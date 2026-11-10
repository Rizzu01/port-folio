-- Run this once in Supabase SQL Editor.
-- Stores AI-generated SEO metadata per Pinterest Pin so image analysis is not repeated.
create table if not exists public.pinterest_pin_seo (
  pin_id text primary key,
  title text not null,
  description text not null,
  alt_text text not null,
  updated_at timestamptz not null default now()
);

alter table public.pinterest_pin_seo enable row level security;

-- No public policies are intentionally created. The Next.js server accesses this
-- table with SUPABASE_SERVICE_ROLE_KEY, which must remain server-side.


-- Supabase now requires explicit Data API grants for newly/private-exposed tables.
-- Keep the table private to public clients; only the server-side service role needs access.
grant usage on schema public to service_role;
grant select, insert, update on table public.pinterest_pin_seo to service_role;
