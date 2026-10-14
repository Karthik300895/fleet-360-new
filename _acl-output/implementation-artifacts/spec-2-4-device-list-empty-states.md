---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:01:01.698Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 2.4 — Device List & Empty States'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/implementation-artifacts/spec-2-2-device-store-status-polling.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Operators needed a scannable registry table.

**Approach:** DevicesListPage with table, indicators, skeleton, and empty states.

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

- src/features/devices/DevicesListPage.tsx

## Tasks & Acceptance

**Execution:**
- [x] `src/features/devices/DevicesListPage.tsx` -- table, skeleton, empties -- FR-16

**Acceptance Criteria:**
- Given devices exist, when list renders, then status icon cluster per row
- Given row click, when activated, then /devices/:id/overview
- Given zero fleet, when loaded, then upload empty state
- Given filters empty result, when applied, then clear filters message

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
