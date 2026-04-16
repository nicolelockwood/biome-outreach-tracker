import { navHTML } from './dashboard.js';

function parseTicket(str) {
  if (!str) return 0;
  let s = str.toString().replace(/[$,\s]/g, '');
  if (/B$/i.test(s)) return parseFloat(s) * 1_000_000_000;
  if (/M$/i.test(s)) return parseFloat(s) * 1_000_000;
  if (/K$/i.test(s)) return parseFloat(s) * 1_000;
  return parseFloat(s) || 0;
}

function fmtM(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K';
  return n > 0 ? '$' + n.toLocaleString() : '$0';
}

function fmtDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return d; }
}

// SVG progress ring generator
function progressRing(pct, size, strokeWidth, color, trailColor = 'rgba(20,52,42,0.08)') {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  const center = size / 2;

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" class="block">
      <!-- Trail -->
      <circle cx="${center}" cy="${center}" r="${radius}"
        fill="none" stroke="${trailColor}" stroke-width="${strokeWidth}"
        stroke-linecap="round"/>
      <!-- Progress -->
      <circle cx="${center}" cy="${center}" r="${radius}"
        fill="none" stroke="${color}" stroke-width="${strokeWidth}"
        stroke-linecap="round"
        class="progress-ring-circle"
        stroke-dasharray="${circumference}"
        stroke-dashoffset="${offset}"/>
    </svg>`;
}

export function renderArchive(navigate, securedLeads = [], allInteractions = []) {
  const totalLanded = securedLeads.reduce((sum, l) => sum + parseTicket(l.ticket_size), 0);
  const philLanded  = securedLeads.filter(l => (l.category||'').includes('Philanthropy')).reduce((sum, l) => sum + parseTicket(l.ticket_size), 0);
  const invLanded   = securedLeads.filter(l => (l.category||'').includes('Investors')).reduce((sum, l) => sum + parseTicket(l.ticket_size), 0);

  const PHIL_GOAL = 5_000_000;
  const INV_GOAL  = 100_000_000;
  const TOTAL_GOAL = PHIL_GOAL + INV_GOAL;

  const philPct = Math.min(100, Math.round(philLanded / PHIL_GOAL * 100));
  const invPct  = Math.min(100, Math.round(invLanded / INV_GOAL * 100));
  const totalPct = Math.min(100, Math.round(totalLanded / TOTAL_GOAL * 100));

  // Group interactions by lead_id
  const intByLead = {};
  for (const i of allInteractions) {
    if (!intByLead[i.lead_id]) intByLead[i.lead_id] = [];
    intByLead[i.lead_id].push(i);
  }

  const outcomeColour = (o) => {
    if (o === 'Committed' || o === 'Interested') return 'bg-meadow text-forest';
    if (o === 'Declined') return 'bg-error/10 text-error';
    if (o === 'Meeting Booked' || o === 'Proposal Requested') return 'bg-stage-hot-bg text-stage-hot';
    return 'bg-surface-mid text-ink-soft';
  };

  const typeIcon = (t) => {
    if (t === 'Call') return 'call';
    if (t === 'Meeting') return 'groups';
    if (t === 'LinkedIn') return 'person_search';
    if (t === 'Intro') return 'handshake';
    return 'mail';
  };

  const leadCard = (lead) => {
    const ints = (intByLead[lead.id] || []).sort((a, b) => new Date(a.date) - new Date(b.date));
    const cats = (lead.category || '').split(',');
    const isPhil = cats.includes('Philanthropy');
    const isInv  = cats.includes('Investors');
    const catLabel = isPhil && isInv ? 'Investor + Philanthropy' : (lead.category || '—');

    return `
    <div class="card rounded-2xl overflow-hidden">
      <!-- Lead header -->
      <div class="p-6 relative overflow-hidden" style="background: rgba(20,52,42,0.85); backdrop-filter: blur(16px); color: white;">
        <div class="absolute right-5 top-5 opacity-10">
          <span class="material-symbols-outlined" style="font-size:5rem;">${isPhil ? 'volunteer_activism' : 'payments'}</span>
        </div>
        <div class="flex items-start justify-between gap-4">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2.5 py-0.5 bg-canopy/20 text-canopy text-[9px] font-bold uppercase tracking-wider rounded-full">Secured ✓</span>
              <span class="px-2.5 py-0.5 bg-white/10 text-white/70 text-[9px] font-bold uppercase tracking-wider rounded-full">${catLabel}</span>
            </div>
            <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white mb-1">${lead.org_name}</h3>
            <p class="text-white/60 text-sm">${lead.contact_name || '—'}${lead.contact_title ? ' · ' + lead.contact_title : ''}</p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-3xl font-bold text-white" style="font-family:'Fraunces',Georgia,serif;">${lead.ticket_size || 'TBC'}</p>
            <p class="text-white/50 text-xs mt-1">${lead.region || 'Australia'}</p>
          </div>
        </div>
        ${lead.comments ? `<p class="text-white/50 text-xs mt-4 leading-relaxed line-clamp-2">${lead.comments}</p>` : ''}
        <button class="mt-4 flex items-center gap-1.5 text-canopy text-xs font-bold hover:text-white transition-colors cursor-pointer" onclick="window.app.navigate('#lead/${lead.id}')">
          View Full Lead Detail <span class="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <!-- Interaction history -->
      <div class="p-6">
        <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-5">
          Full Interaction History · ${ints.length} touchpoint${ints.length !== 1 ? 's' : ''}
        </p>
        ${ints.length > 0 ? `
        <div class="relative">
          <div class="absolute left-3 top-0 bottom-0 w-px bg-border-soft"></div>
          <div class="space-y-5">
            ${ints.map(int => `
            <div class="relative pl-10">
              <div class="absolute left-0 top-1 w-6 h-6 rounded-full bg-meadow border-2 border-white flex items-center justify-center">
                <span class="material-symbols-outlined text-forest text-xs">${typeIcon(int.type)}</span>
              </div>
              <div class="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-bold text-ink-mid">${fmtDate(int.date)}</span>
                  <span class="px-2 py-0.5 bg-surface-low text-ink-soft text-[9px] font-bold uppercase tracking-wider rounded-full">${int.type}</span>
                  <span class="px-2 py-0.5 ${outcomeColour(int.outcome)} text-[9px] font-bold rounded-full">${int.outcome}</span>
                </div>
              </div>
              <p class="text-sm text-ink-mid leading-relaxed">${int.summary}</p>
              ${(int.follow_up_action || int.follow_up_date) ? `
              <div class="flex flex-wrap gap-3 mt-2">
                ${int.follow_up_action ? `<p class="text-xs text-forest font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-xs">task_alt</span>${int.follow_up_action}</p>` : ''}
                ${int.follow_up_date ? `<p class="text-xs text-ink-ghost flex items-center gap-1"><span class="material-symbols-outlined text-xs">calendar_today</span>${int.follow_up_date}</p>` : ''}
              </div>` : ''}
            </div>`).join('')}
          </div>
        </div>` : `
        <div class="py-6 text-center">
          <p class="text-sm text-ink-ghost italic">No interactions logged — <a class="text-forest hover:underline cursor-pointer" onclick="window.app.navigate('#lead/${lead.id}')">add one from the lead detail</a></p>
        </div>`}
      </div>
    </div>`;
  };

  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('archive')}

      <main class="max-w-4xl mx-auto px-6 pt-10 pb-16">

        <!-- Hero -->
        <section class="mb-10">
          <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Partnerships Landed</p>
          <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-3">Secured</h1>
          <p class="text-white/70 text-base max-w-xl leading-relaxed">
            Every commitment landed, every relationship that crossed the line — with the full trail of how you got there.
          </p>
        </section>

        <!-- Premium progress ring cards -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <!-- Total Landed -->
          <div class="card rounded-2xl p-6 flex flex-col items-center text-center">
            <div class="relative mb-4">
              ${progressRing(totalPct, 140, 8, '#14342a')}
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-2xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${fmtM(totalLanded)}</p>
                <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost">${totalPct}%</p>
              </div>
            </div>
            <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Total Landed</p>
            <p class="text-xs text-ink-soft">${securedLeads.length} commitment${securedLeads.length !== 1 ? 's' : ''}</p>
            <p class="text-[10px] text-ink-ghost mt-2">of ${fmtM(TOTAL_GOAL)} combined goal</p>
          </div>

          <!-- Philanthropy -->
          <div class="card rounded-2xl p-6 flex flex-col items-center text-center">
            <div class="relative mb-4">
              ${progressRing(philPct, 140, 8, '#5a8a4a')}
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-2xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${fmtM(philLanded)}</p>
                <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost">${philPct}%</p>
              </div>
            </div>
            <p class="text-[9px] font-bold uppercase tracking-wider text-philanthropy mb-1">Philanthropy</p>
            <p class="text-xs text-ink-soft">of ${fmtM(PHIL_GOAL)} goal</p>
          </div>

          <!-- Investment -->
          <div class="card rounded-2xl p-6 flex flex-col items-center text-center">
            <div class="relative mb-4">
              ${progressRing(invPct, 140, 8, '#2a6a5a')}
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <p class="text-2xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${fmtM(invLanded)}</p>
                <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost">${invPct}%</p>
              </div>
            </div>
            <p class="text-[9px] font-bold uppercase tracking-wider text-investor mb-1">Investment</p>
            <p class="text-xs text-ink-soft">of ${fmtM(INV_GOAL)} goal</p>
          </div>
        </section>

        <!-- Lead archive cards -->
        ${securedLeads.length > 0 ? `
        <div class="space-y-8">
          ${securedLeads.map(l => leadCard(l)).join('')}
        </div>` : `
        <div class="text-center py-20">
          <div class="w-16 h-16 rounded-2xl bg-meadow flex items-center justify-center mx-auto mb-5">
            <span class="material-symbols-outlined text-forest text-3xl" style="font-variation-settings:'FILL' 1;">workspace_premium</span>
          </div>
          <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white drop-shadow-sm mb-2">No secured funding yet</h3>
          <p class="text-white/60 text-base mb-6 max-w-sm mx-auto">When a lead commits, edit their stage to <strong class="text-white">Secured</strong> and they'll appear here with their full interaction trail.</p>
          <button class="btn-primary px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer" onclick="window.app.navigate('#kanban')">View Pipeline</button>
        </div>`}
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
        <a class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#archive')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">workspace_premium</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Secured</span>
        </a>
      </nav>
    </div>
  `;
}
