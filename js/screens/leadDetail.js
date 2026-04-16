import { navHTML } from './dashboard.js';

export function renderLeadDetail(lead, interactions = [], navigate, showInteractionModal) {
  if (!lead) return `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-ink-soft text-lg mb-4">Lead not found.</p>
        <button class="btn-primary px-6 py-3 rounded-xl font-semibold cursor-pointer" onclick="window.app.navigate('#leads')">Back to Leads</button>
      </div>
    </div>
  `;

  const tags = Array.isArray(lead.tags) ? lead.tags : [];
  const cats = lead.category ? lead.category.split(',') : [];
  const isPhil = cats.includes('Philanthropy');
  const isBoth = cats.includes('Philanthropy') && cats.includes('Investors');
  const categoryDisplay = isBoth ? 'Investor + Philanthropy' : (lead.category || '—');

  const stageColour = (stage) => {
    if (stage === 'Engaged')          return 'bg-canopy/10 text-canopy';
    if (stage === 'Contacted')        return 'bg-meadow text-forest';
    if (stage === 'Meeting Set' || stage === 'Proposal Sent') return 'bg-amber-50 text-amber-700';
    if (stage === 'Awaiting Response') return 'bg-amber-50 text-amber-700';
    if (stage === 'Parked' || stage === 'Closed') return 'bg-surface-mid text-ink-ghost';
    return 'bg-surface-mid text-ink-soft';
  };

  // Card background + text — changes with pipeline stage
  const cardStyle = (stage) => {
    if (stage === 'Engaged')          return { bg: '#2d6b4a', text: '#fff', subtext: 'rgba(255,255,255,0.65)', icon: 'rgba(255,255,255,0.15)' };
    if (stage === 'Meeting Set')      return { bg: '#8a7a3a', text: '#fff', subtext: 'rgba(255,255,255,0.6)',  icon: 'rgba(255,255,255,0.12)' };
    if (stage === 'Proposal Sent')    return { bg: '#1e4d3a', text: '#fff', subtext: 'rgba(255,255,255,0.6)',  icon: 'rgba(255,255,255,0.12)' };
    if (stage === 'Awaiting Response')return { bg: '#8a7a3a', text: '#fff', subtext: 'rgba(255,255,255,0.6)',  icon: 'rgba(255,255,255,0.12)' };
    if (stage === 'Parked')           return { bg: '#2d3d34', text: '#fff', subtext: 'rgba(255,255,255,0.5)',  icon: 'rgba(255,255,255,0.1)'  };
    return                                   { bg: '#14342a', text: '#fff', subtext: 'rgba(255,255,255,0.5)',  icon: 'rgba(255,255,255,0.1)'  };
  };
  const cs = cardStyle(lead.stage);

  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('leads')}

      <main class="max-w-7xl mx-auto px-6 py-10">

        <!-- Breadcrumb -->
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <nav class="flex items-center gap-1.5 text-white/50 text-xs font-bold uppercase tracking-wider mb-3">
              <a class="hover:text-white cursor-pointer transition-colors" onclick="window.app.navigate('#leads')">Leads</a>
              <span class="material-symbols-outlined text-sm">chevron_right</span>
              <span class="text-white/70">Lead Detail</span>
            </nav>
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-4xl font-semibold text-white drop-shadow-sm leading-tight">${lead.contact_name || lead.org_name}</h1>
              <span class="px-3 py-1 rounded-full ${stageColour(lead.stage)} text-[10px] font-bold uppercase tracking-wider">${lead.stage}</span>
            </div>
            <p class="text-white/70 text-base">${lead.contact_title || 'Contact'} · ${lead.org_name}</p>
          </div>
          <div class="flex items-center gap-3 shrink-0 self-start">
            <button class="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-200 cursor-pointer backdrop-blur-sm" onclick="window.app.navigate('#edit-lead/${lead.id}')">
              <span class="material-symbols-outlined text-base">edit</span>
              Edit Lead
            </button>
            <button class="btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2" onclick="window.app.showInteractionModal(${lead.id})">
              <span class="material-symbols-outlined text-base">add</span>
              Log Interaction
            </button>
          </div>
        </div>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8">

          <!-- Left: Detail + Timeline -->
          <div class="md:col-span-8 space-y-8">

            <!-- Lead overview -->
            <section class="card rounded-2xl p-8">
              <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-6">Lead Overview</p>
              <div class="grid grid-cols-2 gap-6">
                ${[
                  ['Lead Type',      categoryDisplay],
                  ['Current Stage',  lead.stage],
                  ['Priority',       lead.priority || '—'],
                  ['Category',       categoryDisplay],
                  ['Region',         lead.region || 'Australia'],
                  ['Ticket Size',    lead.ticket_size || 'TBC'],
                ].map(([label, val]) => `
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost mb-1">${label}</p>
                  <p class="text-sm font-semibold text-ink-mid">${val}</p>
                </div>`).join('')}
                ${lead.comments ? `
                <div class="col-span-2">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Notes</p>
                  <p class="text-sm text-ink-soft leading-relaxed">${lead.comments}</p>
                </div>` : ''}
                ${lead.action ? `
                <div class="col-span-2">
                  <p class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Next Action</p>
                  <p class="text-sm text-ink-mid font-medium leading-relaxed">${lead.action}</p>
                </div>` : ''}
              </div>
            </section>

            <!-- Ticket / value card — colour reflects pipeline stage -->
            <div class="rounded-2xl p-8 flex flex-col gap-4 relative overflow-hidden transition-colors duration-500"
              style="background:${cs.bg}; color:${cs.text};">
              <div class="absolute right-6 top-6" style="color:${cs.icon}; font-size:6rem; line-height:1;">
                <span class="material-symbols-outlined" style="font-size:inherit;">${isPhil ? 'volunteer_activism' : 'payments'}</span>
              </div>
              <p class="text-[10px] font-bold uppercase tracking-[0.12em]" style="color:${cs.subtext};">${isBoth ? 'Investment & Engagement' : isPhil ? 'Engagement Details' : 'Investment Value'}</p>
              <p class="text-4xl font-bold leading-tight" style="font-family:'Fraunces',Georgia,serif;">${lead.ticket_size || 'TBC'}</p>
              <div class="flex items-center gap-3 mt-1 flex-wrap">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase" style="background:rgba(255,255,255,0.15); color:${cs.text};">${lead.stage}</span>
                <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase" style="background:rgba(255,255,255,0.1); color:${cs.subtext};">${lead.priority === 'Critical' ? 'High' : lead.priority || 'Medium'} priority</span>
              </div>
            </div>

            <!-- Timeline -->
            <section class="card rounded-2xl p-8">
              <div class="flex items-center justify-between mb-8">
                <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-xl font-semibold text-forest">Interaction Timeline</h3>
                <button class="flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-canopy transition-colors cursor-pointer" onclick="window.app.showInteractionModal(${lead.id})">
                  <span class="material-symbols-outlined text-base">add_circle</span>
                  Log Interaction
                </button>
              </div>
              <div class="space-y-6 relative">
                <div class="absolute left-[11px] top-0 bottom-0 w-px bg-border"></div>
                ${interactions.length > 0 ? interactions.map(int => `
                <div class="relative pl-10">
                  <div class="absolute left-0 top-1 w-6 h-6 rounded-full bg-forest flex items-center justify-center">
                    <span class="material-symbols-outlined text-white text-[12px]">done</span>
                  </div>
                  <div class="card rounded-xl p-5">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 bg-meadow text-forest text-[9px] font-bold uppercase tracking-wider rounded-full">${int.type}</span>
                        <p class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost">${int.date}</p>
                      </div>
                      <span class="text-[9px] text-ink-soft font-bold uppercase px-2 py-0.5 border border-border rounded-full">Outcome: ${int.outcome}</span>
                    </div>
                    <p class="text-sm text-ink-mid leading-relaxed">${int.summary}</p>
                    ${(int.follow_up_action || int.follow_up_date) ? `
                    <div class="mt-3 pt-3 border-t border-border-soft flex flex-wrap gap-4">
                      ${int.follow_up_action ? `<p class="text-xs text-forest font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-xs">task_alt</span>${int.follow_up_action}</p>` : ''}
                      ${int.follow_up_date ? `<p class="text-xs text-ink-ghost flex items-center gap-1"><span class="material-symbols-outlined text-xs">calendar_today</span>${int.follow_up_date}</p>` : ''}
                    </div>` : ''}
                  </div>
                </div>
                `).join('') : `
                <div class="pl-10 py-8 text-ink-ghost text-sm italic">No interactions logged yet — add the first one above.</div>`}
              </div>
            </section>
          </div>

          <!-- Right sidebar -->
          <div class="md:col-span-4 space-y-6">

            <!-- Contact Info -->
            ${(lead.phone || lead.email || lead.website) ? `
            <div class="card rounded-2xl p-6">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-forest text-base">contacts</span>
                <h3 class="font-semibold text-forest text-base" style="font-family:'Fraunces',Georgia,serif;">Contact Info</h3>
              </div>
              <div class="space-y-3">
                ${lead.phone ? `
                <a href="tel:${lead.phone}" class="flex items-center gap-3 text-sm text-ink-mid hover:text-forest transition-colors group">
                  <span class="material-symbols-outlined text-ink-ghost text-base group-hover:text-forest transition-colors">call</span>
                  ${lead.phone}
                </a>` : ''}
                ${lead.email ? `
                <a href="mailto:${lead.email}" class="flex items-center gap-3 text-sm text-ink-mid hover:text-forest transition-colors group">
                  <span class="material-symbols-outlined text-ink-ghost text-base group-hover:text-forest transition-colors">mail</span>
                  ${lead.email}
                </a>` : ''}
                ${lead.website ? `
                <a href="${lead.website}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 text-sm text-ink-mid hover:text-forest transition-colors group">
                  <span class="material-symbols-outlined text-ink-ghost text-base group-hover:text-forest transition-colors">language</span>
                  <span class="truncate">${lead.website.replace(/^https?:\/\//, '')}</span>
                </a>` : ''}
              </div>
            </div>` : ''}

          <!-- Next follow-up -->
            <div class="card rounded-2xl p-6 bg-surface-low">
              <div class="flex items-center gap-2 mb-4">
                <span class="material-symbols-outlined text-forest text-base">alarm</span>
                <h3 class="font-semibold text-forest text-base" style="font-family:'Fraunces',Georgia,serif;">Next Follow-up</h3>
              </div>
              <div class="bg-white rounded-xl p-4 border border-border-soft mb-4">
                <p class="text-xs font-bold text-ink-ghost uppercase tracking-wider mb-1">${lead.next_follow_up || 'To be scheduled'}</p>
                <p class="text-sm font-semibold text-ink-mid">Review status &amp; finalise next steps</p>
              </div>
              <button class="w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer text-white transition-all"
                style="background: linear-gradient(135deg, #3d8b63, #14342a); box-shadow: 0 2px 12px rgba(61,139,99,0.2);"
                onclick="window.app.showOutcomeModal(${lead.id}, '${(lead.stage || '').replace(/'/g, "\\'")}')">
                <span class="material-symbols-outlined text-base">verified</span>
                Log Outcome
              </button>
            </div>

          </div>
        </div>
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
