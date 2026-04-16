import { navHTML } from './dashboard.js';

function renderCard(lead) {
  const isPhilanthropy = lead.category === 'Philanthropy';
  const isHigh = lead.priority === 'Critical' || lead.priority === 'High';
  const isLow  = lead.priority === 'Low';

  const priorityBadge = isHigh
    ? '<span class="px-2 py-0.5 bg-error/10 text-error text-[9px] font-bold uppercase tracking-wider rounded-full">High</span>'
    : isLow
    ? '<span class="px-2 py-0.5 bg-stage-pipeline-bg text-stage-pipeline text-[9px] font-bold uppercase tracking-wider rounded-full">Low</span>'
    : '<span class="px-2 py-0.5 bg-stage-warm-bg text-stage-warm text-[9px] font-bold uppercase tracking-wider rounded-full">Med</span>';

  // Priority glass tint class instead of flat left border
  const glassClass = isHigh ? 'priority-glass-high' : isLow ? 'priority-glass-low' : 'priority-glass-medium';

  const categoryBadge = isPhilanthropy
    ? '<span class="px-2 py-0.5 bg-meadow text-forest text-[9px] font-bold uppercase tracking-wider rounded-full">Philanthropy</span>'
    : '<span class="px-2 py-0.5 bg-surface-mid text-ink-soft text-[9px] font-bold uppercase tracking-wider rounded-full">Investor</span>';

  return `
    <article class="card rounded-2xl p-5 cursor-pointer ${glassClass}"
      onclick="window.app.navigate('#lead/${lead.id}')">
      <div class="flex items-start justify-between gap-2 mb-3">
        ${categoryBadge}
        ${priorityBadge}
      </div>
      <h4 class="font-semibold text-forest text-base mb-1 leading-snug" style="font-family:'Fraunces',Georgia,serif;">${lead.org_name}</h4>
      <p class="text-sm text-ink-soft mb-3">${lead.contact_name || '—'}</p>
      ${lead.action ? `<p class="text-xs text-ink-ghost leading-relaxed mb-3 line-clamp-2">${lead.action.slice(0, 90)}${lead.action.length > 90 ? '…' : ''}</p>` : ''}
      <div class="flex items-center justify-between pt-3 border-t border-border-soft">
        <span class="text-sm font-bold text-forest">${lead.ticket_size || '—'}</span>
        <span class="material-symbols-outlined text-sm text-ink-ghost">arrow_forward</span>
      </div>
    </article>
  `;
}

const COL_CONFIG = [
  { key: 'new',      title: 'New',              dotColor: '#6b7d8a',  filter: l => l.stage === 'New' },
  { key: 'contacted',title: 'Contacted',         dotColor: '#3d8b63',  filter: l => l.stage === 'Contacted' },
  { key: 'engaged',  title: 'Engaged',           dotColor: '#b8860b',  filter: l => l.stage === 'Engaged' },
  { key: 'meeting',  title: 'Meeting / Proposal',dotColor: '#b0603a',  filter: l => l.stage === 'Meeting Set' || l.stage === 'Proposal Sent' || l.stage === 'Awaiting Response' },
  { key: 'parked',   title: 'Parked',            dotColor: '#6a7a72',  filter: l => l.stage === 'Parked' || l.stage === 'Closed' },
  { key: 'secured',  title: 'Secured ✓',         dotColor: '#14342a',  filter: l => l.stage === 'Secured' },
];

function renderColumn(col, leads) {
  const colLeads = leads.filter(col.filter);
  return `
    <div class="flex flex-col gap-4 shrink-0" style="width:288px;">
      <!-- Glass-backed column header for contrast on dark forest bg -->
      <div class="flex items-center justify-between px-3 py-2.5 rounded-xl mb-1" style="background: rgba(255,255,255,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.4);">
        <div class="flex items-center gap-2.5">
          <span class="w-2.5 h-2.5 rounded-full inline-block" style="background: ${col.dotColor};"></span>
          <h3 class="text-xs font-bold uppercase tracking-[0.12em] text-forest">${col.title}</h3>
        </div>
        <span class="text-xs font-bold text-white bg-forest px-2.5 py-1 rounded-full">${colLeads.length}</span>
      </div>
      ${colLeads.length > 0
        ? colLeads.map(l => renderCard(l)).join('')
        : `<div class="h-20 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center">
             <p class="text-[10px] font-bold uppercase tracking-widest text-white/40">Empty</p>
           </div>`
      }
    </div>
  `;
}

export function renderKanban(navigate, leads = []) {
  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('kanban')}

      <main>
        <!-- Hero -->
        <section class="max-w-7xl mx-auto px-6 pt-10 pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Outreach Lifecycle</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-3">Leads Pipeline</h1>
            <p class="text-white/70 text-base max-w-lg leading-relaxed">
              Track your <strong class="text-white font-semibold">${leads.length} lead${leads.length !== 1 ? 's' : ''}</strong> across every stage from first contact to active engagement.
            </p>
          </div>
          <div class="flex gap-3 shrink-0">
            <button class="flex items-center gap-2 px-5 py-3 bg-surface-low border border-border-soft text-ink-mid font-semibold rounded-xl hover:bg-surface-mid transition-colors cursor-pointer text-sm" onclick="window.app.navigate('#strategy')">
              <span class="material-symbols-outlined text-base">auto_stories</span>
              Strategy
            </button>
            <button class="btn-primary flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm cursor-pointer" onclick="window.app.navigate('#add-lead')">
              <span class="material-symbols-outlined text-base">add</span>
              New Lead
            </button>
          </div>
        </section>

        <!-- Kanban board -->
        <div class="px-6 overflow-x-auto pb-12">
          <div class="flex gap-5 items-start" style="min-width: max-content; min-height: 500px;">
            ${COL_CONFIG.map(col => renderColumn(col, leads)).join('')}
          </div>
        </div>
      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 nav-glass-bottom rounded-t-3xl">
        <a class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-xl">dashboard</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-forest text-white" onclick="window.app.navigate('#kanban')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">view_kanban</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Pipeline</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-xl">table_rows</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Leads</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#add-lead')">
          <span class="material-symbols-outlined text-xl">add_circle</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Add</span>
        </a>
      </nav>
    </div>
  `;
}
