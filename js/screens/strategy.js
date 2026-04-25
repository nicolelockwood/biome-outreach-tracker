// Pipeline Strategy — dual-track playbook.
// Two tracks of guidance: Philanthropy and Investors. Nicole toggles between
// them at the top. The lens (when set) auto-selects the matching track on
// first render; otherwise localStorage remembers her last choice.

import { navHTML } from './dashboard.js';

// ─── PHILANTHROPY TRACK ─────────────────────────────────────────────
// Mission, alignment, legacy, trust. Pace of relationship over pace of timeline.
const PHIL_STAGES = [
  {
    name: 'New',
    epicName: 'Discovery & Alignment',
    icon: 'search',
    goal: 'Qualify the lead and determine if there is a genuine mission alignment before investing relationship capital.',
    actions: [
      'Research the foundation — giving history, areas of focus, public commitments',
      'Identify the right contact (decision-maker, programme officer, or warm entry point)',
      'Check for mutual connections on LinkedIn or within Biome\'s network',
      'Draft a compelling, personalised first-touch message centred on shared values',
      'Assign a priority level (High / Med / Low) based on alignment score',
    ],
    template: `Subject: Regenerative Finance — Earthly Ventures

Hi [Name],

I came across [Organisation] through [mutual connection / research] and was struck by your commitment to [specific initiative]. I'm reaching out on behalf of Earthly Ventures — we're building a portfolio of regenerative infrastructure projects that deliver measurable ecological impact alongside long-term resilience.

Given [Foundation]'s focus on [their cause area], I think there could be a meaningful conversation worth exploring. Would you be open to a 20-minute call this month?

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
      'Qualify: budget authority, timeline, and strategic alignment',
    ],
    template: `Subject: Following up — Earthly Ventures

Hi [Name],

I wanted to follow up on my earlier note. I completely understand how busy things get — I'll keep this brief.

Earthly Ventures is currently raising for [specific project/fund]. Given [Foundation]'s focus on [their area], I think there could be a meaningful opportunity worth 20 minutes of conversation.

Happy to work around your schedule — what does the next few weeks look like?

Nicole`,
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
      'Research any recent news about the foundation or contact',
      'Prepare a clean, tailored one-pager or short slide deck',
      'Anticipate their top 3 questions and prepare honest responses',
      'Bring a clear ask: what do you want them to commit to after the meeting?',
      'Send a follow-up summary within 24 hours with agreed next steps',
    ],
    template: `Subject: Meeting confirmation + a few things to frame our conversation

Hi [Name],

Looking forward to our meeting on [date/time] at [location / via Zoom].

To make best use of our time, I've attached a brief overview of Earthly's current raise, including the impact thesis, project structure, and funding model. Happy to tailor the conversation based on what's most relevant to [Foundation].

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
    template: `Subject: Earthly Ventures — Proposal for [Foundation]

Hi [Name],

As discussed, please find attached our funding proposal. It includes [brief summary: project structure, use of funds, impact metrics, reporting cadence].

I've also included our most recent impact report and references from current partner foundations happy to speak to their experience.

I'm available this week for any questions — and I'll reach out on [date] to see if you have any feedback after reviewing.

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

I hope things are going well at [Foundation]. I wanted to check in — I know these decisions take time, and I want to make sure I'm being helpful rather than a source of pressure.

If the timing isn't right, that's completely fine — I'd just love to keep in touch and revisit when it makes sense.

Is there anything I can share in the meantime that would be useful?

Warmly,
Nicole`,
    watch: 'Know the difference between "considering" and "ghosting". If you genuinely don\'t know — ask directly and kindly.',
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
      'Ask if they know anyone else who might be a strong fit for Earthly\'s mission',
      'Mark as Secured in the tracker — this counts toward your funding goals!',
    ],
    template: `Subject: Welcome to the Earthly partnership — and thank you

Hi [Name],

I wanted to take a moment to personally thank you for committing to [project/fund]. This is a meaningful step — for Earthly, for the landscape we're regenerating, and for the movement of capital we're all trying to shift.

I'll be in touch shortly with the next practical steps. In the meantime, please don't hesitate to reach out with any questions.

With genuine gratitude,
Nicole`,
    watch: 'A secured philanthropic partner is your warmest future referral source. Treat every update as a relationship investment.',
  },
];

// ─── INVESTOR TRACK ─────────────────────────────────────────────────
// Returns, risk-adjusted thesis, diligence, deal structure, close.
// Different language, different pace, different priorities. Same architecture.
const INV_STAGES = [
  {
    name: 'New',
    epicName: 'Sourcing & Thesis Fit',
    icon: 'search',
    goal: 'Qualify the investor against Earthly\'s thesis. Don\'t pitch — qualify.',
    actions: [
      'Research the firm — fund size, ticket range, sector focus, recent deployments',
      'Identify the right contact (partner, principal, or thematic lead in nature/climate)',
      'Check for portfolio fit: do they invest in regenerative infrastructure / nature-based assets?',
      'Map mutual investors, LPs, or operators on LinkedIn or Crunchbase',
      'Set priority (High / Med / Low) based on thesis fit, ticket alignment, and warm-intro availability',
    ],
    template: `Subject: Earthly Ventures — Regenerative Infrastructure Thesis

Hi [Name],

I'm Nicole Lockwood, founder of Earthly Ventures. I came across [Firm] through [mutual contact / portfolio research] and noticed your work in [climate / nature / infrastructure].

We're raising [Fund/Round] for a portfolio of regenerative infrastructure projects targeting [target IRR / impact metric]. Given [Firm]'s thesis on [their area], I think there's enough overlap to warrant a 20-minute conversation.

Happy to share a one-pager and find time that works.

Best,
Nicole`,
    watch: 'Don\'t move to "Contacted" until the first real touchpoint is made — a generic mass email doesn\'t count.',
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
    template: `Subject: Following up — Earthly Ventures thesis

Hi [Name],

Following up on my earlier note. Quick recap: we're raising [round] at [stage], targeting [IRR / impact return profile], with [N] live projects in regenerative infrastructure (kelp, mangroves, soil carbon, etc.).

I noticed [Firm] recently [signal — portfolio move / fund close / thesis post]. Felt worth one more nudge given the alignment.

20 minutes — would [day options] work?

Nicole`,
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
    template: `Subject: Earthly Ventures — diligence resources for your review

Hi [Name],

Great call. As promised, here's the data room with:
- Pitch deck + financial model
- Project portfolio summary (LOIs, status, projected returns)
- Reference list — happy to introduce you to [N] of our current investors
- Term sheet template (not yet finalised, indicative)

A few things I picked up from our conversation:
- [Their thesis alignment point] — [our matching strength]
- [Their concern / question] — [direct response or proof point]

Suggested next step: [their stated process — second meeting, IC pre-read, partner intro]. I'll follow up on [date] unless you'd prefer a different cadence.

Nicole`,
    watch: 'Engaged investors test the deal. Don\'t over-promise — every claim becomes a diligence question later. Be the source of truth.',
  },
  {
    name: 'Meeting Set',
    epicName: 'The Pitch',
    icon: 'calendar_month',
    goal: 'Run a tight, partner-ready pitch. Anticipate the no, address it before they raise it.',
    actions: [
      'Confirm 24–48 hours beforehand and reconfirm attendees (partners? IC?)',
      'Research recent firm activity — what have they deployed into in the last 90 days?',
      'Tailor the deck to their thesis — drop slides that don\'t serve the room',
      'Pre-empt the top 3 objections with honest, data-backed responses',
      'Bring a clear ask: indicative interest? Term sheet by [date]? Anchor commitment?',
      'Send a follow-up email within 24 hours with: deck, model, references, agreed next steps',
    ],
    template: `Subject: Pitch confirmation + materials

Hi [Name],

Looking forward to [date/time] with [attendees]. As prep:

- Updated deck attached
- Financial model link: [link]
- Two reference investors available this week: [names]

I'll come ready to walk through the thesis, project pipeline, and deal structure. Happy to drill into any specific area first — let me know if there's a topic you'd like me to lead with.

Nicole`,
    watch: 'If you can\'t state your ask in one sentence — "We\'re raising $X at $Y valuation, seeking commitments by [date]" — you\'re not ready.',
  },
  {
    name: 'Proposal Sent',
    epicName: 'The Term Sheet',
    icon: 'description',
    goal: 'Get to a soft yes or a clean no. Both are valuable. Avoid maybes that drag for months.',
    actions: [
      'Send the term sheet with a personalised cover note — not just an attachment',
      'Set a follow-up date: "I\'ll check in on [date] for any feedback or red lines"',
      'Answer red-line questions within 24 hours — speed signals seriousness',
      'If silence after 10 business days, a single direct check-in is appropriate',
      'Identify your back-up investors so you\'re negotiating from strength, not desperation',
    ],
    template: `Subject: Earthly Ventures — Term Sheet for [Firm]

Hi [Name],

As discussed, please find the indicative term sheet attached. Headline terms:
- Ticket: [size]
- Structure: [equity / convertible / direct project]
- Target IRR: [%]
- Anchor LP / co-investor signals: [names if disclosable]

I've also re-attached the latest model and reference list. Happy to walk through any clauses with your legal team — we've kept the structure intentionally clean.

I'll check in on [date] unless you have feedback before then.

Best,
Nicole`,
    watch: 'Silence after a term sheet is normal — but don\'t mistake it for a yes. One follow-up, then it\'s their move.',
  },
  {
    name: 'Awaiting Response',
    epicName: 'Under Review',
    icon: 'hourglass_top',
    goal: 'Stay top-of-mind without crowding their IC process. Drop signal, not pressure.',
    actions: [
      'Note when their IC meets — that\'s your real timeline',
      'If 3+ weeks with no response, send one substantive update: project milestone, new LP, press mention',
      'Don\'t share generic "checking in" — every touchpoint should be new information',
      'After 6 weeks of silence, move to Parked with a 90-day re-engage trigger (new round, new milestone)',
      'A polite "no for now" is a yes for next round if you stay in their orbit',
    ],
    template: `Subject: Earthly Ventures — quick update

Hi [Name],

Quick update from our side — wanted to keep you in the loop without crowding your process:

- [Recent milestone — closed sub-round, signed anchor LP, project went live]
- [Press / signal — feature, award, regulatory progress]
- [Timing note — IC date / round close target]

No action needed. Reach out if you have questions or if there's anything I can prep for your next IC.

Nicole`,
    watch: 'Read the difference between "still evaluating" and "polite ghosting". If unsure, ask directly: "What would unblock a yes or no?"',
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
      'Send 