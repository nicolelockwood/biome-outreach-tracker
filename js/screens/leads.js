import { navHTML } from './dashboard.js';

export function renderLeads(navigate, leads = []) {
  const priorityDot = (p) => {
    if (p === 'Critical') return '<span class="inline-block w-2 h-2 rounded-full bg-error dot-critical"></span>';
    if (p === 'High')     return '<span class="inline-block w-2 h-2 rounded-full bg-canopy"></span>';
    if (p === 'Medium')   return '<span class="inline-block w-2 h-2 rounded-full bg-warning"></span>';
    return '<span class="inline-block w-2 h-2 rounded-full bg-border"></span>';
  };

  const stageColour = (stage) => {
    if (stage === 'Engaged')          return 'bg-canopy/10 text-canopy';
    if (stage === 'Contacted')        return 'bg-meadow text-forest';
    if (stage === 'Meeting Set' || stage === 'Proposal Sent') return 'bg-warning-bg text-warning';
    if (stage === 'Awaiting Response') return 'bg-warning-bg text-warning';
    if (stage === 'Parked' || stage === 'Closed') return 'bg-surface-mid text-ink-ghost';
    return 'bg-surface-mid text-ink-soft';
  };

  const leadsHtml = leads.map(lead => `
    <tr class="lead-row border-b border-border-soft cursor-pointer" onclick="window.app.navigate('#lead/${lead.id}')">
      <td class="py-5 px-6">
        <div>
          <p class="font-semibold text-forest text-sm leading-snug">${lead.org_name}</p>
          <p class="text-xs text-ink-ghost mt-0.5">${lead.region || 'Australia'} · ${lead.category}</p>
        </div>
      </td>
      <td class="py-5 px-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-meadow text-forest flex items-center justify-center text-[10px] font-bold shrink-0">${lead.contact_initials || '??'}</div>
          <div>
            <p class="text-sm font-medium text-ink-mid leading-snug">${lead.contact_name || '—'}</p>
            <p class="text-[11px] text-ink-ghost">${lead.contact_title || '—'}</p>
          </div>
        </div>
      </td>
      <td class="py-5 px-6">
        <span class="px-3 py-1 rounded-full ${stageColour(lead.stage)} text-[10px] font-bold uppercase tracking-wider">${lead.stage}</span>
      </td>
      <td class="py-5 px-6">
        <div class="flex items-center gap-2">
          ${priorityDot(lead.priority)}
          <span class="text-sm text-ink-mid">${lead.priority || '—'}</span>
        </div>
      </td>
      <td class="py-5 px-6">
        <span class="text-sm font-semibold text-forest">${lead.ticket_size || '—'}</span>
      </td>
      <td class="py-5 px-6 text-right">
        <span class="material-symbols-outlined text-ink-ghost group-hover:text-forest text-base transition-colors">chevron_right</span>
      </td>
    </tr>
  `).join('');

  return `
    <div class="min-h-screen bg-white pb-24 md:pb-0">
      ${navHTML('leads')}

      <main class="max-w-7xl mx-auto px-6 pt-10">

        <!-- Hero -->
        <section class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-ghost mb-3">All Organisations</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-forest leading-tight mb-3">All Leads</h1>
            <p class="text-ink-soft text-base max-w-lg leading-relaxed">
              Your complete pipeline — <strong class="text-ink-mid font-semibold">${leads.length} organisation${leads.length !== 1 ? 's' : ''}</strong> across all stages and categories.
            </p>
          </div>
          <button class="btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shrink-0 self-start md:self-auto" onclick="window.app.navigate('#add-lead')">
            <span class="material-symbols-outlined text-base">add</span>
            New Lead
          </button>
        </section>

        <!-- Filters -->
        <section class="mb-8 p-5 bg-surface-low rounded-2xl border border-border-soft">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            ${[
              ['Category',    ['All Categories', 'Philanthropy', 'Investors']],
              ['Stage',       ['All Stages', 'New', 'Contacted', 'Engaged', 'Meeting Set', 'Proposal Sent', 'Parked']],
              ['Priority',    ['All Priorities', 'Critical', 'High', 'Medium', 'Low']],
              ['Owner',       ['All Owners', 'Nicole']],
              ['Ticket Size', ['Any Range', 'A$1M–A$10M', 'A$10M+']],
              ['Tags',        ['All Tags', 'Warm Intro', 'Direct Outreach', 'Cold Outreach']],
            ].map(([label, opts]) => `
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost px-1">${label}</label>
              <select class="w-full bg-white border border-border-soft rounded-xl py-2.5 px-3 text-sm text-ink-mid appearance-none focus:ring-2 focus:ring-forest/20 focus:outline-none cursor-pointer">
                ${opts.map(o => `<option>${o}</option>`).join('')}
              </select>
            </div>
            `).join('')}
          </div>
        </section>

        <!-- Table -->
        <section class="card rounded-2xl overflow-hidden mb-12">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-border-soft bg-surface-low">
                  <th class="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Organization</th>
                  <th class="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Contact</th>
                  <th class="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Stage</th>
                  <th class="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Priority</th>
                  <th class="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Ticket Size</th>
                  <th class="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody>
                ${leadsHtml || `<tr><td colspan="6" class="py-16 text-center text-ink-ghost text-sm">No leads yet — add your first one</td></tr>`}
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 border-t border-border-soft flex justify-between items-center bg-surface-low">
            <p class="text-sm text-ink-ghost">Showing <strong class="text-ink-mid">${leads.length}</strong> lead${leads.length !== 1 ? 's' : ''}</p>
            <div class="flex gap-2">
              <button class="w-9 h-9 rounded-xl border border-border-soft bg-white flex items-center justify-center text-ink-ghost disabled:opacity-40" disabled>
                <span class="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button class="w-9 h-9 rounded-xl border border-border-soft bg-white flex items-center justify-center text-forest hover:bg-surface-low">
                <span class="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur border-t border-border-soft shadow-nav rounded-t-3xl">
        <a class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-xl">dashboard</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Dashboard</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#kanban')">
          <span class="material-symbols-outlined text-xl">view_kanban</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Pipeline</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-forest text-white" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">table_rows</span>
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
