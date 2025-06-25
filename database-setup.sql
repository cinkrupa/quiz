-- Supabase Database Schema for Quiz Application
-- Run this SQL in your Supabase SQL editor

-- Create the players table
create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  score integer default 0,
  total_answers integer default 0,
  updated_at timestamp default now()
);

-- Enable Row Level Security (RLS)
alter table public.players enable row level security;

-- Create a policy that allows all operations for now
-- In production, you might want to restrict this further
create policy "Enable all operations for players" on public.players
for all using (true);

-- Create an index on name for faster lookups
create index if not exists players_name_idx on public.players(name);

-- Create an index on updated_at for sorting
create index if not exists players_updated_at_idx on public.players(updated_at desc);
