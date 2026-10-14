---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:01:14.707Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 2.7 — Device Detail Header & Tab Navigation'
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

**Problem:** Per-device workflows need consistent header and tabs.

**Approach:** DeviceDetailPage header, InsightCard, tab links updating URL.

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

- src/features/devices/DeviceDetailPage.tsx
- src/features/devices/deviceDetailTabs.ts
- src/shared/ui/InsightCard.tsx

## Tasks & Acceptance

**Execution:**
- [x] `src/features/devices/DeviceDetailPage.tsx` -- header + tabs -- FR-20, FR-21
- [x] `src/app/router.tsx` -- /devices/:id/:tab -- FR-21

**Acceptance Criteria:**
- Given device detail, when rendered, then breadcrumb, badges, insight card visible
- Given tab click, when navigated, then URL updates without full reload
- Given back control, when used, then return to list

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
