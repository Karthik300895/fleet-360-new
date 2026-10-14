---
status: In Review
title: 'Story 2.6 — Sort Panel & Row Actions'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/implementation-artifacts/spec-2-4-device-list-empty-states.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Operators need sort and per-row maintenance actions.

**Approach:** SortPanel, kebab menu, confirm remove, DeviceEditPage.

## Boundaries & Constraints

**Always:**
- Feature-sliced code under `src/features/devices/` and shared primitives in `src/shared/ui/`
- API access only through `src/api/`; MSW paths must match adapters (AD-3, AD-4)

**Ask First:**
- Adding new npm dependencies beyond `xlsx` for upload template

**Never:**
- Real backend integration or SSR in Phase 1

</frozen-after-approval>

## Code Map

- src/features/devices/panels/SortPanel.tsx
- src/features/devices/ConfirmDialog.tsx
- src/features/devices/DeviceEditPage.tsx

## Tasks & Acceptance

**Execution:**
- [x] `src/features/devices/panels/SortPanel.tsx` -- sort fields -- FR-18
- [x] `src/features/devices/DevicesListPage.tsx` -- kebab edit/remove -- FR-19
- [x] `src/features/devices/DeviceEditPage.tsx` -- minimal edit form -- FR-19

**Acceptance Criteria:**
- Given sort applied, when list renders, then rows ordered by field/direction
- Given remove confirmed, when API succeeds, then row removed
- Given edit saved, when submitted, then detail reflects changes

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
