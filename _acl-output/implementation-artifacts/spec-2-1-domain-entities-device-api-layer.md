---
status: In Review
title: 'Story 2.1 — Domain Entities & Device API Layer'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/planning-artifacts/architecture/architecture-fleet-360-new-2026-09-23/ARCHITECTURE-SPINE.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Device features lacked shared entities and API adapters.

**Approach:** Canonical entities, devicesApi/uploadApi, MSW handlers and fixtures.

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

- src/entities/device.ts
- src/api/devicesApi.ts
- src/api/uploadApi.ts
- src/mocks/fixtures/devices.ts
- src/mocks/handlers/devices.ts
- src/mocks/handlers/upload.ts

## Tasks & Acceptance

**Execution:**
- [x] `src/entities/*` -- Device, Site, DeviceFilter, upload types -- AD-6
- [x] `src/api/devicesApi.ts` -- list/get/update/remove -- AD-3
- [x] `src/api/uploadApi.ts` -- parse/commit -- AD-3
- [x] `src/mocks/*` -- aligned URL paths -- AD-4

**Acceptance Criteria:**
- Given MSW enabled, when devicesApi.list called, then typed Device[] returned
- Given API error, when non-2xx, then ApiError thrown
- Given fixtures, when listed, then multi-site mixed device types present

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `npm run lint` -- expected: pass
