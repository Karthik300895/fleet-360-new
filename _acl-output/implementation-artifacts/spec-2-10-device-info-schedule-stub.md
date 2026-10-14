---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:01:24.286Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 2.10 — Device Info & Schedule Stub'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/planning-artifacts/epics.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Technicians need hardware metadata; Schedule is Phase 2.

**Approach:** Device Info KV grids; Schedule tab shows Phase 2 placeholder with escape.

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

- src/features/devices/DeviceDetailTabContent.tsx

## Tasks & Acceptance

**Execution:**
- [x] `src/features/devices/DeviceDetailTabContent.tsx` -- device-info + schedule stub -- FR-26, FR-27

**Acceptance Criteria:**
- Given Device Info tab, when rendered, then two-column KV grids
- Given Schedule tab, when rendered, then Coming in Phase 2 with back navigation
- Given tab bar, when viewed, then Schedule remains visible

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
