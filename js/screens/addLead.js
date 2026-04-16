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
            <div class="md:col-span-12 lg:col-span-8 space-y-5">

              <!-- Organisation & Contact -->
              <div class="card rounded-2xl p-8">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-6">Organisation & Contact</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Organization Name *</label>
                    <input id="al-org-name" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all" placeholder="e.g. Evergreen Endowment Fund" type="text"/>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact First Name</label>
                    <input id="al-first-name" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text"/>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact Last Name</label>
                    <input id="al-last-name" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text"/>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact Title / Role</label>
                    <input id="al-title" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all" placeholder="e.g. Director of Impact Investments" type="text"/>
                  </div>
                </div>
              </div>

              <!-- Contact Details -->
              <div class="card rounded-2xl p-8">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-6">Contact Details</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Phone</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">call</span>
                      <input id="al-phone" class="w-full bg-surface-low border border-border-soft rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all" placeholder="+61 400 000 000" type="tel"/>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Email</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">mail</span>
                      <input id="al-email" class="w-full bg-surface-low border border-border-soft rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all" placeholder="name@organisation.com" type="email"/>
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Website</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">language</span>
                      <input id="al-website" class="w-full bg-surface-low border border-border-soft rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all" placeholder="https://www.organisation.com" type="url"/>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lead Type -->
              <div class="card rounded-2xl p-8">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-4">Lead Type <span class="normal-case font-normal text-ink-ghost">(select one or both)</span></p>
                <div class="grid grid-cols-2 gap-4" id="lead-type-group">
                  <label class="relative flex items-center gap-4 p-5 rounded-xl cursor-pointer bg-meadow border-2 border-forest transition-all" id="type-investor-label">
                    <input id="type-investor" class="sr-only" name="lead_type" value="Investors" type="checkbox" checked
                      onchange="(function(){
                        const inv = document.getElementById('type-investor');
                        const phi = document.getElementById('type-philanthropy');
                        const il = document.getElementById('type-investor-label');
                        const pl = document.getElementById('type-philanthropy-label');
                        il.classList.toggle('border-forest', inv.checked);
                        il.classList.toggle('bg-meadow', inv.checked);
                        il.classList.toggle('border-transparent', !inv.checked);
                        il.classList.toggle('bg-surface-low', !inv.checked);
                      })()"/>
                    <div class="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-forest text-base" style="font-variation-settings:'FILL' 1;">payments</span>
                    </div>
                    <div>
                      <span class="block font-semibold text-forest text-sm">Return-seeking</span>
                      <span class="text-[10px] text-ink-ghost uppercase tracking-wider">Investor</span>
                    </div>
                  </label>
                  <label class="relative flex items-center gap-4 p-5 rounded-xl cursor-pointer bg-surface-low border-2 border-transparent hover:bg-meadow transition-all" id="type-philanthropy-label">
                    <input id="type-philanthropy" class="sr-only" name="lead_type" value="Philanthropy" type="checkbox"
                      onchange="(function(){
                        const inv = document.getElementById('type-investor');
                        const phi = document.getElementById('type-philanthropy');
                        const il = document.getElementById('type-investor-label');
                        const pl = document.getElementById('type-philanthropy-label');
                        pl.classList.toggle('border-forest', phi.checked);
                        pl.classList.toggle('bg-meadow', phi.checked);
                        pl.classList.toggle('border-transparent', !phi.checked);
                        pl.classList.toggle('bg-surface-low', !phi.checked);
                      })()"/>
                    <div class="w-8 h-8 rounded-full bg-canopy/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-canopy text-base" style="font-variation-settings:'FILL' 1;">volunteer_activism</span>
                    </div>
                    <div>
                      <span class="block font-semibold text-forest text-sm">Impact-motivated</span>
                      <span class="text-[10px] text-ink-ghost uppercase tracking-wider">Philanthropy</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="md:col-span-12 lg:col-span-4 flex flex-col gap-5">
              <div class="card rounded-2xl p-6 space-y-5">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Initial Status</label>
                  <div class="relative">
                    <select id="add-lead-stage" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none">
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Engaged">Engaged</option>
                      <option value="Meeting Set">Meeting Set</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Awaiting Response">Awaiting Response</option>
                      <option value="Parked">Parked</option>
                      <option value="Secured">Secured ✓</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Region</label>
                  <div class="relative">
                    <select id="add-lead-region" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none">
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="UK">UK</option>
                      <option value="US">US</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="International">International</option>
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Target Ask</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost font-bold text-sm">$</span>
                    <input id="al-ticket" class="w-full bg-surface-low border border-border-soft rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" placeholder="5,000,000" type="text"/>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Priority Level</label>
                  <div class="flex gap-2" id="priority-group">
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl bg-surface-low border border-border-soft text-ink-soft hover:bg-meadow hover:text-forest transition-colors" data-priority="Low" type="button"
                      onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft');this.classList.add('bg-meadow','text-forest')">LOW</button>
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl bg-forest text-white" data-priority="Medium" type="button"
                      onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft');this.classList.add('bg-forest','text-white')">MED</button>
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl bg-surface-low border border-border-soft text-ink-soft hover:bg-error-bg hover:text-error transition-colors" data-priority="High" type="button"
                      onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft');this.classList.add('bg-error','text-white')">HIGH</button>
                  </div>
                </div>
              </div>

              <!-- Notes card -->
              <div class="card rounded-2xl p-6">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Initial Notes</p>
                <textarea id="al-notes" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all resize-none" placeholder="Background context, connection source, initial impression…" rows="4"></textarea>
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
                    <input checked class="sr-only peer" type="checkbox"/>
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

              const orgName = document.getElementById('al-org-name')?.value?.trim();
              const firstName = document.getElementById('al-first-name')?.value?.trim() || '';
              const lastName = document.getElementById('al-last-name')?.value?.trim() || '';
              const contactName = [firstName, lastName].filter(Boolean).join(' ');
              const contactTitle = document.getElementById('al-title')?.value?.trim() || null;
              const phone = document.getElementById('al-phone')?.value?.trim() || null;
              const email = document.getElementById('al-email')?.value?.trim() || null;
              const website = document.getElementById('al-website')?.value?.trim() || null;
              const stage = document.getElementById('add-lead-stage')?.value || 'New';
              const region = document.getElementById('add-lead-region')?.value || 'Australia';
              const ticketRaw = document.getElementById('al-ticket')?.value?.trim() || '';
              const ticketSize = ticketRaw ? (ticketRaw.startsWith('$') ? ticketRaw : '$' + ticketRaw) : null;
              const notes = document.getElementById('al-notes')?.value?.trim() || null;

              const activePriorityBtn = document.querySelector('.priority-btn.bg-forest') || document.querySelector('.priority-btn.bg-error') || document.querySelector('.priority-btn.bg-meadow');
              const priority = activePriorityBtn?.dataset?.priority || 'Medium';

              const checkedTypes = [...document.querySelectorAll('input[name=lead_type]:checked')].map(i => i.value);
              if (checkedTypes.length === 0) {
                errEl.textContent = 'Please select at least one lead type.';
                errEl.classList.remove('hidden');
                return;
              }
              const category = checkedTypes.join(',');

              if (!orgName) {
                errEl.textContent = 'Organisation name is required.';
                errEl.classList.remove('hidden');
                return;
              }

              btn.disabled = true;
              btn.innerHTML = '<span class=\'inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin\'></span>';

              const initials = contactName ? contactName.split(' ').map(n=>n[0]||'').join('').toUpperCase().slice(0,2) : (orgName.slice(0,2).toUpperCase());
              const leadData = {
                org_name: orgName,
                contact_name: contactName || null,
                contact_initials: initials,
                contact_title: contactTitle,
                phone,
                email,
                website,
                stage,
                priority,
                ticket_size: ticketSize,
                category,
                region,
                comments: notes,
                tags: []
              };

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

