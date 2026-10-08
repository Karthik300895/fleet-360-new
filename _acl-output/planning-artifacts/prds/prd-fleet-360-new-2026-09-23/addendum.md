# Fleet 360 PRD — Technical Addendum

Overflow from `prd.md` — implementation hints, data model, and design tokens for downstream architecture and UX work.

---

## Design System Tokens

| Token | Usage |
|-------|-------|
| Primary blue | Logo "Fleet", active nav icons, links, Site Selector pill, selected filter chips |
| Primary red | CTAs (Login, Manage Devices, Apply, Save & Next), active nav underline, alerts |
| Dark slate | Landing bottom section background, body headings |
| White / light grey | Page backgrounds, card surfaces |
| Status green | Online badge, no-issues indicators |
| Status orange/yellow | Warnings, heating mode |
| Status purple/light blue | Device type badges (Cooler, etc.) |

Typography: clean sans-serif; hierarchy page titles → section headings → labels (grey) → values (black).

---

## Application Shell Wireframe

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Fleet 360  │ [All Sites ▼]     Dashboard  Devices  Sites  Users  Alarms  🔔 👤 │
└─────────────────────────────────────────────────────────────────────────┘
```

Site Selector options (mock): All Sites, Northridge Middle, Orchid, Greenwood Corporate, Summit Industrial Park, Sunrise Villa, Urban Heaven.

---

## Device Entity (Architecture Hint)

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

Site hierarchy: `Site → Floor → Area → Device`

---

## Upload Template Schema (Proposed)

| Column | Required | Validation |
|--------|----------|------------|
| Device Name | Yes | Non-empty string, max 100 chars |
| Serial Number | Yes | Unique per fleet |
| MAC Address | Yes | Valid MAC format |
| Model Number | No | String |
| Site | Yes | Must match known Site name |
| Floor | Yes | Must exist under Site |
| Area | Yes | Must exist under Floor |
| Device Type | Yes | One of: Air, Water, Cooler |

---

## Screen Inventory — Phase 1

| # | Screen | Priority |
|---|--------|----------|
| 1 | Login | P0 |
| 2 | Landing | P0 |
| 3 | Application Shell / Header | P0 |
| 4 | Upload Devices | P0 |
| 5 | Device List (with filter/sort) | P0 |
| 6 | Filters Panel | P0 |
| 7 | Sort Panel | P1 |
| 8 | Device Detail — Overview | P0 |
| 9 | Device Detail — Analytics | P1 |
| 10 | Device Detail — Controls | P1 |
| 11 | Device Detail — Maintenance | P1 |
| 12 | Device Detail — Device Info | P1 |
| 13 | Device Detail — Schedule (stub) | P2 |

---

## Related Designs (Out of Phase 1 Scope)

Same Figma file; reference for nav stubs and future epics:

- Dashboard (`Dashboard.jpg`)
- Sites management (`Manage Sites.png`, `Create Site.png`)
- Users management (`User Manage.png`)
- Alarms (`Manage Alarms List.png`)
- Site detail tabs (Analytics, Controls, Site Info)
