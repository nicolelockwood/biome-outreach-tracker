import { navHTML } from './dashboard.js';

const PRIORITY_COLOUR = {
  High:     { dot: '#8a3a3a', badge: 'bg-error/10 text-error',     glass: 'priority-glass-high' },
  Critical: { dot: '#8a3a3a', badge: 'bg-error/10 text-error',     glass: 'priority-glass-high' },
  Medium:   { dot: '#3d8b63', badge: 'bg-stage-warm-bg text-stage-warm', glass: 'priority-glass-medium' },
  Low:      { dot: '#c8d8c4', badge: 'bg-stage-pipeline-bg text-stage-pipeline', glass: 'priority-glass-low' },
};
const pc = (p) => PRIORITY_COLOUR[p] || PRIORITY_COLOUR['Medium'];

// Category colour for calendar dots
const catColour = (lead) => {
  const cat = (lead?.category || '').toLowerCase();
  if (cat.includes('philanthropy') && cat.includes('investor')) return { bg: 'bg-copper', ring: 'ring-canopy' };
  if (cat.includes('philanthropy')) return { bg: 'bg-copper' };
  return { bg: 'bg-canopy' };
};

export function renderCalendar(navigate, followUps = [], leads = []) {
  const leadMap = Object.fromEntries(leads.map(l => [l.id, l]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parse = (d) => { const dt = new Date(d + 'T00:00:00'); dt.setHours(0,0,0,0); return dt; };
  const fmt = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-AU', { weekday:'short', day:'numeric', month:'short' });

  // Enrich
  const items = followUps
    .filter(f => f.follow_up_date)
    .map(f => {
      const lead = leadMap[f.lead_id] || {};
      const dt = parse(f.follow_up_date);
      const diffDays = Math.round((dt - today) / 86400000);
      return { ...f, lead, dt, diffDays };
    })
    .sort((a, b) => a.dt - b.dt);

  // Buckets for task list
  const overdue   = items.filter(i => i.diffDays < 0 && !i.completed);
  const todayItems = items.filter(i => i.diffDays === 0 && !i.completed);
  const thisWeek  = items.filter(i => i.diffDays > 0 && i.diffDays <= 7 && !i.completed);
  const upcoming  = items.filter(i => i.diffDays > 7 && !i.completed);
  const done      = items.filter(i => i.completed);

  const totalPending = overdue.length + todayItems.length + thisWeek.length + upcoming.length;

  // ── Calendar grid data ──────────────────────────────
  const dateMap = {};
  items.forEach(item => {
    const key = item.follow_up_date;
    if (!dateMap[key]) dateMap[key] = [];
    dateMap[key].push(item);
  });

  const calMonth = today.getMonth();
  const calYear = today.getFullYear();

  function calendarGrid(year, month) {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    let cells = '';
    for (let i = 0; i < startDow; i++) {
      cells += `<div class="h-20 md:h-24"></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const dayItems = dateMap[dateStr] || [];
      const isToday = (d === today.getDate() && month === today.getMonth() && year === today.getFullYear());
      const hasOverdue = dayItems.some(i => !i.completed && i.diffDays < 0);

      const dayNumClass = isToday
        ? 'w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-xs font-bold'
        : 'text-xs font-semibold text-ink-mid';

      const cellBorder = isToday ? 'border-forest/30 bg-canopy-light/30' : hasOverdue ? 'border-error/20 bg-error-bg/30' : 'border-transparent';

      const dots = dayItems.slice(0, 3).map(item => {
        const cc = catColour(item.lead);
        const completed = item.completed;
        return `<div class="w-2 h-2 rounded-full ${completed ? 'bg-surface-high' : cc.bg} ${cc.ring ? 'ring-1 ' + cc.ring : ''}" title="${item.lead?.org_name || ''}: ${item.follow_up_action || item.summary || ''}"></div>`;
      }).join('');

      const overflow = dayItems.length > 3 ? `<span class="text-[9px] text-ink-ghost font-bold">+${dayItems.length - 3}</span>` : '';

      // Click to filter task list by date
      const onclick = dayItems.length > 0 ? `onclick="window.app._calFilterDate && window.app._calFilterDate('${dateStr}')"` : '';

      cells += `
        <div class="h-20 md:h-24 p-1.5 border ${cellBorder} rounded-lg ${dayItems.length > 0 ? 'cursor-pointer hover:bg-surface-low' : ''} transition-colors" ${onclick}>
          <div class="${dayNumClass} mb-1">${isToday ? `<span>${d}</span>` : d}</div>
          <div class="flex items-center gap-1 flex-wrap">${dots}${overflow}</div>
        </div>`;
    }

    return cells;
  }

  // Pre-render 4 months: prev, current, next, next+1
  const months = [];
  for (let offset = -1; offset <= 2; offset++) {
    const m = new Date(calYear, calMonth + offset, 1);
    months.push({ year: m.getFullYear(), month: m.getMonth(), id: `cal-${m.getFullYear()}-${m.getMonth()}` });
  }

  const calGrids = months.map(({ year, month, id }) => {
    const cells = calendarGrid(year, month);
    const isCurrent = (year === calYear && month === calMonth);
    return `
    <div id="${id}" class="${isCurrent ? '' : 'hidden'}" data-cal-grid data-year="${year}" data-month="${month}">
      <div class="grid grid-cols-7 gap-px mb-2">
        ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<div class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost text-center py-2">${d}</div>`).join('')}
      </div>
      <div class="grid grid-cols-7 gap-px">
        ${cells}
      </div>
    </div>`;
  }).join('');

  // Task card renderer — using priority glass tints
  const card = (item, extraClass = '') => {
    const p = item.lead?.priority || 'Medium';
    const pNorm = p === 'Critical' ? 'High' : p;
    const colours = pc(p);
    const dateStr = item.follow_up_date;
    return `
    <div data-cal-task data-task-date="${dateStr}" class="card rounded-xl p-4 ${colours.glass} flex items-start gap-4 group ${extraClass}">
      <div class="shrink-0 mt-0.5">
        <div class="w-5 h-5 rounded-full border-2 border-border cursor-pointer flex items-center justify-center hover:border-forest transition-colors ${item.completed ? 'bg-forest border-forest' : ''}"
          onclick="(async function(){
            const { error } = await window.app.completeFollowUp(${item.id}, ${!item.completed});
            if (!error) window.app.navigate('#calendar');
          }).call(this)">
          ${item.completed ? '<span class="material-symbols-outlined text-white text-xs">check</span>' : ''}
        </div>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <a class="font-semibold text-forest text-sm hover:underline cursor-pointer leading-snug" onclick="window.app.navigate('#lead/${item.lead_id}')">
            ${item.lead?.org_name || 'Unknown Lead'}
          </a>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${colours.badge}">${pNorm}</span>
        </div>
        ${item.follow_up_action ? `<p class="text-sm text-ink-mid font-medium mb-1">${item.follow_up_action}</p>` : ''}
        <p class="text-xs text-ink-ghost line-clamp-1">${item.summary || '—'}</p>
        <div class="flex items-center gap-3 mt-2">
          <span class="text-[10px] text-ink-ghost font-bold uppercase tracking-wider">${fmt(item.follow_up_date)}</span>
          <span class="px-2 py-0.5 bg-surface-low text-ink-ghost text-[9px] font-bold uppercase rounded-full">${item.type}</span>
        </div>
      </div>
      <a class="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onclick="window.app.navigate('#lead/${item.lead_id}')">
        <span class="material-symbols-outlined text-ink-ghost text-base">open_in_new</span>
      </a>
    </div>`;
  };

  const bucket = (title, icon, items, emptyMsg, accent = '') => {
    if (items.length === 0 && !emptyMsg) return '';
    return `
    <div class="mb-8" data-cal-bucket>
      <div class="flex items-center gap-2 mb-4">
        <span class="material-symbols-outlined text-base ${accent || 'text-white/60'}">${icon}</span>
        <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-lg font-semibold text-white drop-shadow-sm">${title}</h3>
        ${items.length > 0 ? `<span class="px-2.5 py-0.5 text-white/80 text-xs font-bold rounded-full" style="background:rgba(255,255,255,0.15);">${items.length}</span>` : ''}
      </div>
      <div class="space-y-3">
        ${items.length > 0 ? items.map(i => card(i)).join('') : `<p class="text-sm text-white/50 italic pl-7">${emptyMsg}</p>`}
      </div>
    </div>`;
  };

  // Date filter notice (hidden by default, shown when a date is clicked)
  const filterNotice = `
    <div id="cal-filter-notice" class="hidden mb-6 flex items-center justify-between px-4 py-3 rounded-xl" style="background:rgba(255,255,255,0.85); backdrop-filter:blur(12px); border:1px solid rgba(255,255,255,0.4);">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined text-forest text-base">filter_list</span>
        <p class="text-sm font-semibold text-forest">Showing tasks for <span id="cal-filter-date-label"></span></p>
      </div>
      <button class="text-xs font-bold text-ink-soft hover:text-forest transition-colors cursor-pointer flex items-center gap-1" onclick="window.app._calClearFilter && window.app._calClearFilter()">
        <span class="material-symbols-outlined text-sm">close</span> Show all
      </button>
    </div>`;

  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('calendar')}

      <main class="max-w-7xl mx-auto px-6 pt-10">

        <!-- Hero -->
        <section class="mb-10 flex items-end justify-between gap-6">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/50 mb-3">Action Centre</p>
            <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-2">Follow-ups</h1>
            <p class="text-white/70 text-base">
              ${totalPending > 0
                ? `<strong class="text-white">${totalPending}</strong> task${totalPending !== 1 ? 's' : ''} pending${overdue.length > 0 ? ` · <span class="text-error font-semibold">${overdue.length} overdue</span>` : ''}`
                : 'All clear — no pending follow-ups'}
            </p>
          </div>
          <div class="text-right shrink-0">
            <p class="text-[10px] font-bold uppercase tracking-wider text-white/50">${today.toLocaleDateString('en-AU', { weekday:'long' })}</p>
            <p class="text-2xl font-bold text-white drop-shadow-sm" style="font-family:'Fraunces',Georgia,serif;">${today.toLocaleDateString('en-AU', { day:'numeric', month:'short', year:'numeric' })}</p>
          </div>
        </section>

        <!-- ═══ Two-column layout: Calendar + Task List ═══ -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <!-- Calendar panel -->
          <div class="lg:col-span-7">
            <div class="card rounded-2xl p-6 mb-8">
              <!-- Month navigation -->
              <div class="flex items-center justify-between mb-6">
                <button id="cal-prev" class="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center text-ink-soft hover:text-forest hover:bg-surface-mid transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <h3 id="cal-month-title" style="font-family:'Fraunces',Georgia,serif;" class="text-xl font-semibold text-forest">${new Date(calYear, calMonth).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</h3>
                <button id="cal-next" class="w-9 h-9 rounded-lg bg-surface-low flex items-center justify-center text-ink-soft hover:text-forest hover:bg-surface-mid transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-lg">chevron_right</span>
                </button>
              </div>

              <!-- Calendar grids -->
              ${calGrids}

              <!-- Legend -->
              <div class="flex items-center gap-6 mt-5 pt-4 border-t border-border-soft">
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-copper"></div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost">Philanthropy</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-2.5 h-2.5 rounded-full bg-canopy"></div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost">Investors</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 rounded-full bg-forest text-white flex items-center justify-center text-[9px] font-bold">${today.getDate()}</div>
                  <span class="text-[10px] font-bold uppercase tracking-wider text-ink-ghost">Today</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Task list panel -->
          <div class="lg:col-span-5" id="cal-task-panel">
            ${filterNotice}
            ${overdue.length > 0 ? bucket('Overdue', 'warning', overdue, '', 'text-error') : ''}
            ${bucket('Today', 'today', todayItems, 'Nothing due today', 'text-canopy')}
            ${bucket('This Week', 'date_range', thisWeek, 'Nothing else this week')}
            ${upcoming.length > 0 ? bucket('Upcoming', 'event', upcoming, '') : ''}
            ${done.length > 0 ? `
            <details class="mt-8">
              <summary class="flex items-center gap-2 cursor-pointer text-white/50 hover:text-white transition-colors mb-4">
                <span class="material-symbols-outlined text-base">check_circle</span>
                <span class="text-sm font-bold uppercase tracking-wider">Completed (${done.length})</span>
              </summary>
              <div class="space-y-3 opacity-60">
                ${done.map(i => card(i)).join('')}
              </div>
            </details>` : ''}

            ${totalPending === 0 && done.length === 0 ? `
            <div class="text-center py-16">
              <div class="w-14 h-14 rounded-2xl bg-canopy-light flex items-center justify-center mx-auto mb-4">
                <span class="material-symbols-outlined text-canopy text-2xl" style="font-variation-settings:'FILL' 1;">sentiment_satisfied</span>
              </div>
              <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-xl font-semibold text-white drop-shadow-sm mb-2">You're all caught up</h3>
              <p class="text-white/60 text-sm mb-5">Log interactions and set follow-up dates to see tasks here.</p>
              <button class="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer" onclick="window.app.navigate('#leads')">View All Leads</button>
            </div>` : ''}
          </div>
        </div>

      </main>

      <!-- Bottom nav (mobile) -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-6 pt-3 nav-glass-bottom rounded-t-3xl">
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-xl">dashboard</span>
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
        <a class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#calendar')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">calendar_today</span>
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

// Post-render setup — called from app.js after innerHTML is set
export function initCalendarControls() {
  const grids = document.querySelectorAll('[data-cal-grid]');
  const title = document.getElementById('cal-month-title');
  const prevBtn = document.getElementById('cal-prev');
  const nextBtn = document.getElementById('cal-next');
  if (!grids.length || !title || !prevBtn || !nextBtn) return;

  let currentIdx = Array.from(grids).findIndex(g => !g.classList.contains('hidden'));
  if (currentIdx === -1) currentIdx = 0;

  function show(idx) {
    grids.forEach(g => g.classList.add('hidden'));
    if (grids[idx]) {
      grids[idx].classList.remove('hidden');
      const y = grids[idx].dataset.year;
      const m = grids[idx].dataset.month;
      title.textContent = new Date(y, m).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
    }
    currentIdx = idx;
    prevBtn.style.visibility = idx <= 0 ? 'hidden' : 'visible';
    nextBtn.style.visibility = idx >= grids.length - 1 ? 'hidden' : 'visible';
  }

  prevBtn.addEventListener('click', () => { if (currentIdx > 0) show(currentIdx - 1); });
  nextBtn.addEventListener('click', () => { if (currentIdx < grids.length - 1) show(currentIdx + 1); });
  show(currentIdx);

  // Date click filtering
  window.app._calFilterDate = function(dateStr) {
    const notice = document.getElementById('cal-filter-notice');
    const label = document.getElementById('cal-filter-date-label');
    const tasks = document.querySelectorAll('[data-cal-task]');
    const buckets = document.querySelectorAll('[data-cal-bucket]');

    if (notice) notice.classList.remove('hidden');
    if (label) {
      const d = new Date(dateStr + 'T00:00:00');
      label.textContent = d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    // Hide all buckets first, show only matching tasks
    buckets.forEach(b => b.style.display = 'none');
    tasks.forEach(t => {
      if (t.dataset.taskDate === dateStr) {
        t.style.display = '';
        // Make sure parent bucket is visible
        const parentBucket = t.closest('[data-cal-bucket]');
        if (parentBucket) parentBucket.style.display = '';
      } else {
        t.style.display = 'none';
      }
    });
  };

  window.app._calClearFilter = function() {
    const notice = document.getElementById('cal-filter-notice');
    if (notice) notice.classList.add('hidden');
    document.querySelectorAll('[data-cal-task]').forEach(t => t.style.display = '');
    document.querySelectorAll('[data-cal-bucket]').forEach(b => b.style.display = '');
  };
}
