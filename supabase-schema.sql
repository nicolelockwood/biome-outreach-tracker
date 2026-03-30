-- ============================================================
-- BIOME LEAD TRACKING — Database Schema
-- Run this entire file in Supabase SQL Editor
-- Project: jfiykbjnywyuoulhrsxs
-- ============================================================

-- ── 1. LEADS TABLE ──────────────────────────────────────────
create table if not exists leads (
  id              bigserial primary key,
  org_name        text not null,
  contact_name    text,
  contact_title   text,
  contact_initials text,
  stage           text default 'New',
  priority        text default 'Medium',
  ticket_size     text,
  next_follow_up  text,
  last_contact    text,
  type            text default 'philanthropy',
  tags            text[] default '{}',
  region          text default 'Australia',
  category        text,
  comments        text,
  action          text,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ── 2. INTERACTIONS TABLE ───────────────────────────────────
create table if not exists interactions (
  id              bigserial primary key,
  lead_id         bigint references leads(id) on delete cascade,
  date            text,
  type            text,
  summary         text,
  outcome         text,
  follow_up_date  text,
  created_at      timestamptz default now()
);

-- ── 3. AUTO-UPDATE updated_at on leads ──────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- ── 4. ROW LEVEL SECURITY ───────────────────────────────────
-- Enable RLS on both tables
alter table leads enable row level security;
alter table interactions enable row level security;

-- Allow any authenticated user to read all leads
create policy "Authenticated users can read leads"
  on leads for select
  to authenticated
  using (true);

-- Allow any authenticated user to insert leads
create policy "Authenticated users can insert leads"
  on leads for insert
  to authenticated
  with check (true);

-- Allow any authenticated user to update leads
create policy "Authenticated users can update leads"
  on leads for update
  to authenticated
  using (true)
  with check (true);

-- Allow any authenticated user to delete leads
create policy "Authenticated users can delete leads"
  on leads for delete
  to authenticated
  using (true);

-- Same for interactions
create policy "Authenticated users can read interactions"
  on interactions for select
  to authenticated
  using (true);

create policy "Authenticated users can insert interactions"
  on interactions for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update interactions"
  on interactions for update
  to authenticated
  using (true);

create policy "Authenticated users can delete interactions"
  on interactions for delete
  to authenticated
  using (true);
