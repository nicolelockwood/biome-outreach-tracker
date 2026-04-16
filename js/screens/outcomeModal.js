export function renderOutcomeModal(leadId, currentStage) {
  const stages = ['New', 'Contacted', 'Engaged', 'Meeting Set', 'Proposal Sent', 'Awaiting Response', 'Secured', 'Parked', 'Closed'];

  return `
    <div class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm overflow-y-auto" onclick="if(event.target === this) window.app.closeOutcomeModal()">
      <div class="min-h-full flex items-start justify-center px-4 pt-20 md:pt-28 pb-10">
        <div class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onclick="event.stopPropagation()">

          <!-- Top accent -->
          <div class="h-1.5 w-full" style="background: linear-gradient(90deg, #3d8b63, #14342a, #8a7a3a);"></div>

          <div class="p-8">
            <!-- Header -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.15em] text-canopy mb-1">Stage Update</p>
                <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-forest">Log Outcome</h2>
                <p class="text-sm text-ink-soft mt-1">Move this lead forward — or park it for later.</p>
              </div>
              <button class="w-8 h-8 rounded-full bg-surface-low flex items-center justify-center text-ink-soft hover:bg-surface-mid transition-colors cursor-pointer" onclick="window.app.closeOutcomeModal()">
                <span class="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form id="outcome-form" class="space-y-5" onsubmit="return false;">

              <!-- New stage -->
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Move to Stage</label>
                <div class="relative">
                  <select id="outcome-stage" class="w-full appearance-none bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink font-semibold focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all">
                    ${stages.map(s => `<option value="${s}" ${s === currentStage ? 'selected' : ''}>${s}${s === currentStage ? ' (current)' : ''}</option>`).join('')}
                  </select>
                  <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost text-base pointer-events-none">expand_more</span>
                </div>
              </div>

              <!-- Outcome note -->
              <div>
                <label class="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Outcome Note</label>
                <textarea id="outcome-note" class="w-full bg-surface-low border border-border-soft rounded-xl px-4 py-3 text-sm text-ink focus:ring-2 focus:ring-forest/20 focus:outline-none transition-all placeholder:text-ink-ghost resize-none" placeholder="Brief note on what happened — e.g. 'Committed $500K after board meeting'" rows="3"></textarea>
              </div>

              <!-- Error -->
              <div id="outcome-error" class="hidden px-4 py-3 bg-error-bg text-error rounded-xl text-sm font-medium"></div>

              <!-- Actions -->
              <div class="flex items-center gap-3 pt-2">
                <button id="outcome-save-btn" class="flex-1 py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer text-white transition-all"
                  style="background: linear-gradient(135deg, #3d8b63, #14342a);"
                  type="button" onclick="(async function(){
                  const btn = document.getElementById('outcome-save-btn');
                  const errEl = document.getElementById('outcome-error');
                  errEl.classList.add('hidden');
                  const stage = document.getElementById('outcome-stage').value;
                  const note = document.getElementById('outcome-note').value.trim();
                  btn.disabled = true;
                  btn.innerHTML = '<span class=\\'inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin\\'></span>';
                  const updates = { stage };
                  if (note) updates.comments = note;
                  const { data, error } = await window.app.updateLead(${leadId}, updates);
                  if (error) {
                    errEl.textContent = error.message || 'Failed to save. Please try again.';
                    errEl.classList.remove('hidden');
                    btn.disabled = false;
                    btn.innerHTML = '<span class=\\'material-symbols-outlined text-sm\\'>verified</span> Confirm Outcome';
                  } else {
                    window.app.closeOutcomeModal();
                  }
                })()">
                  <span class="material-symbols-outlined text-sm">verified</span>
                  Confirm Outcome
                </button>
                <button class="px-5 py-3.5 text-ink-soft font-semibold text-sm hover:text-forest transition-colors cursor-pointer rounded-xl hover:bg-surface-low" type="button" onclick="window.app.closeOutcomeModal()">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  `;
}
