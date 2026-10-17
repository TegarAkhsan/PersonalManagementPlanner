-- Supabase Schema for ProjectFlow
-- Run this script in the Supabase SQL Editor

-- 1. Projects Table
create table if not exists public.projects (
  id text primary key,
  name text not null,
  color text default '#F59E0B',
  description text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Tasks Table
create table if not exists public.tasks (
  id text primary key,
  title text not null,
  project_id text references public.projects(id) on delete set null,
  status text default 'todo', -- todo, in_progress, review, done
  priority text default 'Medium', -- Low, Medium, High, Urgent
  due_date text,
  source_label text,
  created_at text,
  completed_at text
);

-- 3. Events Table
create table if not exists public.events (
  id text primary key,
  title text not null,
  date text not null,
  start_time text,
  end_time text,
  location text,
  category text,
  project_id text references public.projects(id) on delete set null,
  type text default 'event'
);

-- 4. Habits Table
create table if not exists public.habits (
  id text primary key,
  name text not null,
  type text default 'single', -- single or checklist
  emoji text,
  frequency text default 'daily',
  streak integer default 0,
  max_streak integer default 0,
  created_at text,
  archived boolean default false,
  logs jsonb default '[]'::jsonb,
  checklist_logs jsonb default '{}'::jsonb,
  sub_items jsonb default '[]'::jsonb
);

-- 5. Goals Table
create table if not exists public.goals (
  id text primary key,
  title text not null,
  progress integer default 0,
  target_date text,
  category text,
  color text default '#F59E0B'
);

-- 6. Notes Table
create table if not exists public.notes (
  id text primary key,
  title text not null,
  content text,
  tags jsonb default '[]'::jsonb,
  pinned boolean default false,
  updated_at text
);

-- Enable RLS and public access policies for anonymous demo client
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.events enable row level security;
alter table public.habits enable row level security;
alter table public.goals enable row level security;
alter table public.notes enable row level security;

-- Policies for public/anon access
create policy "Allow all public for projects" on public.projects for all using (true) with check (true);
create policy "Allow all public for tasks" on public.tasks for all using (true) with check (true);
create policy "Allow all public for events" on public.events for all using (true) with check (true);
create policy "Allow all public for habits" on public.habits for all using (true) with check (true);
create policy "Allow all public for goals" on public.goals for all using (true) with check (true);
create policy "Allow all public for notes" on public.notes for all using (true) with check (true);
