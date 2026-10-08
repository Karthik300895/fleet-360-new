---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T04:37:14.626Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: "PRD: Fleet 360"
created: "2026-09-23"
updated: "2026-09-23"
---

# PRD: Fleet 360

## 0. Document Purpose

This PRD defines Phase 1 functional and non-functional requirements for **Fleet 360** — a browser-based fleet management application for connected HVAC and building-automation devices. It is written for product stakeholders, UX designers, architects, and engineering leads who will produce downstream artifacts (`acl-ux`, `acl-architecture`, `acl-create-epics-and-stories`).

The document builds on the approved Product Brief (`brief-fleet-360-new-2026-09-23`) and its addendum (page-level UX specifications). Vocabulary is anchored in §3 Glossary; features are grouped in §5 with globally numbered FRs. Inferred decisions are tagged `[ASSUMPTION]` inline and indexed in §11.

**Design references:** [Figma — Fleet 360_BK](https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811) · Local screenshots: `public/Fleet 360_BK (2)/`

---

## 1. Vision

Fleet 360 is the operational control plane for distributed commercial HVAC fleets. Facility and operations teams currently juggle spreadsheets, vendor portals, and site-specific tools to answer basic questions: *Which units are offline? Where is that RTU? What do I do about this alert?* Fleet 360 replaces that fragmentation with a single web application that spans authentication, module navigation, and deep per-device operational insight.

Phase 1 delivers the foundation — **Login**, **Landing**, and **Devices** — so operators can securely access the product, discover modules, onboard devices in bulk, filter and sort a fleet-wide device registry, and drill into individual units across Overview, Analytics, Controls, Maintenance, and Device Info surfaces. Every subsequent module (Dashboard, Sites, Users, Alarms) builds on this shell and data model.

The product is branded **Fleet 360** within the VelocityOne / ACL Digital ecosystem and targets enterprise facility teams managing Air, Water, and Cooler device types across a multi-site hierarchy (Site → Floor → Area → Device).

---

## 2. Target User

### 2.1 Jobs To Be Done

- **As a Facility Manager**, I need to see fleet health across all Sites so I can prioritize morning triage without opening five different tools.
- **As an Operations Manager**, I need to filter hundreds of devices by connection status, type, and power mode so I can find units that need attention in seconds.
- **As a Field Technician**, I need all operational data for a single RTU on one screen — controls, maintenance history, serial/MAC metadata — so I can act on-site without calling the office.
- **As a Fleet Administrator**, I need to bulk-onboard devices via spreadsheet so greenfield fleet setup does not require one-by-one provisioning.
- **As a Security-conscious Enterprise**, I need branded, consent-aware authentication so users trust the entry point and legal obligations are met.

### 2.2 Non-Users (v1)

- **End occupants / tenants** — no resident-facing features in Phase 1.
- **Hardware installers** — provisioning workflows beyond spreadsheet upload are out of scope.
- **Finance / billing analysts** — energy cost analytics exist as insight cards only; no billing module.
- **Mobile field workers requiring offline access** — web-only; no native mobile app.

### 2.3 Key User Journeys

**UJ-1. Marcus signs in and reaches the Devices module.**

Marcus, a facility manager at a multi-site property group, opens Fleet 360 in Chrome on his desktop. He is unauthenticated. He enters his corporate email and password on the Login page, accepts the legal consent copy, and clicks Login. On success he lands on the Landing page, reads the three module cards, and clicks **Manage Devices** on the Devices card. He arrives in the Devices module with the application shell visible — site selector showing "All Sites", primary nav active on Devices. **Climax:** Marcus is in the device registry within three clicks of authentication. **Resolution:** He can now filter, upload, or open a device. **Edge case:** Invalid credentials show an error message; Marcus corrects his password and retries without losing form input.

**UJ-2. Priya bulk-onboards a new site's device roster.**

Priya, fleet administrator, navigates to Devices → Upload Devices. She downloads the XLSX template, fills in 120 rows (device name, serial, MAC, model, site, floor, area, type), and drags the file into the upload zone. She clicks **Load Data**; the system parses the file and surfaces two rows with validation errors. She fixes the spreadsheet offline, re-uploads, and clicks **Save & Next**. **Climax:** All 120 devices appear in the device list under the correct Site hierarchy. **Resolution:** Priya returns to the list view ready for operations handoff. **Edge case:** A non-XLSX file is rejected with a clear format error.

**UJ-3. Marcus triages offline Cooler units at Northridge Middle.**

Marcus is authenticated in the Devices module with site selector set to "All Sites". He opens the Filters panel, selects Site hierarchy **Northridge Middle → Ivy Manor → 3rd Floor**, Connection **Inactive**, and Device Type **Cooler**, then clicks Apply. The device list narrows to four units. He sorts by Device Name ascending and clicks the first row. The Device Detail header shows Online/Offline badges, contact, location, and an Insight card. He switches to the Maintenance tab to check next service due. **Climax:** Marcus identifies which Cooler needs a field visit without leaving Fleet 360. **Resolution:** He calls the on-site contact listed in the device header.

**UJ-4. Diego adjusts a setpoint from the Controls tab.**

Diego, HVAC technician, opens device **RTU F202401367** from a shared link. He is already authenticated. The Device Detail header shows the unit is Online (Cooler type). He navigates to the Controls tab and uses the circular dial to lower the Set Point Cool Limit by 2°F using the arrow buttons. **Climax:** The adjusted setpoint is reflected in the control UI. **Resolution:** Diego confirms the change and moves to the Device Info tab for serial number verification. **Edge case:** If the device is Offline, controls display a disabled/N/A state and Diego cannot submit changes. [ASSUMPTION: Phase 1 may use mock/simulated control state if live IoT write-back is not integrated.]

---

## 3. Glossary

| Term | Definition |
|------|------------|
| **Device** | A connected HVAC or building-automation unit (Air, Water, or Cooler type) registered in Fleet 360 with serial number, MAC address, and Site placement. |
| **Site** | A top-level physical location (e.g., Northridge Middle) in the organizational hierarchy. Contains Floors. |
| **Floor** | A subdivision of a Site (e.g., 3rd Floor). Contains Areas. |
| **Area** | A subdivision of a Floor (e.g., Reception). A Device is assigned to exactly one Area. |
| **Fleet** | The aggregate of all Devices across all Sites accessible to the authenticated user. |
| **Site Selector** | Header control allowing the user to scope data to All Sites or a single Site. |
| **Application Shell** | The persistent post-login chrome: logo, Site Selector, primary navigation, notification bell, profile avatar. |
| **Module** | A major product area accessed from Landing or primary nav: Devices, Sites, Users, Dashboard, Alarms. |
| **Device Detail** | The per-Device view with shared header and sub-tabs (Overview, Analytics, Controls, Schedule, Maintenance, Device Info). |
| **Insight Card** | Contextual alert or anomaly summary displayed in the Device Detail header; content varies by tab and device state. |
| **Connection Status** | Whether a Device has an active network link: Active or Inactive. |
| **Power Status** | Operational power state: Running, Standby, or Offline. |
| **Mode** | HVAC operating mode: Heat, Cool, Dry, Fan, or Heat/Cool. |
| **Upload Template** | Standard XLSX file defining required columns for bulk Device onboarding. |

---

## 4. Platform

| Attribute | Phase 1 Requirement |
|-----------|---------------------|
| **Form factor** | Responsive web application (desktop-first; tablet acceptable) |
| **Browsers** | Latest two versions of Chrome, Edge, Firefox, Safari |
| **Authentication** | Email + password via REST API [ASSUMPTION: custom auth backend; no SSO/MFA in Phase 1] |
| **Data refresh** | Polling interval for device status [ASSUMPTION: 30-second poll; WebSocket deferred] |
| **Offline** | Not supported — requires network connectivity |
| **Localization** | English only for Phase 1 |

---

## 5. Features

### 5.1 Authentication (Login)

**Description:** Branded Login surface establishes secure access to Fleet 360. Split-layout page with form panel (left) and industrial HVAC hero imagery (right). Users authenticate with email and password, acknowledge legal consent, and proceed to Landing on success. Realizes UJ-1.

**Functional Requirements:**

#### FR-1: Email and password login

An unauthenticated User can submit email and password credentials to authenticate into Fleet 360. Realizes UJ-1.

**Consequences (testable):**
- Login form displays Email and Password fields with labels and placeholders per design spec.
- Submitting valid credentials returns a session token and redirects to Landing.
- Submitting invalid credentials displays an error without redirecting.
- Pressing Enter in either field submits the form when both fields are populated.

#### FR-2: Pre-submit validation

The system validates email format and non-empty password before accepting a login attempt. Realizes UJ-1.

**Consequences (testable):**
- Malformed email shows inline validation error; submit is blocked.
- Empty password shows inline validation error; submit is blocked.

#### FR-3: Legal consent display

The Login page displays Terms & Conditions and Privacy Notice links with consent copy. Realizes UJ-1.

**Consequences (testable):**
- Consent copy reads: "By clicking login, you hereby agree to our Terms and Conditions & Privacy Notice."
- Terms and Privacy links are clickable and open policy content (modal or external page).

#### FR-4: Forgot Password entry point

The Login page displays a Forgot Password link. Realizes UJ-1.

**Consequences (testable):**
- Forgot Password link is visible below the password field.
- Clicking the link navigates to a password-reset flow or displays a "Coming soon" stub [ASSUMPTION: UI-only stub for Phase 1 unless security review mandates full flow].

#### FR-5: Branded presentation

The Login page renders Fleet 360 branding and ACL Digital footer per Figma. Realizes UJ-1.

**Consequences (testable):**
- Product title "Fleet 360" appears in the form area.
- Footer displays "Powered by" with ACL Digital logo.
- Layout matches `Login.jpg` reference within design-tolerance guidelines.

---

### 5.2 Landing Hub

**Description:** Post-login destination presenting three module entry cards — Devices, Sites, Users — in a marketing-style two-band layout without the Application Shell header. Devices CTA is fully functional; Sites and Users route to Phase 2 stubs. Realizes UJ-1.

**Functional Requirements:**

#### FR-6: Landing page layout

An authenticated User sees the Landing page as the default post-login destination. Realizes UJ-1.

**Consequences (testable):**
- Top band displays centered Fleet 360 logo and welcome copy per design spec.
- Bottom band displays three equal module cards: Devices, Sites, Users.
- Landing page does not render the Application Shell header [per Figma].

#### FR-7: Devices module navigation

An authenticated User can navigate from Landing to the Devices module via the Manage Devices CTA. Realizes UJ-1.

**Consequences (testable):**
- Clicking Manage Devices on the Devices card navigates to the Devices module.
- Application Shell appears upon entering Devices.

#### FR-8: Sites and Users stub navigation

An authenticated User clicking Manage Sites or Manage Users sees a Phase 2 placeholder. Realizes UJ-1.

**Consequences (testable):**
- Sites and Users CTAs navigate to a "Coming soon" stub page or display a disabled-state message [ASSUMPTION: minimal stub page with back navigation].
- Stub pages do not expose incomplete CRUD functionality.

---

### 5.3 Application Shell

**Description:** Persistent header chrome on all authenticated routes except Landing. Provides Site Selector, primary navigation (Dashboard, Devices, Sites, Users, Alarms), notification bell, and profile avatar. Active nav item shows blue icon, label, and red bottom border. Realizes UJ-3, UJ-4.

**Functional Requirements:**

#### FR-9: Application Shell rendering

An authenticated User sees the Application Shell on Devices and Device Detail routes. Realizes UJ-3.

**Consequences (testable):**
- Header contains: Fleet 360 logo, Site Selector, nav items (Dashboard, Devices, Sites, Users, Alarms), notification bell, profile avatar.
- Devices nav item shows active state when user is in Devices module.

#### FR-10: Site Selector

An authenticated User can scope fleet data via the Site Selector dropdown. Realizes UJ-3.

**Consequences (testable):**
- Default selection is "All Sites".
- Dropdown lists available Sites (e.g., Northridge Middle, Orchid, Greenwood Corporate, Summit Industrial Park, Sunrise Villa, Urban Heaven).
- Selecting a Site filters device list and detail context to that Site [ASSUMPTION: Phase 1 uses client-side or API filter param].

#### FR-11: Navigation stubs for out-of-scope modules

Primary nav items for Dashboard, Sites, Users, and Alarms route to Phase 2 stubs when clicked. Realizes UJ-3.

**Consequences (testable):**
- Clicking Dashboard, Sites, Users, or Alarms from nav shows stub/coming-soon page.
- Devices nav item is fully functional.

---

### 5.4 Device Upload

**Description:** Bulk onboarding flow allowing Fleet Administrators to upload an XLSX roster, validate rows, preview parsed data, and commit devices to the registry. Realizes UJ-2.

**Functional Requirements:**

#### FR-12: Upload zone

A Fleet Administrator can upload device data via drag-and-drop or file browse. Realizes UJ-2.

**Consequences (testable):**
- Upload zone displays dashed border, cloud icon, and "Drag & drop files or Browse" copy.
- Only `.xlsx` files are accepted; other formats show a rejection error.
- Uploaded filename appears in a file row with remove (X) control.

#### FR-13: Template download

A Fleet Administrator can download the standard Upload Template. Realizes UJ-2.

**Consequences (testable):**
- "Download Template" link is visible below the upload zone.
- Downloaded file contains columns: Device Name, Serial Number, MAC Address, Model Number, Site, Floor, Area, Device Type [ASSUMPTION: column set per addendum].

#### FR-14: Parse and validate

A Fleet Administrator can parse an uploaded file and see per-row validation results. Realizes UJ-2.

**Consequences (testable):**
- Clicking "Load Data" triggers server-side or client-side parse.
- Invalid rows display error details (missing required field, invalid device type, unknown Site).
- Valid rows are marked ready for commit.

#### FR-15: Commit or cancel upload

A Fleet Administrator can save parsed devices or cancel the upload. Realizes UJ-2.

**Consequences (testable):**
- "Save & Next" commits valid rows to the Device registry and navigates to device list or confirmation.
- "Cancel" discards the upload session and returns to the previous view.
- Back arrow navigates away from Upload Devices page.

---

### 5.5 Device List, Filters, and Sort

**Description:** Searchable, filterable, sortable registry of Devices. Users apply multi-dimensional filters (Site hierarchy, Connection, Type, Power, Mode), sort by operational fields, and navigate to Device Detail. Row-level kebab menu supports Edit and Remove. Realizes UJ-3.

**Functional Requirements:**

#### FR-16: Device list display

An authenticated User can view a list of Devices scoped by Site Selector and active filters. Realizes UJ-3.

**Consequences (testable):**
- List displays devices with status indicators (connection, power, alert, mode icons per design).
- List layout is a data table [ASSUMPTION: tabular layout; card grid deferred].
- Clicking a row navigates to Device Detail for that Device.
- Empty state displays when no devices match filters.

#### FR-17: Filters panel

An authenticated User can filter the device list by Site hierarchy, Connections, Device Type, Power, and Mode. Realizes UJ-3.

**Consequences (testable):**
- Filters panel opens as slide-over or modal with categories per design spec.
- Site hierarchy uses cascading dropdowns: Location → Floor → Area.
- Connection, Type, Power, and Mode use multi-select chips with toggle selection.
- "Clear all" resets all filters to defaults.
- "Apply" closes panel and refreshes list; filters persist in session until cleared.

#### FR-18: Sort panel

An authenticated User can sort the device list by field and order. Realizes UJ-3.

**Consequences (testable):**
- Sort panel offers Order: Ascending or Descending (radio).
- Sort by options: Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours.
- "Reset" clears sort to default; "Apply" applies sort and refreshes list.

#### FR-19: Row actions

An authenticated User can Edit or Remove a Device from the list kebab menu. Realizes UJ-3.

**Consequences (testable):**
- Kebab menu offers Edit and Remove options.
- Remove triggers a confirmation dialog before deletion [ASSUMPTION: soft delete with confirmation].
- Edit navigates to a device edit form [ASSUMPTION: minimal edit form for name, location, contact in Phase 1].

---

### 5.6 Device Detail

**Description:** Rich per-Device operational view with shared header (breadcrumb, status badges, contact, location, Insight card) and sub-tabs: Overview, Analytics, Controls, Schedule, Maintenance, Device Info. Realizes UJ-3, UJ-4.

**Functional Requirements:**

#### FR-20: Device Detail header

An authenticated User viewing a Device sees a consistent header across all sub-tabs. Realizes UJ-3, UJ-4.

**Consequences (testable):**
- Header shows breadcrumb (Manage Devices / {device name}), back arrow, device name, Online/Offline badge, device type badge (Cooler/Air/Water).
- Header shows MAC, serial, software version, contact name/phone, and location (Site, Area, Floor, room).
- Insight card displays contextual text; content may vary by active tab.

#### FR-21: Sub-tab navigation

An authenticated User can navigate among Device Detail sub-tabs. Realizes UJ-3, UJ-4.

**Consequences (testable):**
- Tabs: Overview, Analytics, Controls, Schedule, Maintenance, Device Info.
- Active tab shows blue pill background with white text.
- Tab content loads without full page reload.

#### FR-22: Overview tab

An authenticated User can view operational summary on the Overview tab. Realizes UJ-3.

**Consequences (testable):**
- Total Runtime section shows Last 7 days with Heating (orange) and Cooling (blue) bar charts in kWh.
- Weather section shows 7-day forecast with icons and °F.
- Alerts & Health lists Critical (red) and Warning (yellow) items with timestamps and "View all" link.
- Comfort & Temperature shows Current Room, Set Point, Supply Air, Return Air, Humidity %.
- Maintenance & Service shows Last Service, Filter Health %, Next Scheduled Service, Faults in Last 30 Days.

#### FR-23: Analytics tab

An authenticated User can view historical runtime analytics. Realizes UJ-3.

**Consequences (testable):**
- Historical Runtime line chart displays date range on X-axis, hours on Y-axis.
- Summary shows total runtime; Insight card may show week-over-week delta (e.g., "Runtime increased by 12%").

#### FR-24: Controls tab

An authenticated User can view and adjust temperature setpoints on the Controls tab. Realizes UJ-4.

**Consequences (testable):**
- Circular dial controls display Set Point Cool Limit, Temperature Lockout Cool, Temperature Lockout Heat.
- Arrow buttons adjust values; inactive lockouts show N/A grey state.
- Offline devices disable control interaction [ASSUMPTION: mock state acceptable if IoT write-back not integrated].

#### FR-25: Maintenance tab

An authenticated User can view warranty and service information. Realizes UJ-3.

**Consequences (testable):**
- Warranty grid shows Installation Date, Parts Warranty, Labour Warranty, Periodic Service, Last Service Date, Next Service Due (warning icon if due).
- Notes free-text area with placeholder "Write notes".
- Documents section lists uploaded files or upload area.

#### FR-26: Device Info tab

An authenticated User can view technical device metadata. Realizes UJ-4.

**Consequences (testable):**
- Device Details: Name, Software Version, Model Number, Location, Serial, MAC.
- Device Status: Compressor RPM, pressures, EXV position, voltage, heat cycles, current.
- Temperature Details: Set Point, Heating Hrs, Cooling Hrs.

#### FR-27: Schedule tab stub

The Schedule tab is present in navigation but content is deferred. Realizes UJ-4.

**Consequences (testable):**
- Schedule tab is visible in tab bar.
- Clicking Schedule shows placeholder content or "Coming in Phase 2" message [ASSUMPTION: tab stub acceptable for Phase 1].

---

## 6. Non-Goals (Explicit)

- Fleet 360 is **not** a building management system (BMS) replacement — it is a fleet operations layer, not a full BACnet/programming tool.
- Fleet 360 will **not** provide native mobile apps in Phase 1.
- Fleet 360 will **not** implement real-time IoT telemetry ingestion in Phase 1 — device data may be served via mock API or contract-defined REST endpoints.
- Fleet 360 will **not** deliver SSO, MFA, or enterprise IdP integration in Phase 1 unless mandated by security review.
- Fleet 360 will **not** implement alarm notification delivery, Dashboard analytics, Sites CRUD, or Users RBAC in Phase 1.

---

## 7. MVP Scope

### 7.1 In Scope

| Area | Deliverables |
|------|-------------|
| **Login** | Email/password auth, validation, legal consent, branded layout, Forgot Password link |
| **Landing** | Three module cards; Devices CTA live; Sites/Users stubs |
| **Application Shell** | Site Selector, primary nav, notification bell, profile avatar |
| **Upload Devices** | XLSX upload, template download, parse/validate, Save & Next / Cancel |
| **Device List** | Table view, filter panel, sort panel, row navigation, kebab actions |
| **Device Detail** | Header, Overview, Analytics, Controls, Maintenance, Device Info tabs; Schedule stub |
| **Design fidelity** | Implemented screens match Figma for Login, Landing, Devices shell |

### 7.2 Out of Scope for MVP

| Item | Reason |
|------|--------|
| Dashboard module | Separate epic; design exists but not Phase 1 |
| Sites module (beyond stub) | Phase 2 |
| Users module / RBAC (beyond stub) | Phase 2 |
| Alarms list and push notifications | Requires backend notification service |
| Live IoT telemetry pipeline | Mock/contract API only for Phase 1 |
| SSO / MFA | Deferred unless security gate |
| Schedule tab implementation | Design incomplete in screenshot set |
| Mobile-native apps | Web-only Phase 1 |
| WebSocket real-time updates | Polling assumed sufficient for Phase 1 |

---

## 8. Success Metrics

**Primary**

- **SM-1: Authentication efficiency** — Users complete login and reach Landing in ≤ 3 clicks. Validates FR-1, FR-6.
- **SM-2: Module discovery** — ≥ 90% of test users identify the path to Devices from Landing without guidance. Validates FR-7.
- **SM-3: Bulk upload success** — Admin uploads a valid XLSX and sees parsed file ready to load on first attempt. Validates FR-12, FR-14.
- **SM-4: Filter efficacy** — User applies Site + Connection + Type filters and sees a narrowed device set matching criteria. Validates FR-17.
- **SM-5: Device detail reachability** — Technician reaches Controls or Maintenance tab from device header in ≤ 2 clicks. Validates FR-20, FR-21.

**Secondary**

- **SM-6: Design fidelity** — Implemented Login, Landing, and Devices screens pass visual review against Figma references. Validates FR-5, FR-6, FR-9.

**Counter-metrics (do not optimize)**

- **SM-C1: Time-on-task for upload** — Do not optimize for fastest possible upload at the expense of validation thoroughness; bad data in the registry is worse than slower onboarding. Counterbalances SM-3.
- **SM-C2: Filter panel open rate** — High filter usage alone is not success if users cannot find devices without filtering; optimize findability, not filter engagement. Counterbalances SM-4.

---

## 9. Cross-Cutting Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| **NFR-1: Performance** | Device list with 500 rows renders and responds to filter/sort within 2 seconds on standard enterprise hardware. |
| **NFR-2: Security** | Passwords transmitted over HTTPS; session tokens stored securely; no credentials in client-side logs. |
| **NFR-3: Accessibility** | Login and primary flows meet WCAG 2.1 AA for contrast, keyboard navigation, and form labels. |
| **NFR-4: Browser support** | Functional on latest two versions of Chrome, Edge, Firefox, Safari. |
| **NFR-5: Error handling** | API failures display user-friendly messages; no raw stack traces in UI. |
| **NFR-6: Session management** | Unauthenticated access to protected routes redirects to Login. |

---

## 10. Open Questions

1. **Authentication provider** — Custom REST auth API vs. OAuth/enterprise IdP? [Default assumption: email/password REST API]
2. **Forgot Password** — Full reset flow or UI-only stub for Phase 1?
3. **Sites/Users stub UX** — Disabled button, "Coming soon" page, or minimal placeholder with back nav?
4. **Device list layout** — Table vs. card grid? [Default assumption: table]
5. **Real-time updates** — WebSocket push vs. polling interval? [Default assumption: 30s poll]
6. **XLSX validation rules** — Exact schema, required fields, and error message format?
7. **Device delete policy** — Soft delete vs. hard delete; audit trail requirements?
8. **Controls write-back** — Live IoT command integration or mock UI state for Phase 1?

---

## 11. Assumptions Index

| # | Assumption | Location |
|---|------------|----------|
| A-1 | Custom email/password auth via REST API; no SSO/MFA in Phase 1 | §4, FR-1 |
| A-2 | Forgot Password is UI stub unless security review requires full flow | FR-4 |
| A-3 | Sites/Users Landing and nav CTAs route to minimal "Coming soon" stub pages | FR-8, FR-11 |
| A-4 | Device list uses tabular layout (not card grid) | FR-16 |
| A-5 | Device status refreshes via 30-second polling (no WebSocket) | §4 |
| A-6 | Upload template columns: Device Name, Serial, MAC, Model, Site, Floor, Area, Device Type | FR-13 |
| A-7 | Device Remove uses soft delete with confirmation dialog | FR-19 |
| A-8 | Device Edit is minimal (name, location, contact) in Phase 1 | FR-19 |
| A-9 | Controls tab may use mock/simulated state if IoT write-back not integrated | FR-24, UJ-4 |
| A-10 | Schedule tab shows placeholder content in Phase 1 | FR-27 |
| A-11 | Differentiation vs. incumbent BMS is UX cohesion and multi-site fleet ops, not proprietary hardware | Inherited from brief |
