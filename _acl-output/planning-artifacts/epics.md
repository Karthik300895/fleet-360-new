---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T05:21:34.026Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - _acl-output/planning-artifacts/prds/prd-fleet-360-new-2026-09-23/prd.md
  - _acl-output/planning-artifacts/architecture/architecture-fleet-360-new-2026-09-23/ARCHITECTURE-SPINE.md
  - _acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md
  - _acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/EXPERIENCE.md
---

# fleet-360-new - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for fleet-360-new, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: An unauthenticated User can submit email and password credentials to authenticate into Fleet 360. Login form displays Email and Password fields with labels and placeholders per design spec. Submitting valid credentials returns a session token and redirects to Landing. Submitting invalid credentials displays an error without redirecting. Pressing Enter in either field submits the form when both fields are populated.

FR-2: The system validates email format and non-empty password before accepting a login attempt. Malformed email shows inline validation error; submit is blocked. Empty password shows inline validation error; submit is blocked.

FR-3: The Login page displays Terms & Conditions and Privacy Notice links with consent copy. Consent copy reads: "By clicking login, you hereby agree to our Terms and Conditions & Privacy Notice." Terms and Privacy links are clickable and open policy content (modal or external page).

FR-4: The Login page displays a Forgot Password link visible below the password field. Clicking the link navigates to a password-reset flow or displays a "Coming soon" stub.

FR-5: The Login page renders Fleet 360 branding and ACL Digital footer per Figma. Product title "Fleet 360" appears in the form area. Footer displays "Powered by" with ACL Digital logo. Layout matches Login.jpg reference within design-tolerance guidelines.

FR-6: An authenticated User sees the Landing page as the default post-login destination. Top band displays centered Fleet 360 logo and welcome copy per design spec. Bottom band displays three equal module cards: Devices, Sites, Users. Landing page does not render the Application Shell header.

FR-7: An authenticated User can navigate from Landing to the Devices module via the Manage Devices CTA. Clicking Manage Devices on the Devices card navigates to the Devices module. Application Shell appears upon entering Devices.

FR-8: An authenticated User clicking Manage Sites or Manage Users sees a Phase 2 placeholder. Sites and Users CTAs navigate to a "Coming soon" stub page or display a disabled-state message. Stub pages do not expose incomplete CRUD functionality.

FR-9: An authenticated User sees the Application Shell on Devices and Device Detail routes. Header contains: Fleet 360 logo, Site Selector, nav items (Dashboard, Devices, Sites, Users, Alarms), notification bell, profile avatar. Devices nav item shows active state when user is in Devices module.

FR-10: An authenticated User can scope fleet data via the Site Selector dropdown. Default selection is "All Sites". Dropdown lists available Sites. Selecting a Site filters device list and detail context to that Site.

FR-11: Primary nav items for Dashboard, Sites, Users, and Alarms route to Phase 2 stubs when clicked. Clicking Dashboard, Sites, Users, or Alarms from nav shows stub/coming-soon page. Devices nav item is fully functional.

FR-12: A Fleet Administrator can upload device data via drag-and-drop or file browse. Upload zone displays dashed border, cloud icon, and "Drag & drop files or Browse" copy. Only `.xlsx` files are accepted; other formats show a rejection error. Uploaded filename appears in a file row with remove (X) control.

FR-13: A Fleet Administrator can download the standard Upload Template. "Download Template" link is visible below the upload zone. Downloaded file contains columns: Device Name, Serial Number, MAC Address, Model Number, Site, Floor, Area, Device Type.

FR-14: A Fleet Administrator can parse an uploaded file and see per-row validation results. Clicking "Load Data" triggers server-side or client-side parse. Invalid rows display error details (missing required field, invalid device type, unknown Site). Valid rows are marked ready for commit.

FR-15: A Fleet Administrator can save parsed devices or cancel the upload. "Save & Next" commits valid rows to the Device registry and navigates to device list or confirmation. "Cancel" discards the upload session and returns to the previous view. Back arrow navigates away from Upload Devices page.

FR-16: An authenticated User can view a list of Devices scoped by Site Selector and active filters. List displays devices with status indicators (connection, power, alert, mode icons per design). List layout is a data table. Clicking a row navigates to Device Detail for that Device. Empty state displays when no devices match filters.

FR-17: An authenticated User can filter the device list by Site hierarchy, Connections, Device Type, Power, and Mode. Filters panel opens as slide-over or modal with categories per design spec. Site hierarchy uses cascading dropdowns: Location → Floor → Area. Connection, Type, Power, and Mode use multi-select chips with toggle selection. "Clear all" resets all filters to defaults. "Apply" closes panel and refreshes list; filters persist in session until cleared.

FR-18: An authenticated User can sort the device list by field and order. Sort panel offers Order: Ascending or Descending (radio). Sort by options: Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours. "Reset" clears sort to default; "Apply" applies sort and refreshes list.

FR-19: An authenticated User can Edit or Remove a Device from the list kebab menu. Kebab menu offers Edit and Remove options. Remove triggers a confirmation dialog before deletion (soft delete with confirmation). Edit navigates to a device edit form (minimal edit form for name, location, contact in Phase 1).

FR-20: An authenticated User viewing a Device sees a consistent header across all sub-tabs. Header shows breadcrumb (Manage Devices / {device name}), back arrow, device name, Online/Offline badge, device type badge (Cooler/Air/Water). Header shows MAC, serial, software version, contact name/phone, and location (Site, Area, Floor, room). Insight card displays contextual text; content may vary by active tab.

FR-21: An authenticated User can navigate among Device Detail sub-tabs. Tabs: Overview, Analytics, Controls, Schedule, Maintenance, Device Info. Active tab shows blue pill background with white text. Tab content loads without full page reload.

FR-22: An authenticated User can view operational summary on the Overview tab. Total Runtime section shows Last 7 days with Heating (orange) and Cooling (blue) bar charts in kWh. Weather section shows 7-day forecast with icons and °F. Alerts & Health lists Critical (red) and Warning (yellow) items with timestamps and "View all" link. Comfort & Temperature shows Current Room, Set Point, Supply Air, Return Air, Humidity %. Maintenance & Service shows Last Service, Filter Health %, Next Scheduled Service, Faults in Last 30 Days.

FR-23: An authenticated User can view historical runtime analytics. Historical Runtime line chart displays date range on X-axis, hours on Y-axis. Summary shows total runtime; Insight card may show week-over-week delta.

FR-24: An authenticated User can view and adjust temperature setpoints on the Controls tab. Circular dial controls display Set Point Cool Limit, Temperature Lockout Cool, Temperature Lockout Heat. Arrow buttons adjust values; inactive lockouts show N/A grey state. Offline devices disable control interaction.

FR-25: An authenticated User can view warranty and service information. Warranty grid shows Installation Date, Parts Warranty, Labour Warranty, Periodic Service, Last Service Date, Next Service Due (warning icon if due). Notes free-text area with placeholder "Write notes". Documents section lists uploaded files or upload area.

FR-26: An authenticated User can view technical device metadata. Device Details: Name, Software Version, Model Number, Location, Serial, MAC. Device Status: Compressor RPM, pressures, EXV position, voltage, heat cycles, current. Temperature Details: Set Point, Heating Hrs, Cooling Hrs.

FR-27: The Schedule tab is present in navigation but content is deferred. Schedule tab is visible in tab bar. Clicking Schedule shows placeholder content or "Coming in Phase 2" message.

### NonFunctional Requirements

NFR-1: Device list with 500 rows renders and responds to filter/sort within 2 seconds on standard enterprise hardware.

NFR-2: Passwords transmitted over HTTPS; session tokens stored securely; no credentials in client-side logs.

NFR-3: Login and primary flows meet WCAG 2.1 AA for contrast, keyboard navigation, and form labels.

NFR-4: Functional on latest two versions of Chrome, Edge, Firefox, Safari.

NFR-5: API failures display user-friendly messages; no raw stack traces in UI.

NFR-6: Unauthenticated access to protected routes redirects to Login.

### Additional Requirements

- Feature-sliced SPA architecture: each PRD feature area maps to one `src/features/<name>/` slice; slices do not import from sibling slices (AD-1).
- All mutable application state lives in domain Zustand stores (`useAuthStore`, `useDeviceStore`, `useShellStore`); components read stores, not local server state (AD-2).
- Only `src/api/` modules call `fetch`; typed functions per resource with DTO→entity mapping before return (AD-3).
- MSW handlers intercept same URL paths as `api/` adapters; swap to production via `VITE_USE_MSW=false` without feature code changes (AD-4).
- Session token persisted under `localStorage` key `fleet360:session`; `<ProtectedRoute>` redirects unauthenticated access to `/login`; logout clears store and storage (AD-5).
- Canonical entity types (`Device`, `Site`, `Session`, `User`, `DeviceFilter`) defined once in `src/entities/`; stores hold entities, never raw DTOs (AD-6).
- `DESIGN.md` tokens exported to `shared/styles/tokens.css` as CSS custom properties; feature styles use `var(--color-*)`, `var(--spacing-*)` — no literal hex for tokenized values (AD-7).
- `useDeviceStore` owns 30-second poll via `setInterval` calling `devicesApi.list`; poll starts on Devices route mount, stops on unmount; list and detail share store cache (AD-8).
- `api/` throws `ApiError { code, message, status }`; stores expose user-facing `error: string | null`; UI renders store error strings only (AD-9).
- Vite builds static SPA deployed to Vercel; config via `VITE_API_BASE_URL`, `VITE_USE_MSW`; no SSR in Phase 1 (AD-10).
- Stack: React 19.2.8, TypeScript 6.0.2, Vite 8.2.2, Zustand 5.0.15, React Router 8.4.0, MSW 2.15.0.
- Routing: public `/login`; protected `/`, `/devices`, `/devices/:deviceId/:tab?`; stubs at `/dashboard`, `/sites`, `/users`, `/alarms`.
- Structural seed: `src/app/`, `src/features/{login,landing,shell,devices/{upload,list,detail}}`, `src/entities/`, `src/api/`, `src/shared/{ui,styles,lib}`, `src/stores/`, `src/mocks/`.
- Brownfield project — no greenfield starter template; extend existing React + Vite codebase.
- Phase 1 data served via MSW mock API; real REST backend integration deferred.
- Device status refresh via 30-second polling (no WebSocket).
- ISO 8601 dates in entities; device IDs are opaque strings.
- Auth mock accepts any valid-format credentials in Phase 1.

### UX Design Requirements

UX-DR1: Implement design token system in `shared/styles/tokens.css` — all color tokens (primary-blue, primary-red, navy-deep, status colors, device-type colors, chip-selected, insight-accent), typography scale (page-title, section-heading, body, label, value, logo-fleet), spacing scale (xs through xl, shell-padding, card-padding), and border-radius scale (sm, md, lg, pill).

UX-DR2: Implement `ButtonPrimary` component — red background (`{colors.primary-red}`), white text, 44px height, `{rounded.md}` radius; used for Login, Apply, Save & Next, Manage Devices CTAs.

UX-DR3: Implement `ButtonOutline` component — transparent background, red border and text, `{rounded.md}` radius; used for Cancel, Load Data secondary actions.

UX-DR4: Implement `ButtonSecondary` component — blue background (`{colors.primary-blue}`), white text, `{rounded.pill}` radius; used for secondary blue actions.

UX-DR5: Implement `SiteSelector` pill component — blue background, white text, chevron, `{rounded.pill}`; default "All Sites" with dropdown of available sites.

UX-DR6: Implement `NavActiveIndicator` — 3px red bottom border on active primary nav item; active nav shows blue icon + label.

UX-DR7: Implement `FilterChip` component — toggle selection with `{components.filter-chip-selected}` active state (blue border, light blue background); used in Filters and Sort panels.

UX-DR8: Implement `BadgeOnline` component — green text on light green pill background; text label "Online" or "Offline" (not color-only).

UX-DR9: Implement `BadgeDeviceType` component — pill badges for Cooler (purple), Air (blue), Water (cyan) with text labels.

UX-DR10: Implement `TabActive` pill component — blue background, white text, `{rounded.pill}`; used in Device Detail sub-nav.

UX-DR11: Implement `UploadZone` component — dashed blue border, cloud icon, drag-and-drop + Browse link, "Supported Formats: XLSX" label (correct spelling, not XLXS typo).

UX-DR12: Implement `CardSurface` component — white background, subtle border, `{rounded.lg}`, shadow `0 1px 3px rgba(0,0,0,0.08)`; used across all card layouts.

UX-DR13: Implement `InsightCard` component — left 3px blue accent bar, contextual insight text with red emphasis on deltas; content varies by tab/device state.

UX-DR14: Implement Login split-layout page — ~40% navy form panel left, ~60% hero image right; white inputs with `{rounded.sm}`; ACL Digital "Powered by" footer; matches `Login.jpg`.

UX-DR15: Implement Landing two-band layout — white top band (~40vh) with logo and welcome copy; slate bottom band (~60vh) with three equal module columns; no Application Shell; red pill CTAs per card; matches `Landing.jpg`.

UX-DR16: Implement Application Shell header — fixed 64px height; Fleet 360 logo left, Site Selector, nav items (Dashboard, Devices, Sites, Users, Alarms), notification bell, profile avatar right; `{spacing.shell-padding}` horizontal padding.

UX-DR17: Implement Filters panel — slide-over from right, ~400px desktop / full-width sheet tablet; cascading Site→Floor→Area dropdowns; multi-select chips for Connection, Type, Power, Mode; Clear all (red), Apply (primary) footer; matches `Filters_Device.png`.

UX-DR18: Implement Sort panel — radio Ascending/Descending order; single-select sort fields (Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours); Reset (red text) and Apply footer; matches `Sorting.png`.

UX-DR19: Implement Device Detail header — breadcrumb, back arrow, device name, status badges, metadata row (serial, MAC, version), contact block, location hierarchy, Insight card; shared across all tabs; matches `Frame 1984077425.png`.

UX-DR20: Implement Device List data table — column headers with sort affordance, status icon cluster per row (Wi-Fi, power, alert, mode), kebab menu (Edit, Remove); matches `Frame 427319604.png` and `Unit_Kebab Menu.png`.

UX-DR21: Implement Overview tab card grid — Total Runtime horizontal bar chart (orange heating, blue cooling kWh), Weather 7-day strip, Alerts list (red critical, yellow warning), Comfort metrics grid, Maintenance summary grid.

UX-DR22: Implement Analytics tab — historical runtime line chart with date range X-axis, hours Y-axis, runtime summary with week-over-week insight.

UX-DR23: Implement Controls tab — circular dial gauges with arrow steppers for Set Point Cool Limit, Temperature Lockout Cool, Temperature Lockout Heat; N/A grey disabled state for inactive lockouts and offline devices.

UX-DR24: Implement Maintenance tab — warranty date grid, notes textarea ("Write notes" placeholder), documents list/upload area.

UX-DR25: Implement Device Info tab — two-column key-value grids for Device Details, Device Status, Temperature Details; HVAC unit illustration.

UX-DR26: Implement responsive breakpoints — desktop-first ≥1280px (full shell, multi-column grids, 400px panels); tablet 768–1279px (compressed nav labels, 2-column grids, full-width panels); mobile <768px (icon-only nav, single-column, horizontal table scroll).

UX-DR27: Implement state pattern treatments — skeleton loading on cold load; empty fleet message with Upload link; empty filter results with Clear filters action; upload format/parse error messages per voice-and-tone spec; offline device controls disabled with tooltip; Phase 2 stub pages with back/nav escape; session expired redirect with toast.

UX-DR28: Implement accessibility floor — WCAG 2.1 AA contrast; all form inputs with associated `<label>`; status badges with text labels (not color-only); `aria-pressed` on filter chips; chart text summaries for screen readers; blue focus rings on all interactive elements; full keyboard navigation without mouse.

UX-DR29: Implement interaction primitives — Enter submits valid forms; Escape closes panels; click-outside dismisses panels; Remove device requires confirmation dialog with device name; Tab order follows visual order.

UX-DR30: Implement voice-and-tone microcopy — factual, non-celebratory copy per EXPERIENCE.md table (e.g., "4 devices match your filters", "Upload failed — only .xlsx files are accepted", "Device is offline — controls unavailable").

### FR Coverage Map

FR-1: Epic 1 — Email/password login
FR-2: Epic 1 — Pre-submit validation
FR-3: Epic 1 — Legal consent display
FR-4: Epic 1 — Forgot Password entry point
FR-5: Epic 1 — Branded Login presentation
FR-6: Epic 1 — Landing page layout
FR-7: Epic 1 — Devices module navigation
FR-8: Epic 1 — Sites/Users stub navigation
FR-9: Epic 1 — Application Shell rendering
FR-10: Epic 1 — Site Selector
FR-11: Epic 1 — Nav stubs for out-of-scope modules
FR-12: Epic 2 — Upload zone
FR-13: Epic 2 — Template download
FR-14: Epic 2 — Parse and validate
FR-15: Epic 2 — Commit or cancel upload
FR-16: Epic 2 — Device list display
FR-17: Epic 2 — Filters panel
FR-18: Epic 2 — Sort panel
FR-19: Epic 2 — Row actions (Edit/Remove)
FR-20: Epic 2 — Device Detail header
FR-21: Epic 2 — Sub-tab navigation
FR-22: Epic 2 — Overview tab
FR-23: Epic 2 — Analytics tab
FR-24: Epic 2 — Controls tab
FR-25: Epic 2 — Maintenance tab
FR-26: Epic 2 — Device Info tab
FR-27: Epic 2 — Schedule tab stub

## Epic List

### Epic 1: Secure Access & Application Navigation
Operators can sign in, discover modules from the Landing hub, and navigate the fleet application with site-scoped context.
**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5, FR-6, FR-7, FR-8, FR-9, FR-10, FR-11

### Epic 2: Fleet Device Operations
Fleet administrators and operators can bulk-onboard devices, triage the fleet registry with filters and sort, and drill into per-device operational insight across all detail tabs.
**FRs covered:** FR-12, FR-13, FR-14, FR-15, FR-16, FR-17, FR-18, FR-19, FR-20, FR-21, FR-22, FR-23, FR-24, FR-25, FR-26, FR-27

## Epic 1: Secure Access & Application Navigation

Operators can sign in, discover modules from the Landing hub, and navigate the fleet application with site-scoped context.

### Story 1.1: Application Foundation & Design Tokens

As a developer,
I want the application bootstrap, routing skeleton, and design token system in place,
So that all subsequent features share a consistent technical and visual foundation.

**Acceptance Criteria:**

**Given** the brownfield React + Vite project
**When** the application starts
**Then** `src/app/` bootstraps React Router with public `/login` and protected route wrapper
**And** `shared/styles/tokens.css` exports all DESIGN.md color, typography, spacing, and radius tokens as CSS custom properties (UX-DR1, AD-7)
**And** global styles load tokens before any feature CSS (AD-10)
**And** folder structure matches architecture seed: `features/`, `entities/`, `api/`, `shared/`, `stores/`, `mocks/` (AD-1)

### Story 1.2: Shared UI Primitives

As a developer,
I want reusable UI components matching the design system,
So that feature screens render consistently without duplicating styles.

**Acceptance Criteria:**

**Given** design tokens are available in `tokens.css`
**When** a feature imports from `shared/ui/`
**Then** `ButtonPrimary` renders red CTA per UX-DR2 (44px height, `{rounded.md}`)
**And** `ButtonOutline` renders transparent with red border per UX-DR3
**And** `ButtonSecondary` renders blue pill per UX-DR4
**And** `BadgeOnline` and `BadgeDeviceType` render pill badges with text labels (not color-only) per UX-DR8, UX-DR9
**And** `CardSurface` renders white card with subtle border and shadow per UX-DR12
**And** all interactive primitives show blue focus ring per UX-DR28

### Story 1.3: Authentication API, Session Store & Route Guards

As an unauthenticated visitor,
I want protected routes to require a valid session,
So that fleet data is only accessible after login.

**Acceptance Criteria:**

**Given** no session exists in `localStorage`
**When** the user navigates to any protected route (`/`, `/devices`, `/devices/:id`)
**Then** the user is redirected to `/login` (FR-1, NFR-6, AD-5)
**And** `authApi.login` calls the REST adapter (mocked via MSW) and returns a typed `Session` entity (AD-3, AD-4, AD-6)
**And** `useAuthStore` persists token under `fleet360:session` and hydrates on app boot (AD-2, AD-5, NFR-2)
**And** `api/` throws `ApiError { code, message, status }` on failure; store exposes user-facing error string (AD-9, NFR-5)
**And** logout clears store and `localStorage`

### Story 1.4: Login Page

As an unauthenticated user,
I want to sign in with email and password on a branded Login page,
So that I can securely access Fleet 360.

**Acceptance Criteria:**

**Given** the user is on `/login`
**When** the page renders
**Then** split layout displays navy form panel (~40%) and hero image (~60%) per UX-DR14 (FR-5)
**And** Email and Password fields have labels, placeholders, and associated `<label>` elements (FR-1, NFR-3)
**And** submitting malformed email or empty password shows inline validation errors and blocks submit (FR-2)
**And** consent copy with clickable Terms & Conditions and Privacy Notice links is displayed (FR-3)
**And** Forgot Password link is visible and navigates to stub or reset flow (FR-4)
**And** footer shows "Powered by" with ACL Digital logo (FR-5)
**When** valid credentials are submitted (Enter key or Login button)
**Then** session is created and user redirects to Landing (FR-1)
**When** invalid credentials are submitted
**Then** error displays below form without redirect and field input is retained (FR-1, UX-DR27)
**And** microcopy follows voice-and-tone spec — no celebratory language (UX-DR30)

### Story 1.5: Landing Hub

As an authenticated user,
I want a Landing page with module entry cards,
So that I can discover and navigate to product modules after sign-in.

**Acceptance Criteria:**

**Given** the user is authenticated
**When** login succeeds or user navigates to `/`
**Then** Landing renders two-band layout without Application Shell per UX-DR15 (FR-6)
**And** top band shows Fleet 360 logo and welcome copy; bottom band shows three equal cards: Devices, Sites, Users (FR-6)
**When** user clicks Manage Devices on the Devices card
**Then** user navigates to `/devices` and Application Shell appears (FR-7)
**When** user clicks Manage Sites or Manage Users
**Then** user navigates to a Phase 2 "Coming soon" stub with back navigation (FR-8, UX-DR27)

### Story 1.6: Application Shell & Navigation Stubs

As an authenticated user,
I want persistent header navigation across fleet modules,
So that I can move between product areas without losing context.

**Acceptance Criteria:**

**Given** the user is on any authenticated route except Landing
**When** the Application Shell renders
**Then** fixed 64px header shows Fleet 360 logo, Site Selector pill, nav items (Dashboard, Devices, Sites, Users, Alarms), notification bell, and profile avatar per UX-DR16 (FR-9)
**And** active nav item shows blue icon + label + red 3px bottom border per UX-DR6 (FR-9)
**When** user is in Devices module
**Then** Devices nav item shows active state (FR-9)
**When** user clicks Dashboard, Sites, Users, or Alarms in primary nav
**Then** stub "Coming soon" page renders with escape navigation (FR-11, UX-DR27)
**And** shell is responsive per UX-DR26 breakpoints (icon-only nav below 768px)

### Story 1.7: Site Selector & Shell State

As an authenticated operator,
I want to scope fleet data by site from the header,
So that I can focus on a single location or view the entire fleet.

**Acceptance Criteria:**

**Given** the Application Shell is visible
**When** the Site Selector renders
**Then** default selection is "All Sites" in a blue pill with chevron per UX-DR5 (FR-10)
**And** dropdown lists available sites (Northridge Middle, Orchid, Greenwood Corporate, Summit Industrial Park, Sunrise Villa, Urban Heaven)
**When** user selects a specific site
**Then** `useShellStore` updates selected site and persists in session (FR-10)
**And** downstream device queries receive site filter context (FR-10)
**When** user switches back to "All Sites"
**Then** site filter is cleared and full fleet scope is restored

## Epic 2: Fleet Device Operations

Fleet administrators and operators can bulk-onboard devices, triage the fleet registry with filters and sort, and drill into per-device operational insight across all detail tabs.

### Story 2.1: Domain Entities & Device API Layer

As a developer,
I want typed domain entities and API adapters for devices and uploads,
So that device features share consistent data shapes and error handling.

**Acceptance Criteria:**

**Given** the application foundation is in place
**When** `src/entities/` is imported
**Then** `Device`, `Site`, `DeviceFilter`, and upload-related types are defined once (AD-6)
**And** `devicesApi.list`, `devicesApi.getById`, `devicesApi.remove`, and `uploadApi.parse`/`uploadApi.commit` exist in `src/api/` with DTO→entity mapping (AD-3)
**And** MSW handlers intercept the same URL paths at `src/mocks/` (AD-4)
**And** mock fixture data includes multi-site hierarchy and mixed device types (Air, Water, Cooler)
**And** API failures throw `ApiError` with user-facing message (AD-9, NFR-5)

### Story 2.2: Device Store & Status Polling

As an authenticated operator,
I want device status to refresh automatically,
So that I see current connection and operational state without manual reload.

**Acceptance Criteria:**

**Given** the user navigates to any Devices route
**When** the Devices feature mounts
**Then** `useDeviceStore` fetches device list via `devicesApi.list` (AD-2)
**And** a 30-second `setInterval` poll refreshes device data (AD-8)
**When** the user leaves all Devices routes
**Then** polling stops and interval is cleared (AD-8)
**And** list and detail views read from the same store cache (AD-6, AD-8)
**And** 500-row list filter/sort operations complete within 2 seconds (NFR-1)

### Story 2.3: Bulk Device Upload Flow

As a fleet administrator,
I want to bulk-onboard devices via XLSX upload,
So that I can provision an entire site roster without one-by-one entry.

**Acceptance Criteria:**

**Given** the user navigates to `/devices/upload`
**When** the upload page renders
**Then** dashed upload zone with cloud icon, drag-and-drop, and Browse link is displayed per UX-DR11 (FR-12)
**And** "Supported Formats: XLSX" label is spelled correctly (UX-DR11)
**And** "Download Template" link downloads XLSX with columns: Device Name, Serial Number, MAC Address, Model Number, Site, Floor, Area, Device Type (FR-13)
**When** user drags or browses a non-`.xlsx` file
**Then** rejection error displays: "Upload failed — only .xlsx files are accepted" (FR-12, UX-DR30)
**When** user uploads a valid `.xlsx` file
**Then** filename row appears with remove (X) control (FR-12)
**When** user clicks Load Data
**Then** file is parsed and per-row validation results display — invalid rows show error details, valid rows marked ready (FR-14)
**When** user clicks Save & Next with all rows valid
**Then** devices are committed to registry and user navigates to device list (FR-15)
**When** user clicks Cancel or back arrow
**Then** upload session is discarded and user returns to previous view (FR-15)

### Story 2.4: Device List & Empty States

As an authenticated operator,
I want to view a searchable device registry table,
So that I can scan fleet status and open any device for detail.

**Acceptance Criteria:**

**Given** the user navigates to `/devices` with Application Shell visible
**When** devices exist in the registry
**Then** data table displays devices with status icon cluster (Wi-Fi, power, alert, mode) per UX-DR20 (FR-16)
**And** list respects Site Selector scope from shell store (FR-16, FR-10)
**When** user clicks a table row
**Then** user navigates to `/devices/:id/overview` (FR-16)
**When** no devices exist in the fleet
**Then** empty state shows "No devices yet. Upload devices to get started." with link to Upload (UX-DR27)
**When** page is loading
**Then** skeleton rows matching table layout are displayed (UX-DR27)
**When** filters yield zero results
**Then** empty state shows "No devices match these filters." with Clear filters action (UX-DR27, UX-DR30)

### Story 2.5: Filters Panel

As an operations manager,
I want to filter the device list by site hierarchy, connection, type, power, and mode,
So that I can find units needing attention in seconds.

**Acceptance Criteria:**

**Given** the user is on the device list
**When** user opens the Filters panel
**Then** slide-over renders from right (~400px desktop, full-width tablet) per UX-DR17 (FR-17)
**And** cascading dropdowns for Location → Floor → Area are displayed (FR-17)
**And** multi-select chips for Connection, Device Type, Power, and Mode use `FilterChip` with `aria-pressed` (FR-17, UX-DR7, UX-DR28)
**When** user clicks Clear all
**Then** all filter selections reset to defaults (FR-17)
**When** user clicks Apply
**Then** panel closes, list refreshes with matching count (e.g., "4 devices match your filters"), and filters persist in session (FR-17, UX-DR30)
**When** user presses Escape or clicks outside
**Then** panel dismisses per UX-DR29

### Story 2.6: Sort Panel & Row Actions

As an authenticated operator,
I want to sort the device list and manage individual devices,
So that I can organize triage results and maintain the registry.

**Acceptance Criteria:**

**Given** the user is on the device list
**When** user opens the Sort panel
**Then** Ascending/Descending radio order and sort fields (Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours) are displayed per UX-DR18 (FR-18)
**When** user clicks Reset
**Then** sort returns to default (FR-18)
**When** user clicks Apply
**Then** list re-sorts and panel closes (FR-18)
**When** user opens row kebab menu
**Then** Edit and Remove options are displayed (FR-19)
**When** user selects Remove
**Then** confirmation dialog shows device name and requires confirm before soft delete (FR-19, UX-DR29)
**When** user selects Edit
**Then** user navigates to minimal edit form for name, location, and contact (FR-19)

### Story 2.7: Device Detail Header & Tab Navigation

As a field technician,
I want a consistent device header and sub-tab navigation,
So that I can access all operational surfaces for a single unit.

**Acceptance Criteria:**

**Given** the user navigates to `/devices/:id`
**When** Device Detail renders
**Then** header shows breadcrumb, back arrow, device name, Online/Offline badge, device type badge, metadata row, contact block, location hierarchy, and Insight card per UX-DR19 (FR-20)
**And** Insight card uses left blue accent bar per UX-DR13 (UX-DR13)
**And** sub-nav tabs display: Overview, Analytics, Controls, Schedule, Maintenance, Device Info (FR-21)
**When** user clicks a tab
**Then** active tab shows blue pill background, URL updates to `/devices/:id/:tab`, and content loads without full page reload (FR-21, UX-DR10)
**When** user clicks back arrow
**Then** user returns to device list (UX-DR19)
**And** header and insight card persist across all tab changes (FR-20)

### Story 2.8: Overview & Analytics Tabs

As a facility manager,
I want operational summary and historical analytics for a device,
So that I can assess health and runtime trends at a glance.

**Acceptance Criteria:**

**Given** the user is on the Overview tab
**When** tab content renders
**Then** Total Runtime bar chart shows Last 7 days Heating (orange) and Cooling (blue) kWh (FR-22, UX-DR21)
**And** Weather 7-day forecast strip, Alerts & Health list, Comfort & Temperature grid, and Maintenance & Service summary are displayed (FR-22)
**And** chart includes text summary for screen readers (UX-DR28)
**Given** the user navigates to Analytics tab
**When** tab content renders
**Then** historical runtime line chart displays date range and hours (FR-23, UX-DR22)
**And** summary shows total runtime with week-over-week insight in Insight card (FR-23)

### Story 2.9: Controls & Maintenance Tabs

As an HVAC technician,
I want to adjust setpoints and review service records,
So that I can act on-site and plan maintenance visits.

**Acceptance Criteria:**

**Given** the user is on the Controls tab with an online device
**When** tab content renders
**Then** circular dial gauges display Set Point Cool Limit, Temperature Lockout Cool, and Temperature Lockout Heat with arrow steppers (FR-24, UX-DR23)
**When** user adjusts a setpoint via arrow buttons
**Then** dial reflects new value (FR-24)
**Given** the device is offline
**When** Controls tab renders
**Then** all dials are disabled with N/A grey state and tooltip "Device offline" (FR-24, UX-DR27, UX-DR30)
**Given** the user is on the Maintenance tab
**When** tab content renders
**Then** warranty date grid, notes textarea ("Write notes" placeholder), and documents section are displayed (FR-25, UX-DR24)
**And** Next Service Due shows warning icon when due (FR-25)

### Story 2.10: Device Info & Schedule Stub

As a field technician,
I want to view technical device metadata and see Schedule as a future capability,
So that I can verify hardware details on-site and know what is coming next.

**Acceptance Criteria:**

**Given** the user is on the Device Info tab
**When** tab content renders
**Then** two-column key-value grids show Device Details, Device Status, and Temperature Details per UX-DR25 (FR-26)
**Given** the user clicks the Schedule tab
**When** tab content renders
**Then** placeholder displays "Coming in Phase 2" message with navigation escape (FR-27, UX-DR27)
**And** Schedule tab remains visible in tab bar (FR-27)
