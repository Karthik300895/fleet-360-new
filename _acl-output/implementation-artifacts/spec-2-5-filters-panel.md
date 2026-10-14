---
status: In Review
title: 'Story 2.5 — Filters Panel'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Large fleets need fast triage filters.

**Approach:** Slide-over FiltersPanel, FilterChip, session-persisted applied filters.

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

- src/features/devices/panels/FiltersPanel.tsx
- src/shared/ui/FilterChip.tsx
- src/stores/useDeviceListUiStore.ts

## Tasks & Acceptance

**Execution:**
- [x] `src/features/devices/panels/FiltersPanel.tsx` -- slide-over + apply -- FR-17
- [x] `src/features/devices/deviceListUtils.ts` -- client filter -- FR-17

**Acceptance Criteria:**
- Given filters open, when Apply, then panel closes and match count shown
- Given Clear all, when clicked, then defaults restored
- Given Escape/outside click, when triggered, then panel dismisses

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
