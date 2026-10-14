---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:00:39.275Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 1.5 — Landing Hub'
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

**Problem:** Post-login hub was a stub; users could not discover modules.

**Approach:** Two-band Landing with three module cards and CTAs; no Application Shell.

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

- src/features/landing/LandingPage.tsx
- src/features/landing/LandingPage.module.css

## Tasks & Acceptance

**Execution:**
- [x] `src/features/landing/LandingPage.tsx` -- welcome band + module cards -- FR-6
- [x] `src/app/router.tsx` -- protected index route / -- FR-6

**Acceptance Criteria:**
- Given authenticated user on /, when page loads, then two-band layout without shell
- Given Devices card, when Manage Devices clicked, then navigate to /devices with shell
- Given Sites/Users cards, when clicked, then Phase 2 coming-soon routes

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `Manual: login then verify Landing layout` -- expected: pass
