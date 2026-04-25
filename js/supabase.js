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
  return (data || []).filter(l => !l.archived);
}

// All leads including paused — useful for archive views or admin
export async function getAllLeadsIncludingArchived() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('id', { ascending: true });
  if (error) { console.error('getAllLeadsIncludingArchived error:', error); return []; }
  return data || [];
}

// Just the paused/archived leads.
// Orders by id (always exists) rather than archived_at — that way this query
// is safe to run before the migration adds archived_at. Until the column
// exists, the filter returns [] which is the correct empty state.
export async function getArchivedLeads() {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('id', { ascending: false });
    if (error) { console.error('getArchivedLeads error:', error); return []; }
    return (data || []).filter(l => l.archived === true);
  } catch (e) {
    console.error('getArchivedLeads exception:', e);
    return [];
  }
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
export async function restoreLead(id) {
  const { data, error } = await supabase
    .from('leads')
    .update({
      archived: false,
      archived_at: null,
      archived_reason: null,
    })
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Bulk pause every lead matching a category. category is the plain string
// stored in leads.category. Note this column is comma-delimited in some
// rows (e.g. "Investors,Philanthropy"), so we fetch then verify in JS.
export async function bulkArchiveByCategory(category, reason) {
  const { data: matches, error: fetchErr } = await supabase
    .from('leads')
    .select('id, category, archived');
  if (fetchErr) return { count: 0, error: fetchErr };

  const cats = (c) => (c || '').split(',').map(s => s.trim());
  const ids = (matches || [])
    .filter(l => cats(l.category).includes(category))
    .filter(l => !l.archived)
    .map(l => l.id);

  if (ids.length === 0) return { count: 0, error: null };

  const { error } = await supabase
    .from('leads')
    .update({
      archived: true,
      archived_at: new Date().toISOString(),
      archived_reason: reason || (category + ' season pause'),
    })
    .in('id', ids);

  return { count: ids.length, error };
}

// Bulk restore every paused lead matching a category — used for ending
// a season-pause and bringing the category back online.
export async function bulkRestoreByCategory(category) {
  const { data: matches, error: fetchErr } = await supabase
    .from('leads')
    .select('id, category, archived');
  if (fetchErr) return { count: 0, error: fetchErr };

  const cats = (c) => (c || '').split(',').map(s => s.trim());
  const ids = (matches || [])
    .filter(l => cats(l.category).includes(category))
    .filter(l => l.archived === true)
    .map(l => l.id);

  if (ids.length === 0) return { count: 0, error: null };

  const { error } = await supabase
    .from('leads')
    .update({
      archived: false,
      archived_at: null,
      archived_reason: null,
    })
    .in('id', ids);

  return { count: ids.length, error };
}

export async function deleteLead(id) {
  const { error } = await supabase
    .from('leads')
    .delete()
    .eq('id', id);
  return { error };
}

// ─── Interactions helpers ────────────────────────────────────────
export async function getInteractions(leadId) {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .eq('lead_id', leadId)
    .order('date', { ascending: false });
  if (error) { console.error('getInteractions error:', error); return []; }
  return data;
}

export async function createInteraction(interaction) {
  const { data, error } = await supabase
    .from('interactions')
    .insert([interaction])
    .select()
    .single();
  return { data, error };
}

export async function getAllInteractions() {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .not('follow_up_date', 'is', null)
    .order('follow_up_date', { ascending: true });
  if (error) { console.error('getAllInteractions error:', error); return []; }
  return data;
}

export async function getAllInteractionsAll() {
  const { data, error } = await supabase
    .from('interactions')
    .select('*')
    .order('date', { ascending: true });
  if (error) { console.error('getAllInteractionsAll error:', error); return []; }
  return data;
}

export async function updateInteraction(id, updates) {
  const { data, error } = await supabase
    .from('interactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}
