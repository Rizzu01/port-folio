import { NextResponse } from "next/server";

export const revalidate = 3600;

type PinterestPin = {
  id: string;
  title?: string;
  description?: string;
  media?: { images?: Record<string, { url?: string; width?: number; height?: number }> };
  created_at?: string;
};
type PinterestBoard = { id: string; name: string; privacy?: string };
type PinterestPage<T> = { items?: T[]; bookmark?: string | null };
const CATEGORIES = [
  { label: "Social Media Posts", slug: "social-media-post", aliases: ["social media post", "social media posts"] },
  { label: "UI/UX Designs", slug: "uiux-design", aliases: ["uiux design", "ui ux design", "ui/ux designs"] },
  { label: "Printed Designs", slug: "printed-designs", aliases: ["printed designs", "printed design"] },
] as const;
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
    const boardsUrl = new URL("https://api.pinterest.com/v5/user_account/boards");
    const boards = await getAllPages<PinterestBoard>(boardsUrl, token);
    const allPins: Array<{ id: string; title: string; description: string; imageUrl: string; pinUrl: string; createdAt: string; category: string }> = [];

    for (const category of CATEGORIES) {
      const board = boards.find((candidate) => {
        const boardName = normalize(candidate.name);
        return category.aliases.some((alias) => boardName === normalize(alias)) ||
          boardName === normalize(category.slug.replace(/-/g, " "));
      });
      if (!board) continue;

      const pinsUrl = new URL(`https://api.pinterest.com/v5/boards/${encodeURIComponent(board.id)}/pins`);
      const items = await getAllPages<PinterestPin>(pinsUrl, token);
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

    return NextResponse.json({
      configured: true,
      pins: allPins,
      message: allPins.length ? undefined : "No Pins found. Check that the three boards are public and their names match the category names.",
    }, { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } });
  } catch (error) {
    console.error("Pinterest board sync failed:", error);
    return NextResponse.json({ configured: true, pins: [], message: "Pinterest could not load the category boards. The access token may need refreshing." }, { status: 502 });
  }
}
