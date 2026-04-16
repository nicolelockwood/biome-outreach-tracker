import { navHTML } from './dashboard.js';

function renderCard(lead) {
  const isPhilanthropy = lead.category === 'Philanthropy';
  const isHigh = lead.priority === 'Critical' || lead.priority === 'High';
  const isMed  = lead.priority === 'Medium' || (!isHigh && lead.priority !== 'Low');
  const isLow  = lead.priority === 'Low';

  const priorityBadge = isHigh
    ? '<span class="px-2 py-0.5 bg-error/10 text-error text-[9px] font-bold uppercase tracking-wider rounded-full">High</span>'
    : isLow
    ? '<span class="px-2 py-0.5 bg-meadow text-forest text-[9px] font-bold uppercase tracking-wider rounded-full">Low</span>'
    : '<span class="px-2 py-0.5 bg-canopy/15 text-canopy text-[9px] font-bold uppercase tracking-wider rounded-full">Med</span>';

  const borderClass = isHigh ? 'border-l-error' : isLow ? 'border-l-meadow-mid' : 'border-l-canopy';

  const categoryBadge = isPhilanthropy
    ? '<span class="px-2 py-0.5 bg-meadow text-forest text-[9px] font-bold uppercase tracking-wider rounded-full">Philanthropy</span>'
    : '<span class="px-2 py-0.5 bg-surface-mid text-ink-soft text-[9px] font-bold uppercase tracking-wider rounded-full">Investor</span>';

  return `
    <article class="card rounded-2xl p-5 cursor-pointer border-l-2 ${borderClass}"
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
  { key: 'new',      title: 'New',              dotClass: 'bg-border',        filter: l => l.stage === 'New' },
  { key: 'contacted',title: 'Contacted',         dotClass: 'bg-ink-soft',      filter: l => l.stage === 'Contacted' },
  { key: 'engaged',  title: 'Engaged',           dotClass: 'bg-canopy',        filter: l => l.stage === 'Engaged' },
  { key: 'meeting',  title: 'Meeting / Proposal',dotClass: 'bg-warning',       filter: l => l.stage === 'Meeting Set' || l.stage === 'Proposal Sent' || l.stage === 'Awaiting Response' },
  { key: 'parked',   title: 'Parked',            dotClass: 'bg-surface-high',  filter: l => l.stage === 'Parked' || l.stage === 'Closed' },
  { key: 'secured',  title: 'Secured ✓',         dotClass: 'bg-forest',        filter: l => l.stage === 'Secured' },
];

function renderColumn(col, leads) {
  const colLeads = leads.filter(col.filter);
  return `
    <div class="flex flex-col gap-4 shrink-0" style="width:288px;">
      <div class="flex items-center justify-between px-1 mb-1">
        <div class="flex items-center gap-2">
          <span class="w-2 h-2 rounded-full ${col.dotClass} inline-block"></span>
          <h3 class="text-xs font-bold uppercase tracking-[0.12em] text-ink-soft">${col.title}</h3>
        </div>
        <span class="text-xs font-bold text-ink-ghost bg-surface-mid px-2 py-0.5 rounded-full">${colLeads.length}</span>
      </div>
      ${colLeads.length > 0
        ? colLeads.map(l => renderCard(l)).join('')
        : `<div class="h-20 rounded-2xl border-2 border-dashed border-border-soft flex items-center justify-center">
             <p class="text-[10px] font-bold uppercase tracking-widest text-ink-ghost">Empty</p>
           </div>`
      }
    </div>
  `;
}

export function renderKanban(navigate, leads = []) {
  return `
    <div class="min-h-screen bg-white pb-24 md:pb-0">
      ${navHTML('kanban')}

      <main>
        <!-- Hero -->
        <section class="max-w-7xl mx-auto px-6 pt-10 pb-6 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-ghost mb-3">Outreach Lifecycle</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-forest leading-tight mb-3">Leads Pipeline</h1>
            <p class="text-ink-soft text-base max-w-lg leading-relaxed">
              Track your <strong class="text-ink-mid font-semibold">${leads.length} lead${leads.length !== 1 ? 's' : ''}</strong> across every stage from first contact to active engagement.
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

        <!-- Filter panel -->
        <div id="kanban-filter-panel" class="hidden max-w-7xl mx-auto px-6 mb-4">
          <div class="card rounded-2xl p-4 flex gap-4 flex-wrap">
            ${[['Category',['All','Philanthropy','Investors']],['Priority',['All','Critical','High','Medium','Low']],['Region',['All','Australia']]].map(([label,opts]) => `
            <div class="flex flex-col gap-1">
              <label class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">${label}</label>
              <select class="bg-surface-low border border-border-soft rounded-xl px-3 py-2 text-sm text-ink-mid focus:outline-none focus:ring-2 focus:ring-forest/20">
                ${opts.map(o=>`<option>${o}</option>`).join('')}
              </select>
            </div>`).join('')}
          </div>
        </div>

        <!-- Kanban board -->
        <div class="px-6 overflow-x-auto pb-12">
          <div class="flex gap-5 items-start" style="min-width: max-content; min-height: 500px;">
            ${COL_CONFIG.map(col => renderColumn(col, leads)).join('')}
          </div>
        </div>
      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur border-t border-border-soft shadow-nav rounded-t-3xl">
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
