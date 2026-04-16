import { navHTML } from './dashboard.js';

export function renderAddLead(navigate) {
  return `
    <div class="min-h-screen bg-white text-ink pb-24 md:pb-0">
      ${navHTML('add-lead')}

      <main class="max-w-4xl mx-auto px-6 pt-10">
        <!-- Hero -->
        <section class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="max-w-xl">
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-ink-ghost mb-3">New Prospect Acquisition</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-forest leading-tight mb-3">Register New Lead</h1>
            <p class="text-ink-soft text-base leading-relaxed">
              Expand the living archive of ecological investments. Ensure data integrity for high-trust institutional outreach.
            </p>
          </div>
        </section>

        <!-- Form -->
        <form id="add-lead-form" class="space-y-6" onsubmit="return false;">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
            <!-- Main info card -->
            <div class="md:col-span-12 lg:col-span-8 card rounded-2xl p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div class="md:col-span-2">
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Organization Name</label>
                  <input class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all" placeholder="e.g. Evergreen Endowment Fund" type="text"/>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact First Name</label>
                  <input class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text"/>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact Last Name</label>
                  <input class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text"/>
                </div>
                <div class="md:col-span-2 pt-2">
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Lead Type</label>
                  <div class="grid grid-cols-2 gap-4">
                    <label class="relative flex items-center justify-center p-4 rounded-xl cursor-pointer bg-surface-low border border-border-soft hover:bg-meadow transition-all">
                      <input checked="" class="sr-only peer" name="lead_type" value="Investors" type="radio"/>
                      <div class="text-center">
                        <span class="block font-semibold text-forest text-sm">Return-seeking</span>
                        <span class="text-[10px] text-ink-ghost uppercase tracking-wider">Investor</span>
                      </div>
                      <div class="absolute inset-0 border-2 border-forest rounded-xl opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </label>
                    <label class="relative flex items-center justify-center p-4 rounded-xl cursor-pointer bg-surface-low border border-border-soft hover:bg-meadow transition-all">
                      <input class="sr-only peer" name="lead_type" value="Philanthropy" type="radio"/>
                      <div class="text-center">
                        <span class="block font-semibold text-forest text-sm">Impact-motivated</span>
                        <span class="text-[10px] text-ink-ghost uppercase tracking-wider">Philanthropy</span>
                      </div>
                      <div class="absolute inset-0 border-2 border-forest rounded-xl opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="md:col-span-12 lg:col-span-4 flex flex-col gap-5">
              <div class="card rounded-2xl p-6 space-y-5">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Initial Status</label>
                  <select id="add-lead-stage" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none">
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Meeting Set">Meeting Set</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Awaiting Response">Awaiting Response</option>
                    <option value="Parked">Parked</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Target Ask</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost font-bold text-sm">$</span>
                    <input class="w-full bg-surface-low border border-border-soft rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" placeholder="5,000,000" type="number"/>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Priority Level</label>
                  <div class="flex gap-2" id="priority-group">
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl bg-surface-low border border-border-soft text-ink-soft hover:bg-meadow hover:text-forest transition-colors" data-priority="Low" type="button" onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft');this.classList.add('bg-meadow','text-forest')">LOW</button>
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl bg-forest text-white" data-priority="Medium" type="button" onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft');this.classList.add('bg-forest','text-white')">MED</button>
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl bg-surface-low border border-border-soft text-ink-soft hover:bg-error-bg hover:text-error transition-colors" data-priority="High" type="button" onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft');this.classList.add('bg-error','text-white')">HIGH</button>
                  </div>
                </div>
              </div>

              <!-- Assign card -->
              <div class="card rounded-2xl p-5 border border-border-soft">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-forest flex items-center justify-center text-[10px] text-white font-bold">NL</div>
                    <div>
                      <p class="text-sm font-semibold text-forest">Assign to Nicole</p>
                      <p class="text-[10px] text-ink-ghost">Default Lead Owner</p>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input checked="" class="sr-only peer" type="checkbox"/>
                    <div class="w-10 h-5 bg-border-soft peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-forest"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Error -->
          <div id="add-lead-error" class="hidden px-4 py-3 bg-error-bg text-error rounded-xl text-sm font-medium"></div>
          <!-- Actions -->
          <div class="flex items-center justify-end gap-5 pt-6 border-t border-border-soft">
            <button class="text-ink-soft font-semibold text-sm hover:text-forest transition-colors px-4 py-2 cursor-pointer" type="button" onclick="window.app.navigate('#leads')">Discard</button>
            <button id="save-lead-btn" class="btn-primary px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer" type="button" onclick="(async function(){
              const btn = document.getElementById('save-lead-btn');
              const errEl = document.getElementById('add-lead-error');
              errEl.classList.add('hidden');
              const orgName = document.querySelector('#add-lead-form input[placeholder*=\'Evergreen\']')?.value?.trim();
              const firstName = document.querySelectorAll('#add-lead-form input[type=text]')[1]?.value?.trim() || '';
              const lastName = document.querySelectorAll('#add-lead-form input[type=text]')[2]?.value?.trim() || '';
              const contactName = [firstName, lastName].filter(Boolean).join(' ');
              const stage = document.getElementById('add-lead-stage')?.value || 'New';
              const ticketSize = document.querySelector('#add-lead-form input[type=number]')?.value || '';
              const activePriorityBtn = document.querySelector('.priority-btn.bg-forest');
              const priority = activePriorityBtn?.dataset?.priority || 'Medium';
              const selectedType = document.querySelector('input[name=lead_type]:checked')?.value || 'Investors';
              if (!orgName) {
                errEl.textContent = 'Organisation name is required.';
                errEl.classList.remove('hidden');
                return;
              }
              btn.disabled = true;
              btn.innerHTML = '<span class=\'inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin\'></span>';
              const initials = contactName ? contactName.split(' ').map(n=>n[0]||'').join('').toUpperCase().slice(0,2) : '??';
              const leadData = { org_name: orgName, contact_name: contactName || null, contact_initials: initials, stage, priority, ticket_size: ticketSize ? ticketSize.toString() : null, category: selectedType, region: 'Australia', tags: [] };
              const { data, error } = await window.app.saveNewLead(leadData);
              if (error) {
                errEl.textContent = error.message || 'Failed to save lead. Please try again.';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = '<span class=\'material-symbols-outlined text-sm\'>save</span> Initialize Lead';
              } else {
                window.app.navigate('#leads');
              }
            })()">
              <span class="material-symbols-outlined text-sm">save</span>
              Initialize Lead
            </button>
          </div>
        </form>

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
        <a class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-xl">table_rows</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Leads</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#add-lead')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">add_circle</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Add</span>
        </a>
      </nav>
    </div>
  `;
}
