-- 0002_guesty_cms.sql
-- Guesty-mode CMS: make the previously hardcoded homepage content editable.
-- Additive and low-risk. Adds the guesty marketing categories (+ ordered media
-- links), extends attractions & conveniences, and tags media_assets with its
-- storage backend (supabase | r2). Idempotent where practical.

-- 1) The guesty marketing categories (link out to Hotelyzer; no booking semantics).
create table if not exists public.guesty_categories (
    id            uuid primary key default gen_random_uuid(),
    slug          text unique not null,
    title         text not null,
    subtitle      text,
    description   text,
    guesty_url    text not null,
    layout        text not null default 'image-left'
                  check (layout in ('image-left', 'image-right')),
    display_order integer not null default 0,
    is_published  boolean not null default true,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

-- 2) Ordered images per category, referencing the existing media catalog.
--    Purely positional: display_order 0 = cover; the frontend derives
--    main (=0), secondary (=1..3) and extras (=4..) by slicing the ordered list.
create table if not exists public.guesty_category_media (
    category_id   uuid not null references public.guesty_categories(id) on delete cascade,
    media_id      uuid not null references public.media_assets(id) on delete restrict,
    display_order integer not null default 0,
    primary key (category_id, media_id)
);
create index if not exists guesty_category_media_category_idx
    on public.guesty_category_media (category_id);

-- 3) Attractions: lightbox gallery (images + YouTube URLs) + external link.
alter table public.attractions add column if not exists external_url text;
alter table public.attractions add column if not exists gallery jsonb not null default '[]'::jsonb;

-- 4) Conveniences (map pins): richer popup data.
alter table public.conveniences add column if not exists description text;
alter table public.conveniences add column if not exists popup_image text;
alter table public.conveniences add column if not exists rating      numeric(2,1);

-- 5) Media storage backend tag (existing rows -> 'supabase'; guesty uploads -> 'r2').
alter table public.media_assets add column if not exists provider text not null default 'supabase';

-- 6) Keep updated_at fresh (reuse the existing helper function from 0001).
create or replace trigger guesty_categories_updated_at
    before update on public.guesty_categories
    for each row execute function public.update_updated_at_column();

-- 7) RLS: public read (content surface), staff write gated by the content permission.
alter table public.guesty_categories     enable row level security;
alter table public.guesty_category_media enable row level security;

create policy "Public read guesty_categories"
    on public.guesty_categories for select using (true);
create policy "Public read guesty_category_media"
    on public.guesty_category_media for select using (true);

create policy "Staff manage guesty_categories"
    on public.guesty_categories for all to authenticated
    using (public.check_permission('content.pages'))
    with check (public.check_permission('content.pages'));
create policy "Staff manage guesty_category_media"
    on public.guesty_category_media for all to authenticated
    using (public.check_permission('content.pages'))
    with check (public.check_permission('content.pages'));

-- 8) Grants — least-privilege (tighter than the legacy content tables).
grant select on public.guesty_categories     to anon, authenticated;
grant select on public.guesty_category_media to anon, authenticated;
grant all    on public.guesty_categories     to service_role;
grant all    on public.guesty_category_media to service_role;
