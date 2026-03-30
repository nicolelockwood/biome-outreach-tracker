import { mockTeam } from '../data.js';

export function renderImportLeads() {
  const fieldOptions = [
    'Organization Name',
    'Contact Name',
    'Contact Title',
    'Stage',
    'Priority',
    'Ticket Size',
    'Region'
  ];

  return `
    <div class="min-h-screen bg-surface pb-32 md:pb-0 flex flex-col md:flex-row">
      <!-- Sidebar Navigation -->
      <aside class="md:w-20 md:fixed md:left-0 md:top-0 md:h-screen md:bg-surface-container-low md:border-r md:border-outline-variant/10 flex md:flex-col items-center md:items-stretch md:justify-start md:pt-6 gap-2 md:gap-6 px-3 py-4 md:px-0">
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">dashboard</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Outreach</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428] font-bold transition-colors py-3 px-4 md:px-0 cursor-pointer md:bg-surface-container rounded-lg" onclick="window.app.navigate('#import')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">upload_file</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Import</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#export')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">download</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Export</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#notifications')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">tune</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Settings</span>
        </a>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-20 px-6 pt-8 max-w-5xl">
        <h1 class="text-4xl font-serif font-bold text-[#163428] mb-12">Import Prospects</h1>

        <!-- Upload Zone -->
        <section class="mb-12 p-12 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 text-center hover:bg-primary/10 transition-colors cursor-pointer">
          <div class="flex justify-center mb-4">
            <span class="material-symbols-outlined text-6xl text-primary">upload_file</span>
          </div>
          <p class="text-lg font-semibold text-[#163428] mb-2">Drag CSV file here or click to upload</p>
          <p class="text-sm text-on-surface-variant">Accepted formats: CSV, Excel</p>
          <input type="file" class="hidden" accept=".csv,.xlsx"/>
        </section>

        <!-- Field Correspondence -->
        <section class="mb-12">
          <h2 class="text-xl font-bold text-[#163428] mb-6">Field Correspondence</h2>
          <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
            <div class="grid grid-cols-2 items-center gap-6 p-6">
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Source Column</p>
                <div class="space-y-3">
                  <p class="text-sm font-medium">Organization</p>
                  <p class="text-sm font-medium">Contact</p>
                  <p class="text-sm font-medium">Title</p>
                  <p class="text-sm font-medium">Status</p>
                  <p class="text-sm font-medium">Amount</p>
                  <p class="text-sm font-medium">Priority</p>
                  <p class="text-sm font-medium">Region</p>
                </div>
              </div>
              <div>
                <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Biome Attribute</p>
                <div class="space-y-3">
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Organization Name</option>
                  </select>
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Contact Name</option>
                  </select>
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Contact Title</option>
                  </select>
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Stage</option>
                  </select>
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Ticket Size</option>
                  </select>
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Priority</option>
                  </select>
                  <select class="w-full bg-surface-container-highest border-none rounded-lg py-2 px-3 text-sm">
                    <option>Region</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Ledger Preview -->
        <section class="mb-12">
          <h2 class="text-xl font-bold text-[#163428] mb-6">Ledger Preview</h2>
          <div class="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="bg-surface-container-high/30 border-b border-outline-variant/10">
                    <th class="py-4 px-6 text-left font-bold text-xs uppercase tracking-widest text-on-surface-variant">Organization</th>
                    <th class="py-4 px-6 text-left font-bold text-xs uppercase tracking-widest text-on-surface-variant">Contact</th>
                    <th class="py-4 px-6 text-left font-bold text-xs uppercase tracking-widest text-on-surface-variant">Amount</th>
                    <th class="py-4 px-6 text-left font-bold text-xs uppercase tracking-widest text-on-surface-variant">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-outline-variant/10">
                  <tr class="hover:bg-surface-container-low/40 transition-colors">
                    <td class="py-4 px-6 font-medium">Green Canopy Trust</td>
                    <td class="py-4 px-6">Elena Martinez</td>
                    <td class="py-4 px-6">A$2.4M</td>
                    <td class="py-4 px-6"><span class="px-2 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary">Ready</span></td>
                  </tr>
                  <tr class="hover:bg-surface-container-low/40 transition-colors">
                    <td class="py-4 px-6 font-medium">Pacific Carbon Labs</td>
                    <td class="py-4 px-6">Julian Beck</td>
                    <td class="py-4 px-6">A$850k</td>
                    <td class="py-4 px-6"><span class="px-2 py-1 rounded-full text-xs font-bold bg-primary/15 text-primary">Ready</span></td>
                  </tr>
                  <tr class="hover:bg-surface-container-low/40 transition-colors">
                    <td class="py-4 px-6 font-medium">Oakmont Equity</td>
                    <td class="py-4 px-6">Julian Reed</td>
                    <td class="py-4 px-6">A$12.5M</td>
                    <td class="py-4 px-6"><span class="px-2 py-1 rounded-full text-xs font-bold bg-error/15 text-error">Duplicate</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <!-- Fixed Bottom Action Bar -->
      <div class="fixed bottom-0 left-0 right-0 md:ml-20 bg-surface-container border-t border-outline-variant/10 px-6 py-4 shadow-lg shadow-[#163428]/5 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <p class="text-sm font-bold text-[#163428]">2 Leads Ready</p>
          <span class="h-4 w-px bg-outline-variant/30"></span>
          <p class="text-sm text-error font-semibold">1 Conflict Detected</p>
        </div>
        <div class="flex gap-3">
          <button class="px-6 py-2 rounded-xl border border-outline-variant/20 bg-surface text-[#163428] font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">Cancel</button>
          <button class="px-6 py-2 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-colors cursor-pointer" onclick="window.app.navigate('#dashboard')">Start Import</button>
        </div>
      </div>
    </div>
  `;
}

export function renderExportData() {
  return `
    <div class="min-h-screen bg-surface pb-32 md:pb-0 flex flex-col md:flex-row">
      <!-- Sidebar Navigation -->
      <aside class="md:w-20 md:fixed md:left-0 md:top-0 md:h-screen md:bg-surface-container-low md:border-r md:border-outline-variant/10 flex md:flex-col items-center md:items-stretch md:justify-start md:pt-6 gap-2 md:gap-6 px-3 py-4 md:px-0">
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">dashboard</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Outreach</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#import')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">upload_file</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Import</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428] font-bold transition-colors py-3 px-4 md:px-0 cursor-pointer md:bg-surface-container rounded-lg" onclick="window.app.navigate('#export')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">download</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Export</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#notifications')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">tune</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Settings</span>
        </a>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-20 px-6 pt-8 max-w-5xl">
        <h1 class="text-4xl font-serif font-bold text-[#163428] mb-3">Export Data</h1>
        <p class="text-on-surface-variant mb-12 max-w-2xl">Choose your export format, temporal range, and which fields to include in your report.</p>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <!-- Left Column: Export Settings -->
          <div class="lg:col-span-1 space-y-8">
            <!-- Export Format -->
            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">Export Destination</h3>
              <div class="flex gap-3">
                <button class="flex-1 py-3 px-4 rounded-lg bg-primary text-on-primary font-semibold transition-colors cursor-pointer">CSV</button>
                <button class="flex-1 py-3 px-4 rounded-lg bg-surface-container-low text-[#163428] font-semibold hover:bg-surface-container transition-colors cursor-pointer">Excel</button>
              </div>
            </div>

            <!-- Temporal Range -->
            <div>
              <h3 class="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-4">Temporal Range</h3>
              <div class="space-y-3">
                <input type="date" class="w-full bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-sm" value="2024-10-01"/>
                <input type="date" class="w-full bg-surface-container-lowest border-none rounded-lg py-3 px-4 text-sm" value="2024-10-31"/>
              </div>
            </div>
          </div>

          <!-- Right Column: Field Selection -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Export Leads Card -->
            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-8">
              <h3 class="text-lg font-bold text-[#163428] mb-6">Export Leads</h3>
              <div class="space-y-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Name</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Stage</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Next Follow-up</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Ticket Size</span>
                </label>
              </div>
            </div>

            <!-- Export Interactions Card -->
            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-8">
              <h3 class="text-lg font-bold text-[#163428] mb-6">Export Interactions</h3>
              <div class="space-y-4">
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Date</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Type</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Outcome</span>
                </label>
                <label class="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked class="w-5 h-5 rounded cursor-pointer"/>
                  <span class="text-sm font-medium">Summary</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 mb-12">
          <button class="px-6 py-3 rounded-xl border border-outline-variant/20 bg-surface text-[#163428] font-semibold hover:bg-surface-container-low transition-colors cursor-pointer">Reset Filters</button>
          <button class="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-colors cursor-pointer" onclick="window.app.navigate('#dashboard')">Generate Export</button>
        </div>
      </main>
    </div>
  `;
}

export function renderNotifications() {
  return `
    <div class="pb-32 md:pb-0">
      <!-- Header Navigation -->
      <header class="flex justify-between items-center px-6 py-4 w-full sticky top-0 bg-[#fafaf5]/60 backdrop-blur-xl z-50 shadow-sm shadow-[#163428]/5 border-b border-outline-variant/10">
        <div class="flex items-center gap-3">
          <svg width="36" height="28" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="64" height="48" rx="6" fill="#163428"/><text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="'Manrope',sans-serif" font-weight="800" font-size="11" fill="#4ade80" letter-spacing="2">EARTHLY</text></svg>
          <h1 class="font-serif text-2xl font-bold tracking-tight text-[#163428]">Biome</h1>
        </div>
        <div class="hidden md:flex items-center gap-6 mr-8">
          <a class="text-[#163428]/70 hover:bg-[#163428]/5 transition-colors px-3 py-1 rounded-full cursor-pointer" onclick="window.app.navigate('#dashboard')">Dashboard</a>
          <a class="text-[#163428]/70 hover:bg-[#163428]/5 transition-colors px-3 py-1 rounded-full cursor-pointer" onclick="window.app.navigate('#leads')">Leads</a>
          <a class="text-[#163428] font-bold hover:bg-[#163428]/5 transition-colors px-3 py-1 rounded-full cursor-pointer" onclick="window.app.navigate('#notifications')">Settings</a>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-6xl mx-auto px-6 pt-10">
        <h1 class="text-4xl font-serif font-bold text-[#163428] mb-12">Notification Preferences</h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <!-- Settings Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Personal Outreach Section -->
            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-8">
              <h2 class="text-xl font-bold text-[#163428] mb-6">Personal Outreach</h2>
              <div class="space-y-6">
                <!-- Daily Digest Toggle -->
                <div class="flex items-center justify-between">
                  <div class="flex-1">
                    <p class="font-semibold text-[#163428]">Daily Digest</p>
                    <p class="text-sm text-on-surface-variant">Morning summary of all activity</p>
                  </div>
                  <div class="relative w-12 h-7 bg-primary rounded-full cursor-pointer" onclick="this.classList.toggle('opacity-50')">
                    <div class="absolute right-1 top-1 w-5 h-5 bg-on-primary rounded-full transition-transform"></div>
                  </div>
                </div>

                <!-- Today's Follow-up Toggle -->
                <div class="flex items-center justify-between pt-4 border-t border-outline-variant/10">
                  <div class="flex-1">
                    <p class="font-semibold text-[#163428]">Today's Follow-up</p>
                    <p class="text-sm text-on-surface-variant">Alert before follow-ups are due</p>
                  </div>
                  <div class="relative w-12 h-7 bg-surface-container rounded-full cursor-pointer opacity-50">
                    <div class="absolute left-1 top-1 w-5 h-5 bg-on-surface-variant rounded-full transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Admin Controls Section -->
            <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-8">
              <h2 class="text-xl font-bold text-[#163428] mb-6">Admin Controls</h2>
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <p class="font-semibold text-[#163428]">Enable Team Notifications</p>
                  <p class="text-sm text-on-surface-variant">Send activity summaries to all team members</p>
                </div>
                <div class="relative w-12 h-7 bg-primary rounded-full cursor-pointer">
                  <div class="absolute right-1 top-1 w-5 h-5 bg-on-primary rounded-full transition-transform"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sticky Sidebar -->
          <aside class="lg:col-span-1">
            <div class="sticky top-24 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-xl p-8">
              <h3 class="text-lg font-bold mb-3">Cultivating Focus</h3>
              <p class="text-sm leading-relaxed mb-6">Enable thoughtful notifications that respect your time while keeping you informed on critical lead activity.</p>
              <div class="w-full h-32 rounded-lg mb-6 overflow-hidden bg-on-primary/20">
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f8a9cc88?w=400&h=300&fit=crop" alt="Botanical moss" class="w-full h-full object-cover"/>
              </div>
              <button class="w-full py-2 px-4 bg-on-primary text-primary font-semibold rounded-lg hover:opacity-90 transition-colors cursor-pointer">Send Test Alert</button>
            </div>
          </aside>
        </div>
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#f4f4ef] rounded-t-[2rem] border-t border-[#c1c8c3]/20 shadow-[0_-4px_20px_rgba(22,52,40,0.04)]">
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Dashboard</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#kanban')">
          <span class="material-symbols-outlined">view_kanban</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Pipeline</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined">table_rows</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Leads</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#notifications')">
          <span class="material-symbols-outlined">tune</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Settings</span>
        </a>
      </nav>
    </div>
  `;
}

export function renderTeamManagement() {
  const teamHtml = mockTeam.map((member, index) => {
    const colors = [
      'bg-[#d1e4dd]',
      'bg-[#cce5e0]',
      'bg-[#e8dcc9]',
      'bg-[#d1d9e8]'
    ];
    return `
      <div class="flex items-center justify-between py-6 px-8 border-b border-outline-variant/10 last:border-b-0 hover:bg-surface-container-low/40 transition-colors">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 rounded-full ${colors[index]} flex items-center justify-center text-sm font-bold text-[#163428]">
            ${member.initials}
          </div>
          <div class="flex flex-col">
            <p class="font-semibold text-[#163428]">${member.name}</p>
            <p class="text-xs text-on-surface-variant">${member.email}</p>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter ${member.role === 'Admin' ? 'bg-primary/15 text-primary' : 'bg-surface-container text-on-surface'}">${member.role}</span>
          <div class="flex gap-2">
            <button class="px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer">Edit Role</button>
            <button class="px-3 py-2 text-xs font-semibold text-error/60 hover:text-error hover:bg-error/5 rounded-lg transition-colors cursor-pointer">Deactivate</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="pb-32 md:pb-0">
      <!-- Sidebar Navigation -->
      <aside class="md:w-20 md:fixed md:left-0 md:top-0 md:h-screen md:bg-surface-container-low md:border-r md:border-outline-variant/10 flex md:flex-col items-center md:items-stretch md:justify-start md:pt-6 gap-2 md:gap-6 px-3 py-4 md:px-0">
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">dashboard</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Dashboard</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">person</span>
          <span class="text-[9px] font-medium uppercase md:hidden">My Leads</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">table_rows</span>
          <span class="text-[9px] font-medium uppercase md:hidden">All Leads</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428] font-bold transition-colors py-3 px-4 md:px-0 cursor-pointer md:bg-surface-container rounded-lg" onclick="window.app.navigate('#team')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">group</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Team</span>
        </a>
        <a class="flex md:flex-col items-center justify-center gap-2 md:gap-1 text-[#163428]/60 hover:text-[#163428] transition-colors py-3 px-4 md:px-0 cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined text-5xl md:text-6xl md:text-2xl" style="font-size: 1.5rem;">archive</span>
          <span class="text-[9px] font-medium uppercase md:hidden">Archive</span>
        </a>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 md:ml-20 px-6 pt-8 max-w-4xl">
        <div class="flex justify-between items-center mb-12">
          <h1 class="text-4xl font-serif font-bold text-[#163428]">Team Management</h1>
          <button class="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center gap-2">
            <span class="material-symbols-outlined">add</span>
            Invite New Member
          </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6">
            <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Total Guardians</p>
            <p class="text-3xl font-bold text-[#163428]">24</p>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6">
            <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Admin Level</p>
            <p class="text-3xl font-bold text-[#163428]">04</p>
          </div>
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 p-6">
            <p class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Pending Invites</p>
            <p class="text-3xl font-bold text-[#163428]">02</p>
          </div>
        </div>

        <!-- Team List -->
        <div class="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden mb-12">
          <div class="p-8 border-b border-outline-variant/10 bg-surface-container-high/30">
            <p class="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Team Members</p>
          </div>
          ${teamHtml}
        </div>
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#f4f4ef] rounded-t-[2rem] border-t border-[#c1c8c3]/20 shadow-[0_-4px_20px_rgba(22,52,40,0.04)]">
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#dashboard')">
          <span class="material-symbols-outlined">dashboard</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Dashboard</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#leads')">
          <span class="material-symbols-outlined">table_rows</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Leads</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#team')">
          <span class="material-symbols-outlined">group</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Team</span>
        </a>
        <a class="flex flex-col items-center justify-center text-[#163428]/60 px-5 py-2 hover:text-[#163428] active:scale-90 transition-transform cursor-pointer" onclick="window.app.navigate('#notifications')">
          <span class="material-symbols-outlined">tune</span>
          <span class="font-sans text-[11px] font-medium tracking-wide uppercase mt-1">Settings</span>
        </a>
      </nav>
    </div>
  `;
}
