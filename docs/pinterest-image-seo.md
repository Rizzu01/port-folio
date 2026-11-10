# Automatic Pinterest image SEO

Pinterest remains the source of truth for portfolio images. The `app/api/pinterest/pins/route.ts` route:
- fetches Pins from the configured public boards;
- analyzes at most one previously unseen Pin image per API refresh with Groq vision;
- uses Qwen 3.8 27B (`qwen/qwen3.8-27b`) to generate a specific title, description and image alt text;
- stores generated fields by Pin ID in Supabase, so they are reused on later requests;
- falls back to the Pin's existing title/description, then category-based copy if AI metadata is unavailable.

## Required server environment variables

Keep all values server-side; do not prefix them with `NEXT_PUBLIC_`.

- `GROQ_API_KEY` — Groq API key from https://console.groq.com/keys.
- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key. Never expose this in client code.
- `GROQ_MODEL` — optional model ID; defaults to `qwen/qwen3.8-27b`.

Groq currently publishes free-plan rate limits for this vision model. Requests within the free-tier limits are not charged; when a limit is reached, requests are rate-limited. Check your account's current limits in the Groq Console because limits and model availability can change.

## One-time Supabase setup

Run `supabase/pinterest_pin_seo.sql` in the Supabase SQL Editor. This creates the private metadata table used to avoid repeated image analysis.

## Deploy and verify

1. Add `GROQ_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` to the hosting project's server environment.
2. Optionally set `GROQ_MODEL=qwen/qwen3.8-27b`.
3. Run the SQL once in Supabase if the `pinterest_pin_seo` table does not already exist.
4. Deploy the site.
5. Open `/api/pinterest/pins` and inspect the returned `pins`. Each item should include `title`, `description` and `altText`.
6. Newly discovered Pins are analyzed one at a time on gallery API refreshes. Existing generated metadata is reused from Supabase.

The gallery refreshes Pins every five minutes while open. Because generation is triggered by API refreshes, keep an eye on Groq's free-tier rate limits if the gallery receives substantial traffic. If Groq or Supabase is not configured, the Pinterest gallery continues to work using original Pinterest text and safe fallback copy.
