type StoredToken = {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at?: string | null;
};

type RefreshResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  message?: string;
};

const noStore = { cache: "no-store" as RequestCache };

async function saveTokens(
  supabaseUrl: string,
  serviceKey: string,
  tokens: { access_token: string; refresh_token: string; expires_in: number; refresh_token_expires_in?: number },
) {
  const now = Date.now();
  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/pinterest_oauth_tokens?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify({
      id: 1,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      access_token_expires_at: new Date(now + tokens.expires_in * 1000).toISOString(),
      refresh_token_expires_at: tokens.refresh_token_expires_in
        ? new Date(now + tokens.refresh_token_expires_in * 1000).toISOString()
        : null,
      updated_at: new Date(now).toISOString(),
    }),
    ...noStore,
  });
  if (!response.ok) throw new Error(`Supabase token save failed: ${response.status}`);
}

export async function getPinterestAccessToken(): Promise<string | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Keep compatibility with the old manual token until OAuth has been connected.
  if (!supabaseUrl || !serviceKey) return process.env.PINTEREST_ACCESS_TOKEN ?? null;

  const read = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/pinterest_oauth_tokens?select=access_token,refresh_token,access_token_expires_at,refresh_token_expires_at&id=eq.1&limit=1`,
    {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: "application/json" },
      ...noStore,
    },
  );
  if (!read.ok) throw new Error(`Supabase token read failed: ${read.status}`);
  const rows = (await read.json()) as StoredToken[];
  const stored = rows[0];
  if (!stored) return process.env.PINTEREST_ACCESS_TOKEN ?? null;

  // Refresh 5 minutes early to avoid using a token at the expiry boundary.
  if (new Date(stored.access_token_expires_at).getTime() > Date.now() + 5 * 60 * 1000) {
    return stored.access_token;
  }

  const clientId = process.env.PINTEREST_APP_ID;
  const clientSecret = process.env.PINTEREST_APP_SECRET;
  if (!clientId || !clientSecret) throw new Error("Pinterest OAuth app credentials are missing.");

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch("https://api.pinterest.com/v5/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: stored.refresh_token,
    }),
    ...noStore,
  });

  const refreshed = (await response.json()) as RefreshResponse;
  if (!response.ok || !refreshed.access_token || !refreshed.refresh_token) {
    console.error("Pinterest access-token refresh failed:", response.status, refreshed.message ?? "No token returned");
    throw new Error("Pinterest token refresh failed. Reconnect Pinterest via /api/pinterest/auth.");
  }

  await saveTokens(supabaseUrl, serviceKey, {
    access_token: refreshed.access_token,
    refresh_token: refreshed.refresh_token,
    expires_in: refreshed.expires_in ?? 2592000,
    refresh_token_expires_in: refreshed.refresh_token_expires_in,
  });
  return refreshed.access_token;
}
