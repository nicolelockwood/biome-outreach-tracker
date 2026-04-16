import { navHTML } from './dashboard.js';

const STAGES = [
  {
    name: 'New',
    epicName: 'Discovery & Alignment',
    icon: 'search',
    goal: 'Qualify the lead and determine if there is a genuine mission or returns alignment before investing relationship capital.',
    actions: [
      'Research the organisation — mission, portfolio, past giving or investments',
      'Identify the right contact (decision-maker or warm entry point)',
      'Check for mutual connections on LinkedIn or within the Biome network',
      'Draft a compelling, personalised first-touch message',
      'Assign a priority level (High / Med / Low) based on alignment score',
    ],
    template: `Subject: Regenerative Finance — Earthly Ventures

Hi [Name],

I came across [Organisation] through [mutual connection / research] and was struck by your commitment to [specific initiative]. I'm reaching out on behalf of Earthly Ventures — we're building a portfolio of regenerative infrastructure projects that deliver measurable ecological impact alongside strong risk-adjusted returns.

I'd love to explore whether there's a strategic fit. Would you be open to a 20-minute call this month?

Warm regards,
Nicole`,
    watch: 'Don\'t move to "Contacted" until the first real touchpoint is made — not just a LinkedIn view.',
  },
  {
    name: 'Contacted',
    epicName: 'First Touch',
    icon: 'mail',
    goal: 'Open a two-way conversation. Your goal at this stage is a reply — not a yes.',
    actions: [
      'Send initial outreach (email, LinkedIn, warm intro)',
      'Follow up once if no response within 7 days',
      'Log every touchpoint in the interaction timeline',
      'If they reply, capture their key interests and concerns',
      'Qualify: budget authority, timeline, and strategic interest',
    ],
    template: `Subject: Following up — Earthly Ventures

Hi [Name],

I wanted to follow up on my earlier note. I completely understand how busy things get — I'll keep this brief.

Earthly Ventures is currently raising for [specific project/fund]. Given [Organisation]'s focus on [their area], I think there could be a meaningful opportunity worth 20 minutes of conversation.

Happy to work around your schedule — what does the next few weeks look like?

Nicole`,
    watch: 'Three attempts with no response = move to Parked, not abandoned. Note the date and re-visit in 90 days.',
  },
  {
    name: 'Engaged',
    epicName: 'Building Trust',
    icon: 'forum',
    goal: 'Deepen the relationship. Understand what they care about, what their process looks like, and where Earthly fits.',
    actions: [
      'Schedule a proper intro or scoping call',
      'Prepare 3–5 tailored talking points based on their known interests',
      'Ask about their investment or giving criteria, timeline, and decision process',
      'Share relevant proof points (impact reports, case studies, co-investors)',
      'Identify any internal champions or blockers',
      'Agree on a clear next step before ending every call',
    ],
    template: `Subject: Great speaking with you — a few follow-up resources

Hi [Name],

Wonderful to connect. As discussed, I'm attaching [material] which speaks to [their specific interest].

A few things I noted from our conversation that feel relevant:
- [Specific point they raised] — [how Earthly addresses it]
- [Their timeline/process] — [how you can work with it]

I'll reach back out on [date] to continue the conversation. In the meantime, feel free to share any questions.

Looking forward to it,
Nicole`,
    watch: 'Engagement ≠ commitment. Keep nurturing without over-pressuring. Track the quality of conversations, not just the volume.',
  },
  {
    name: 'Meeting Set',
    epicName: 'The Conversation',
    icon: 'calendar_month',
    goal: 'Make the meeting count. Come prepared to listen as much as to present.',
    actions: [
      'Confirm the meeting 24–48 hours beforehand',
      'Research any recent news about the organisation or contact',
      'Prepare a clean, tailored one-pager or short slide deck',
      'Anticipate their top 3 objections and prepare honest responses',
      'Bring a clear ask: what do you want them to commit to after the meeting?',
      'Send a follow-up summary within 24 hours with agreed next steps',
    ],
    template: `Subject: Meeting confirmation + a few things to frame our conversation

Hi [Name],

Looking forward to our meeting on [date/time] at [location / via Zoom].

To make best use of our time, I've attached a brief overview of Earthly's current raise, including the deal structure, target returns, and impact thesis. Happy to tailor the conversation based on what's most relevant to [Organisation].

See you then.
Nicole`,
    watch: 'If you can\'t answer "what\'s the ask?" in one sentence before you walk in — you\'re not ready.',
  },
  {
    name: 'Proposal Sent',
    epicName: 'The Invitation',
    icon: 'description',
    goal: 'Hold the relationship while they deliberate. Your job is to be available, not pushy.',
    actions: [
      'Send the proposal with a personalised cover note — not just an attachment',
      'Set a follow-up date: "I\'ll check back in on [date] — is that OK?"',
      'Answer any questions quickly and thoroughly',
      'If there\'s silence after 2 weeks, a single gentle check-in is appropriate',
      'Start identifying backup options in case this doesn\'t progress',
    ],
    template: `Subject: Earthly Ventures — Proposal for [Organisation]

Hi [Name],

As discussed, please find attached our investment proposal. It includes [brief summary: deal structure, use of proceeds, return profile, impact metrics].

I\'ve also included our most recent impact report and references from current investors happy to speak to their experience.

I\'m available this week for any questions — and I\'ll reach out on [date] to see if you have any feedback after reviewing.

Thank you for your time and consideration.
Nicole`,
    watch: 'Silence after a proposal is normal. Don\'t over-communicate. One follow-up at the agreed time is enough — let them breathe.',
  },
  {
    name: 'Awaiting Response',
    epicName: 'Holding Space',
    icon: 'hourglass_top',
    goal: 'Stay in their peripheral vision without being a nuisance. Keep the door open.',
    actions: [
      'Note the date you last heard from them',
      'If it\'s been 3+ weeks with no response, send one more gentle check-in',
      'Consider sharing a relevant article or insight as a low-pressure touchpoint',
      'After 6 weeks with no response, move to Parked and set a 90-day re-engage reminder',
      'Never burn a relationship — a no today can be a yes in 12 months',
    ],
    template: `Subject: Still here if the timing shifts

Hi [Name],

I hope things are going well at [Organisation]. I wanted to check in — I know these decisions take time, and I want to make sure I\'m being helpful rather than a source of pressure.

If the timing isn\'t right, that\'s completely fine — I\'d just love to keep in touch and revisit when it makes sense.

Is there anything I can share in the meantime that would be useful?

Warmly,
Nicole`,
    watch: 'Know the difference between "considering" and "ghosting". If you genuinely don\'t know — ask directly and kindly.',
  },
  {
    name: 'Secured',
    epicName: 'Partnership Sealed',
    icon: 'verified',
    goal: 'Lock in the commitment and set the relationship up for long-term trust. The deal is just the beginning.',
    actions: [
      'Confirm next steps: legal docs, transfer timeline, reporting cadence',
      'Introduce them to any relevant team members or co-investors',
      'Schedule a first update / impact report delivery date',
      'Send a personal thank-you note within 24 hours of commitment',
      'Ask if they know anyone else who might be a strong fit for Earthly\'s mission',
      'Mark as Secured in the tracker — this counts toward your funding goals!',
    ],
    template: `Subject: Welcome to the Earthly portfolio — and thank you

Hi [Name],

I wanted to take a moment to personally thank you for committing to [project/fund]. This is a meaningful step — for Earthly, for the landscape we\'re regenerating, and for the movement of capital we\'re all trying to shift.

I\'ll be in touch shortly with the next practical steps. In the meantime, please don\'t hesitate to reach out with any questions.

With genuine gratitude,
Nicole`,
    watch: 'A secured investor or philanthropist is your warmest future referral source. Treat every update as a relationship investment.',
  },
];

export function renderStrategy(navigate) {
  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('strategy')}

      <!-- Glass hero band — frosted forest green, canopy shows through -->
      <div class="text-white py-14 mb-10" style="background: rgba(20,52,42,0.75); backdrop-filter: blur(20px) saturate(1.2); -webkit-backdrop-filter: blur(20px) saturate(1.2); border-bottom: 1px solid rgba(255,255,255,0.08);">
        <div class="max-w-5xl mx-auto px-6">
          <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-3">Sales Playbook</p>
          <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold leading-tight mb-4">Pipeline Strategy</h1>
          <p class="text-white/65 text-base max-w-2xl leading-relaxed">
            Stage-by-stage guidance for converting ecological capital conversations into committed relationships. Treat every interaction as a trust deposit, not a transaction.
          </p>
        </div>
      </div>

      <main class="max-w-5xl mx-auto px-6 pb-16">

        <!-- Stages — all start closed, uniform glassmorphism -->
        <div class="space-y-5">
          ${STAGES.map((s, i) => {
            const isSecured = s.name === 'Secured';
            return `
          <details class="group rounded-2xl overflow-hidden" style="border: 1.5px solid rgba(255,255,255,0.35); box-shadow: 0 2px 12px rgba(20,52,42,0.06);">
            <summary class="flex items-center gap-5 p-6 cursor-pointer list-none hover:opacity-95 transition-all" style="background: rgba(255,255,255,0.75); backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);">
              <!-- Stage number -->
              <div class="text-3xl font-bold text-ink-ghost/20 shrink-0 w-8 text-center" style="font-family:'Fraunces',Georgia,serif;">${i + 1}</div>
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(255,255,255,0.80); backdrop-filter: blur(4px);">
                <span class="material-symbols-outlined text-forest text-xl" style="font-variation-settings:'FILL' 1;">${s.icon}</span>
              </div>
              <div class="flex-1">
                <!-- Epic name is the feature now -->
                <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-xl font-semibold text-forest leading-snug">${s.epicName}</h3>
                <div class="flex items-center gap-3 mt-1.5">
                  <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-stage-pipeline-bg text-stage-pipeline">${s.name}</span>
                  <p class="text-xs text-ink-soft leading-snug line-clamp-1">${s.goal.slice(0, 80)}${s.goal.length > 80 ? '…' : ''}</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-ink-ghost group-open:rotate-180 transition-transform duration-200">expand_more</span>
            </summary>

            <div class="p-7 space-y-6" style="background: rgba(255,255,255,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1.5px solid rgba(20,52,42,0.06);">

              <!-- Goal -->
              <div class="rounded-xl p-5 border-l-4 border-l-canopy" style="background: rgba(61,139,99,0.06);">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Stage Goal</p>
                <p class="text-sm text-ink-mid leading-relaxed font-medium">${s.goal}</p>
              </div>

              <!-- Actions + Watch -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Key Actions</p>
                  <ul class="space-y-2.5">
                    ${s.actions.map(a => `
                    <li class="flex items-start gap-2.5 text-sm text-ink-mid">
                      <span class="material-symbols-outlined text-canopy text-base shrink-0 mt-0.5" style="font-variation-settings:'FILL' 1;">check_circle</span>
                      ${a}
                    </li>`).join('')}
                  </ul>
                </div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Watch Out For</p>
                  <div class="bg-error-bg border border-error/15 rounded-xl p-4">
                    <div class="flex items-start gap-2.5">
                      <span class="material-symbols-outlined text-error text-base shrink-0 mt-0.5">warning</span>
                      <p class="text-sm text-ink-mid leading-relaxed">${s.watch}</p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <button class="text-xs font-bold text-forest hover:text-canopy transition-colors cursor-pointer flex items-center gap-1.5"
                      onclick="window.app.navigate('#add-lead')">
                      <span class="material-symbols-outlined text-sm">add_circle</span>
                      Add a ${s.name} Lead →
                    </button>
                  </div>
                </div>
              </div>

              <!-- Email template -->
              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Template Message</p>
                <div class="rounded-xl p-5 relative" style="background: rgba(20,52,42,0.05);">
                  <pre class="text-xs text-ink-mid leading-relaxed whitespace-pre-wrap font-mono">${s.template}</pre>
                  <button class="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-white border border-border-soft rounded-lg text-[10px] font-bold text-ink-soft hover:text-forest hover:border-forest transition-colors cursor-pointer"
                    onclick="(function(){
                      const t = this.closest('.relative').querySelector('pre').textContent;
                      navigator.clipboard.writeText(t).then(()=>{
                        this.innerHTML = '<span class=\\'material-symbols-outlined text-xs\\'>check</span> Copied';
                        setTimeout(()=>{this.innerHTML = '<span class=\\'material-symbols-outlined text-xs\\'>content_copy</span> Copy'},2000);
                      });
                    }).call(this)">
                    <span class="material-symbols-outlined text-xs">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>

            </div>
          </details>
          `}).join('')}
        </div>

        <!-- Footer note -->
        <div class="mt-12 p-6 rounded-2xl card-warm">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-copper text-xl shrink-0 mt-0.5" style="font-variation-settings:'FILL' 1;">eco</span>
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-copper mb-2">Remember</p>
              <p class="text-sm text-ink-mid leading-relaxed">
                Every lead is a person, not a number. The most successful capital conversations happen when people feel genuinely understood and respected — not processed. Move at the pace of trust, not the pace of your timeline.
              </p>
            </div>
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
        <a class="flex flex-col items-center gap-1 px-3 py-2 text-ink-soft hover:text-forest cursor-pointer" onclick="window.app.navigate('#calendar')">
          <span class="material-symbols-outlined text-xl">calendar_today</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Tasks</span>
        </a>
        <a class="flex flex-col items-center gap-1 px-3 py-2 rounded-xl bg-forest text-white cursor-pointer" onclick="window.app.navigate('#strategy')">
          <span class="material-symbols-outlined text-xl" style="font-variation-settings:'FILL' 1;">auto_stories</span>
          <span class="text-[9px] font-bold uppercase tracking-wider">Strategy</span>
        </a>
      </nav>
    </div>
  `;
}
