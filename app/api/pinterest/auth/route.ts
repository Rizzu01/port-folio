import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const clientId = process.env.PINTEREST_APP_ID;
  if (!clientId) {
    return NextResponse.json({ error: "Missing PINTEREST_APP_ID environment variable." }, { status: 500 });
  }

  const redirectUri = process.env.PINTEREST_REDIRECT_URI || new URL("/api/pinterest/callback", request.url).toString();
  const state = randomBytes(24).toString("hex");
  const authorizeUrl = new URL("https://www.pinterest.com/oauth/");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "boards:read,pins:read,user_accounts:read");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set("pinterest_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return response;
}
