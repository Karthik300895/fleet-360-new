---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:01:17.991Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 2.8 — Overview & Analytics Tabs'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/implementation-artifacts/spec-2-7-device-detail-header-tab-navigation.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Managers need runtime summary and trends per device.

**Approach:** DeviceDetailTabContent overview chart + analytics strip with a11y summary.

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
- [x] `src/features/devices/DeviceDetailTabContent.tsx` -- overview + analytics tabs -- FR-22, FR-23

**Acceptance Criteria:**
- Given overview tab, when rendered, then 7-day runtime bars and health sections
- Given analytics tab, when rendered, then historical runtime visualization
- Given overview chart, when inspected, then screen reader summary present

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
