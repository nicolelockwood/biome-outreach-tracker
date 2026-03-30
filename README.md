# Arbor Ethos - Keystone Outreach Tracker

A beautiful, premium single-page web application for environmental/conservation lead tracking, built with vanilla HTML, JavaScript, and Tailwind CSS.

## Features

- **Hash-based routing** - Navigate between screens using URL fragments (#signin, #dashboard, #leads, etc.)
- **No build tools required** - Pure HTML/CSS/JS that works by simply opening index.html in a browser
- **Responsive design** - Full mobile, tablet, and desktop support with dedicated bottom navigation for mobile
- **Complete CRM functionality** - Lead management, interaction tracking, team management, data import/export

## File Structure

```
biome-app/
├── index.html                  # App shell with Tailwind config
├── _redirects                  # Netlify SPA redirect configuration
├── js/
│   ├── app.js                 # Router and main application logic
│   ├── data.js                # Mock data (leads, interactions, team)
│   └── screens/               # Screen components (one per route)
│       ├── signin.js          # Sign in page
│       ├── dashboard.js       # Dashboard with overview
│       ├── leads.js           # Leads table with filters
│       ├── kanban.js          # Kanban board pipeline view
│       ├── leadDetail.js      # Individual lead detail page
│       ├── addLead.js         # Form to add new lead
│       ├── interactionModal.js # Modal for logging interactions
│       └── placeholders.js    # Placeholder screens (import, export, settings, team)
└── README.md
```

## Routes

| Route | Screen |
|-------|--------|
| `#signin` (default) | Sign In |
| `#dashboard` | Dashboard with KPIs |
| `#leads` | Leads table with filters |
| `#kanban` | Kanban board pipeline |
| `#lead/:id` | Individual lead details |
| `#add-lead` | Add new lead form |
| `#import` | Import leads from CSV |
| `#export` | Export data configuration |
| `#notifications` | Notification preferences |
| `#team` | Team management |

## Design System

- **Primary Color**: #163428 (deep forest green)
- **Surface**: #fafaf5 (warm cream)
- **Typography**: Noto Serif (headlines), Manrope (body/labels)
- **Icons**: Material Symbols Outlined
- **Aesthetic**: "The Living Archive" - editorial, botanical, high-trust calm
- **Rounded Corners**: xl = 0.5rem, full = 0.75rem
- **Shadows**: Ambient with primary tint, no 1px borders, tonal layering

## Getting Started

### Local Development

1. Open `index.html` in your browser - the app will work immediately
2. Navigate between screens using the UI or by directly entering hash routes in the URL
3. All data is stored in memory (see `js/data.js` for mock data)

### Deployment to Netlify

1. Zip the entire `biome-app` folder
2. Drag and drop onto Netlify's deploy zone at https://app.netlify.com/drop
3. The `_redirects` file ensures proper SPA routing on Netlify

## Mock Data

The app includes rich mock data for:
- **8 leads** with full contact, stage, priority, and financial information
- **6 interactions** showing communication history
- **4 team members** with roles and initials

All data is defined in `js/data.js` and can be easily extended.

## Navigation

### Top Header
- Logo and app name
- Navigation links (Desktop only)
- User profile avatar

### Bottom Navigation
- Mobile-only bottom tab bar
- Dashboard, Pipeline, Leads, and Add buttons
- Auto-highlights current active route

### Within Screens
- Breadcrumbs for context (Lead Detail)
- Inline navigation buttons
- Dropdown menus for filtering and view options

## Key Interactions

- Sign in button navigates to dashboard
- Dashboard "View List" button goes to leads table
- Leads table rows are clickable and navigate to lead detail
- Lead detail "Log Interaction" button shows modal overlay
- All navigation is performed via `window.app.navigate(hash)`
- Modals use overlay pattern with click-outside-to-close

## Browser Support

Works on all modern browsers that support ES6 modules:
- Chrome/Edge 64+
- Firefox 67+
- Safari 11.1+

## Notes

- Pre-filled demo credentials: nicole@arborethos.com / keystone123
- All external images use Google Stitch export URLs
- No authentication logic - sign in simply navigates to dashboard
- No backend API - all data is static mock data
- Responsive images use proper srcset patterns
- Accessibility-compliant form inputs and navigation
