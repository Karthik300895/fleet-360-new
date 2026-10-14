---
status: In Review
title: 'Story 2.2 — Device Store & Status Polling'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/implementation-artifacts/spec-2-1-domain-entities-device-api-layer.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Device list did not refresh automatically.

**Approach:** useDeviceStore with 30s polling started/stopped in DevicesRouteLayout.

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

- src/stores/useDeviceStore.ts
- src/features/devices/DevicesRouteLayout.tsx

## Tasks & Acceptance

**Execution:**
- [x] `src/stores/useDeviceStore.ts` -- fetch, startPolling, stopPolling -- AD-8
- [x] `src/features/devices/DevicesRouteLayout.tsx` -- lifecycle hook -- AD-8

**Acceptance Criteria:**
- Given user on /devices, when layout mounts, then list fetch runs and 30s poll starts
- Given user leaves devices routes, when unmount, then interval cleared
- Given detail route, when open, then same store cache used

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `Manual: observe network poll on /devices` -- expected: pass
