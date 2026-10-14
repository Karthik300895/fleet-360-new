---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:00:42.341Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 1.6 — Application Shell & Navigation Stubs'
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

**Problem:** Fleet modules lacked persistent header navigation.

**Approach:** ApplicationShell layout with nav, utilities, and ComingSoon stubs for Phase 2 routes.

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

- src/features/shell/ApplicationShell.tsx
- src/features/shell/ComingSoonPage.tsx
- src/app/router.tsx -- shell-wrapped device routes

## Tasks & Acceptance

**Execution:**
- [x] `src/features/shell/ApplicationShell.tsx` -- 64px header nav -- FR-9, UX-DR16
- [x] `src/features/shell/ComingSoonPage.tsx` -- stub escape nav -- FR-11
- [x] `src/app/router.tsx` -- dashboard/sites/users/alarms stubs -- FR-11

**Acceptance Criteria:**
- Given /devices, when rendered, then shell header with five nav items
- Given Devices route, when active, then blue label and red underline
- Given Dashboard nav click, when rendered, then Coming soon with back navigation
- Given viewport <768px, when shell renders, then icon-only nav labels hidden

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `Manual: resize shell nav` -- expected: pass
