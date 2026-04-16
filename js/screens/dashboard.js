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
        ${link('calendar', 'Follow-ups', 'calendar')}
        ${link('strategy', 'Strategy', 'strategy')}
        ${link('archive', 'Archive', 'archive')}
      </nav>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-forest flex items-center justify-center cursor-pointer" onclick="window.app.signOut()" title="Sign out">
          <svg width="18" height="18" viewBox="0 0 32 32" fill="none"><path d="M16 6 C10 6 7 11 8 17 C9 20 12 22 16 22 C20 22 23 20 24 17 C25 11 22 6 16 6Z" fill="#00c566"/><path d="M16 14 L16 26" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/></svg>
        </div>
      </div>
    </div>
  </header>`;
}

// Parse ticket_size strings like "$5M", "$1,000,000", "$500K" → number
function parseTicket(str) {
  if (!str) return 0;
  let s = str.toString().replace(/[$,\s]/g, '');
  if (/B$/i.test(s)) return parseFloat(s) * 1_000_000_000;
  if (/M$/i.test(s)) return parseFloat(s) * 1_000_000;
  if (/K$/i.test(s)) return parseFloat(s) * 1_000;
  return parseFloat(s) || 0;
}

function fmtM(n) {
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return '$' + Math.round(n / 1_000) + 'K';
  return n > 0 ? '$' + n.toLocaleString() : '$0';
}

export function renderDashboard(navigate, leads = [], session = null) {
  const ls = leads;
  const totalLeads = ls.length;
  // Category helpers — handle comma-separated (e.g. "Investors,Philanthropy")
  const hasPhil = (l) => (l.category || '').split(',').map(s=>s.trim()).includes('Philanthropy');
  const hasInv  = (l) => (l.category || '').split(',').map(s=>s.trim()).includes('Investors');
  const philanthropy = ls.filter(hasPhil);
  const investors = ls.filter(hasInv);
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

  // ── Goal indicator calculations ───────────────────────────────────────
  const PHIL_GOAL = 5_000_000;
  const INV_GOAL  = 100_000_000;

  const calcGoal = (group, goal) => {
    const secured   = group.filter(l => l.stage === 'Secured');
    const pipeline  = group.filter(l => l.stage !== 'Secured' && l.stage !== 'Parked' && l.stage !== 'Closed');
    const landed    = secured.reduce((sum, l) => sum + parseTicket(l.ticket_size), 0);
    const potential = pipeline.reduce((sum, l) => sum + parseTicket(l.ticket_size), 0);
    const remaining = Math.max(0, goal - landed);
    const landedPct    = Math.min(100, Math.round(landed    / goal * 100));
    const potentialPct = Math.min(100 - landedPct, Math.round(potential / goal * 100));
    return { landed, potential, remaining, landedPct, potentialPct };
  };

  const philGoal = calcGoal(philanthropy, PHIL_GOAL);
  const invGoal  = calcGoal(investors,    INV_GOAL);

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

        <!-- ── Overdue alert (shown only when there are overdue follow-ups from leads.next_follow_up) ── -->
        ${(() => {
          const today = new Date(); today.setHours(0,0,0,0);
          const overdue = ls.filter(l => {
            if (!l.next_follow_up || l.stage === 'Secured' || l.stage === 'Parked') return false;
            try { const d = new Date(l.next_follow_up); d.setHours(0,0,0,0); return d < today; } catch { return false; }
          });
          if (overdue.length === 0) return '';
          return `
          <div class="mb-8 flex items-center gap-4 px-5 py-4 bg-error/5 border border-error/20 rounded-2xl cursor-pointer" onclick="window.app.navigate('#calendar')">
            <span class="material-symbols-outlined text-error text-xl shrink-0">warning</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-error">
                ${overdue.length} overdue follow-up${overdue.length > 1 ? 's' : ''} — ${overdue.map(l => l.org_name).slice(0,3).join(', ')}${overdue.length > 3 ? ` + ${overdue.length - 3} more` : ''}
              </p>
              <p class="text-xs text-error/70">Tap to view your follow-up task list →</p>
            </div>
            <span class="material-symbols-outlined text-error/50 text-base">chevron_right</span>
          </div>`;
        })()}

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

        <!-- ── Goal Indicators ───────────────────────────────── -->
        <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          ${[
            { label: 'Philanthropy Goal', goal: PHIL_GOAL, g: philGoal, icon: 'volunteer_activism', colour: 'canopy' },
            { label: 'Investment Goal',   goal: INV_GOAL,  g: invGoal,  icon: 'payments',           colour: 'forest' },
          ].map(({ label, goal, g, icon, colour }) => `
          <div class="card rounded-2xl p-7">
            <div class="flex items-start justify-between mb-5">
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-1">${label}</p>
                <p class="text-3xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${fmtM(goal)}</p>
              </div>
              <div class="w-10 h-10 rounded-xl bg-meadow flex items-center justify-center">
                <span class="material-symbols-outlined text-forest" style="font-variation-settings:'FILL' 1;">${icon}</span>
              </div>
            </div>
            <!-- Progress bar -->
            <div class="w-full h-3 rounded-full bg-surface-high overflow-hidden flex mb-4">
              <div class="h-full rounded-l-full bg-forest transition-all duration-700" style="width:${g.landedPct}%"></div>
              <div class="h-full bg-canopy/50 transition-all duration-700" style="width:${g.potentialPct}%"></div>
            </div>
            <!-- Stats row -->
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-surface-low rounded-xl p-3 text-center">
                <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Landed</p>
                <p class="text-sm font-bold text-forest">${fmtM(g.landed)}</p>
              </div>
              <div class="bg-meadow rounded-xl p-3 text-center">
                <p class="text-[9px] font-bold uppercase tracking-wider text-forest/60 mb-1">Potential</p>
                <p class="text-sm font-bold text-forest">${fmtM(g.potential)}</p>
              </div>
              <div class="bg-surface-low rounded-xl p-3 text-center">
                <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Still Needed</p>
                <p class="text-sm font-bold text-ink-mid">${fmtM(g.remaining)}</p>
              </div>
            </div>
            <p class="text-[10px] text-ink-ghost mt-3">
              ${g.landedPct}% secured · ${g.potentialPct}% in pipeline · Mark a lead as <strong class="text-forest">Secured</strong> when funding lands
            </p>
          </div>
          `).join('')}
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
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 bg-white/90 backdrop-blur border-t border-border-soft shadow-nav rounded-t-3xl">
        <a class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-forest text-white" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">dashboard</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Home</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#kanban')">
          <span class="material-symbols-outlined text-xl">view_kanban</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Pipeline</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-xl">table_rows</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Leads</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#calendar')">
          <span class="material-symbols-outlined text-xl">calendar_today</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Tasks</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#add-lead')">
          <span class="material-symbols-outlined text-xl">add_circle</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Add</span>
        </a>
      </nav>
    </div>
  `;
}
