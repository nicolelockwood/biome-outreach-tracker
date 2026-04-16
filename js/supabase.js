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
export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('id', { ascending: true });
  if (error) { console.error('getLeads error:', error); return []; }
  return data;
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

export async function updateInteraction(id, updates) {
  const { data, error } = await supabase
    .from('interactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}
