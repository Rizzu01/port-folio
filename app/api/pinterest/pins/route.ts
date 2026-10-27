import { NextResponse } from "next/server";

export const revalidate = 3600;

type PinterestPin = {
  id: string;
  title?: string;
  description?: string;
  media?: { images?: Record<string, { url?: string; width?: number; height?: number }> };
  created_at?: string;
};
type PinterestBoard = { id: string; name: string };
type PinterestPage<T> = { items?: T[]; bookmark?: string | null };
type Category = { label: string; slug: string; envKey: string; aliases: string[] };

const CATEGORIES: Category[] = [
  { label: "Social Media Posts", slug: "social-media-post", envKey: "PINTEREST_SOCIAL_MEDIA_BOARD_ID", aliases: ["social media post", "social media posts"] },
  { label: "UI/UX Designs", slug: "uiux-design", envKey: "PINTEREST_UIUX_BOARD_ID", aliases: ["ui ux design", "ui ux designs", "uiux design", "uiux designs"] },
  { label: "Printed Designs", slug: "printed-designs", envKey: "PINTEREST_PRINTED_BOARD_ID", aliases: ["printed design", "printed designs"] },
];

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

async function getAllPages<T>(url: URL, token: string): Promise<T[]> {
  const items: T[] = [];
  let bookmark: string | null = null;
  for (let page = 0; page < 10; page += 1) {
    const pageUrl = new URL(url);
    pageUrl.searchParams.set("page_size", "100");
    if (bookmark) pageUrl.searchParams.set("bookmark", bookmark);
    const response = await fetch(pageUrl.toString(), {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error(`Pinterest API request failed: ${response.status}`);
    const data = (await response.json()) as PinterestPage<T>;
    items.push(...(data.items ?? []));
    if (!data.bookmark) break;
    bookmark = data.bookmark;
  }
  return items;
}

export async function GET() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  if (!token) {
    return NextResponse.json({ configured: false, pins: [], message: "Pinterest API is not configured yet." });
  }

  try {
    let boards: PinterestBoard[] = [];
    try {
      boards = await getAllPages<PinterestBoard>(new URL("https://api.pinterest.com/v5/user_account/boards"), token);
    } catch (error) {
      // Explicit board IDs can still work if Pinterest's board-list endpoint is unavailable.
      if (!CATEGORIES.some((category) => process.env[category.envKey]) && !process.env.PINTEREST_BOARD_ID) throw error;
    }

    const allPins: Array<{ id: string; title: string; description: string; imageUrl: string; pinUrl: string; createdAt: string; category: string }> = [];
    const usedBoardIds = new Set<string>();

    for (const category of CATEGORIES) {
      const configuredId = process.env[category.envKey];
      const board = configuredId
        ? { id: configuredId, name: category.label }
        : boards.find((candidate) => {
            const name = normalize(candidate.name);
            return category.aliases.some((alias) => name === normalize(alias)) ||
              name === normalize(category.slug.replace(/-/g, " "));
          });
      if (!board || usedBoardIds.has(board.id)) continue;
      usedBoardIds.add(board.id);

      const items = await getAllPages<PinterestPin>(new URL(`https://api.pinterest.com/v5/boards/${encodeURIComponent(board.id)}/pins`), token);
      const pins = items.map((pin) => {
        const images = pin.media?.images ?? {};
        const image = images["1200x"] ?? images["600x"] ?? Object.values(images).sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
        return {
          id: pin.id,
          title: pin.title?.trim() || pin.description?.trim().split("\n")[0] || "Selected design",
          description: pin.description ?? "",
          imageUrl: image?.url ?? "",
          pinUrl: `https://www.pinterest.com/pin/${pin.id}/`,
          createdAt: pin.created_at ?? "",
          category: category.label,
        };
      }).filter((pin) => pin.imageUrl);
      allPins.push(...pins);
    }

    // Keep the previous single-board setup usable until all three boards are detected/configured.
    if (!allPins.length && process.env.PINTEREST_BOARD_ID) {
      const legacyPins = await getAllPages<PinterestPin>(new URL(`https://api.pinterest.com/v5/boards/${encodeURIComponent(process.env.PINTEREST_BOARD_ID)}/pins`), token);
      allPins.push(...legacyPins.map((pin) => {
        const images = pin.media?.images ?? {};
        const image = images["1200x"] ?? images["600x"] ?? Object.values(images).sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
        return {
          id: pin.id,
          title: pin.title?.trim() || pin.description?.trim().split("\n")[0] || "Selected design",
          description: pin.description ?? "",
          imageUrl: image?.url ?? "",
          pinUrl: `https://www.pinterest.com/pin/${pin.id}/`,
          createdAt: pin.created_at ?? "",
          category: "Social Media Posts",
        };
      }).filter((pin) => pin.imageUrl));
    }

    return NextResponse.json({
      configured: true,
      pins: allPins,
      message: allPins.length ? undefined : "No Pins found. Check that the three boards are public and named Social Media Posts, UI/UX Designs, and Printed Designs.",
    }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    console.error("Pinterest board sync failed:", error);
    return NextResponse.json({ configured: true, pins: [], message: "Pinterest could not load the boards. The access token may need refreshing." }, { status: 502 });
  }
}
