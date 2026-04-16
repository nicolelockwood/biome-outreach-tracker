export function renderInteractionModal(leadId, onClose) {
  return `
    <div class="fixed inset-0 z-[100] flex items-start justify-center pt-20 md:pt-28 bg-black/50 backdrop-blur-sm overflow-y-auto" onclick="if(event.target === this) window.app.closeInteractionModal()">
      <div class="relative w-full md:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden mb-10" onclick="event.stopPropagation()">

        <!-- Top accent bar -->
        <div class="h-1 w-full bg-gradient-to-r from-forest via-canopy to-forest opacity-80"></div>

        <div class="p-8">
          <!-- Header -->
          <div class="flex items-start justify-between mb-8">
            <div>
              <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-ink-ghost mb-1">Outreach Record</p>
              <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-forest">Log Interaction</h2>
            </div>
            <button class="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-ink-soft hover:bg-surface-mid transition-colors cursor-pointer" onclick="window.app.closeInteractionModal()">
              <span class="material-symbols-outlined text-base">close</span>
            </button>
          </div>

          <form id="interaction-form" class="space-y-5" onsubmit="return false;">

            <!-- Date + Type row -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Date</label>
                <input id="int-date" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="date" value="${new Date().toISOString().split('T')[0]}"/>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Type</label>
                <div class="relative">
                  <select id="int-type" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all">
                    <option>Email</option>
                    <option>Call</option>
                    <option>Meeting</option>
                    <option>LinkedIn</option>
                    <option>Intro</option>
                    <option>Event</option>
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <!-- Summary -->
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Summary / Notes</label>
              <textarea id="int-summary" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all placeholder:text-ink-ghost resize-none" placeholder="Key discussion points, context, and observations…" rows="3"></textarea>
            </div>

            <!-- Outcome — full width, own line -->
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Outcome</label>
              <div class="relative">
                <select id="int-outcome" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all">
                  <option>No Response</option>
                  <option>Interested</option>
                  <option>Declined</option>
                  <option>Needs Follow-up</option>
                  <option>Meeting Booked</option>
                  <option>Proposal Requested</option>
                  <option>Committed</option>
                </select>
                <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
              </div>
            </div>

            <!-- Follow-up Action + Date row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">
                  Follow-up Action Item
                  <span class="normal-case font-normal text-ink-ghost ml-1">(optional)</span>
                </label>
                <input id="int-action" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all placeholder:text-ink-ghost" type="text" placeholder="e.g. Send proposal deck"/>
              </div>
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">
                  Follow-up Date
                  <span class="normal-case font-normal text-ink-ghost ml-1">(optional)</span>
                </label>
                <input id="int-followup" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all" type="date"/>
              </div>
            </div>

            <!-- Error -->
            <div id="int-error" class="hidden px-4 py-3 bg-error-bg text-error rounded-xl text-sm font-medium"></div>

            <!-- Actions -->
            <div class="flex items-center gap-3 pt-2">
              <button id="int-save-btn" class="btn-primary flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer" type="button" onclick="(async function(){
                const btn = document.getElementById('int-save-btn');
                const errEl = document.getElementById('int-error');
                errEl.classList.add('hidden');
                const date = document.getElementById('int-date').value;
                const type = document.getElementById('int-type').value;
                const summary = document.getElementById('int-summary').value.trim();
                const outcome = document.getElementById('int-outcome').value;
                const followUpAction = document.getElementById('int-action').value.trim() || null;
                const followUpDate = document.getElementById('int-followup').value || null;
                if (!summary) {
                  errEl.textContent = 'Please add a summary before saving.';
                  errEl.classList.remove('hidden');
                  return;
                }
                btn.disabled = true;
                btn.innerHTML = '<span class=\'inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin\'></span>';
                const { data, error } = await window.app.saveInteraction({
                  lead_id: ${leadId},
                  date,
                  type,
                  summary,
                  outcome,
                  follow_up_action: followUpAction,
                  follow_up_date: followUpDate
                });
                if (error) {
                  errEl.textContent = error.message || 'Failed to save. Please try again.';
                  errEl.classList.remove('hidden');
                  btn.disabled = false;
                  btn.innerHTML = '<span class=\'material-symbols-outlined text-sm\'>add_circle</span> Record Interaction';
                } else {
                  window.app.closeInteractionModal();
                }
              })()">
                <span class="material-symbols-outlined text-sm">add_circle</span>
                Record Interaction
              </button>
              <button class="px-5 py-3.5 text-ink-soft font-semibold text-sm hover:text-forest transition-colors cursor-pointer rounded-xl hover:bg-surface-low" type="button" onclick="window.app.closeInteractionModal()">
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  `;
}
