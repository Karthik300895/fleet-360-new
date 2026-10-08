# Fleet 360 — Page Specifications (Addendum)

Derived from Figma design `Fleet 360_BK` and screenshots in `public/Fleet 360_BK (2)/`. This addendum supplements the product brief with implementation-ready UX detail for **Login**, **Landing**, and **Devices**.

---

## Global Design System (shared across authenticated pages)

### Brand & Color

| Token | Usage |
|-------|-------|
| Primary blue | Logo "Fleet", active nav icons, links, site selector pill, selected filter chips |
| Primary red | CTAs (Login, Manage Devices, Apply, Save & Next), active nav underline, alerts |
| Dark slate | Landing bottom section background, body headings |
| White / light grey | Page backgrounds, card surfaces |
| Status green | Online badge, no-issues indicators |
| Status orange/yellow | Warnings, heating mode |
| Status purple/light blue | Device type badges (e.g., Cooler) |

### Typography

Clean sans-serif throughout. Hierarchy: page titles (bold, large) → section headings → labels (grey, smaller) → values (black, medium).

### Application Shell (post-login)

Present on Landing (if extended), Devices, and all authenticated routes:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Fleet 360  │ [All Sites ▼]     Dashboard  Devices  Sites  Users  Alarms  🔔 👤 │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Site selector:** Blue pill dropdown; options include All Sites, Northridge Middle, Orchid, Greenwood Corporate, Summit Industrial Park, Sunrise Villa, Urban Heaven
- **Nav active state:** Blue icon + label, red bottom border
- **Utilities:** Notification bell, circular profile avatar

---

## 1. Login Page

**Reference:** `Login.jpg`

### Layout

- Full-viewport split composition: form panel left (~40%), hero imagery right (~60%)
- Background: industrial outdoor HVAC/fan units with deep navy blue gradient overlay

### Content Blocks

| Element | Specification |
|---------|---------------|
| Product title | "Fleet 360" — white, bold, top-left of form area |
| Email field | Label "Email", placeholder "Enter Email", white input |
| Password field | Label "Password", placeholder "Enter Password", white input |
| Forgot Password | Right-aligned white underlined link below password |
| Login button | Full-width, rounded, red background, white "Login" text |
| Legal copy | "By clicking login, you hereby agree to our Terms and Conditions & Privacy Notice" — links underlined |
| Footer | "Powered by" + ACL Digital logo (ALTEN group) |

### Behaviors

- Validate required email format and non-empty password before submit
- Show inline or toast error on failed authentication
- Successful login → redirect to **Landing** page
- Forgot Password → password reset flow [TBD in open questions]
- Terms/Privacy → modal or external policy pages

### Accessibility

- Labels associated with inputs; keyboard-submit on Enter
- Sufficient contrast on white inputs over dark overlay

---

## 2. Landing Page

**Reference:** `Landing.jpg`

### Layout

Two horizontal bands:

**Top band (white background)**
- Centered logo: "Fleet" in cerulean blue + "360" in charcoal
- Right-aligned welcome block:
  - "Welcome to"
  - "Fleet 360" (large, bold, slate-blue)
  - Body: "Complete visibility into your data, total control over your insights. Empowering secure, real-time analytics with precision and speed."

**Bottom band (dark slate-grey)**
- Three equal columns, each a module entry point

### Module Cards

| Module | Icon | Description | CTA |
|--------|------|-------------|-----|
| **Devices** | Wireframe globe/sphere | "Manage devices effortlessly with unified control and real-time insights." | Manage Devices (red button) → Devices module |
| **Sites** | Map pin in square frame | "Manage sites with seamless oversight and instant control with visual hierarchy" | Manage Sites (red button) → Phase 2 / stub |
| **Users** | Person silhouette | "Assigns roles per site with granular access controls for easy user management." | Manage Users (red button) → Phase 2 / stub |

### Behaviors

- Page is the default post-login destination
- CTAs navigate to respective modules; Devices is fully in scope for Phase 1
- No app shell header on Landing per Figma — standalone marketing-style layout
- [ASSUMPTION] User may also reach Dashboard via direct URL after login; Landing remains optional hub

---

## 3. Devices Module

**References:** `Manage Devices_Card.jpg`, `Filters_Device.png`, `Device Filters.jpg`, `Sorting.png`, `Frame 1984077425.png` (Overview), `Frame 1984077433.png` (Analytics), `Frame 1984077434.png` (Controls), `Frame 1984077531.png` (Maintenance), `Frame 1984077532.png` (Device Info), `Unit_Kebab Menu.png`

### 3.1 Upload Devices

**Route:** Devices → Upload (or first-time onboarding path)

| Section | Detail |
|---------|--------|
| Page title | "Upload Devices" with back arrow |
| Upload zone | Dashed blue border, cloud upload icon, "Drag & drop files or **Browse**", supported format note "XLXS" [sic — implement as XLSX] |
| Template | "Download Template" link below zone |
| File row | Shows uploaded filename (e.g., "Devices List.xlxs"), progress/selection indicator, remove (X), "Load Data" button (red outline) |
| Illustration | Decorative HVAC line-art on right |
| Footer actions | "Save & Next" (solid red), "Cancel" (red outline) |

**Behaviors:**
- Accept `.xlsx` only; reject other formats with error message
- Parse file on "Load Data"; show validation errors per row if schema invalid
- Save & Next → proceed to device list or confirmation step
- Cancel → discard and return to previous view

### 3.2 Filters Panel

**Reference:** `Filters_Device.png` (full), `Device Filters.jpg` (includes Mode)

Slide-over or modal panel:

| Category | Controls |
|----------|----------|
| **Sites** | Hierarchical dropdowns: Location (e.g., Ivy Manor), Floor (All Floors), Area (All Area) — with icons |
| **Connections** | Multi-select chips: Active (Wi-Fi), Inactive (slashed Wi-Fi) |
| **Type of Devices** | Chips: Air (wind), Cooler (snowflake), Water (droplet) |
| **Power** | Chips: Running, Standby, Offline |
| **Mode** | Chips: Heat, Cool, Dry, Fan, Heat/Cool [from Device Filters.jpg] |

**Header:** "Filters" | "Clear all" (red) | Close (X)  
**Footer:** Full-width red "Apply" button

**Behaviors:**
- Chips toggle selected state (light blue bg, blue border)
- Clear all resets to defaults
- Apply closes panel and refreshes device list with filter query params
- Filters persist in session until cleared

### 3.3 Sort Panel

**Reference:** `Sorting.png`

| Section | Options |
|---------|---------|
| Order | Ascending (↑), Descending (↓) — radio with checkmark on selected |
| Sort by | Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours |

**Footer:** Reset (red text), Apply (red button)

### 3.4 Device List [ASSUMPTION — list layout not in provided screenshots]

Expected capabilities based on filters/sort/kebab menu:
- Tabular or card list of devices with status icon row (Wi-Fi, Power, Alert, Heat, Cool, Auto, Humidity, Fan — see `Frame 427319604.png`)
- Per-row kebab menu: **Edit**, **Remove**
- Click row → Device Detail

### 3.5 Device Detail — Shared Header

All device sub-tabs share this header:

```
Manage Devices / RTU F202401367
← RTU F202401367  [Online] [Cooler]
#14-D4-24-BC-19-21 | #W332306439 | Version. 2.3.1.
Contact: Henry A., +1(415)619-9792
Location: Northridge Middle, Ivy Manor, 3rd Floor, Reception
┌ Insight ─────────────────────────────────────┐
│ Contextual insight (varies per tab/device)    │
└──────────────────────────────────────────────┘
```

**Sub-navigation tabs:** Overview | Analytics | Controls | Schedule | Maintenance | Device Info  
Active tab: blue pill background, white text

**Status badges:**
- Online — green pill with connectivity icon
- Device type (Cooler, Air, Water) — colored pill

### 3.6 Device Detail — Tab Content Summary

#### Overview (`Frame 1984077425.png`)
- **Total Runtime:** Last 7 days dropdown; horizontal bars for Heating (orange, kWh) and Cooling (blue, kWh)
- **Weather:** 7-day forecast with icons and °F
- **Alerts & Health:** Critical (red) and Warning (yellow) items with timestamp; "View all" link
- **Comfort & Temperature:** Current Room, Set Point, Supply Air, Return Air, Humidity %
- **Maintenance & Service:** Last Service, Filter Health %, Next Scheduled Service, Faults in Last 30 Days

#### Analytics (`Frame 1984077433.png`)
- **Historical Runtime:** Line chart, date range on X-axis, hours on Y-axis, total runtime summary
- Insight example: "Runtime increased by 12% compared to last week"

#### Controls (`Frame 1984077434.png`)
- **Temperature Set Points:** Circular dial controls for Set Point Cool Limit, Temperature Lockout Cool, Temperature Lockout Heat
- Left/right arrow buttons for adjustment
- N/A state for inactive lockouts (grey)

#### Maintenance (`Frame 1984077531.png`)
- **Warranty grid:** Installation Date, Parts Warranty, Labour Warranty, Periodic Service, Last Service Date, Next Service Due (warning icon if due)
- **Notes:** Free-text area, placeholder "Write notes"
- **Documents:** File list/upload area

#### Device Info (`Frame 1984077532.png`)
- **Device Details:** Name, Software Version, Model Number, Location, Serial, MAC
- **Device Status:** Compressor RPM, pressures, EXV position, voltage, heat cycles, current
- **Temperature Details:** Set Point, Heating Hrs, Cooling Hrs
- HVAC unit illustration on right

#### Schedule
- Referenced in tab bar; detailed design not in provided screenshot set — defer to separate story

### 3.7 Device Row Actions

**Kebab menu** (`Unit_Kebab Menu.png`): Edit | Remove  
- Edit → device edit form [TBD]  
- Remove → confirmation dialog → soft/hard delete per data policy

---

## Data Model Hints (for downstream PRD / Architecture)

### Device (core entity)

```
deviceId, name, serialNumber, macAddress, modelNumber, softwareVersion,
deviceType: Air | Water | Cooler,
connectionStatus: Active | Inactive,
powerStatus: Running | Standby | Offline,
mode: Heat | Cool | Dry | Fan | HeatCool,
siteId, floorId, areaId, locationLabel,
contactName, contactPhone,
insightText, insightSeverity,
online: boolean
```

### Site hierarchy

```
Site → Floor → Area → Device
```

### Upload template (expected columns) [ASSUMPTION]

Device Name, Serial Number, MAC Address, Model Number, Site, Floor, Area, Device Type

---

## Screen Inventory — Phase 1

| # | Screen | Priority |
|---|--------|----------|
| 1 | Login | P0 |
| 2 | Landing | P0 |
| 3 | App Shell / Header | P0 |
| 4 | Upload Devices | P0 |
| 5 | Device List (with filter/sort) | P0 |
| 6 | Filters Panel | P0 |
| 7 | Sort Panel | P1 |
| 8 | Device Detail — Overview | P0 |
| 9 | Device Detail — Analytics | P1 |
| 10 | Device Detail — Controls | P1 |
| 11 | Device Detail — Maintenance | P1 |
| 12 | Device Detail — Device Info | P1 |
| 13 | Device Detail — Schedule | P2 |

---

## Related Designs (out of Phase 1 scope, same Figma file)

- Dashboard (`Dashboard.jpg`) — fleet summary cards, status donut, consumption pie, alerts + map
- Sites management (`Manage Sites.png`, `Create Site.png`)
- Users management (`User Manage.png`)
- Alarms (`Manage Alarms List.png`)
- Site detail tabs (Analytics, Controls, Site Info)

These should be referenced for navigation stubs and architectural planning but are not part of this brief's delivery scope.
