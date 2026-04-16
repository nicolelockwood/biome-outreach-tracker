// Shared nav HTML — single source of truth used by all screens
export function navHTML(active = 'dashboard') {
  const link = (id, label, hash) => {
    const isActive = active === id;
    return `<a class="${isActive
      ? 'text-forest font-bold border-b-2 border-canopy pb-0.5'
      : 'text-ink-soft hover:text-forest transition-colors'} text-sm cursor-pointer tracking-wide" onclick="window.app.navigate('#${hash}')">${label}</a>`;
  };
  return `
  <header class="glass-nav sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer" onclick="window.app.navigate('#dashboard')">
        <div class="w-8 h-8 rounded-lg icon-forest flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 4 5.5 4 10c0 2.5 1.2 4.8 3 6.2V20h10v-3.8c1.8-1.4 3-3.7 3-6.2 0-4.5-4-8-8-8z" fill="#3d8b63" opacity="0.9"/>
            <path d="M9 20v2h6v-2H9z" fill="#3d8b63" opacity="0.6"/>
          </svg>
        </div>
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
        <div class="w-9 h-9 rounded-full icon-forest flex items-center justify-center cursor-pointer" onclick="window.app.signOut()" title="Sign out">
          <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">logout</span>
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
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('dashboard')}

      <main class="max-w-7xl mx-auto px-6 pt-10">

        <!-- ── Overdue alert ── -->
        ${(() => {
          const today = new Date(); today.setHours(0,0,0,0);
          const overdue = ls.filter(l => {
            if (!l.next_follow_up || l.stage === 'Secured' || l.stage === 'Parked') return false;
            try { const d = new Date(l.next_follow_up); d.setHours(0,0,0,0); return d < today; } catch { return false; }
          });
          if (overdue.length === 0) return '';
          return `
          <div class="mb-8 flex items-center gap-4 px-5 py-4 card rounded-2xl cursor-pointer" style="background: rgba(138,58,58,0.08); border: 1px solid rgba(138,58,58,0.15);" onclick="window.app.navigate('#calendar')">
            <span class="material-symbols-outlined text-urgent text-xl shrink-0">warning</span>
            <div class="flex-1">
              <p class="text-sm font-bold text-urgent">
                ${overdue.length} overdue follow-up${overdue.length > 1 ? 's' : ''} — ${overdue.map(l => l.org_name).slice(0,3).join(', ')}${overdue.length > 3 ? ` + ${overdue.length - 3} more` : ''}
              </p>
              <p class="text-xs text-urgent/70">Tap to view your follow-up task list →</p>
            </div>
            <span class="material-symbols-outlined text-urgent/50 text-base">chevron_right</span>
          </div>`;
        })()}

        <!-- ══════════════════════════════════════════════════
             ZONE 1 — WELCOME + PULSE
             The entry hall: warm, spacious, orienting
             ══════════════════════════════════════════════════ -->
        <section class="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Portfolio Overview</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl md:text-6xl font-semibold text-white mb-4 leading-tight drop-shadow-sm">
              Welcome, ${userName}
            </h1>
            <p class="text-white/70 text-lg max-w-xl leading-relaxed">
              You're managing <strong class="text-white font-semibold">${totalLeads} leads</strong> across Philanthropy and Investors.
              <strong class="text-white font-semibold">${activeLeads}</strong> are actively in your pipeline.
            </p>
          </div>
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

        <!-- Quick pulse — three glass cards with premium forest icons -->
        <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <!-- Philanthropy -->
          <div class="card rounded-2xl p-8 group hover:cursor-pointer" onclick="window.app.navigate('#leads')">
            <div class="flex items-start justify-between mb-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-philanthropy">Philanthropy</p>
              <div class="w-9 h-9 rounded-xl icon-forest flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">volunteer_activism</span>
              </div>
            </div>
            <p class="text-5xl font-bold text-forest mb-2" style="font-family:'Fraunces',Georgia,serif;">${philanthropy.length}</p>
            <p class="text-sm text-ink-soft">Leads</p>
            <p class="text-xs text-ink-ghost mt-3">${philanthropy.filter(l => l.stage === 'Engaged' || l.stage === 'Contacted').length} actively engaged</p>
          </div>

          <!-- Investors -->
          <div class="card rounded-2xl p-8 group hover:cursor-pointer" onclick="window.app.navigate('#leads')">
            <div class="flex items-start justify-between mb-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-investor">Investors</p>
              <div class="w-9 h-9 rounded-xl icon-forest flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">trending_up</span>
              </div>
            </div>
            <p class="text-5xl font-bold text-forest mb-2" style="font-family:'Fraunces',Georgia,serif;">${investors.length}</p>
            <p class="text-sm text-ink-soft">Leads</p>
            <p class="text-xs text-ink-ghost mt-3">${investors.filter(l => l.ticket_size).length} with ticket sizes identified</p>
          </div>

          <!-- Total Pipeline — dark glass -->
          <div class="card-deep rounded-2xl p-8 group hover:cursor-pointer" onclick="window.app.navigate('#kanban')">
            <div class="flex items-start justify-between mb-4">
              <p class="text-[11px] font-bold uppercase tracking-[0.12em] text-white/50">Total Pipeline</p>
              <div class="w-9 h-9 rounded-xl icon-forest flex items-center justify-center">
                <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">account_tree</span>
              </div>
            </div>
            <p class="text-5xl font-bold text-white mb-2" style="font-family:'Fraunces',Georgia,serif;">${totalLeads}</p>
            <p class="text-sm text-white/70">Leads</p>
            <p class="text-xs text-white/40 mt-3">${newLeads.length} new · ${contacted.length} contacted · ${engaged.length} engaged</p>
          </div>
        </section>
      </main>

      <!-- ══════════════════════════════════════════════════
           ZONE 2 — FUNDING GOALS
           A distinct warm band — feels like stepping into
           the financial room. Different background, different weight.
           ══════════════════════════════════════════════════ -->
      <div class="max-w-7xl mx-auto px-6 mt-10">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-9 h-9 rounded-xl icon-forest flex items-center justify-center">
              <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">savings</span>
            </div>
            <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white drop-shadow-sm">Funding Goals</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${[
              { label: 'Philanthropy Goal', goal: PHIL_GOAL, g: philGoal, icon: 'volunteer_activism', accentColor: '#5a8a4a', barColor: '#5a8a4a' },
              { label: 'Investment Goal',   goal: INV_GOAL,  g: invGoal,  icon: 'payments',           accentColor: '#2a6a5a', barColor: '#2a6a5a' },
            ].map(({ label, goal, g, icon, accentColor, barColor }) => `
            <div class="card rounded-2xl p-7">
              <div class="flex items-start justify-between mb-5">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-1">${label}</p>
                  <p class="text-3xl font-bold text-forest" style="font-family:'Fraunces',Georgia,serif;">${fmtM(goal)}</p>
                </div>
                <div class="w-10 h-10 rounded-xl icon-forest flex items-center justify-center">
                  <span class="material-symbols-outlined text-white" style="font-variation-settings:'FILL' 1;">${icon}</span>
                </div>
              </div>
              <!-- Progress bar -->
              <div class="w-full h-3 rounded-full overflow-hidden flex mb-4" style="background: rgba(20,52,42,0.08);">
                <div class="h-full rounded-l-full transition-all duration-700" style="width:${g.landedPct}%; background: ${barColor};"></div>
                <div class="h-full transition-all duration-700" style="width:${g.potentialPct}%; background: ${barColor}; opacity: 0.3;"></div>
              </div>
              <!-- Stats row -->
              <div class="grid grid-cols-3 gap-2">
                <div class="rounded-xl p-3 text-center" style="background: rgba(255,255,255,0.5);">
                  <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Landed</p>
                  <p class="text-sm font-bold text-forest">${fmtM(g.landed)}</p>
                </div>
                <div class="rounded-xl p-3 text-center" style="background: ${accentColor}10;">
                  <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Potential</p>
                  <p class="text-sm font-bold text-forest">${fmtM(g.potential)}</p>
                </div>
                <div class="rounded-xl p-3 text-center" style="background: rgba(255,255,255,0.5);">
                  <p class="text-[9px] font-bold uppercase tracking-wider text-ink-ghost mb-1">Still Needed</p>
                  <p class="text-sm font-bold text-ink-mid">${fmtM(g.remaining)}</p>
                </div>
              </div>
              <p class="text-[10px] text-ink-ghost mt-3">
                ${g.landedPct}% secured · ${g.potentialPct}% in pipeline · Mark a lead as <strong class="text-forest">Secured</strong> when funding lands
              </p>
            </div>
            `).join('')}
          </div>
      </div>

      <!-- ══════════════════════════════════════════════════
           ZONE 3 — PIPELINE INTELLIGENCE
           Back to the main room. Distribution + Priority.
           ══════════════════════════════════════════════════ -->
      <div class="max-w-7xl mx-auto px-6 pt-10 pb-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

          <!-- Stage Distribution -->
          <div class="lg:col-span-7">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl icon-forest flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">bar_chart</span>
                </div>
                <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white drop-shadow-sm">Lead Stages</h2>
              </div>
              <button class="text-xs font-bold text-white/60 hover:text-white transition-colors" onclick="window.app.navigate('#kanban')">View Pipeline →</button>
            </div>
            <div class="card rounded-2xl overflow-hidden">
              ${stages.map((s, i) => `
              <div class="flex items-center gap-4 px-6 py-5 ${i < stages.length - 1 ? 'border-b border-border-soft' : ''} group hover:bg-surface-low transition-colors">
                <div class="w-1 h-10 rounded-full bg-surface-high overflow-hidden shrink-0">
                  <div class="${s.bar} bar-fill h-full rounded-full" style="height:${Math.round(s.count / maxCount * 100)}%"></div>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-sm text-ink-mid">${s.label}</p>
                </div>
                <p class="text-sm font-bold text-forest w-20 text-center">${s.count} Lead${s.count !== 1 ? 's' : ''}</p>
                <span class="hidden sm:inline px-3 py-1 ${s.badge} text-[10px] font-bold uppercase tracking-wider rounded-full shrink-0">${s.tag}</span>
              </div>
              `).join('')}
            </div>
          </div>

          <!-- Priority Leads -->
          <div class="lg:col-span-5">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl icon-forest flex items-center justify-center">
                  <span class="material-symbols-outlined text-white text-base" style="font-variation-settings:'FILL' 1;">priority_high</span>
                </div>
                <h2 style="font-family:'Fraunces',Georgia,serif;" class="text-2xl font-semibold text-white drop-shadow-sm">Priority Leads</h2>
              </div>
              <span class="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full" style="background: rgba(138,74,58,0.15); color: #d4785a;">${highPriority.length} high</span>
            </div>

            <div class="space-y-4 mb-6">
              ${priorityLeads.map(lead => `
              <div class="card rounded-2xl p-5 cursor-pointer border-l-4 ${(lead.priority === 'Critical' || lead.priority === 'High') ? 'border-l-error' : 'border-l-canopy'}" onclick="window.app.navigate('#lead/${lead.id}')">
                <div class="flex items-start justify-between mb-2">
                  <h4 class="font-semibold text-forest text-base leading-tight">${lead.org_name}</h4>
                  <span class="material-symbols-outlined text-sm ${(lead.priority === 'Critical' || lead.priority === 'High') ? 'text-error' : 'text-canopy'}" style="font-variation-settings:'FILL' 1;">priority_high</span>
                </div>
                <p class="text-sm text-ink-soft mb-3 line-clamp-2 leading-relaxed">${lead.action || lead.comments || 'No action noted'}</p>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-meadow text-forest text-[10px] font-bold uppercase tracking-wider rounded-full">${lead.stage}</span>
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded-full" style="${lead.category === 'Philanthropy' ? 'background:rgba(90,138,74,0.12);color:#5a8a4a;' : 'background:rgba(42,106,90,0.12);color:#2a6a5a;'}">${lead.category}</span>
                </div>
              </div>
              `).join('')}
            </div>

            <!-- Category split card -->
            <div class="card-deep rounded-2xl p-6">
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
      </div>

      <!-- ── Bottom nav (mobile) ── -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 nav-glass-bottom rounded-t-3xl">
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
