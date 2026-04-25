// Pipeline Strategy — dual-track playbook.
// Two tracks of guidance: Philanthropy and Investors. Nicole toggles between
// them at the top. The lens (when set) auto-selects the matching track on
// first render; otherwise localStorage remembers her last choice.

import { navHTML } from './dashboard.js';

// ─── PHILANTHROPY TRACK ─────────────────────────────────────────────
const PHIL_STAGES = [
  {
    name: 'New',
    epicName: 'Discovery & Alignment',
    icon: 'search',
    goal: 'Qualify the lead and determine if there is a genuine mission alignment before investing relationship capital.',
    actions: [
      'Research the foundation — giving history, areas of focus, public commitments',
      'Identify the right contact (decision-maker, programme officer, or warm entry point)',
      "Check for mutual connections on LinkedIn or within Biome's network",
      'Draft a compelling, personalised first-touch message centred on shared values',
      'Assign a priority level (High / Med / Low) based on alignment score',
    ],
    template: "Subject: Regenerative Finance — Earthly Ventures\n\nHi [Name],\n\nI came across [Organisation] through [mutual connection / research] and was struck by your commitment to [specific initiative]. I'm reaching out on behalf of Earthly Ventures — we're building a portfolio of regenerative infrastructure projects that deliver measurable ecological impact alongside long-term resilience.\n\nGiven [Foundation]'s focus on [their cause area], I think there could be a meaningful conversation worth exploring. Would you be open to a 20-minute call this month?\n\nWarm regards,\nNicole",
    watch: "Don't move to \"Contacted\" until the first real touchpoint is made — not just a LinkedIn view.",
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
      'Qualify: budget authority, timeline, and strategic alignment',
    ],
    template: "Subject: Following up — Earthly Ventures\n\nHi [Name],\n\nI wanted to follow up on my earlier note. I completely understand how busy things get — I'll keep this brief.\n\nEarthly Ventures is currently raising for [specific project/fund]. Given [Foundation]'s focus on [their area], I think there could be a meaningful opportunity worth 20 minutes of conversation.\n\nHappy to work around your schedule — what does the next few weeks look like?\n\nNicole",
    watch: 'Three attempts with no response = move to Parked, not abandoned. Note the date and re-visit in 90 days.',
  },
  {
    name: 'Engaged',
    epicName: 'Building Trust',
    icon: 'forum',
    goal: 'Deepen the relationship. Understand what they care about, what their giving process looks like, and where Earthly fits.',
    actions: [
      'Schedule a proper intro or scoping call',
      'Prepare 3–5 tailored talking points based on their known interests',
      'Ask about their giving criteria, timeline, and decision process',
      'Share relevant proof points (impact reports, case studies, co-funders)',
      'Identify any internal champions or blockers',
      'Agree on a clear next step before ending every call',
    ],
    template: "Subject: Great speaking with you — a few follow-up resources\n\nHi [Name],\n\nWonderful to connect. As discussed, I'm attaching [material] which speaks to [their specific interest].\n\nA few things I noted from our conversation that feel relevant:\n- [Specific point they raised] — [how Earthly addresses it]\n- [Their timeline/process] — [how you can work with it]\n\nI'll reach back out on [date] to continue the conversation. In the meantime, feel free to share any questions.\n\nLooking forward to it,\nNicole",
    watch: 'Engagement ≠ commitment. Keep nurturing without over-pressuring. Track the quality of conversations, not just the volume.',
  },
  {
    name: 'Meeting Set',
    epicName: 'The Conversation',
    icon: 'calendar_month',
    goal: 'Make the meeting count. Come prepared to listen as much as to present.',
    actions: [
      'Confirm the meeting 24–48 hours beforehand',
      'Research any recent news about the foundation or contact',
      'Prepare a clean, tailored one-pager or short slide deck',
      'Anticipate their top 3 questions and prepare honest responses',
      'Bring a clear ask: what do you want them to commit to after the meeting?',
      'Send a follow-up summary within 24 hours with agreed next steps',
    ],
    template: "Subject: Meeting confirmation + a few things to frame our conversation\n\nHi [Name],\n\nLooking forward to our meeting on [date/time] at [location / via Zoom].\n\nTo make best use of our time, I've attached a brief overview of Earthly's current raise, including the impact thesis, project structure, and funding model. Happy to tailor the conversation based on what's most relevant to [Foundation].\n\nSee you then.\nNicole",
    watch: "If you can't answer \"what's the ask?\" in one sentence before you walk in — you're not ready.",
  },
  {
    name: 'Proposal Sent',
    epicName: 'The Invitation',
    icon: 'description',
    goal: 'Hold the relationship while they deliberate. Your job is to be available, not pushy.',
    actions: [
      'Send the proposal with a personalised cover note — not just an attachment',
      "Set a follow-up date: \"I'll check back in on [date] — is that OK?\"",
      'Answer any questions quickly and thoroughly',
      "If there's silence after 2 weeks, a single gentle check-in is appropriate",
      "Start identifying backup options in case this doesn't progress",
    ],
    template: "Subject: Earthly Ventures — Proposal for [Foundation]\n\nHi [Name],\n\nAs discussed, please find attached our funding proposal. It includes [brief summary: project structure, use of funds, impact metrics, reporting cadence].\n\nI've also included our most recent impact report and references from current partner foundations happy to speak to their experience.\n\nI'm available this week for any questions — and I'll reach out on [date] to see if you have any feedback after reviewing.\n\nThank you for your time and consideration.\nNicole",
    watch: "Silence after a proposal is normal. Don't over-communicate. One follow-up at the agreed time is enough — let them breathe.",
  },
  {
    name: 'Awaiting Response',
    epicName: 'Holding Space',
    icon: 'hourglass_top',
    goal: 'Stay in their peripheral vision without being a nuisance. Keep the door open.',
    actions: [
      'Note the date you last heard from them',
      "If it's been 3+ weeks with no response, send one more gentle check-in",
      'Consider sharing a relevant article or insight as a low-pressure touchpoint',
      'After 6 weeks with no response, move to Parked and set a 90-day re-engage reminder',
      'Never burn a relationship — a no today can be a yes in 12 months',
    ],
    template: "Subject: Still here if the timing shifts\n\nHi [Name],\n\nI hope things are going well at [Foundation]. I wanted to check in — I know these decisions take time, and I want to make sure I'm being helpful rather than a source of pressure.\n\nIf the timing isn't right, that's completely fine — I'd just love to keep in touch and revisit when it makes sense.\n\nIs there anything I can share in the meantime that would be useful?\n\nWarmly,\nNicole",
    watch: "Know the difference between \"considering\" and \"ghosting\". If you genuinely don't know — ask directly and kindly.",
  },
  {
    name: 'Secured',
    epicName: 'Partnership Sealed',
    icon: 'verified',
    goal: 'Lock in the commitment and set the relationship up for long-term trust. The grant is just the beginning.',
    actions: [
      'Confirm next steps: legal docs, transfer timeline, reporting cadence',
      'Introduce them to any relevant team members or co-funders',
      'Schedule a first update / impact report delivery date',
      'Send a personal thank-you note within 24 hours of commitment',
      "Ask if they know anyone else who might be a strong fit for Earthly's mission",
      'Mark as Secured in the tracker — this counts toward your funding goals!',
    ],
    template: "Subject: Welcome to the Earthly partnership — and thank you\n\nHi [Name],\n\nI wanted to take a moment to personally thank you for committing to [project/fund]. This is a meaningful step — for Earthly, for the landscape we're regenerating, and for the movement of capital we're all trying to shift.\n\nI'll be in touch shortly with the next practical steps. In the meantime, please don't hesitate to reach out with any questions.\n\nWith genuine gratitude,\nNicole",
    watch: 'A secured philanthropic partner is your warmest future referral source. Treat every update as a relationship investment.',
  },
];

// ─── INVESTOR TRACK ─────────────────────────────────────────────────
const INV_STAGES = [
  {
    name: 'New',
    epicName: 'Sourcing & Thesis Fit',
    icon: 'search',
    goal: "Qualify the investor against Earthly's thesis. Don't pitch — qualify.",
    actions: [
      'Research the firm — fund size, ticket range, sector focus, recent deployments',
      'Identify the right contact (partner, principal, or thematic lead in nature/climate)',
      'Check for portfolio fit: do they invest in regenerative infrastructure / nature-based assets?',
      'Map mutual investors, LPs, or operators on LinkedIn or Crunchbase',
      'Set priority (High / Med / Low) based on thesis fit, ticket alignment, and warm-intro availability',
    ],
    template: "Subject: Earthly Ventures — Regenerative Infrastructure Thesis\n\nHi [Name],\n\nI'm Nicole Lockwood, founder of Earthly Ventures. I came across [Firm] through [mutual contact / portfolio research] and noticed your work in [climate / nature / infrastructure].\n\nWe're raising [Fund/Round] for a portfolio of regenerative infrastructure projects targeting [target IRR / impact metric]. Given [Firm]'s thesis on [their area], I think there's enough overlap to warrant a 20-minute conversation.\n\nHappy to share a one-pager and find time that works.\n\nBest,\nNicole",
    watch: "Don't move to \"Contacted\" until the first real touchpoint is made — a generic mass email doesn't count.",
  },
  {
    name: 'Contacted',
    epicName: 'First Outreach',
    icon: 'mail',
    goal: 'Get a reply — preferably with a specific reaction to the thesis. Reply quality > reply speed.',
    actions: [
      'Send initial outreach (warm intro >> email >> LinkedIn)',
      'Follow up once if no response within 7 days — keep it short, add a single new piece of signal',
      'Log every touchpoint with response quality noted',
      'Qualify against their stated process (cold inbound vs warm intro vs thesis-led)',
      'Capture any pushback or curiosity in the interaction notes',
    ],
    template: "Subject: Following up — Earthly Ventures thesis\n\nHi [Name],\n\nFollowing up on my earlier note. Quick recap: we're raising [round] at [stage], targeting [IRR / impact return profile], with [N] live projects in regenerative infrastructure (kelp, mangroves, soil carbon, etc.).\n\nI noticed [Firm] recently [signal — portfolio move / fund close / thesis post]. Felt worth one more nudge given the alignment.\n\n20 minutes — would [day options] work?\n\nNicole",
    watch: 'Three attempts with no response = move to Parked, not abandoned. Note the date and re-visit when you have new signal (closed round, new project, anchor LP).',
  },
  {
    name: 'Engaged',
    epicName: 'Initial Diligence',
    icon: 'analytics',
    goal: 'Understand their diligence process and surface the data they need. Move from interested to evaluating.',
    actions: [
      'Schedule a proper intro / thesis call (45 mins, expect partner-level)',
      'Prepare your top 5 deal facts: structure, IRR, ticket sizes, cap table, anchor LPs',
      'Ask about their diligence process, IC cadence, and timeline to decision',
      'Share the data room link or one-pager — track who opens what',
      'Get reference investors lined up — second-fund LPs are gold',
      'Identify their internal champion and any blockers (gatekeepers, IC bottlenecks)',
    ],
    template: "Subject: Earthly Ventures — diligence resources for your review\n\nHi [Name],\n\nGreat call. As promised, here's the data room with:\n- Pitch deck + financial model\n- Project portfolio summary (LOIs, status, projected returns)\n- Reference list — happy to introduce you to [N] of our current investors\n- Term sheet template (not yet finalised, indicative)\n\nA few things I picked up from our conversation:\n- [Their thesis alignment point] — [our matching strength]\n- [Their concern / question] — [direct response or proof point]\n\nSuggested next step: [their stated process — second meeting, IC pre-read, partner intro]. I'll follow up on [date] unless you'd prefer a different cadence.\n\nNicole",
    watch: "Engaged investors test the deal. Don't over-promise — every claim becomes a diligence question later. Be the source of truth.",
  },
  {
    name: 'Meeting Set',
    epicName: 'The Pitch',
    icon: 'calendar_month',
    goal: 'Run a tight, partner-ready pitch. Anticipate the no, address it before they raise it.',
    actions: [
      'Confirm 24–48 hours beforehand and reconfirm attendees (partners? IC?)',
      'Research recent firm activity — what have they deployed into in the last 90 days?',
      "Tailor the deck to their thesis — drop slides that don't serve the room",
      'Pre-empt the top 3 objections with honest, data-backed responses',
      'Bring a clear ask: indicative interest? Term sheet by [date]? Anchor commitment?',
      'Send a follow-up email within 24 hours with: deck, model, references, agreed next steps',
    ],
    template: "Subject: Pitch confirmation + materials\n\nHi [Name],\n\nLooking forward to [date/time] with [attendees]. As prep:\n\n- Updated deck attached\n- Financial model link: [link]\n- Two reference investors available this week: [names]\n\nI'll come ready to walk through the thesis, project pipeline, and deal structure. Happy to drill into any specific area first — let me know if there's a topic you'd like me to lead with.\n\nNicole",
    watch: "If you can't state your ask in one sentence — \"We're raising $X at $Y valuation, seeking commitments by [date]\" — you're not ready.",
  },
  {
    name: 'Proposal Sent',
    epicName: 'The Term Sheet',
    icon: 'description',
    goal: 'Get to a soft yes or a clean no. Both are valuable. Avoid maybes that drag for months.',
    actions: [
      'Send the term sheet with a personalised cover note — not just an attachment',
      "Set a follow-up date: \"I'll check in on [date] for any feedback or red lines\"",
      'Answer red-line questions within 24 hours — speed signals seriousness',
      'If silence after 10 business days, a single direct check-in is appropriate',
      "Identify your back-up investors so you're negotiating from strength, not desperation",
    ],
    template: "Subject: Earthly Ventures — Term Sheet for [Firm]\n\nHi [Name],\n\nAs discussed, please find the indicative term sheet attached. Headline terms:\n- Ticket: [size]\n- Structure: [equity / convertible / direct project]\n- Target IRR: [%]\n- Anchor LP / co-investor signals: [names if disclosable]\n\nI've also re-attached the latest model and reference list. Happy to walk through any clauses with your legal team — we've kept the structure intentionally clean.\n\nI'll check in on [date] unless you have feedback before then.\n\nBest,\nNicole",
    watch: "Silence after a term sheet is normal — but don't mistake it for a yes. One follow-up, then it's their move.",
  },
  {
    name: 'Awaiting Response',
    epicName: 'Under Review',
    icon: 'hourglass_top',
    goal: 'Stay top-of-mind without crowding their IC process. Drop signal, not pressure.',
    actions: [
      "Note when their IC meets — that's your real timeline",
      'If 3+ weeks with no response, send one substantive update: project milestone, new LP, press mention',
      "Don't share generic \"checking in\" — every touchpoint should be new information",
      'After 6 weeks of silence, move to Parked with a 90-day re-engage trigger (new round, new milestone)',
      'A polite "no for now" is a yes for next round if you stay in their orbit',
    ],
    template: "Subject: Earthly Ventures — quick update\n\nHi [Name],\n\nQuick update from our side — wanted to keep you in the loop without crowding your process:\n\n- [Recent milestone — closed sub-round, signed anchor LP, project went live]\n- [Press / signal — feature, award, regulatory progress]\n- [Timing note — IC date / round close target]\n\nNo action needed. Reach out if you have questions or if there's anything I can prep for your next IC.\n\nNicole",
    watch: "Read the difference between \"still evaluating\" and \"polite ghosting\". If unsure, ask directly: \"What would unblock a yes or no?\"",
  },
  {
    name: 'Secured',
    epicName: 'Capital Committed',
    icon: 'verified',
    goal: 'Close the wire and convert this investor into a champion for the next round.',
    actions: [
      'Confirm sub docs, wire timing, and reporting cadence in writing',
      'Introduce them to portfolio operators and other LPs where useful',
      'Schedule the first quarterly update / project update call',
      'Send a personal thank-you within 24 hours of wire confirmation',
      'Ask the close question: "Who else in your network should know about this?"',
      'Mark as Secured in the tracker — this counts toward your $100M target!',
    ],
    template: "Subject: Welcome to Earthly — and thank you\n\nHi [Name],\n\nWire confirmed — thank you. This is a meaningful commitment, and I don't take it lightly.\n\nNext steps from our side:\n- Sub docs filed, share certificate / unit register updated this week\n- First quarterly update on [date]\n- I'd love to introduce you to [portfolio operator] and [co-investor] if useful\n\nWhen you're ready, I'd genuinely value the warm intros to others in your network who care about this thesis. Earthly grows on the strength of relationships like yours.\n\nWith gratitude,\nNicole",
    watch: 'A committed LP is your highest-conversion source for Round 2. Treat the post-close relationship like the deal isn\'t done.',
  },
];

const TRACKS = {
  Philanthropy: { stages: PHIL_STAGES, label: 'Philanthropy', icon: 'volunteer_activism', accent: '#5a8a4a', tagline: 'Stage-by-stage guidance for converting mission-aligned conversations into committed philanthropic partnerships. Move at the pace of trust.' },
  Investors:    { stages: INV_STAGES,  label: 'Investors',    icon: 'trending_up',         accent: '#2a6a5a', tagline: 'Stage-by-stage guidance for converting investor conversations into committed capital. Disciplined process, premium relationships.' },
};

function getTrack(lens) {
  if (lens === 'Investors') return 'Investors';
  if (lens === 'Philanthropy') return 'Philanthropy';
  try { return localStorage.getItem('biome-strategy-track') || 'Philanthropy'; }
  catch (e) { return 'Philanthropy'; }
}

export function renderStrategy(navigate, lens = 'all') {
  const track = getTrack(lens);
  const config = TRACKS[track];
  const STAGES = config.stages;

  return `
    <div class="min-h-screen pb-24 md:pb-0">
      ${navHTML('strategy')}

      <main class="max-w-5xl mx-auto px-6 pb-16">

        <section class="pt-10 mb-8">
          <p class="text-[11px] font-bold uppercase tracking-[0.15em] text-white/40 mb-3">Sales Playbook</p>
          <h1 style="font-family:'Fraunces',Georgia,serif;" class="text-5xl font-semibold text-white drop-shadow-sm leading-tight mb-4">Pipeline Strategy</h1>
          <p class="text-white/60 text-base max-w-2xl leading-relaxed">${config.tagline}</p>
        </section>

        <div class="mb-10 inline-flex rounded-2xl p-1.5" style="background: rgba(255,255,255,0.78); backdrop-filter: blur(20px) saturate(1.4); -webkit-backdrop-filter: blur(20px) saturate(1.4); border: 1px solid rgba(255,255,255,0.4); box-shadow: 0 2px 12px rgba(20,52,42,0.08);">
          ${['Philanthropy', 'Investors'].map(t => {
            const isActive = track === t;
            const tCfg = TRACKS[t];
            return `
            <button type="button"
              class="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isActive ? 'bg-forest text-white shadow-md' : 'text-ink-soft hover:text-forest'}"
              onclick="window.setStrategyTrack('${t}')">
              <span class="material-symbols-outlined text-base" style="font-variation-settings:'FILL' ${isActive ? '1' : '0'};">${tCfg.icon}</span>
              ${tCfg.label} Track
            </button>`;
          }).join('')}
        </div>

        <div class="space-y-5">
          ${STAGES.map((s, i) => {
            return `
          <details class="group rounded-2xl overflow-hidden" style="border: 1.5px solid rgba(255,255,255,0.35); box-shadow: 0 2px 12px rgba(20,52,42,0.06);">
            <summary class="flex items-center gap-5 p-6 cursor-pointer list-none hover:opacity-95 transition-all" style="background: rgba(255,255,255,0.75); backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3);">
              <div class="text-3xl font-bold text-ink-ghost/20 shrink-0 w-8 text-center" style="font-family:'Fraunces',Georgia,serif;">${i + 1}</div>
              <div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style="background: rgba(255,255,255,0.80); backdrop-filter: blur(4px);">
                <span class="material-symbols-outlined text-forest text-xl" style="font-variation-settings:'FILL' 1;">${s.icon}</span>
              </div>
              <div class="flex-1">
                <h3 style="font-family:'Fraunces',Georgia,serif;" class="text-xl font-semibold text-forest leading-snug">${s.epicName}</h3>
                <div class="flex items-center gap-3 mt-1.5">
                  <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-stage-pipeline-bg text-stage-pipeline">${s.name}</span>
                  <p class="text-xs text-ink-soft leading-snug line-clamp-1">${s.goal.slice(0, 80)}${s.goal.length > 80 ? '…' : ''}</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-ink-ghost group-open:rotate-180 transition-transform duration-200">expand_more</span>
            </summary>

            <div class="p-7 space-y-6" style="background: rgba(255,255,255,0.88); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border-top: 1.5px solid rgba(20,52,42,0.06);">

              <div class="rounded-xl p-5 border-l-4 border-l-canopy" style="background: rgba(61,139,99,0.06);">
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-2">Stage Goal</p>
                <p class="text-sm text-ink-mid leading-relaxed font-medium">${s.goal}</p>
              </div>

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
                    <button class="text-xs font-bold text-forest hover:text-canopy transition-colors cursor-pointer flex items-center gap-1.5" onclick="window.app.navigate('#add-lead')">
                      <span class="material-symbols-outlined text-sm">add_circle</span>
                      Add a ${s.name} Lead →
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <p class="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-ghost mb-3">Template Message</p>
                <div class="rounded-xl p-5 relative" style="background: rgba(20,52,42,0.05);">
                  <pre class="text-xs text-ink-mid leading-relaxed whitespace-pre-wrap font-mono">${s.template}</pre>
                  <button class="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1.5 bg-white border border-border-soft rounded-lg text-[10px] font-bold text-ink-soft hover:text-forest hover:border-forest transition-colors cursor-pointer"
                    onclick="(function(btn){ const t = btn.closest('.relative').querySelector('pre').textContent; navigator.clipboard.writeText(t).then(function(){ btn.innerHTML = '<span class=&quot;material-symbols-outlined text-xs&quot;>check</span> Copied'; setTimeout(function(){btn.innerHTML = '<span class=&quot;material-symbols-outlined text-xs&quot;>content_copy</span> Copy'},2000); }); })(this)">
                    <span class="material-symbols-outlined text-xs">content_copy</span>
                    Copy
                  </button>
                </div>
              </div>

            </div>
          </details>
          `}).join('')}
        </div>

        <div class="mt-12 p-6 rounded-2xl" style="background: rgba(255,255,255,0.72); backdrop-filter: blur(16px) saturate(1.3); -webkit-backdrop-filter: blur(16px) saturate(1.3); border: 1.5px solid rgba(255,255,255,0.35); box-shadow: 0 2px 12px rgba(20,52,42,0.06);">
          <div class="flex items-start gap-3">
            <span class="material-symbols-outlined text-canopy text-xl shrink-0 mt-0.5" style="font-variation-settings:'FILL' 1;">eco</span>
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-canopy mb-2">Remember</p>
              <p class="text-sm text-ink-mid leading-relaxed">
                ${track === 'Philanthropy'
                  ? 'Every lead is a person, not a number. The most successful capital conversations happen when people feel genuinely understood and respected — not processed. Move at the pace of trust, not the pace of your timeline.'
                  : 'Every investor wants two things: a credible operator and a defensible thesis. Be tight on the data, generous with the relationship, and disciplined about the close. The deal is where it starts, not where it ends.'}
              </p>
            </div>
          </div>
        </div>

      </main>

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
