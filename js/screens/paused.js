// On Pause page — the "hibernation" home for leads Nicole has set aside
// for a season. Distinct from #archive (which is the Secured / landed page).
// Paused leads do not appear in dashboard / kanban / leads / calendar,
// but they are not lost — restore is one click.

import { navHTML, stageColourClass } from './dashboard.js';

function fmtDate(d) {
  if (!d) return '';
  try {
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

// Live filter for the On Pause page — search + segmented filter
const FILTER_FN = `(function(){
  var search = (document.getElementById('paused-search')?.value || '').toLowerCase();
  var filter = document.querySelector('.paused-segment.is-active')?.dataset?.filter || 'all';
  var rows = document.querySelectorAll('.paused-lead-card');
  var shown = 0;
  rows.forEach(function(card){
    var org = (card.dataset.org || '').toLowerCase();
    var contact = (card.dataset.contact || '').toLowerCase();
    var category = card.dataset.category || '';
    var reason = (card.dataset.reason || '').toLowerCase();
    var matchSearch = !search || org.includes(search) || contact.includes(search);
    var matchFilter;
    if (filter === 'all') matchFilter = true;
    else if (filter === 'manual') matchFilter = !reason.includes('season pause');
    else matchFilter = category.split(',').map(function(s){return s.trim();}).indexOf(filter) > -1;
    var visible = matchSearch && matchFilter;
    card.style.display = visible ? '' : 'none';
    if (visible) shown++;
  });
  var counter = document.getElementById('paused-shown');
  if (counter) counter.textContent = shown;
})()`;

const SEGMENT_CLICK = `(function(btn){
  document.querySelectorAll('.paused-segment').forEach(function(b){ b.classList.remove('is-active'); });
  btn.classList.add('is-active');
  ${FILTER_FN};
})(this)`;

export function renderPaused(navigate, archivedLeads = [], lens = 'all') {
  const all = archivedLeads;
  const investors = all.filter(l => (l.category || '').split(',').map(s=>s.trim()).includes('Investors'));
  const philanthropy = all.filter(l => (l.category || '').split(',').map(s=>s.trim()).includes('Philanthropy'));
  const manual = all.filter(l => !(l.archived_reason || '').toLowerCase().includes('season pause'));

  const isPausedSeason = (cat) =>
    (cat === 'Investors' && investors.length > 0 && investors.every(l => (l.archived_reason || '').toLowerCase().includes('season pause')))
    || (cat === 'Philanthropy' && philanthropy.length > 0 && philanthropy.every(l => (l.archived_reason || '').toLowerCase().includes('season pause')));

  const reasonBadge = (reason) => {
    const r = (reason || '').toLowerCase();
    if (r.includes('investor') && r.includes('season')) {
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style="background:rgba(42,106,90,0.12);color:#2a6a5a;">Investor Season Pause</span>`;
    }
    if (r.includes('philanthropy') && r.includes('season')) {
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style="background:rgba(90,138,74,0.14);color:#5a8a4a;">Philanthropy Season Pause</span>`;
    }
    return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style="background:rgba(20,52,42,0.08);color:#5a6a60;">Manual Pause</span>`;
  };

  const catBadge = (cat) => {
    const cats = (cat || '').split(',').map(s=>s.trim());
    const isPhil = cats.includes('Philanthropy');
    const isInv  = cats.includes('Investors');
    if (isPhil && isInv) return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-meadow-mid text-forest">Both</span>`;
    if (isPhil) return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style="background:rgba(90,138,74,0.12);color:#5a8a4a;">Philanthropy</span>`;
    if (isInv)  return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style="background:rgba(42,106,90,0.12);color:#2a6a5a;">Investor</span>`;
    return '';
  };

  const leadCard = (lead) => `
    <article class="paused-lead-card card rounded-2xl p-6 cursor-pointer transition-all"
      data-org="${(lead.org_name || '').replace(/"/g,'&quot;').toLowerCase()}"
      data-contact="${(lead.contact_name || '').replace(/"/g,'&quot;').toLowerCase()}"
      data-category="${lead.category || ''}"
      data-reason="${(lead.archived_reason || '').replace(/"/g,'&quot;')}"
      style="background: rgba(255,255,255,0.92); position: relative;">
      <!-- Soft 'on pause' stripe in top-right corner -->
      <div style="position:absolute; top:0; right:0; width:0; height:0; border-style:solid; border-width:0 28px 28px 0; border-color:transparent rgba(106,122,114,0.25) transparent transparent; pointer-events:none;"></div>

      <div class="flex items-start justify-between gap-3 mb-3">
        <div class="flex flex-wrap items-center gap-2">
          ${catBadge(lead.category)}
          ${reasonBadge(lead.archived_reason)}
        </div>
      </div>

      <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-lg font-semibold text-forest leading-tight mb-1">${lead.org_name}</h3>
      <p class="text-sm text-ink-soft mb-1">${lead.contact_name || '—'}${lead.contact_title ? ' · ' + lead.contact_title : ''}</p>

      <div class="flex flex-wrap items-center gap-2 mt-3 mb-4">
        <span class="px-2.5 py-0.5 rounded-full ${stageColourClass(lead.stage)} text-[9px] font-bold uppercase tracking-wider">Was: ${lead.stage}</span>
        ${lead.archived_at ? `<span class="text-[10px] text-ink-ghost flex items-center gap-1"><span class="material-symbols-outlined text-xs">schedule</span>Paused ${fmtDate(lead.archived_at)}</span>` : ''}
      </div>

      ${lead.action ? `<p class="text-xs text-ink-soft leading-relaxed line-clamp-2 mb-4 pb-4 border-b border-border-soft">${lead.action}</p>` : ''}

      <div class="flex items-center gap-2">
        <button class="btn-primary px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
          onclick="event.stopPropagation(); window.handleRestoreLead(${lead.id});">
          <span class="material-symbols-outlined text-sm">replay</span>
          Restore
        </button>
        <button class="px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 cursor-pointer text-ink-soft hover:text-forest border border-border-soft transition-colors"
          onclick="event.stopPropagation(); window.app.navigate('#lead/${lead.id}');">
          View Detail
          <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </article>
  `;

  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('paused')}

      <main class="max-w-6xl mx-auto px-6 pt-10 pb-16">

        <!-- Hero -->
        <section class="mb-10">
          <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Resting Quietly</p>
          <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-3">On Pause</h1>
          <p class="text-white/70 text-base max-w-2xl leading-relaxed">
            Leads you've set aside for a season. They're hidden from your active views — but everything's preserved, and you can restore any of them with a single click.
          </p>
        </section>

        <!-- Stat row -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div class="card rounded-2xl p-6">
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Total Paused</p>
            <p class="text-4xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${all.length}</p>
            <p class="text-xs text-ink-soft mt-1">${all.length === 1 ? 'lead' : 'leads'} resting</p>
          </div>
          <div class="card rounded-2xl p-6" style="background: linear-gradient(135deg, rgba(42,106,90,0.10), rgba(255,255,255,0.92));">
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style="color:#2a6a5a;">Investors</p>
            <p class="text-4xl font-bold" style="color:#2a6a5a; font-family:'Fraunces',Georgia,serif;">${investors.length}</p>
            <p class="text-xs text-ink-soft mt-1">paused in this category</p>
          </div>
          <div class="card rounded-2xl p-6" style="background: linear-gradient(135deg, rgba(90,138,74,0.10), rgba(255,255,255,0.92));">
            <p class="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style="color:#5a8a4a;">Philanthropy</p>
            <p class="text-4xl font-bold" style="color:#5a8a4a; font-family:'Fraunces',Georgia,serif;">${philanthropy.length}</p>
            <p class="text-xs text-ink-soft mt-1">paused in this category</p>
          </div>
        </section>

        <!-- Bulk restore prompt — only appears if a season pause is active -->
        ${investors.length >= 2 && investors.every(l => (l.archived_reason || '').toLowerCase().includes('season pause')) ? `
        <section class="mb-8 card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4" style="background: linear-gradient(135deg, rgba(42,106,90,0.08), rgba(255,255,255,0.94));">
          <div class="flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style="background:rgba(42,106,90,0.15);">
              <span class="material-symbols-outlined" style="color:#2a6a5a;">local_florist</span>
            </div>
            <div>
              <p class="font-semibold text-forest text-base mb-1" style="font-family:'Fraunces',Georgia,serif;">Investor season is paused</p>
              <p class="text-sm text-ink-soft">${investors.length} investor leads waiting in stillness. Bring them all back when the timing feels right.</p>
            </div>
          </div>
          <button class="btn-primary px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer shrink-0"
            onclick="window.handleBulkRestore('Investors')">
            <span class="material-symbols-outlined text-base">replay</span>
            Bring Investors Back
          </button>
        </section>` : ''}

        ${all.length === 0 ? `
        <!-- Empty state -->
        <section class="text-center py-20">
          <div class="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style="background:rgba(255,255,255,0.85); backdrop-filter:blur(20px);">
            <span class="material-symbols-outlined text-canopy text-4xl" style="font-variation-settings:'FILL' 1;">spa</span>
          </div>
          <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white drop-shadow-sm mb-2">Nothing on pause</h3>
          <p class="text-white/60 text-base max-w-md mx-auto mb-6 leading-relaxed">
            When you want to set leads aside for a season — without losing them — pause them from the dashboard or any individual lead. They'll rest here until you're ready.
          </p>
          <button class="btn-primary px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer" onclick="window.app.navigate('#dashboard')">
            Back to Dashboard
          </button>
        </section>
        ` : `
        <!-- Search + segmented filter -->
        <section class="mb-6 card rounded-2xl p-5">
          <div class="relative mb-4">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">search</span>
            <input id="paused-search" type="text" placeholder="Search by organisation or contact name…"
              class="w-full bg-white border border-border-soft rounded-xl pl-11 pr-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all placeholder:text-ink-ghost"
              oninput="${FILTER_FN}"/>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="paused-segment is-active px-4 py-2 rounded-xl text-xs font-semibold transition-all" data-filter="all" onclick="${SEGMENT_CLICK}">All <span class="ml-1 opacity-60">${all.length}</span></button>
            <button class="paused-segment px-4 py-2 rounded-xl text-xs font-semibold transition-all" data-filter="Investors" onclick="${SEGMENT_CLICK}">Investors <span class="ml-1 opacity-60">${investors.length}</span></button>
            <button class="paused-segment px-4 py-2 rounded-xl text-xs font-semibold transition-all" data-filter="Philanthropy" onclick="${SEGMENT_CLICK}">Philanthropy <span class="ml-1 opacity-60">${philanthropy.length}</span></button>
            <button class="paused-segment px-4 py-2 rounded-xl text-xs font-semibold transition-all" data-filter="manual" onclick="${SEGMENT_CLICK}">Manually Paused <span class="ml-1 opacity-60">${manual.length}</span></button>
          </div>
        </section>

        <!-- Lead grid -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${all.map(l => leadCard(l)).join('')}
        </section>

        <p class="text-xs text-white/50 text-center mt-8">Showing <strong id="paused-shown" class="text-white/80">${all.length}</strong> of ${all.length} paused leads</p>
        `}
      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 nav-glass-bottom rounded-t-3xl">
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-xl">dashboard</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#kanban')">
          <span class="material-symbols-outlined text-xl">view_kanban</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Pipeline</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-xl">table_rows</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Leads</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#calendar')">
          <span class="material-symbols-outlined text-xl">calendar_today</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Tasks</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#paused')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">spa</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Paused</span>
        </a>
      </nav>
    </div>
  `;
}
