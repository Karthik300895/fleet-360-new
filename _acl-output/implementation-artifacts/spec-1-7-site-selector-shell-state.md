---
status: In Review
title: 'Story 1.7 — Site Selector & Shell State'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/implementation-artifacts/epic-1-scope.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Operators could not scope fleet data by site from the header.

**Approach:** useShellStore with fleet360:shell persistence and SiteSelector dropdown in shell.

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

- src/stores/useShellStore.ts
- src/features/shell/SiteSelector.tsx
- src/features/devices/DevicesRouteLayout.tsx -- site filter on fetch

## Tasks & Acceptance

**Execution:**
- [x] `src/stores/useShellStore.ts` -- site id state + hydrate -- FR-10
- [x] `src/features/shell/SiteSelector.tsx` -- blue pill dropdown -- UX-DR5
- [x] `src/features/devices/DevicesListPage.tsx` -- respects site scope via store polling -- FR-10

**Acceptance Criteria:**
- Given shell visible, when selector opens, then All Sites default and six sites listed
- Given site selected, when devices list loads, then API filter uses siteId
- Given All Sites, when selected, then full fleet scope restored

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `Manual: change site and verify device list count` -- expected: pass
