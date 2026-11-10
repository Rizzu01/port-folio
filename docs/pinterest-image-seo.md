# Automatic Pinterest image SEO

Pinterest remains the source of truth for portfolio images. The `app/api/pinterest/pins/route.ts` route:
- fetches Pins from the configured public boards;
- analyzes up to three previously unseen Pin images per refresh with Gemini image understanding;
- generates a concise title, description and image alt text;
- stores generated fields by Pin ID in Supabase, so they are reused on later requests;
- falls back to the Pin's existing title/description, then category-based copy if AI metadata is unavailable.

## Required server environment variables

Keep all values server-side; do not prefix them with `NEXT_PUBLIC_`.

- `GEMINI_API_KEY` — OpenRouter API key for image analysis.
- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service-role key. Never expose this in client code.
- `GEMINI_MODEL` — optional model ID; defaults to `gemini-3.8-flash`, with automatic fallback to `gemini-3.7-flash` for temporary API overloads.

The existing Pinterest OAuth and board environment variables are still required.

## One-time Supabase setup

Run `supabase/pinterest_pin_seo.sql` in the Supabase SQL Editor. This creates the private metadata table used to avoid repeated image analysis.

## Deploy and verify

1. Add the three environment variables to the hosting project's server environment.
2. Run the SQL once in Supabase.
3. Deploy the site.
4. Open `/api/pinterest/pins` and inspect the returned `pins`. Each item should include `title`, `description` and `altText`.
5. Newly discovered Pins are analyzed in batches of up to three per API refresh. The gallery refreshes Pins every five minutes while open; existing metadata is reused.

If Gemini or Supabase is not configured, the Pinterest gallery continues to work using original Pinterest text and safe fallback copy.
