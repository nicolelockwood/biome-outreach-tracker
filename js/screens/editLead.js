import { navHTML } from './dashboard.js';

export function renderEditLead(lead, navigate) {
  if (!lead) return `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-ink-soft text-lg mb-4">Lead not found.</p>
        <button class="btn-primary px-6 py-3 rounded-xl font-semibold cursor-pointer" onclick="window.app.navigate('#leads')">Back to Leads</button>
      </div>
    </div>
  `;

  const cats = lead.category ? lead.category.split(',') : [];
  const isInvestor = cats.includes('Investors');
  const isPhil = cats.includes('Philanthropy');

  const stages = ['New','Contacted','Engaged','Meeting Set','Proposal Sent','Awaiting Response','Parked','Secured'];
  const regions = ['Australia','New Zealand','UK','US','Europe','Asia','International'];

  const stageOptions = stages.map(s =>
    `<option value="${s}"${lead.stage === s ? ' selected' : ''}>${s}</option>`
  ).join('');
  const regionOptions = regions.map(r =>
    `<option value="${r}"${(lead.region || 'Australia') === r ? ' selected' : ''}>${r}</option>`
  ).join('');

  const ticketDisplay = lead.ticket_size || '';

  const priorityLow    = lead.priority === 'Low';
  const priorityMed    = !lead.priority || lead.priority === 'Medium';
  const priorityHigh   = lead.priority === 'High' || lead.priority === 'Critical';

  const btnLow  = priorityLow  ? 'bg-meadow text-forest'                         : 'bg-surface-low border border-border-soft text-ink-soft';
  const btnMed  = priorityMed  ? 'bg-forest text-white'                           : 'bg-surface-low border border-border-soft text-ink-soft';
  const btnHigh = priorityHigh ? 'bg-error text-white'                            : 'bg-surface-low border border-border-soft text-ink-soft';

  const investorLabel = isInvestor
    ? 'relative flex items-center gap-4 p-5 rounded-xl cursor-pointer bg-meadow border-2 border-forest transition-all'
    : 'relative flex items-center gap-4 p-5 rounded-xl cursor-pointer bg-surface-low border-2 border-transparent hover:bg-meadow transition-all';
  const philLabel = isPhil
    ? 'relative flex items-center gap-4 p-5 rounded-xl cursor-pointer bg-meadow border-2 border-forest transition-all'
    : 'relative flex items-center gap-4 p-5 rounded-xl cursor-pointer bg-surface-low border-2 border-transparent hover:bg-meadow transition-all';

  return `
    <div class="min-h-screen text-ink pb-24 md:pb-0">
      ${navHTML('leads')}

      <main class="max-w-4xl mx-auto px-6 pt-10">
        <!-- Breadcrumb + Hero -->
        <section class="mb-10">
          <nav class="flex items-center gap-1.5 text-white/50 text-xs font-bold uppercase tracking-wider mb-4">
            <a class="hover:text-white cursor-pointer transition-colors" onclick="window.app.navigate('#leads')">Leads</a>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
            <a class="hover:text-white cursor-pointer transition-colors" onclick="window.app.navigate('#lead/${lead.id}')">Lead Detail</a>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
            <span class="text-white/70">Edit</span>
          </nav>
          <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-2">Edit Lead</h1>
          <p class="text-white/70 text-base">${lead.org_name}</p>
        </section>

        <!-- Form -->
        <form id="edit-lead-form" class="space-y-6" onsubmit="return false;">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6">

            <!-- Main info -->
            <div class="md:col-span-12 lg:col-span-8 space-y-5">

              <!-- Organisation & Contact -->
              <div class="card rounded-2xl p-8">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-6">Organisation & Contact</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Organization Name *</label>
                    <input id="el-org-name" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text" value="${(lead.org_name || '').replace(/"/g, '&quot;')}"/>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact First Name</label>
                    <input id="el-first-name" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text" value="${((lead.contact_name || '').split(' ')[0] || '').replace(/"/g, '&quot;')}"/>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact Last Name</label>
                    <input id="el-last-name" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text" value="${((lead.contact_name || '').split(' ').slice(1).join(' ') || '').replace(/"/g, '&quot;')}"/>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Contact Title / Role</label>
                    <input id="el-title" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" placeholder="e.g. Director of Impact Investments" type="text" value="${(lead.contact_title || '').replace(/"/g, '&quot;')}"/>
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
                      <input id="el-phone" class="w-full bg-surface-low border border-border-soft rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" placeholder="+61 400 000 000" type="tel" value="${(lead.phone || '').replace(/"/g, '&quot;')}"/>
                    </div>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Email</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">mail</span>
                      <input id="el-email" class="w-full bg-surface-low border border-border-soft rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" placeholder="name@organisation.com" type="email" value="${(lead.email || '').replace(/"/g, '&quot;')}"/>
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Website</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">language</span>
                      <input id="el-website" class="w-full bg-surface-low border border-border-soft rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" placeholder="https://www.organisation.com" type="url" value="${(lead.website || '').replace(/"/g, '&quot;')}"/>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lead Type -->
              <div class="card rounded-2xl p-8">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-4">Lead Type <span class="normal-case font-normal text-ink-ghost">(select one or both)</span></p>
                <div class="grid grid-cols-2 gap-4">
                  <label class="${investorLabel}" id="el-type-investor-label">
                    <input id="el-type-investor" class="sr-only" name="lead_type" value="Investors" type="checkbox"${isInvestor ? ' checked' : ''}
                      onchange="(function(){
                        const el = document.getElementById('el-type-investor');
                        const lbl = document.getElementById('el-type-investor-label');
                        lbl.classList.toggle('border-forest', el.checked);
                        lbl.classList.toggle('bg-meadow', el.checked);
                        lbl.classList.toggle('border-transparent', !el.checked);
                        lbl.classList.toggle('bg-surface-low', !el.checked);
                      })()"/>
                    <div class="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                      <span class="material-symbols-outlined text-forest text-base" style="font-variation-settings:'FILL' 1;">payments</span>
                    </div>
                    <div>
                      <span class="block font-semibold text-forest text-sm">Return-seeking</span>
                      <span class="text-[10px] text-ink-ghost uppercase tracking-wider">Investor</span>
                    </div>
                  </label>
                  <label class="${philLabel}" id="el-type-philanthropy-label">
                    <input id="el-type-philanthropy" class="sr-only" name="lead_type" value="Philanthropy" type="checkbox"${isPhil ? ' checked' : ''}
                      onchange="(function(){
                        const el = document.getElementById('el-type-philanthropy');
                        const lbl = document.getElementById('el-type-philanthropy-label');
                        lbl.classList.toggle('border-forest', el.checked);
                        lbl.classList.toggle('bg-meadow', el.checked);
                        lbl.classList.toggle('border-transparent', !el.checked);
                        lbl.classList.toggle('bg-surface-low', !el.checked);
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

              <!-- Notes & Next Action -->
              <div class="card rounded-2xl p-8">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-6">Notes & Actions</p>
                <div class="space-y-5">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Notes</label>
                    <textarea id="el-notes" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all resize-none" placeholder="Background context, connection source, observations…" rows="3">${lead.comments || ''}</textarea>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Next Action</label>
                    <textarea id="el-action" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none placeholder:text-ink-ghost transition-all resize-none" placeholder="e.g. Send proposal deck by end of month…" rows="2">${lead.action || ''}</textarea>
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Next Follow-up Date</label>
                    <input id="el-followup" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text" placeholder="e.g. 15 May 2025" value="${(lead.next_follow_up || '').replace(/"/g, '&quot;')}"/>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="md:col-span-12 lg:col-span-4 flex flex-col gap-5">
              <div class="card rounded-2xl p-6 space-y-5">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Status</label>
                  <div class="relative">
                    <select id="edit-lead-stage" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none">
                      ${stageOptions}
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Region</label>
                  <div class="relative">
                    <select id="edit-lead-region" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none">
                      ${regionOptions}
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Target Ask</label>
                  <div class="relative">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-ghost font-bold text-sm">$</span>
                    <input id="el-ticket" class="w-full bg-surface-low border border-border-soft rounded-xl pl-8 pr-4 py-3 text-sm focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="text" value="${ticketDisplay.replace(/^\$/, '')}"/>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Priority Level</label>
                  <div class="flex gap-2">
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl ${btnLow}" data-priority="Low" type="button"
                      onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft','border','border-border-soft');this.classList.add('bg-meadow','text-forest')">LOW</button>
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl ${btnMed}" data-priority="Medium" type="button"
                      onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft','border','border-border-soft');this.classList.add('bg-forest','text-white')">MED</button>
                    <button class="priority-btn flex-1 py-2.5 text-xs font-bold rounded-xl ${btnHigh}" data-priority="High" type="button"
                      onclick="document.querySelectorAll('.priority-btn').forEach(b=>{b.classList.remove('bg-meadow','bg-forest','bg-error','text-forest','text-white');b.classList.add('bg-surface-low','text-ink-soft','border','border-border-soft')});this.classList.remove('bg-surface-low','text-ink-soft','border','border-border-soft');this.classList.add('bg-error','text-white')">HIGH</button>
                  </div>
                </div>
              </div>

              <!-- Quick info panel -->
              <div class="card rounded-2xl p-5 bg-surface-low">
                <div class="flex items-center gap-2 mb-3">
                  <span class="material-symbols-outlined text-forest text-base">info</span>
                  <p class="text-xs font-bold text-forest uppercase tracking-wider">Lead Info</p>
                </div>
                <p class="text-xs text-ink-ghost">ID: #${lead.id}</p>
                ${lead.created_at ? `<p class="text-xs text-ink-ghost mt-1">Created: ${new Date(lead.created_at).toLocaleDateString('en-AU', {day:'numeric',month:'short',year:'numeric'})}</p>` : ''}
              </div>
            </div>
          </div>

          <!-- Error -->
          <div id="edit-lead-error" class="hidden px-4 py-3 bg-error-bg text-error rounded-xl text-sm font-medium"></div>

          <!-- Actions -->
          <div class="flex items-center justify-between pt-6 border-t border-border-soft">
            <button class="text-error font-semibold text-sm hover:text-error/70 transition-colors px-4 py-2 cursor-pointer flex items-center gap-1.5" type="button"
              onclick="if(confirm('Are you sure you want to go back without saving?')) window.app.navigate('#lead/${lead.id}')">
              <span class="material-symbols-outlined text-base">arrow_back</span>
              Cancel
            </button>
            <button id="update-lead-btn" class="btn-primary px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer" type="button" onclick="(async function(){
              const btn = document.getElementById('update-lead-btn');
              const errEl = document.getElementById('edit-lead-error');
              errEl.classList.add('hidden');

              const orgName = document.getElementById('el-org-name')?.value?.trim();
              const firstName = document.getElementById('el-first-name')?.value?.trim() || '';
              const lastName = document.getElementById('el-last-name')?.value?.trim() || '';
              const contactName = [firstName, lastName].filter(Boolean).join(' ');
              const contactTitle = document.getElementById('el-title')?.value?.trim() || null;
              const phone = document.getElementById('el-phone')?.value?.trim() || null;
              const email = document.getElementById('el-email')?.value?.trim() || null;
              const website = document.getElementById('el-website')?.value?.trim() || null;
              const stage = document.getElementById('edit-lead-stage')?.value || '${lead.stage}';
              const region = document.getElementById('edit-lead-region')?.value || 'Australia';
              const ticketRaw = document.getElementById('el-ticket')?.value?.trim() || '';
              const ticketSize = ticketRaw ? (ticketRaw.startsWith('$') ? ticketRaw : '$' + ticketRaw) : null;
              const notes = document.getElementById('el-notes')?.value?.trim() || null;
              const action = document.getElementById('el-action')?.value?.trim() || null;
              const followUp = document.getElementById('el-followup')?.value?.trim() || null;

              const activePriorityBtn = document.querySelector('.priority-btn.bg-forest') || document.querySelector('.priority-btn.bg-error') || document.querySelector('.priority-btn.bg-meadow');
              const priority = activePriorityBtn?.dataset?.priority || '${lead.priority || 'Medium'}';

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
              const updates = {
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
                action,
                next_follow_up: followUp
              };

              const { data, error } = await window.app.updateLead(${lead.id}, updates);
              if (error) {
                errEl.textContent = error.message || 'Failed to update lead. Please try again.';
                errEl.classList.remove('hidden');
                btn.disabled = false;
                btn.innerHTML = '<span class=\'material-symbols-outlined text-sm\'>save</span> Save Changes';
              } else {
                window.app.navigate('#lead/${lead.id}');
              }
            })()">
              <span class="material-symbols-outlined text-sm">save</span>
              Save Changes
            </button>
          </div>
        </form>
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
        <a class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#leads')">
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
