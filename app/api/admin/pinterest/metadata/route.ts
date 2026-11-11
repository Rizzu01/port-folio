import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  deleteManualPinterestMetadata,
  getManualPinterestMetadata,
  saveManualPinterestMetadata,
} from "@/lib/pinterest-manual-metadata";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return unauthorized();
  try {
    const metadata = await getManualPinterestMetadata();
    return NextResponse.json({ metadata }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin Pinterest metadata read failed:", error);
    return NextResponse.json({ error: "Could not load saved metadata. Check Supabase configuration." }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return unauthorized();

  let body: { pinId?: unknown; title?: unknown; description?: unknown; altText?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const pinId = typeof body.pinId === "string" ? body.pinId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const altText = typeof body.altText === "string" ? body.altText.trim() : "";

  if (!/^\d{5,30}$/.test(pinId)) {
    return NextResponse.json({ error: "Invalid Pinterest Pin ID." }, { status: 400 });
  }
  if (!title || title.length > 120 || description.length > 1000 || altText.length > 300) {
    return NextResponse.json({ error: "Title is required (max 120 characters). Description max 1,000 and alt text max 300 characters." }, { status: 400 });
  }

  try {
    await saveManualPinterestMetadata({ pin_id: pinId, title, description, alt_text: altText || title });
    return NextResponse.json({ saved: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin Pinterest metadata save failed:", error);
    return NextResponse.json({ error: "Could not save metadata. Check the Supabase table and server credentials." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return unauthorized();

  let body: { pinId?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const pinId = typeof body.pinId === "string" ? body.pinId.trim() : "";
  if (!/^\d{5,30}$/.test(pinId)) {
    return NextResponse.json({ error: "Invalid Pinterest Pin ID." }, { status: 400 });
  }

  try {
    await deleteManualPinterestMetadata(pinId);
    return NextResponse.json({ deleted: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Admin Pinterest metadata reset failed:", error);
    return NextResponse.json({ error: "Could not reset metadata." }, { status: 502 });
  }
}
