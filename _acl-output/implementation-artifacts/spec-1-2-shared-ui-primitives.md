---
status: In Review
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T10:01:58.095Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 1.2 — Shared UI Primitives'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-09-23
review_loop_iteration: 0
baseline_commit: bffbf4a650b1465283b835ebb993b32b73850776
context:
  - _acl-output/implementation-artifacts/epic-1-scope.md
  - _acl-output/implementation-artifacts/spec-1-1-application-foundation-tokens.md
  - _acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Story 1.1 delivered tokens and routing, but `src/shared/ui/` is empty — feature stories (Login, Landing, Shell) would duplicate button, badge, and card styles ad hoc.

**Approach:** Implement the six Epic 1.2 primitives (`ButtonPrimary`, `ButtonOutline`, `ButtonSecondary`, `BadgeOnline`, `BadgeDeviceType`, `CardSurface`) as typed React components with co-located CSS modules referencing design tokens, exported via a barrel file, plus a shared focus-ring utility for all interactive primitives.

## Boundaries & Constraints

**Always:**
- Components live in `src/shared/ui/`; styles use `var(--color-*)`, `var(--spacing-*)`, `var(--radius-*)` — no literal hex/px for tokenized values (AD-7)
- All buttons are native `<button>` elements (or `type="button"` default) supporting `disabled`, standard click handlers, and children for label text
- `BadgeOnline` accepts `status: 'online' | 'offline'` and renders text label ("Online" / "Offline") — not color-only (UX-DR8, UX-DR28)
- `BadgeDeviceType` accepts `type: 'cooler' | 'air' | 'water'` with text label ("Cooler" / "Air" / "Water") (UX-DR9)
- Interactive primitives (`ButtonPrimary`, `ButtonOutline`, `ButtonSecondary`) show blue focus ring on `:focus-visible` (UX-DR28)
- Barrel export at `src/shared/ui/index.ts` re-exports all public components

**Ask First:**
- Adding a dev-only showcase route to visually verify components (not in epics scope)

**Never:**
- Implement SiteSelector, FilterChip, TabActive, UploadZone, InsightCard — those are later stories (UX-DR5–7, 10–13)
- Add Radix, MUI, or other component libraries
- Wire components into Login/Landing pages — Story 1.4/1.5 consume these
- Add Zustand, MSW, or routing changes

</frozen-after-approval>

## Code Map

- `src/shared/ui/.gitkeep` — placeholder only; replace with component files
- `src/shared/styles/tokens.css` — existing token vars; **read-only** — all color/radius/spacing values come from here
- `src/shared/styles/globals.css` — optional place for shared `.focus-ring` utility if not per-module
- `_acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md` — component specs: `button-primary` (red, 44px, md radius), `button-outline` (transparent, red border), `button-secondary` (blue pill), `badge-online`, `badge-device-type`, `card-surface` (white, lg radius, shadow `0 1px 3px rgba(0,0,0,0.08)`)
- `spec-1-1-application-foundation-tokens.md` — continuity: tokens loaded globally; no path aliases; CSS module pattern not yet established — this story sets the convention

## Tasks & Acceptance

**Execution:**
- [x] `src/shared/ui/ButtonPrimary.tsx` + `ButtonPrimary.module.css` -- red CTA, 44px height, md radius, white text, hover state via `--color-primary-red-hover` -- UX-DR2
- [x] `src/shared/ui/ButtonOutline.tsx` + `ButtonOutline.module.css` -- transparent bg, 1px red border, red text, md radius -- UX-DR3
- [x] `src/shared/ui/ButtonSecondary.tsx` + `ButtonSecondary.module.css` -- blue bg, white text, pill radius -- UX-DR4
- [x] `src/shared/ui/BadgeOnline.tsx` + `BadgeOnline.module.css` -- pill badge with "Online"/"Offline" text; green-on-light-green for online, muted for offline -- UX-DR8
- [x] `src/shared/ui/BadgeDeviceType.tsx` + `BadgeDeviceType.module.css` -- pill badge with type-specific bg/fg from device-cooler/air/water tokens and text label -- UX-DR9
- [x] `src/shared/ui/CardSurface.tsx` + `CardSurface.module.css` -- white card, subtle border, lg radius, card shadow; accepts `children` and optional `className` -- UX-DR12
- [x] `src/shared/ui/focus-ring.module.css` or shared mixin -- blue `outline`/`box-shadow` focus ring for `:focus-visible` on buttons -- UX-DR28
- [x] `src/shared/ui/index.ts` -- barrel export all six components and their prop types -- AD-1 shared layer
- [x] Delete `src/shared/ui/.gitkeep` -- replaced by real components

**Acceptance Criteria:**
- Given tokens are loaded, when a feature imports `ButtonPrimary` from `shared/ui`, then it renders a red 44px-tall button with md corner radius and white label text
- Given `ButtonOutline`, when rendered, then it shows transparent background with red border and red text
- Given `ButtonSecondary`, when rendered, then it shows blue pill-shaped button with white text
- Given `BadgeOnline` with `status="online"`, when rendered, then pill displays text "Online" with green-on-light-green styling
- Given `BadgeDeviceType` with `type="cooler"`, when rendered, then pill displays text "Cooler" with purple device-type colors
- Given `CardSurface`, when rendered with children, then white card with subtle border, lg radius, and light shadow wraps content
- Given any button primitive focused via keyboard, when `:focus-visible` is active, then a blue focus ring is visible
- Given `npm run build`, when executed, then build completes with zero TypeScript errors

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: clean build, zero TS errors
- `npm run lint` -- expected: no new lint errors in `src/shared/ui/`

**Manual checks:**
- Import components in a temporary render (e.g. Storybook-less: add to a dev-only fragment or inspect via React DevTools) — verify visual match to DESIGN.md component tokens
- Tab to each button — blue focus ring visible

## Suggested Review Order

**Buttons**

- Primary CTA uses red token, 44px height, and shared focus ring.
  [`ButtonPrimary.tsx:7`](../../src/shared/ui/ButtonPrimary.tsx#L7)

- Outline variant for secondary/cancel actions with red border.
  [`ButtonOutline.tsx:7`](../../src/shared/ui/ButtonOutline.tsx#L7)

- Blue pill secondary action per design system.
  [`ButtonSecondary.tsx:7`](../../src/shared/ui/ButtonSecondary.tsx#L7)

- Shared `:focus-visible` blue ring applied to all buttons.
  [`focus-ring.module.css:5`](../../src/shared/ui/focus-ring.module.css#L5)

**Badges & surfaces**

- Online/offline pill with text labels, not color-only.
  [`BadgeOnline.tsx:14`](../../src/shared/ui/BadgeOnline.tsx#L14)

- Device type pill with cooler/air/water token colors.
  [`BadgeDeviceType.tsx:14`](../../src/shared/ui/BadgeDeviceType.tsx#L14)

- Card wrapper with border, radius, and elevation shadow.
  [`CardSurface.tsx:9`](../../src/shared/ui/CardSurface.tsx#L9)

**Public API**

- Barrel re-exports all primitives and prop types for features.
  [`index.ts:1`](../../src/shared/ui/index.ts#L1)
