---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T04:45:39.041Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
name: Fleet 360
sources:
  - {planning_artifacts}/prds/prd-fleet-360-new-2026-09-23/prd.md
  - {planning_artifacts}/briefs/brief-fleet-360-new-2026-09-23/addendum.md
updated: 2026-09-23
---

# Fleet 360 — Experience Spine

> Phase 1: Login, Landing, Devices module (upload, list, filters, sort, device detail). Desktop-first responsive web. React + Vite. Visual identity in `DESIGN.md`. Figma: [Fleet 360_BK](https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811). Local refs: `imports/README.md`.

Spines win on conflict with mocks, wireframes, or imports.

## Foundation

- **Form factor:** Responsive web, desktop-first (≥1280px optimal); tablet acceptable; mobile degraded but functional.
- **Stack:** React 18+, Vite, CSS modules or plain CSS per existing project conventions.
- **Auth:** Email + password via REST API; session token stored client-side [ASSUMPTION: JWT in memory or secure cookie].
- **Data refresh:** 30-second polling for device status [ASSUMPTION per PRD].
- **Localization:** English only Phase 1.
- **Visual reference:** `DESIGN.md` tokens via `{path.to.token}` syntax.

## Information Architecture

| Surface | Route (proposed) | Shell? | Reached from | Purpose |
|---------|------------------|--------|--------------|---------|
| Login | `/login` | No | Direct URL, logout | Authenticate |
| Landing | `/` or `/landing` | No | Post-login redirect | Module hub |
| Devices — Upload | `/devices/upload` | Yes | Devices module, onboarding | Bulk XLSX onboarding |
| Devices — List | `/devices` | Yes | Landing CTA, nav, post-upload | Filterable device registry |
| Devices — Detail | `/devices/:id` | Yes | List row click, deep link | Per-device operational view |
| Devices — Detail Tab | `/devices/:id/:tab` | Yes | Tab click | Overview, Analytics, Controls, Schedule, Maintenance, Device Info |
| Stub — Dashboard | `/dashboard` | Yes | Nav | Phase 2 placeholder |
| Stub — Sites | `/sites` | Yes | Nav, Landing CTA | Phase 2 placeholder |
| Stub — Users | `/users` | Yes | Nav, Landing CTA | Phase 2 placeholder |
| Stub — Alarms | `/alarms` | Yes | Nav | Phase 2 placeholder |

**Surface closure:** Every Phase 1 FR maps to a surface above. Schedule tab renders stub content within Device Detail shell (P2 per PRD).

→ Visual references: `imports/README.md`, `public/Fleet 360_BK (2)/`

## Voice and Tone

Microcopy. Brand posture lives in `DESIGN.md`.

| Do | Don't |
|---|---|
| "4 devices match your filters" | "Great job! You found 4 devices!" |
| "Upload failed — only .xlsx files are accepted" | "Oops! Something went wrong" |
| "Device is offline — controls unavailable" | "Sorry, we can't do that right now" |
| "No devices match these filters. Try clearing filters." | "Nothing here yet!" |
| Use exact device/site names from data | Use placeholder lorem in production views |

## Component Patterns

Behavioral specs. Visual specs in `DESIGN.md.Components`.

| Component | Use | Behavioral rules |
|-----------|-----|------------------|
| Login form | `/login` | Validate email format + non-empty password before submit. Enter key submits when valid. Failed auth shows inline error; fields retain input. Success redirects to Landing. |
| Module card CTA | Landing | Manage Devices → `/devices`. Manage Sites/Users → stub pages. |
| Site Selector | Shell | Default "All Sites". Selection scopes list + detail context. Persists in session. Changing site re-fetches filtered data. |
| Primary nav | Shell | Devices fully functional. Dashboard/Sites/Users/Alarms → stub. Active item reflects current module. |
| Upload zone | Upload | Drag-drop or Browse. Accept `.xlsx` only. Show filename row with remove. Load Data parses file. Save & Next commits valid rows → list. Cancel/back discards session. |
| Filters panel | List | Slide-over from right. Cascading Site→Floor→Area dropdowns. Multi-select chips for Connection, Type, Power, Mode. Clear all resets. Apply closes + refreshes list. Filters persist in session. |
| Sort panel | List | Radio order (Asc/Desc). Single sort field selection. Reset clears. Apply closes + re-sorts. |
| Device table row | List | Click row → detail. Status icon cluster per device. Kebab → Edit (TBD form) or Remove (confirm dialog). |
| Device detail header | Detail | Shared across tabs. Back arrow → list. Insight card content varies by tab/device state. |
| Sub-nav tabs | Detail | Overview, Analytics, Controls, Schedule (stub), Maintenance, Device Info. Tab change updates URL segment. |
| Circular dial control | Controls | Arrow buttons adjust setpoint. Offline device → all controls disabled with N/A. [ASSUMPTION: mock state if no IoT write-back] |
| Insight card | Detail header | Contextual anomaly text; severity reflected in emphasis color per `DESIGN.md` |

## State Patterns

| State | Surface | Treatment |
|-------|---------|-----------|
| Unauthenticated | Any protected route | Redirect to `/login` |
| Login validation error | Login | Inline field errors; submit blocked |
| Login auth failure | Login | Error banner below form; fields retained |
| Cold load | List, Detail | Skeleton rows/cards matching layout |
| Empty fleet | List | "No devices yet. Upload devices to get started." + link to Upload |
| Empty filter results | List | "No devices match these filters." + Clear filters action |
| Upload format error | Upload | "Only .xlsx files are accepted." |
| Upload parse errors | Upload | Per-row error list; block Save & Next until resolved |
| Offline device | Controls tab | Dials disabled, N/A values, tooltip "Device offline" |
| Phase 2 stub | Dashboard, Sites, Users, Alarms, Schedule | "Coming soon" message + back/nav escape |
| Session expired | Global | Redirect to Login with "Session expired" toast |

## Interaction Primitives

- **Click** — Primary interaction for nav, CTAs, table rows, chips, tabs.
- **Keyboard** — Tab order follows visual order; Enter submits forms; Escape closes panels.
- **Drag-and-drop** — Upload zone only.
- **Polling** — Device status refreshes every 30s on list and detail surfaces.
- **Panel dismiss** — Filters/Sort: X button, Escape, or Apply closes. Click-outside closes [ASSUMPTION].
- **Confirm destructive** — Remove device requires confirmation dialog with device name.

**Banned Phase 1:** Infinite scroll (use pagination if needed), WebSocket live updates, offline mode, SSO/MFA, native mobile gestures.

## Accessibility Floor

- WCAG 2.1 AA minimum.
- All form inputs have associated `<label>` elements.
- Status badges include text (not color-only): "Online", "Cooler", etc.
- Focus rings visible on all interactive elements using `{colors.primary-blue}` outline.
- Filter chips announce selected/unselected state to screen readers (`aria-pressed`).
- Charts include text summaries (e.g., "Heating: 725 kWh, Cooling: 522 kWh").
- Login inputs meet contrast on navy background (white fields).
- Keyboard: full nav operable without mouse.

## Key Flows

### Flow 1 — Marcus signs in and reaches Devices (UJ-1)

1. Marcus opens Fleet 360 at `/login`. Split layout per `DESIGN.md` Login component.
2. He enters email and password, sees legal consent, clicks `{components.button-primary}` Login.
3. **Climax:** Valid credentials → redirect to Landing. Three module cards visible, no shell.
4. He clicks **Manage Devices** on the Devices card.
5. **Resolution:** Application Shell appears; Devices nav active; device list loads scoped to "All Sites".

**Edge:** Invalid credentials → error message, form input preserved, no redirect.

### Flow 2 — Priya bulk-onboards devices (UJ-2)

1. Priya navigates to `/devices/upload` from list or onboarding path.
2. She downloads the XLSX template, fills 120 rows, drags file into upload zone.
3. File row appears; she clicks **Load Data**. Two rows fail validation.
4. She fixes the spreadsheet offline, re-uploads, Load Data passes.
5. **Climax:** She clicks **Save & Next** — 120 devices committed.
6. **Resolution:** Device list shows new devices under correct Site hierarchy.

**Edge:** `.csv` upload → "Only .xlsx files are accepted."

### Flow 3 — Marcus triages offline Coolers (UJ-3)

1. Marcus is on `/devices` with Site Selector "All Sites".
2. He opens Filters panel, sets Site hierarchy Northridge Middle → Ivy Manor → 3rd Floor, Connection Inactive, Type Cooler, clicks Apply.
3. List narrows to 4 devices. He sorts by Device Name ascending.
4. He clicks the first row → `/devices/:id/overview`.
5. **Climax:** Header shows Offline badge, insight card, Maintenance tab shows next service due.
6. **Resolution:** He calls the on-site contact from the header.

### Flow 4 — Diego adjusts setpoint (UJ-4)

1. Diego opens `/devices/:id/controls` via shared link (already authenticated).
2. Header shows Online + Cooler badges. Controls tab active.
3. He uses arrow buttons on Set Point Cool Limit dial to lower by 2°F.
4. **Climax:** Dial reflects new value.
5. **Resolution:** He switches to Device Info tab to verify serial number.

**Edge:** Device offline → controls disabled, N/A state on dials.

## Responsive & Platform

| Breakpoint | Behavior |
|------------|----------|
| ≥1280px | Full shell, multi-column card grids, side panels 400px |
| 768–1279px | Shell nav may compress labels; card grids 2-column; panels full-width sheet |
| <768px | Icon-only nav [ASSUMPTION]; single-column cards; tables horizontal scroll |

## Inspiration & Anti-patterns

- **From Figma Fleet 360_BK:** Exact shell layout, filter chip pattern, device detail header anatomy, circular dial controls.
- **Rejected — Card grid for device list:** PRD specifies data table for scanability at fleet scale.
- **Rejected — Shell on Landing:** Figma shows standalone marketing layout; shell would break the two-band design.
- **Rejected — Celebratory onboarding animations:** Enterprise ops tool; commit confirmation is sufficient.

## Open Items

| ID | Item | Impact |
|----|------|--------|
| OQ-1 | Forgot Password — full flow vs stub | Login only |
| OQ-2 | Device Edit form design | Kebab Edit action |
| OQ-3 | Schedule tab content | Device detail stub |
| OQ-4 | Pagination vs virtual scroll for large fleets | List performance |
| OQ-5 | Exact hex values — validate against Figma when MCP available | Design fidelity |
