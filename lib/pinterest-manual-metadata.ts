export type ManualPinterestMetadata = {
  pin_id: string;
  title: string;
  description: string;
  alt_text: string;
  updated_at?: string;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server configuration is missing.");
  return { url, key };
}

function headers(key: string, extra: Record<string, string> = {}) {
  return {
    apikey: key,
    Authorization: "Bearer " + key,
    Accept: "application/json",
    ...extra,
  };
}

export async function getManualPinterestMetadata() {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(
    url + "/rest/v1/pinterest_manual_metadata?select=pin_id,title,description,alt_text,updated_at",
    { headers: headers(key), cache: "no-store" },
  );
  if (!response.ok) throw new Error("Manual Pinterest metadata read failed: " + response.status);

  const rows = (await response.json()) as ManualPinterestMetadata[];
  return Object.fromEntries(rows.map((row) => [row.pin_id, row])) as Record<string, ManualPinterestMetadata>;
}

export async function saveManualPinterestMetadata(metadata: Omit<ManualPinterestMetadata, "updated_at">) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(url + "/rest/v1/pinterest_manual_metadata?on_conflict=pin_id", {
    method: "POST",
    headers: headers(key, {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    }),
    body: JSON.stringify({ ...metadata, updated_at: new Date().toISOString() }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Manual Pinterest metadata save failed: " + response.status);
  return (await response.json()) as ManualPinterestMetadata[];
}

export async function deleteManualPinterestMetadata(pinId: string) {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(
    url + "/rest/v1/pinterest_manual_metadata?pin_id=eq." + encodeURIComponent(pinId),
    {
      method: "DELETE",
      headers: headers(key, { Prefer: "return=minimal" }),
      cache: "no-store",
    },
  );
  if (!response.ok) throw new Error("Manual Pinterest metadata delete failed: " + response.status);
}
