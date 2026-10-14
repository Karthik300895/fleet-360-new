---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:01:21.074Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 2.9 — Controls & Maintenance Tabs'
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

**Problem:** Technicians need setpoint controls and service records.

**Approach:** Dial controls with offline disable; maintenance warranty/notes/documents.

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
- [x] `src/features/devices/DeviceDetailTabContent.tsx` -- controls + maintenance -- FR-24, FR-25

**Acceptance Criteria:**
- Given online device on Controls, when arrows used, then dial values change
- Given offline device, when Controls tab, then dials disabled with N/A
- Given Maintenance tab, when rendered, then warranty grid and notes field

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `Manual: dev-003 offline controls` -- expected: pass
