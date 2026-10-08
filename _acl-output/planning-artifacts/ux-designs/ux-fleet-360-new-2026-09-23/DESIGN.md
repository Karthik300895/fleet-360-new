---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T04:45:42.559Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
name: Fleet 360
description: Enterprise fleet-management visual identity for VelocityOne / ACL Digital — HVAC device monitoring and control.
updated: 2026-09-23
colors:
  primary-blue: '#1E6FD9'
  primary-blue-dark: '#1558B8'
  primary-red: '#E53935'
  primary-red-hover: '#C62828'
  navy-deep: '#0D1B3E'
  navy-overlay: '#0D1B3E99'
  slate-dark: '#3D4A5C'
  slate-heading: '#2D3748'
  charcoal: '#4A5568'
  background-page: '#F5F7FA'
  background-card: '#FFFFFF'
  border-subtle: '#E2E8F0'
  border-dashed: '#90CAF9'
  text-primary: '#1A202C'
  text-secondary: '#718096'
  text-on-dark: '#FFFFFF'
  text-muted: '#A0AEC0'
  status-online: '#38A169'
  status-online-bg: '#C6F6D5'
  status-warning: '#D69E2E'
  status-warning-bg: '#FEFCBF'
  status-critical: '#E53935'
  status-offline: '#A0AEC0'
  device-cooler: '#805AD5'
  device-cooler-bg: '#E9D8FD'
  device-air: '#3182CE'
  device-water: '#00B5D8'
  heating: '#ED8936'
  cooling: '#3182CE'
  chip-selected-bg: '#EBF4FF'
  chip-selected-border: '#1E6FD9'
  insight-accent: '#1E6FD9'
typography:
  font-family:
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
  page-title:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  section-heading:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.3'
  body:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
  value:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 16px
    fontWeight: '600'
    lineHeight: '1.4'
  logo-fleet:
    fontFamily: 'Inter, system-ui, sans-serif'
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.1'
rounded:
  sm: 4px
  md: 8px
  lg: 12px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  shell-padding: 24px
  card-padding: 20px
components:
  button-primary:
    background: '{colors.primary-red}'
    foreground: '{colors.text-on-dark}'
    radius: '{rounded.md}'
    height: 44px
  button-outline:
    background: transparent
    foreground: '{colors.primary-red}'
    border: '1px solid {colors.primary-red}'
    radius: '{rounded.md}'
  button-secondary:
    background: '{colors.primary-blue}'
    foreground: '{colors.text-on-dark}'
    radius: '{rounded.pill}'
  site-selector:
    background: '{colors.primary-blue}'
    foreground: '{colors.text-on-dark}'
    radius: '{rounded.pill}'
  nav-active-indicator:
    background: '{colors.primary-red}'
    height: 3px
  filter-chip-selected:
    background: '{colors.chip-selected-bg}'
    border: '1px solid {colors.chip-selected-border}'
    radius: '{rounded.md}'
  badge-online:
    background: '{colors.status-online-bg}'
    foreground: '{colors.status-online}'
    radius: '{rounded.pill}'
  badge-device-type:
    radius: '{rounded.pill}'
  tab-active:
    background: '{colors.primary-blue}'
    foreground: '{colors.text-on-dark}'
    radius: '{rounded.pill}'
  upload-zone:
    border: '2px dashed {colors.border-dashed}'
    radius: '{rounded.lg}'
    background: '{colors.background-card}'
  card-surface:
    background: '{colors.background-card}'
    border: '1px solid {colors.border-subtle}'
    radius: '{rounded.lg}'
    shadow: '0 1px 3px rgba(0,0,0,0.08)'
  insight-card:
    border-left: '3px solid {colors.insight-accent}'
    background: '{colors.background-card}'
---

## Brand & Style

Fleet 360 is an enterprise operational control plane for distributed commercial HVAC fleets. The visual language reads **confident, industrial, and data-dense without clutter** — facility managers triage hundreds of units; the interface prioritizes scanability, status-at-a-glance, and decisive CTAs over decorative flourish.

The brand sits within the **VelocityOne / ACL Digital** ecosystem. Login carries ACL Digital "Powered by" footer branding; authenticated surfaces lead with the **Fleet 360** wordmark (cerulean "Fleet" + charcoal "360"). The aesthetic is desktop-first responsive web: white card surfaces on light grey page backgrounds, blue for navigation and selection, red for primary actions and active nav underlines.

Visual references: [Figma Fleet 360_BK](https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811) · `imports/README.md` · `public/Fleet 360_BK (2)/`

## Colors

- **Primary Blue (`{colors.primary-blue}`)** — Fleet wordmark, active nav icons and labels, Site Selector pill, links, Browse/Download Template links, selected filter chips, active tab pill, upload zone icon. The operational "you are here" color.
- **Primary Red (`{colors.primary-red}`)** — All primary CTAs (Login, Manage Devices, Apply, Save & Next), active nav bottom border, Clear all link, Reset text, critical alerts, insight emphasis text. The "act now" color. Never used for passive chrome.
- **Navy Deep (`{colors.navy-deep}`)** — Login form panel background and hero gradient overlay. Creates depth behind white inputs.
- **Slate Dark (`{colors.slate-dark}`)** — Landing bottom band background. Module cards sit on this surface.
- **Status Green (`{colors.status-online}`)** — Online badge, healthy indicators.
- **Status Orange (`{colors.heating}`)** — Heating runtime bars, heating mode.
- **Status Blue (`{colors.cooling}`)** — Cooling runtime bars, cooling mode.
- **Device Type Purple (`{colors.device-cooler}`)** — Cooler badge pill.
- **Chip Selected (`{colors.chip-selected-bg}` / `{colors.chip-selected-border}`)** — Toggle-selected filter and sort options.

Avoid: gradients on cards, more than one red CTA per viewport region, using blue for destructive actions.

## Typography

**Inter** (or system sans-serif fallback) throughout. Hierarchy:

| Role | Token | Usage |
|------|-------|-------|
| Page title | `{typography.page-title}` | "Upload Devices", device name header |
| Section heading | `{typography.section-heading}` | Card titles ("Total Runtime", "Filters") |
| Body | `{typography.body}` | Descriptions, table cells, legal copy |
| Label | `{typography.label}` | Form labels, filter category headers, metadata keys |
| Value | `{typography.value}` | Metric readings, temperatures, kWh totals |
| Logo | `{typography.logo-fleet}` | "Fleet 360" on Login and Landing |

Landing welcome block uses larger display sizing (~36px bold) for "Fleet 360" in the hero text.

## Layout & Spacing

- **Login:** ~40% form panel left, ~60% hero image right; form content vertically centered with generous `{spacing.lg}` between field groups.
- **Landing:** Two horizontal bands — white top (~40vh), slate bottom (~60vh); three equal module columns in bottom band with `{spacing.xl}` gutters.
- **Application Shell:** Fixed top header, 64px height; content area uses `{spacing.shell-padding}` horizontal padding.
- **Devices module:** Full-width content below shell; device detail uses card grid (2–3 columns on desktop).
- **Panels:** Filters and Sort slide in from right, ~400px width on desktop; full-width sheet on tablet.
- **Max content width:** None — enterprise dashboards use full viewport width with card grids.

Breakpoints: desktop-first (≥1280px optimal); tablet (768–1279px) collapses card grids to 2-column; mobile (<768px) stacks to single column with shell nav icons-only [ASSUMPTION: tablet acceptable per PRD; mobile is degraded but functional].

## Elevation & Depth

Subtle elevation only. Cards use `{components.card-surface.shadow}`. Panels and modals use `0 4px 16px rgba(0,0,0,0.12)`. No heavy drop shadows. Login hero uses photographic depth via gradient overlay, not box shadow.

## Shapes

- **Buttons:** `{rounded.md}` (8px) for rectangular CTAs; Landing module CTAs use `{rounded.pill}`.
- **Badges:** `{rounded.pill}` for Online, device type, status chips.
- **Site Selector:** `{rounded.pill}`.
- **Tabs:** Active tab uses `{rounded.pill}` blue background.
- **Inputs:** `{rounded.sm}` (4px) on Login white fields.
- **Upload zone:** `{rounded.lg}` dashed border.

## Components

### Login Form (`Login.jpg`)

- Split viewport; navy left panel with white `{typography.logo-fleet}` title.
- White input fields, full-width `{components.button-primary}` Login button.
- "Forgot Password?" right-aligned white underlined link.
- Legal consent: small white text, underlined policy links.
- Footer: "Powered by" + ACL Digital logo.

### Landing Module Cards (`Landing.jpg`)

- White line-art icon, white bold title, grey description text, red pill CTA per column.
- No Application Shell on this surface.

### Application Shell Header

- Left: Fleet 360 logo (blue).
- `{components.site-selector}` pill with chevron.
- Center-right: nav items with icons — Dashboard, Devices, Sites, Users, Alarms.
- Active nav: blue icon + label + `{components.nav-active-indicator}` red underline.
- Right: notification bell outline, circular profile avatar.

### Upload Zone (`Manage Devices_Card.jpg`)

- `{components.upload-zone}` with cloud-upload icon (blue).
- "Drag & drop files or **Browse**" — Browse is `{colors.primary-blue}` link.
- "Supported Formats: XLSX" note (correct Figma typo XLXS → XLSX).
- File row: document icon, filename, remove X, `{components.button-outline}` "Load Data".
- Footer: `{components.button-primary}` "Save & Next" + `{components.button-outline}` "Cancel".
- Decorative HVAC line-art illustration on right half.

### Filters Panel (`Filters_Device.png`)

- Header: "Filters" title, red "Clear all", X close.
- Category sections separated by horizontal rules.
- Site hierarchy: three stacked dropdown rows with icons.
- Connection / Type / Power / Mode: icon chips using `{components.filter-chip-selected}` when active.
- Footer: full-width `{components.button-primary}` Apply.

### Sort Panel (`Sorting.png`)

- Order section: Ascending / Descending radio rows with blue checkmark on selected.
- Sort by section: Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours.
- Footer: red "Reset" text left, `{components.button-primary}` Apply right.

### Device Detail Header (`Frame 1984077425.png`)

- Breadcrumb: "Manage Devices / {deviceName}".
- Back arrow + device name + `{components.badge-online}` + device-type badge.
- Metadata row: serial, MAC, version.
- Contact block: name, phone, location hierarchy.
- Insight card: left blue accent bar, contextual insight text with red emphasis on deltas.
- Sub-nav tabs: `{components.tab-active}` on current tab.

### Device Detail Cards

- **Overview:** Total Runtime horizontal bar chart (orange heating, blue cooling), Weather 7-day strip, Alerts list (red critical, yellow warning), Comfort metrics grid, Maintenance summary grid.
- **Analytics:** Line chart with date range, runtime summary insight.
- **Controls:** Circular dial gauges with arrow steppers; N/A grey state for inactive lockouts.
- **Maintenance:** Warranty date grid, notes textarea, documents list.
- **Device Info:** Two-column key-value grids + HVAC unit illustration.

### Data Table (Device List) [ASSUMPTION]

- Column headers with sort affordance.
- Status icon row per device (Wi-Fi, power, alert, mode icons per `Frame 427319604.png`).
- Kebab menu: Edit, Remove (`Unit_Kebab Menu.png`).

## Do's and Don'ts

| Do | Don't |
|---|---|
| Match Figma red/blue pairing for CTAs vs navigation | Introduce a third accent color for buttons |
| Use status colors consistently (green=online, orange=heat, blue=cool) | Use red for non-action status indicators |
| Keep Landing shell-free per design | Add Application Shell to Landing |
| Correct XLSX format label (not XLXS) | Copy Figma typo into production UI |
| Show disabled/grey state for offline device controls | Allow setpoint changes on offline devices |
| Use pill badges for device status and type | Use square badges for status |
| Preserve insight card left accent bar pattern | Float insights without visual anchor |
