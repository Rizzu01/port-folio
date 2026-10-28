import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";

export const dynamic = "force-dynamic";

type PinterestTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  token_type?: string;
  message?: string;
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const returnedError = url.searchParams.get("error");
  const cookieState = request.cookies.get("pinterest_oauth_state")?.value;

  if (returnedError) {
    return NextResponse.json({ error: "Pinterest authorization was declined." }, { status: 400 });
  }
  if (!code || !state || !cookieState) {
    return NextResponse.json({ error: "Missing OAuth code or state. Please restart Pinterest connection." }, { status: 400 });
  }
  const a = Buffer.from(state);
  const b = Buffer.from(cookieState);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "OAuth state validation failed. Please restart Pinterest connection." }, { status: 400 });
  }

  const clientId = process.env.PINTEREST_APP_ID;
  const clientSecret = process.env.PINTEREST_APP_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI || new URL("/api/pinterest/callback", request.url).toString();

  if (!clientId || !clientSecret || !supabaseUrl || !serviceKey) {
    return NextResponse.json({
      error: "Missing server configuration. Set PINTEREST_APP_ID, PINTEREST_APP_SECRET, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in Vercel.",
    }, { status: 500 });
  }

  try {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
      cache: "no-store",
    });

    const tokenData = (await tokenResponse.json()) as PinterestTokenResponse;
    if (!tokenResponse.ok || !tokenData.access_token || !tokenData.refresh_token) {
      console.error("Pinterest token exchange failed:", tokenResponse.status, tokenData.message ?? "No token returned");
      return NextResponse.json({ error: "Pinterest token exchange failed. Check app settings and redirect URI." }, { status: 502 });
    }

    const now = Date.now();
    const expiresIn = tokenData.expires_in ?? 2592000;
    const refreshExpiresIn = tokenData.refresh_token_expires_in;
    const saveResponse = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/pinterest_oauth_tokens?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({
        id: 1,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        access_token_expires_at: new Date(now + expiresIn * 1000).toISOString(),
        refresh_token_expires_at: refreshExpiresIn ? new Date(now + refreshExpiresIn * 1000).toISOString() : null,
        updated_at: new Date(now).toISOString(),
      }),
      cache: "no-store",
    });

    if (!saveResponse.ok) {
      console.error("Could not save Pinterest OAuth tokens to Supabase:", saveResponse.status);
      return NextResponse.json({ error: "Pinterest authorized, but token storage failed. Check Supabase configuration and table permissions." }, { status: 502 });
    }

    const successUrl = new URL("/", request.url);
    successUrl.searchParams.set("pinterest_connected", "1");
    const response = NextResponse.redirect(successUrl);
    response.cookies.delete("pinterest_oauth_state");
    return response;
  } catch (error) {
    console.error("Pinterest OAuth callback failed:", error);
    return NextResponse.json({ error: "Pinterest connection failed unexpectedly. Check server logs." }, { status: 500 });
  }
}
