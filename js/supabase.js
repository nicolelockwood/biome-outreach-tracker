// Supabase client configuration
// Biome Lead Tracking — Nicole Lockwood

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://jfiykbjnywyuoulhrsxs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmaXlrYmpueXd5dW91bGhyc3hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4MTUzNjAsImV4cCI6MjA5MDM5MTM2MH0._2ihhR1AePlI1M5KY1plzcm_DC6fLfDnmDs0erkeTGA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Auth helpers ────────────────────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

// ─── Leads helpers ───────────────────────────────────────────────
// Active leads only — paused leads are filtered out client-side so this
// works whether or not the `archived` column exists yet. Once the migration
// runs, paused leads simply disappear from active views.
export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('id', { ascending: true });
  if (error) { console.error('getLeads error:', error); return []; }
  return data.filter(l => !l.archived);
}

// All leads including paused — useful for archive views or admin
export async function getAllLeadsIncludingArchived() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('id', { ascending: true });
  if (error) { console.error('getAllLeadsIncludingArchived error:', error); return []; }
  return data;
}

// Just the paused/archived leads
export async function getArchivedLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('archived_at', { ascending: false });
  if (error) { console.error('getArchivedLeads error:', error); return []; }
  return data.filter(l => l.archived === true);
}

export async function getLead(id) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  if (error) { console.error('getLead error:', error); return null; }
  return data;
}

export async function createLead(lead) {
  const { data, error } = await supabase
    .from('leads')
    .insert([lead])
    .select()
    .single();
  return { data, error };
}

export async function updateLead(id, updates) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// ─── Pause / Restore (the "On Pause" hibernation system) ─────────
// Pause a single lead. Reason is free-text — typically 'Investor season pause'
// for bulk operations, or 'Manual pause' for individual ones.
export async function archiveLead(id, reason = 'Manual pause') {
  const { data, error } = await supabase
    .from('leads')
    .update({
      archived: true,
      archived_at: new Date().toISOString(),
      archived_reason: reason,
    })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Restore a paused lead — clears all archive metadata, lead reappears
// in dashboard, kanban, leads, calendar, etc.
export async function r