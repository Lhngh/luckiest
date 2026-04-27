create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id text primary key,
  name text not null,
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists public.meet_plans (
  id uuid primary key default gen_random_uuid(),
  next_date date not null,
  location text not null,
  role text not null,
  status text not null default '待确认',
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.book_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cover_url text,
  start_date date not null,
  end_date date not null,
  status text not null default '进行中',
  created_at timestamptz not null default now()
);

create table if not exists public.book_notes (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references public.book_plans(id) on delete cascade,
  user_id text not null references public.profiles(id) on delete cascade,
  content text not null,
  page integer,
  created_at timestamptz not null default now()
);

create table if not exists public.enjoy_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null,
  date date not null,
  review text,
  rating integer,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.profiles(id) on delete cascade,
  content text not null,
  mood text,
  created_at timestamptz not null default now()
);

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

insert into public.profiles (id, name, avatar)
values
  ('xing', '星星', null),
  ('yue', '月月', null)
on conflict (id) do update set name = excluded.name;

alter table public.profiles enable row level security;
alter table public.meet_plans enable row level security;
alter table public.book_plans enable row level security;
alter table public.book_notes enable row level security;
alter table public.enjoy_plans enable row level security;
alter table public.messages enable row level security;
alter table public.wishes enable row level security;

drop policy if exists "public read profiles" on public.profiles;
drop policy if exists "public read meet_plans" on public.meet_plans;
drop policy if exists "public read book_plans" on public.book_plans;
drop policy if exists "public read book_notes" on public.book_notes;
drop policy if exists "public read enjoy_plans" on public.enjoy_plans;
drop policy if exists "public read messages" on public.messages;
drop policy if exists "public read wishes" on public.wishes;

create policy "public read profiles" on public.profiles for select using (true);
create policy "public read meet_plans" on public.meet_plans for select using (true);
create policy "public read book_plans" on public.book_plans for select using (true);
create policy "public read book_notes" on public.book_notes for select using (true);
create policy "public read enjoy_plans" on public.enjoy_plans for select using (true);
create policy "public read messages" on public.messages for select using (true);
create policy "public read wishes" on public.wishes for select using (true);

alter publication supabase_realtime add table public.meet_plans;
alter publication supabase_realtime add table public.book_plans;
alter publication supabase_realtime add table public.book_notes;
alter publication supabase_realtime add table public.enjoy_plans;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.wishes;
