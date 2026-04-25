-- ============================================================
-- BIOME LEAD TRACKING — Round 5 Migration
-- "On Pause" hibernation system for leads
-- ============================================================
-- Run this in Supabase SQL Editor (Nicole's project) ONCE.
-- Safe to re-run: all statements are IF NOT EXISTS guarded.
-- ============================================================

-- ── Add the three columns ──────────────────────────────────
alter table leads
  add column if not exists archived         boolean      not null default false,
  add column if not exists archived_at      timestamptz,
  add column if not exists archived_reason  text;

-- ── Index for fast filtering ───────────────────────────────
create index if not exists leads_archived_idx on leads(archived);

-- ── Backfill: any existing rows are 'active' (already default false)
-- No backfill needed thanks to default — but explicit for clarity:
update leads set archived = false where archived is null;

-- ── Done. Verify with:
-- select id, org_name, archived, archived_reason from leads order by archived desc, id;
