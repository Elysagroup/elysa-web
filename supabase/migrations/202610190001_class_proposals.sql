create table if not exists public.class_proposals (
  id text primary key,
  psychologist_id text not null references public.accounts(id) on delete cascade,
  title text not null,
  description text not null,
  thematic_area text not null,
  target_audience text,
  price_per_participant numeric(10, 2),
  min_participants integer not null default 3,
  max_participants integer not null default 10,
  total_hours numeric(6, 1) not null default 8,
  duration text,
  weekly_frequency text,
  session_days jsonb not null default '[]'::jsonb,
  session_time text,
  schedule_details text,
  location_type text not null default 'online',
  materials_json jsonb not null default '[]'::jsonb,
  status text not null default 'pending',
  review_note text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.class_proposals
  add column if not exists psychologist_id text references public.accounts(id) on delete cascade,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists thematic_area text,
  add column if not exists target_audience text,
  add column if not exists price_per_participant numeric(10, 2),
  add column if not exists min_participants integer not null default 3,
  add column if not exists max_participants integer not null default 10,
  add column if not exists total_hours numeric(6, 1) not null default 8,
  add column if not exists duration text,
  add column if not exists weekly_frequency text,
  add column if not exists session_days jsonb not null default '[]'::jsonb,
  add column if not exists session_time text,
  add column if not exists schedule_details text,
  add column if not exists location_type text not null default 'online',
  add column if not exists materials_json jsonb not null default '[]'::jsonb,
  add column if not exists status text not null default 'pending',
  add column if not exists review_note text,
  add column if not exists reviewed_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

create index if not exists class_proposals_status_created_at_idx
  on public.class_proposals (status, created_at desc);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('class-proposal-materials', 'class-proposal-materials', false, 8388608, array['application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;