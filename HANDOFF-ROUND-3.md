# Biome Outreach Tracker — Round 3 Handoff Summary

## Context

This is the continuation handoff for Scarlet (scarletroselegacy@outlook.com) working on Nicole Lockwood's **Biome Outreach Tracker** — a vanilla JS SPA hosted on GitHub Pages at `https://nicolelockwood.github.io/biome-outreach-tracker`, backed by Supabase.

The repo is `https://github.com/nicolelockwood/biome-outreach-tracker` (public, deploys from `main` branch). Scarlet uploads files via GitHub's "Add file > Upload files" drag-and-drop to deploy.

The working copy of all source files is in the Cowork folder at `/sessions/.../mnt/biome-app/`. The actual git repo was cloned to `/sessions/.../biome-outreach-tracker/` during this session.

---

## What's Been Done (Rounds 1–2)

### Round 1: Original 6 UI/UX changes
- Fixed duplicate Log Outcome button (created separate `outcomeModal.js`)
- Replaced neon canopy green with richer palette
- Dashboard visual hierarchy improvements
- Colour palette overhaul
- Added monthly calendar with two-column layout to Follow-ups page
- Redesigned Strategy page with accordion stages

### Round 2: Glassmorphism System Overhaul
Scarlet pivoted the entire visual direction to match a Finance Portal app she'd built for Nicole. The full system was rebuilt:

- **Forest canopy background**: `background-image: url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=2400&q=85')` with `background-attachment: fixed` and dark gradient overlay via `body::before`
- **Frosted glass cards**: `.card` class with `rgba(255,255,255,0.82)` + `backdrop-filter: blur(20px) saturate(1.3)` + glass border + inset highlight
- **Card variants**: `.card-heavy` (0.88 opacity), `.card-deep` (dark glass), `.card-warm` (warm tint)
- **Icon treatment**: `.icon-forest` uses the same Unsplash forest image as background with overlay
- **Glass navigation**: `.nav-glass-bottom` for mobile, glass header nav
- **Forest-derived colour palette** in Tailwind config:
  - forest: `#14342a`, canopy: `#3d8b63`, philanthropy: `#5a8a4a`, investor: `#2a6a5a`, meeting: `#8a7a3a`, urgent: `#8a4a3a`
  - Glass surfaces, mist tones, neutral text colours, semantic colours all derived from the forest photograph
- **All screens updated**: dashboard, kanban, leads, leadDetail, calendar, strategy, archive, addLead, editLead, signin, outcomeModal, interactionModal
- **btn-primary**: dark glass button style
- **Hero text**: white with drop-shadow on forest background across all pages
- **Color consistency pass**: all inline hex values updated from round-1 values to new palette

---

## Tech Stack Quick Reference

- **Framework**: Vanilla JS, ES modules, template literals for HTML rendering
- **CSS**: Tailwind CSS via CDN with inline `tailwind.config` in `index.html`
- **Backend**: Supabase (auth + database)
- **Fonts**: DM Sans (body) + Fraunces (display headings) via Google Fonts
- **Icons**: Material Symbols Outlined via Google Fonts
- **Hosting**: GitHub Pages (static, deploys from `main`)
- **SPA routing**: Hash-based (`#dashboard`, `#kanban`, `#leads`, `#lead/123`, etc.)
- **Shared nav**: `navHTML()` function exported from `dashboard.js`, imported by all screens

### Key Files
- `index.html` — All CSS, Tailwind config, glass classes, body background, global styles
- `js/app.js` — Router, Supabase init, modal management, loading screen
- `js/screens/dashboard.js` — Dashboard + shared `navHTML()` function
- `js/screens/kanban.js` — Kanban pipeline board
- `js/screens/leads.js` — All Leads table view with filters
- `js/screens/leadDetail.js` — Individual lead detail page + timeline
- `js/screens/calendar.js` — Follow-ups page with monthly calendar + task list
- `js/screens/strategy.js` — Pipeline Strategy accordion page
- `js/screens/archive.js` — Funding Archive / Secured leads
- `js/screens/signin.js` — Sign-in page (glass panel on right, forest hero on left)
- `js/screens/outcomeModal.js` — Stage change modal
- `js/screens/interactionModal.js` — Full interaction logging modal
- `js/screens/addLead.js` — Add new lead form
- `js/screens/editLead.js` — Edit lead form

---

## Round 3 Changes Requested (Scarlet's Feedback with Screenshots)

### 1. DASHBOARD — Reorder Sections + Fix New Lead Button
**File**: `js/screens/dashboard.js`

**What to change**:
- Move the **Funding Goals** section ABOVE the **Lead Stages** section. Scarlet's logic: "If none of the leads land, the goal isn't reached — so it needs to start with goal attainment indicators first."
- The **"+ New Lead"** button in the top-right corner is getting lost. Redesign it to match the style of the "Total Pipeline" / "Active Pipeline" stat boxes — a glass card-style button with appropriate text colour, not a small text link.

### 2. DASHBOARD — Priority Indicators + Stage Tag Colours
**File**: `js/screens/dashboard.js`

**What to change**:
- The **red left-border on priority lead cards** is too harsh. Replace with a richer burgundy approach — think glassmorphism tint rather than a flat red stripe. The priority cards should have a subtle glass tint in the priority colour (burgundy for high, something else for medium/low) rather than a coloured left border.
- The **stage tags** (WARM, ACTIVE, PIPELINE, HOT, INACTIVE) in the Lead Stages section currently use similar shades of green/neutral that don't translate psychologically. They need a more distinct, rich colour palette where each tag clearly communicates its meaning at a glance. Not different shades of the same colour — genuinely different hues that still fit the premium forest palette.

**Suggested stage tag palette** (to be confirmed but as starting direction):
- WARM (Engaged) → warm amber/gold glass tint
- ACTIVE (Contacted) → canopy green
- PIPELINE (New) → cool mist/silver
- HOT (Meeting/Proposal) → rich copper/terracotta
- INACTIVE (Parked/Closed) → muted slate

### 3. KANBAN — Stage Column Headers + Card Priority Indicators
**File**: `js/screens/kanban.js`

**What to change**:
- The **stage labels at the top** of kanban columns (NEW, CONTACTED, ENGAGED, etc.) get lost against the dark forest background. The text and count badges need better contrast — either white text or glass-backed labels.
- The **coloured left border on cards** has the same problem as #2 — replace with glassmorphism tint approach. Each card should have a subtle glass tint that reflects its priority level, making it visually clear without the flat stripe.
- The **lead count numbers** in column headers are too light/hard to read.

### 4. LEADS TABLE — Stage Badge Distinction
**File**: `js/screens/leads.js`

**What to change**:
- The **stage badges** (CONTACTED, NEW, PROPOSAL SENT, ENGAGED, etc.) lack enough colour distinction. They're currently mostly green/neutral shades. Apply the same distinct stage colour palette decided in #2 across all stage badges consistently app-wide. This needs to be a single colour decision that flows through dashboard, kanban, leads, and lead detail.

### 5. CALENDAR — Text Readability on Forest Background
**File**: `js/screens/calendar.js`

**What to change**:
- The section headings below the calendar ("Today", "This Week") and their italic empty-state text ("Nothing due today", "Nothing else this week") are hard to read against the forest background. They're currently using `text-forest` and `text-ink-ghost` which don't have enough contrast on the dark background.
- Don't necessarily add boxes around everything — find an alternative approach. Options: white text with subtle drop shadow, or give those section headings a glass-backed treatment, or ensure they sit within an existing glass card container.

### 6. CALENDAR — Date Click Interaction + Month Navigation Fix
**File**: `js/screens/calendar.js`

**What to change**:
- **Click a date** in the calendar grid to filter/show only that date's tasks in the right-hand task list panel. Currently clicking a date scrolls to the task card, but Scarlet wants clicking a date to isolate and surface that date's tasks.
- **Month navigation arrows** don't work — clicking left/right arrows should navigate between months. The code pre-renders 4 months (prev, current, next, next+1) and has JS at the bottom of the template to toggle visibility, but this JS runs inside a `<script>` tag within the template literal and may not be executing properly after SPA navigation. This needs debugging — likely the script needs to run after the DOM is updated, perhaps via `setTimeout` or by attaching event listeners in `app.js` after render.

### 7 & 8. LEAD DETAIL — Outcome Modal Positioning
**Files**: `js/screens/outcomeModal.js` + `js/screens/leadDetail.js`

**What to change**:
- The **Log Outcome modal** currently appears at the bottom of the viewport (using `items-end` on mobile, `items-center` on desktop). When triggered from the "Log Outcome" button in the sidebar, you have to scroll down to find it.
- Change the modal to appear **near the top of the viewport** or directly beneath the Log Outcome button. Replace `items-end md:items-center` with `items-start md:items-start` and add some top padding (`pt-20 md:pt-32`) so it appears high on screen.
- Apply the same fix to `interactionModal.js` for consistency — modals should appear where the eye already is.

### 9. STRATEGY — Glassmorphism Hero Band
**File**: `js/screens/strategy.js`

**What to change**:
- The **dark hero band** (`bg-forest`) at the top of the Strategy page is the only solid-colour section in the entire app. It breaks the glassmorphism system.
- Replace with a **glass-green treatment**: semi-transparent forest green (`rgba(20,52,42,0.75)`) with `backdrop-filter: blur(20px)` so the forest canopy image shows through. Still dark enough for white text readability, but integrated with the glass system rather than being an opaque block.

### 10. STRATEGY — Collapsed Accordion Stage Headers
**File**: `js/screens/strategy.js`

**What to change**:
- The collapsed accordion summary bars (stages 4, 5, 6 especially) have dark/coloured backgrounds where the text gets lost. Apply the same glassmorphism approach — semi-transparent backgrounds with blur instead of solid colours.
- The `headerBg` values were already updated to rgba in round 2, but some (especially the deeper stages) may still be too opaque or too similar to the forest background. Ensure all collapsed states have enough frosted-glass brightness for text to be clearly readable.

### 11, 12, 13. STRATEGY — Full Page Rethink
**File**: `js/screens/strategy.js`

**What to change**:
- **Colour logic**: The current stage colours feel arbitrary. Scarlet can't intuitively understand what they represent. Either justify the colour choices clearly OR (preferred) switch all stage accordions to the same glassmorphism white/frosted treatment so colour isn't a distraction.
- **Default state**: Currently the first accordion (`New`) is open by default (`open` attribute on the first `<details>`). Change so **all stages start closed**. Remove the `${i === 0 ? 'open' : ''}` conditional.
- **Make stage titles the feature**: The stage name badges are currently small pills. Make the stage titles larger, more prominent, and more evocative.
- **Epic stage names**: Rename each stage to feel like a high-tier curated sales strategy. Suggestions (to refine):
  - New → **"Discovery & Alignment"**
  - Contacted → **"First Touch"**
  - Engaged → **"Building Trust"**
  - Meeting Set → **"The Conversation"**
  - Proposal Sent → **"The Invitation"**
  - Awaiting Response → **"Holding Space"**
  - Secured → **"Partnership Sealed"**
  
  These are suggestions — the names should feel alive, premium, and specific to Nicole's ecological investment context. Keep the original stage name as a small subtitle/badge so it still maps to the pipeline.

### 14. ARCHIVE — Visual Progress Graphics
**File**: `js/screens/archive.js`

**What to change**:
- The current Archive page just shows `$0` numbers in glass cards. It's flat and lifeless.
- Add **premium visual progress indicators** that make the goal-achieving process feel alive:
  - Circular progress rings (SVG) around the dollar amounts showing percentage toward goal
  - Or a beautiful radial/arc gauge
  - Animated fill that responds to the actual data
  - The philanthropy goal is $5M, investment goal is $100M — these are defined in the dashboard data
- Make Nicole feel something when she visits this page — even if the numbers are currently $0, the visual structure should communicate "this is where wins live" and create anticipation.

---

## Global Consistency Requirements

### Stage Colour Palette (to be defined and applied everywhere)
One of Scarlet's core feedback themes is that stage colours need to be **psychologically distinct** — not just different shades of green. Whatever palette is chosen needs to flow consistently through:
- Dashboard stage tags (WARM, ACTIVE, etc.)
- Kanban column indicators
- Leads table stage badges
- Lead detail stage badge
- Calendar task card badges
- Strategy page (if colours are kept)

### Priority Indicator Approach
Replace flat coloured left-borders with **glassmorphism tint** approach:
- High/Critical → subtle burgundy/deep rose glass tint on the card
- Medium → subtle amber/gold glass tint
- Low → subtle sage/mist glass tint

This applies to: dashboard priority leads, kanban cards, calendar task cards, leads table rows.

### Text Readability on Forest Background
Any text that sits directly on the forest background (not inside a glass card) needs to be white/light with appropriate contrast. Scan all screens for remaining instances of dark text classes (`text-forest`, `text-ink-mid`, `text-ink-ghost`) in hero sections or areas outside glass cards.

---

## Files That Need Changes

| File | Changes |
|------|---------|
| `js/screens/dashboard.js` | Reorder sections (goals above stages), redesign New Lead button, priority card glassmorphism tint, distinct stage tag colours |
| `js/screens/kanban.js` | Column header contrast, card priority glassmorphism tint, lead count visibility |
| `js/screens/leads.js` | Stage badge colour distinction (consistent with global palette) |
| `js/screens/calendar.js` | Text readability fix, date-click filtering, month navigation fix |
| `js/screens/leadDetail.js` | Stage badge colour consistency |
| `js/screens/outcomeModal.js` | Reposition modal to top of viewport |
| `js/screens/interactionModal.js` | Reposition modal to top of viewport |
| `js/screens/strategy.js` | Glass hero band, all-closed default, epic stage names, glassmorphism accordions, colour logic |
| `js/screens/archive.js` | Premium SVG progress rings/gauges for funding goals |
| `index.html` | May need new CSS classes for priority glass tints, progress ring styles |

---

## Important Notes

- **Deployment**: Scarlet deploys by dragging files into GitHub's "Add file > Upload files" on the repo page. She selects all contents of the biome-app folder (not the folder itself) and drops them in.
- **The live URL**: `https://nicolelockwood.github.io/biome-outreach-tracker`
- **Scarlet's Unsplash forest image note**: The current background uses a similar Unsplash aerial forest image. Scarlet may want her specific image (from her 4th attachment in the original conversation) — this would be a simple URL swap in `index.html`.
- **No frameworks**: This is vanilla JS with template literals. All HTML is returned as strings from render functions. Event handlers are inline `onclick` attributes.
- **Tailwind via CDN**: Config is inline in `index.html`. Custom colours, shadows, fonts all defined there.
- **The `navHTML()` function** in `dashboard.js` is shared across all screens — any nav changes only need to happen once.
- **Biome's brand reference**: https://earthly.org/ — the font and logo icon follow this theme.

---

## Scarlet's Design Sensibility (for reference)

She responds to: psychological depth, rich interfaces, easy eye navigation. Not clinical. Not flat. Sections should feel like distinct rooms in the same house. She processes glassmorphism, premium icon treatments, and colour-as-meaning intuitively. When colours don't map to a clear psychological logic, her system reads it as noise. She values velvet-lining quality — smooth, sealed, quiet, boundaried. Every visual element needs to earn its place by communicating something.
