import { navHTML } from './dashboard.js';

const PRIORITY_COLOUR = {
  High:     { dot: '#c0392b', badge: 'bg-error/10 text-error',     border: 'border-l-error' },
  Critical: { dot: '#c0392b', badge: 'bg-error/10 text-error',     border: 'border-l-error' },
  Medium:   { dot: '#00c566', badge: 'bg-canopy/10 text-canopy',   border: 'border-l-canopy' },
  Low:      { dot: '#d0ead9', badge: 'bg-meadow text-forest',      border: 'border-l-meadow-mid' },
};
const pc = (p) => PRIORITY_COLOUR[p] || PRIORITY_COLOUR['Medium'];

export function renderCalendar(navigate, followUps = [], leads = []) {
  // followUps: interaction records with follow_up_date set
  // leads: all leads (for priority lookup by lead_id)
  const leadMap = Object.fromEntries(leads.map(l => [l.id, l]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parse = (d) => { const dt = new Date(d + 'T00:00:00'); dt.setHours(0,0,0,0); return dt; };
  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' });

  // Enrich each follow-up with lead info + parsed date
  const items = followUps
    .filter(f => f.follow_up_date)
    .map(f => {
      const lead = leadMap[f.lead_id] || {};
      const dt = parse(f.follow_up_date);
      const diffDays = Math.round((dt - today) / 86400000);
      return { ...f, lead, dt, diffDays };
    })
    .sort((a, b) => a.dt - b.dt);

  // Bucket
  const overdue   = items.filter(i => i.diffDays < 0 && !i.completed);
  const todayItems = items.filter(i => i.diffDays === 0 && !i.completed);
  const thisWeek  = items.filter(i => i.diffDays > 0 && i.diffDays <= 7 && !i.completed);
  const upcoming  = items.filter(i => i.diffDays > 7 && !i.completed);
  const done      = items.filter(i => i.completed);

  const card = (item) => {
    const p = item.lead?.priority || 'Medium';
    const pNorm = p === 'Critical' ? 'High' : p;
    const colours = pc(p);
    return `
    <div class="card rounded-xl p-4 border-l-4 ${colours.border} flex items-start gap-4 group">
      <div class="shrink-0 mt-0.5">
        <div class="w-5 h-5 rounded-full border-2 border-border cursor-pointer flex items-center justify-center hover:border-forest transition-colors ${item.completed ? 'bg-forest border-forest' : ''}"
          onclick="(async function(){
            const el = this;
            const { error } = await window.app.completeFollowUp(${item.id}, ${!item.completed});
            if (!error) window.app.navigate('#calendar');
          }).call(this)">
          ${item.completed ? '<span class="material-symbols-outlined text-white text-xs">check</span>' : ''}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <a class="font-semibold text-forest text-sm hover:underline cursor-pointer leading-snug" onclick="window.app.navigate('#lead/${item.lead_id}')">
            ${item.lead?.org_name || 'Unknown Lead'}
          </a>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${colours.badge}">${pNorm}</span>
        </div>
        ${item.follow_up_action ? `<p class="text-sm text-ink-mid font-medium mb-1">${item.follow_up_action}</p>` : ''}
        <p class="text-xs text-ink-ghost line-clamp-1">${item.summary || '—'}</p>
        <div class="flex items-center gap-3 mt-2">
          <span class="text-[10px] text-ink-ghost font-bold uppercase tracking-wider">${fmt(item.follow_up_date)}</span>
          <span class="px-2 py-0.5 bg-surface-low text-ink-ghost text-[9px] font-bold uppercase rounded-full">${item.type}</span>
        </div>
      </div>
      <a class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onclick="window.app.navigate('#lead/${item.lead_id}')">
        <span class="material-symbols-outlined text-ink-ghost text-base">open_in_new</span>
      </a>
    </div>`;
  };

  const bucket = (title, icon, items, emptyMsg, accent = '') => {
    if (items.length === 0 && !emptyMsg) return '';
    return `
    <div class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-base ${accent || 'text-ink-ghost'}">${icon}</span>
        <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-lg font-semibold text-forest">${title}</h3>
        ${items.length > 0 ? `<span class="px-2.5 py-0.5 bg-surface-low text-ink-soft text-xs font-bold rounded-full">${items.length}</span>` : ''}
      </div>
      <div class="space-y-3">
        ${items.length > 0 ? items.map(card).join('') : `<p class="text-sm text-ink-ghost italic pl-7">${emptyMsg}</p>`}
      </div>
    </div>`;
  };

  const totalPending = overdue.length + todayItems.length + thisWeek.length + upcoming.length;

  return `
    <div class="min-h-screen bg-white pb-24 md:pb-0">
      ${navHTML('calendar')}

      <main class="max-w-3xl mx-auto px-6 pt-10">

        <!-- Hero -->
        <section class="mb-10 flex items-end justify-between gap-6">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-ghost mb-3">Action Centre</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-forest leading-tight mb-2">Follow-ups</h1>
            <p class="text-ink-soft text-base">
              ${totalPending > 0
                ? `<strong class="text-ink-mid">${totalPending}</strong> task${totalPending !== 1 ? 's' : ''} pending${overdue.length > 0 ? ` · <span class="text-error font-semibold">${overdue.length} overdue</span>` : ''}`
                : 'All clear — no pending follow-ups 🌿'}
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost">${today.toLocaleDateString('en-AU', { weekday:'long' })}</p>
            <p class="text-2xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${today.toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })}</p>
          </div>
        </section>

        <!-- Task buckets -->
        ${overdue.length > 0 ? bucket('Overdue', 'warning', overdue, '', 'text-error') : ''}
        ${bucket('Today', 'today', todayItems, 'Nothing due today ✓', 'text-canopy')}
        ${bucket('This Week', 'date_range', thisWeek, 'Nothing else this week')}
        ${upcoming.length > 0 ? bucket('Upcoming', 'event', upcoming, '') : ''}
        ${done.length > 0 ? `
        <details class="mt-8">
          <summary class="flex items-center gap-2 cursor-pointer text-ink-ghost hover:text-forest transition-colors mb-4">
            <span class="material-symbols-outlined text-base">check_circle</span>
            <span class="text-sm font-bold uppercase tracking-wider">Completed (${done.length})</span>
          </summary>
          <div class="space-y-3 opacity-60">
            ${done.map(card).join('')}
          </div>
        </details>` : ''}

        ${totalPending === 0 && done.length === 0 ? `
        <div class="text-center py-20">
          <div class="w-16 h-16 rounded-2xl bg-meadow flex items-center justify-center mx-auto mb-5">
            <span class="material-symbols-outlined text-forest text-3xl" style="font-variation-settings:'FILL' 1;">sentiment_satisfied</span>
          </div>
          <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-forest mb-2">You're all caught up</h3>
          <p class="text-ink-soft text-base mb-6">Log interactions and set follow-up dates to see tasks here.</p>
          <button class="btn-primary px-6 py-3 rounded-xl font-semibold text-sm cursor-pointer" onclick="window.app.navigate('#leads')">View All Leads</button>
        </div>` : ''}

      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-white/90 backdrop-blur border-t border-border-soft shadow-nav rounded-t-3xl">
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
        <a class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#calendar')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">calendar_today</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Tasks</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#add-lead')">
          <span class="material-symbols-outlined text-xl">add_circle</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Add</span>
        </a>
      </nav>
    </div>
  `;
}
