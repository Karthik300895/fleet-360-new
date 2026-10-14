---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:00:35.820Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 1.4 — Login Page'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/implementation-artifacts/spec-1-3-authentication-api-session-store-route-guards.md
  - _acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Login route was a placeholder; operators could not authenticate through the branded split-layout experience.

**Approach:** Build `LoginPage` with validation, `useAuthStore.login`, hero imagery, legal copy, and redirect to Landing on success.

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

- src/features/login/LoginPage.tsx — form, validation, auth integration
- src/features/login/LoginPage.module.css — split layout UX-DR14
- src/shared/ui/FleetLogo.tsx — branded title

## Tasks & Acceptance

**Execution:**
- [x] `src/features/login/LoginPage.tsx` -- split layout, labels, submit, error display -- FR-1, FR-5
- [x] `src/features/login/LoginPage.module.css` -- navy panel + hero -- UX-DR14
- [x] `src/app/router.tsx` -- public /login route -- AD-5

**Acceptance Criteria:**
- Given /login, when rendered, then split layout with email/password fields and Login CTA
- Given invalid email or empty password, when submit, then inline errors and no API call
- Given valid credentials, when submit succeeds, then session persists and user lands on /
- Given fail@example.com, when submit, then error shows without redirect

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `npm run lint` -- expected: pass
- `Manual: /login keyboard submit and Forgot Password link` -- expected: pass
