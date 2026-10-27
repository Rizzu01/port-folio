import { NextResponse } from "next/server";

export const revalidate = 3600;

type PinterestPin = {
  id: string;
  title?: string;
  description?: string;
  link?: string;
  media?: { images?: Record<string, { url?: string; width?: number; height?: number }> };
  created_at?: string;
};

type PinterestPage = { items?: PinterestPin[]; bookmark?: string | null };

export async function GET() {
  const token = process.env.PINTEREST_ACCESS_TOKEN;
  const boardId = process.env.PINTEREST_BOARD_ID;

  if (!token || !boardId) {
    return NextResponse.json(
      { configured: false, pins: [], message: "Pinterest API is not configured yet." },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  }

  try {
    const allItems: PinterestPin[] = [];
    let bookmark: string | null = null;
    // Fetch pages until Pinterest has no next bookmark, with a safety cap.
    for (let page = 0; page < 10; page += 1) {
      const url = new URL(`https://api.pinterest.com/v5/boards/${encodeURIComponent(boardId)}/pins`);
      url.searchParams.set("page_size", "100");
      if (bookmark) url.searchParams.set("bookmark", bookmark);
      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        console.error("Pinterest API request failed:", response.status);
        return NextResponse.json({ configured: true, pins: [], message: "Pinterest could not return the board Pins." }, { status: 502 });
      }
      const data = (await response.json()) as PinterestPage;
      allItems.push(...(data.items ?? []));
      if (!data.bookmark) break;
      bookmark = data.bookmark;
    }

    const pins = allItems.map((pin) => {
      const images = pin.media?.images ?? {};
      const image = images["1200x"] ?? images["600x"] ?? Object.values(images).sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0];
      return {
        id: pin.id,
        title: pin.title?.trim() || pin.description?.trim().split("\n")[0] || "Selected design",
        description: pin.description ?? "",
        imageUrl: image?.url ?? "",
        pinUrl: pin.link || `https://www.pinterest.com/pin/${pin.id}/`,
        createdAt: pin.created_at ?? "",
      };
    }).filter((pin) => pin.imageUrl);

    return NextResponse.json({ configured: true, pins }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json({ configured: true, pins: [], message: "Unable to load Pinterest Pins right now." }, { status: 502 });
  }
}
