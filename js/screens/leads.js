import { navHTML, stageColourClass } from './dashboard.js';

// Shared filter logic — stored as a string so it can be called from any filter's onchange/oninput
const FILTER_FN = `(function(){
  var search = (document.getElementById('filter-search')?.value || '').toLowerCase();
  var stage = document.getElementById('filter-stage')?.value || '';
  var priority = document.getElementById('filter-priority')?.value || '';
  var category = document.getElementById('filter-category')?.value || '';
  var region = document.getElementById('filter-region')?.value || '';
  var rows = document.querySelectorAll('.lead-row');
  var shown = 0;
  rows.forEach(function(row){
    var org = (row.dataset.org || '').toLowerCase();
    var contact = (row.dataset.contact || '').toLowerCase();
    var rStage = row.dataset.stage || '';
    var rPriority = row.dataset.priority || '';
    var rCategory = row.dataset.category || '';
    var rRegion = row.dataset.region || '';
    var normPriority = (rPriority === 'Critical') ? 'High' : rPriority;
    var matchSearch   = !search   || org.includes(search) || contact.includes(search);
    var matchStage    = !stage    || stage === 'all'    || rStage === stage;
    var matchPriority = !priority || priority === 'all' || normPriority === priority;
    var matchCategory = !category || category === 'all' || rCategory.split(',').includes(category);
    var matchRegion   = !region   || region === 'all'   || rRegion === region;
    var visible = matchSearch && matchStage && matchPriority && matchCategory && matchRegion;
    row.style.display = visible ? '' : 'none';
    if(visible) shown++;
  });
  var counter = document.getElementById('leads-shown');
  if(counter) counter.textContent = shown;
})()`;

export function renderLeads(navigate, leads = []) {
  const priorityDot = (p) => {
    const norm = (p === 'Critical') ? 'High' : p;
    if (norm === 'High')   return '<span class="inline-block w-2 h-2 rounded-full bg-error"></span>';
    if (norm === 'Medium') return '<span class="inline-block w-2 h-2 rounded-full bg-canopy"></span>';
    return '<span class="inline-block w-2 h-2 rounded-full bg-meadow-mid border border-border-soft"></span>';
  };

  const stageColour = stageColourClass;

  const cats = (lead) => (lead.category || '').split(',').map(c => c.trim());
  const catLabel = (lead) => {
    const c = cats(lead);
    if (c.includes('Investors') && c.includes('Philanthropy')) return 'Both';
    return lead.category || '—';
  };

  const priorityDisplay = (p) => (p === 'Critical') ? 'High' : (p || '—');

  const leadsHtml = leads.map(lead => `
    <tr class="lead-row border-b border-border-soft cursor-pointer hover:bg-surface-low transition-colors"
      data-org="${(lead.org_name || '').replace(/"/g,'&quot;').toLowerCase()}"
      data-contact="${(lead.contact_name || '').replace(/"/g,'&quot;').toLowerCase()}"
      data-stage="${lead.stage || ''}"
      data-priority="${lead.priority || ''}"
      data-category="${lead.category || ''}"
      data-region="${lead.region || ''}"
      onclick="window.app.navigate('#lead/${lead.id}')">
      <td class="py-5 px-6">
        <div>
          <p class="font-semibold text-forest text-sm leading-snug">${lead.org_name}</p>
          <p class="text-xs text-ink-ghost mt-0.5">${lead.region || 'Australia'} · ${catLabel(lead)}</p>
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
          <span class="text-sm text-ink-mid">${priorityDisplay(lead.priority)}</span>
        </div>
      </td>
      <td class="py-5 px-6">
        <span class="text-sm font-semibold text-forest">${lead.ticket_size || '—'}</span>
      </td>
      <td class="py-5 px-6 text-right">
        <span class="material-symbols-outlined text-ink-ghost text-base">chevron_right</span>
      </td>
    </tr>
  `).join('');

  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('leads')}

      <main class="max-w-7xl mx-auto px-6 pt-10">

        <!-- Hero -->
        <section class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">All Organisations</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-3">All Leads</h1>
            <p class="text-white/70 text-base max-w-lg leading-relaxed">
              Your complete pipeline — <strong class="text-white font-semibold">${leads.length} organisation${leads.length !== 1 ? 's' : ''}</strong> across all stages and categories.
            </p>
          </div>
          <button class="btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 shrink-0 self-start md:self-auto cursor-pointer" onclick="window.app.navigate('#add-lead')">
            <span class="material-symbols-outlined text-base">add</span>
            New Lead
          </button>
        </section>

        <!-- Filters -->
        <section class="mb-8 p-5 bg-surface-low rounded-2xl border border-border-soft">
          <!-- Search row -->
          <div class="relative mb-4">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">search</span>
            <input id="filter-search" type="text" placeholder="Search by organisation or contact name…"
              class="w-full bg-white border border-border-soft rounded-xl pl-11 pr-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all placeholder:text-ink-ghost"
              oninput="${FILTER_FN}"/>
          </div>
          <!-- Dropdowns row -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost px-1">Stage</label>
              <div class="relative">
                <select id="filter-stage" class="w-full appearance-none bg-white border border-border-soft rounded-xl py-2.5 px-3 pr-8 text-sm text-ink-mid focus:ring-2 focus:ring-forest/20 focus:outline-none cursor-pointer"
                  onchange="${FILTER_FN}">
                  <option value="all">All Stages</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Meeting Set">Meeting Set</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Awaiting Response">Awaiting Response</option>
                  <option value="Parked">Parked</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost px-1">Priority</label>
              <div class="relative">
                <select id="filter-priority" class="w-full appearance-none bg-white border border-border-soft rounded-xl py-2.5 px-3 pr-8 text-sm text-ink-mid focus:ring-2 focus:ring-forest/20 focus:outline-none cursor-pointer"
                  onchange="${FILTER_FN}">
                  <option value="all">All Priorities</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost px-1">Category</label>
              <div class="relative">
                <select id="filter-category" class="w-full appearance-none bg-white border border-border-soft rounded-xl py-2.5 px-3 pr-8 text-sm text-ink-mid focus:ring-2 focus:ring-forest/20 focus:outline-none cursor-pointer"
                  onchange="${FILTER_FN}">
                  <option value="all">All Categories</option>
                  <option value="Investors">Investors</option>
                  <option value="Philanthropy">Philanthropy</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost px-1">Region</label>
              <div class="relative">
                <select id="filter-region" class="w-full appearance-none bg-white border border-border-soft rounded-xl py-2.5 px-3 pr-8 text-sm text-ink-mid focus:ring-2 focus:ring-forest/20 focus:outline-none cursor-pointer"
                  onchange="${FILTER_FN}">
                  <option value="all">All Regions</option>
                  <option value="Australia">Australia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="UK">UK</option>
                  <option value="US">US</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia">Asia</option>
                  <option value="International">International</option>
                </select>
                <span class="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
          <!-- Clear button -->
          <div class="mt-4 flex justify-end">
            <button class="text-[11px] font-bold uppercase tracking-wider text-ink-ghost hover:text-forest transition-colors cursor-pointer flex items-center gap-1"
              type="button"
              onclick="document.getElementById('filter-search').value='';['filter-stage','filter-priority','filter-category','filter-region'].forEach(id=>{var el=document.getElementById(id);if(el)el.selectedIndex=0});${FILTER_FN}">
              <span class="material-symbols-outlined text-sm">close</span>
              Clear filters
            </button>
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
                  <th class="py-4 px-6 text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Target Ask</th>
                  <th class="py-4 px-6"></th>
                </tr>
              </thead>
              <tbody id="leads-tbody">
                ${leadsHtml || `<tr><td colspan="6" class="py-16 text-center text-ink-ghost text-sm">No leads yet — add your first one</td></tr>`}
              </tbody>
            </table>
          </div>
          <div class="px-6 py-4 border-t border-border-soft flex justify-between items-center bg-surface-low">
            <p class="text-sm text-ink-ghost">Showing <strong id="leads-shown" class="text-ink-mid">${leads.length}</strong> lead${leads.length !== 1 ? 's' : ''}</p>
            <button class="text-xs font-bold uppercase tracking-wider text-ink-ghost hover:text-forest transition-colors cursor-pointer" onclick="window.app.navigate('#add-lead')">+ Add Lead</button>
          </div>
        </section>
      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 nav-glass-bottom rounded-t-3xl">
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
