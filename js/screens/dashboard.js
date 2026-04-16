// Shared nav HTML — single source of truth used by all screens
export function navHTML(active = 'dashboard') {
  const link = (id, label, hash) => {
    const isActive = active === id;
    return `<a class="${isActive
      ? 'text-forest font-bold border-b-2 border-canopy pb-0.5'
      : 'text-ink-soft hover:text-forest transition-colors'} text-sm cursor-pointer tracking-wide" onclick="window.app.navigate('#${hash}')">${label}</a>`;
  };
  return `
  <header class="glass-nav sticky top-0 z-50 border-b border-border-soft">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer" onclick="window.app.navigate('#dashboard')">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="32" height="32" rx="8" fill="#1a3d2b"/>
          <!-- Stylised leaf/tree mark -->
          <path d="M16 6 C10 6 7 11 8 17 C9 20 12 22 16 22 C20 22 23 20 24 17 C25 11 22 6 16 6Z" fill="#00c566" opacity="0.9"/>
          <path d="M16 14 L16 26" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M16 20 C14 18 12 18 11 19" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
          <path d="M16 18 C18 16 20 16 21 17" stroke="#ffffff" stroke-width="1.2" stroke-linecap="round" opacity="0.7"/>
        </svg>
        <span style="font-family:'Fraunces',Georgia,serif;" class="text-forest font-bold text-xl tracking-tight">Biome</span>
      </div>

      <!-- Desktop nav -->
      <nav class="hidden md:flex items-center gap-8">
        ${link('dashboard', 'Dashboard', 'dashboard')}
        ${link('kanban', 'Pipeline', 'kanban')}
        ${link('leads', 'Leads', 'leads')}
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <button class="hidden sm:flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-forest transition-colors px-3 py-1.5 rounded-lg hover:bg-surface-low">
          <span class="material-symbols-outlined text-base">person</span>
          My Leads
          <span class="material-symbols-outlined text-base">expand_more</span>
        </button>
        <div class="w-9 h-9 rounded-full bg-forest flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 6 C10 6 7 11 8 17 C9 20 12 22 16 22 C20 22 23 20 24 17 C25 11 22 6 16 6Z" fill="#00c566"/><path d="M16 14 L16 26" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>
  </header>`;
}

export function renderDashboard(navigate, leads = [], session = null) {
  const ls = leads;
  const totalLeads = ls.length;
  const philanthropy = ls.filter(l => l.category === 'Philanthropy');
  const investors = ls.filter(l => l.category === 'Investors');
  const engaged = ls.filter(l => l.stage === 'Engaged');
  const contacted = ls.filter(l => l.stage === 'Contacted');
  const newLeads = ls.filter(l => l.stage === 'New');
  const meetingSet = ls.filter(l => l.stage === 'Meeting Set');
  const proposalSent = ls.filter(l => l.stage === 'Proposal Sent');
  const awaiting = ls.filter(l => l.stage === 'Awaiting Response');
  const parked = ls.filter(l => l.stage === 'Parked');
  const closed = ls.filter(l => l.stage === 'Closed');
  const activeLeads = totalLeads - parked.length - closed.length;
  const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'Nicole';
  const highPriority = ls.filter(l => l.priority === 'Critical' || l.priority === 'High');
  const priorityLeads = highPriority.filter(l => l.stage !== 'Closed' && l.stage !== 'Parked').slice(0, 4);

  const philPct = totalLeads > 0 ? Math.round(philanthropy.length / totalLeads * 100) : 0;
  const invPct = 100 - philPct;

  // Stage rows data
  const stages = [
    { label: 'Engaged',            count: engaged.length,                              bar: 'bg-canopy',        badge: 'bg-canopy/10 text-canopy',          tag: 'Warm' },
    { label: 'Contacted',          count: contacted.length,                            bar: 'bg-forest-light',  badge: 'bg-meadow text-forest',             tag: 'Active' },
    { label: 'New / Researching',  count: newLeads.length,                             bar: 'bg-border',        badge: 'bg-surface-mid text-ink-soft',      tag: 'Pipeline' },
    { label: 'Meeting / Proposal', count: meetingSet.length + proposalSent.length,     bar: 'bg-warning',       badge: 'bg-warning-bg text-warning',        tag: 'Hot' },
    { label: 'Parked / Closed',    count: parked.length + closed.length,               bar: 'bg-surface-high',  badge: 'bg-surface-mid text-ink-ghost',     tag: 'Inactive' },
  ];
  const maxCount = Math.max(...stages.map(s => s.count), 1);

  return `
    <div class="min-h-screen bg-white pb-24 md:pb-0">
      ${navHTML('dashboard')}

      <main class="max-w-7xl mx-auto px-6 pt-10">

        <!-- ── Hero ──────────────────────────────────────── -->
        <section class="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.15em] text-ink-ghost mb-3">Portfolio Overview · My Leads</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl md:text-6xl font-semibold text-forest mb-4 leading-tight">
              Welcome, ${userName}
            </h1>
            <p class="text-ink-soft text-lg max-w-xl leading-relaxed">
              You're managing <strong class="text-ink-mid font-semibold">${totalLeads} leads</strong> across Philanthropy and Investors.
              <strong class="text-ink-mid font-semibold">${activeLeads}</strong> are actively in your pipeline.
            </p>
          </div>
          <!-- Active pipeline card + New Lead -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <div class="card rounded-2xl p-6 flex items-center gap-6">
              <div>
                <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-1">Active Pipeline</p>
                <p class="text-3xl font-bold text-forest">${contacted.length + engaged.length} <span class="text-lg font-semibold text-ink-soft">In Motion</span></p>
              </div>
              <div class="w-px h-10 bg-border"></div>
              <button class="btn-primary px-5 py-3 rounded-xl font-semibold text-sm" onclick="window.app.navigate('#leads')">
                View List →
              </button>
            </div>
            <button class="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm border-2 border-forest text-forest hover:bg-forest hover:text-white transition-all duration-200 cursor-pointer" onclick="window.app.navigate('#add-lead')">
              <span class="material-symbols-outlined text-base">add</span>
              New Lead
            </button>
          </div>
        </section>

        <!-- ── Stat Cards ─────────────────────────────────── -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <div class="card rounded-2xl p-8 group hover:cursor-pointer" onclick="window.app.navigate('#leads')">
            <div class="flex items-start justify-between mb-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Philanthropy</p>
              <div class="w-8 h-8 rounded-lg bg-meadow flex items-center justify-center">
                <span class="material-symbols-outlined text-forest text-sm" style="font-variation-settings:'FILL' 1;">favorite</span>
              </div>
            </div>
            <p class="text-5xl font-bold text-forest mb-2" style="font-family:'Fraunces',Georgia,serif;">${philanthropy.length}</p>
            <p class="text-sm text-ink-soft">Leads</p>
            <p class="text-xs text-ink-ghost mt-3">${philanthropy.filter(l => l.stage === 'Engaged' || l.stage === 'Contacted').length} actively engaged</p>
          </div>

          <div class="card rounded-2xl p-8 group hover:cursor-pointer" onclick="window.app.navigate('#leads')">
            <div class="flex items-start justify-between mb-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-ink-ghost">Investors</p>
              <div class="w-8 h-8 rounded-lg bg-meadow flex items-center justify-center">
                <span class="material-symbols-outlined text-forest text-sm" style="font-variation-settings:'FILL' 1;">trending_up</span>
              </div>
            </div>
            <p class="text-5xl font-bold text-forest mb-2" style="font-family:'Fraunces',Georgia,serif;">${investors.length}</p>
            <p class="text-sm text-ink-soft">Leads</p>
            <p class="text-xs text-ink-ghost mt-3">${investors.filter(l => l.ticket_size).length} with ticket sizes identified</p>
          </div>

          <div class="card rounded-2xl p-8 group hover:cursor-pointer bg-forest text-white border-0" onclick="window.app.navigate('#kanban')">
            <div class="flex items-start justify-between mb-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">Total Pipeline</p>
              <div class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <span class="material-symbols-outlined text-canopy text-sm" style="font-variation-settings:'FILL' 1;">account_tree</span>
              </div>
            </div>
            <p class="text-5xl font-bold text-white mb-2" style="font-family:'Fraunces',Georgia,serif;">${totalLeads}</p>
            <p class="text-sm text-white/70">Leads</p>
            <p class="text-xs text-white/40 mt-3">${newLeads.length} new · ${contacted.length} contacted · ${engaged.length} engaged</p>
          </div>
        </section>

        <!-- ── Main Grid ───────────────────────────────────── -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <!-- Stage Distribution -->
          <div class="lg:col-span-7">
            <div class="flex items-center justify-between mb-6">
              <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-forest">Lead Stage Distribution</h2>
              <button class="text-xs font-bold text-ink-soft hover:text-forest transition-colors" onclick="window.app.navigate('#kanban')">View Pipeline →</button>
            </div>
            <div class="card rounded-2xl overflow-hidden">
              ${stages.map((s, i) => `
              <div class="flex items-center gap-4 px-6 py-5 ${i < stages.length - 1 ? 'border-b border-border-soft' : ''} group hover:bg-surface-low transition-colors">
                <!-- Bar track -->
                <div class="w-1 h-10 rounded-full bg-surface-high overflow-hidden shrink-0">
                  <div class="${s.bar} bar-fill h-full rounded-full" style="height:${Math.round(s.count / maxCount * 100)}%"></div>
                </div>
                <!-- Label -->
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-ink-mid">${s.label}</p>
                </div>
                <!-- Count -->
                <p class="text-sm font-bold text-forest w-20 text-center">${s.count} Lead${s.count !== 1 ? 's' : ''}</p>
                <!-- Badge -->
                <span class="hidden sm:inline px-3 py-1 ${s.badge} text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0">${s.tag}</span>
              </div>
              `).join('')}
            </div>
          </div>

          <!-- Priority Leads -->
          <div class="lg:col-span-5">
            <div class="flex items-center justify-between mb-6">
              <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-forest">Priority Leads</h2>
              <span class="px-3 py-1 bg-canopy/10 text-canopy text-[10px] font-bold uppercase tracking-wider rounded-full">${highPriority.length} high priority</span>
            </div>

            <div class="space-y-4 mb-6">
              ${priorityLeads.map(lead => `
              <div class="card rounded-2xl p-5 cursor-pointer border-l-4 ${(lead.priority === 'Critical' || lead.priority === 'High') ? 'border-l-error' : 'border-l-canopy'} hover:cursor-pointer" onclick="window.app.navigate('#lead/${lead.id}')">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-forest text-base leading-tight">${lead.org_name}</h4>
                  <span class="material-symbols-outlined text-sm ${(lead.priority === 'Critical' || lead.priority === 'High') ? 'text-error' : 'text-canopy'}" style="font-variation-settings:'FILL' 1;">priority_high</span>
                </div>
                <p class="text-sm text-ink-soft mb-3 line-clamp-2 leading-relaxed">${lead.action || lead.comments || 'No action noted'}</p>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-meadow text-forest text-[10px] font-bold uppercase tracking-wider rounded-full">${lead.stage}</span>
                  <span class="px-2 py-0.5 ${lead.category === 'Philanthropy' ? 'bg-meadow text-forest' : 'bg-surface-mid text-ink-soft'} text-[10px] font-bold rounded-full">${lead.category}</span>
                </div>
              </div>
              `).join('')}
            </div>

            <!-- Category split card -->
            <div class="card rounded-2xl p-6 bg-forest text-white border-0">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-white/50 mb-4">Category Split</p>
              <div class="flex items-end gap-6 mb-4">
                <div>
                  <p class="text-3xl font-bold text-white" style="font-family:'Fraunces',Georgia,serif;">${philanthropy.length}</p>
                  <p class="text-xs text-white/60 mt-1">Philanthropy</p>
                </div>
                <div class="w-px h-8 bg-white/10 mb-1"></div>
                <div>
                  <p class="text-3xl font-bold text-white" style="font-family:'Fraunces',Georgia,serif;">${investors.length}</p>
                  <p class="text-xs text-white/60 mt-1">Investors</p>
                </div>
              </div>
              <!-- Split bar -->
              <div class="w-full bg-white/10 h-2 rounded-full overflow-hidden flex">
                <div class="bg-canopy h-full bar-fill rounded-full" style="width:${philPct}%"></div>
              </div>
              <div class="flex justify-between mt-2">
                <p class="text-[10px] text-white/40">${philPct}% philanthropy</p>
                <p class="text-[10px] text-white/40">${invPct}% investors</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- ── Bottom nav (mobile) ───────────────────────── -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 backdrop-blur border-t border-border-soft shadow-nav rounded-t-3xl">
        <a class="flex flex-col items-center gap-1 px-4 py-2 rounded-xl bg-forest text-white" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">dashboard</span>
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
        <button class="flex flex-col items-center gap-1 px-4 py-2 text-ink-soft hover:text-forest" onclick="window.app.navigate('#add-lead')">
          <span class="material-symbols-outlined text-xl">add_circle</span>
          <span class="text-[10px] font-bold uppercase tracking-wider">Add</span>
        </button>
      </nav>
    </div>
  `;
}
