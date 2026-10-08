---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T05:25:32.748Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
---

# Input Reconciliation — PRD + Screenshots + Figma

**Sources:** `prd-fleet-360-new-2026-09-23/prd.md`, `brief-fleet-360-new-2026-09-23/addendum.md`, `public/Fleet 360_BK (2)/`, Figma Fleet 360_BK (node 104:7811)  
**Targets:** `DESIGN.md`, `EXPERIENCE.md`  
**Verdict:** PASS — all Phase 1 PRD surfaces captured; assumptions documented.

## Coverage

| PRD / Screenshot Item | Spine Location | Status |
|-----------------------|----------------|--------|
| Login split layout (`Login.jpg`) | DESIGN.md Login Form; EXPERIENCE Flow 1 | Covered |
| Landing two-band, no shell (`Landing.jpg`) | DESIGN.md Landing; EXPERIENCE IA | Covered |
| Application Shell | DESIGN.md Shell Header; EXPERIENCE IA | Covered |
| Upload Devices (`Manage Devices_Card.jpg`) | DESIGN.md Upload Zone; EXPERIENCE Flow 2 | Covered |
| Filters panel (`Filters_Device.png`) | DESIGN.md Filters; EXPERIENCE Component Patterns | Covered |
| Sort panel (`Sorting.png`) | DESIGN.md Sort; EXPERIENCE Component Patterns | Covered |
| Device list table [ASSUMPTION] | DESIGN.md Data Table; EXPERIENCE IA | Covered with tag |
| Device detail header + tabs | DESIGN.md Device Detail; EXPERIENCE Component Patterns | Covered |
| Overview cards (`Frame 1984077425.png`) | DESIGN.md Overview cards | Covered |
| Analytics (`Frame 1984077433.png`) | DESIGN.md Analytics | Covered |
| Controls dials (`Frame 1984077434.png`) | DESIGN.md Controls; EXPERIENCE Flow 4 | Covered |
| Maintenance (`Frame 1984077531.png`) | DESIGN.md Maintenance | Covered |
| Device Info (`Frame 1984077532.png`) | DESIGN.md Device Info | Covered |
| Kebab menu (`Unit_Kebab Menu.png`) | DESIGN.md Data Table | Covered |
| FR-1–FR-27 functional behaviors | EXPERIENCE Component Patterns, State Patterns, Key Flows | Covered |
| Out-of-scope modules (Dashboard, Sites, Users, Alarms) | EXPERIENCE IA stub routes | Covered |

## Dropped / Deferred Ideas

- **XLXS typo in Figma** — Corrected to XLSX in DESIGN.md Do's and Don'ts.
- **Schedule tab detailed design** — Stub only; no screenshot in export set.
- **Device Edit form** — Kebab action noted; form design deferred (OQ-2).
- **Exact Figma hex tokens** — Approximated from screenshots; OQ-5 flags re-validation when Figma MCP available.

## Assumptions Carried Forward

1. Device list uses data table (no list screenshot in export).
2. Landing excludes Application Shell per Figma.
3. Phase 1 controls may use mock/simulated IoT state.
4. 30-second polling for device status refresh.
