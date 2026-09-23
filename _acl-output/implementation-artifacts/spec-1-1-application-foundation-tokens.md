---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T07:25:44.535Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 1.1 — Application Foundation & Design Tokens'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-09-23
review_loop_iteration: 0
baseline_commit: 7838df0c827ee6a2736b743b80f3c16f76a54b49
context:
  - _acl-output/implementation-artifacts/epic-1-scope.md
  - _acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md
  - _acl-output/planning-artifacts/architecture/architecture-fleet-360-new-2026-09-23/ARCHITECTURE-SPINE.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The brownfield Vite app is a single placeholder screen (`App.tsx` VelocityOne logo) with no routing, no feature-sliced folder structure, and hardcoded colors/fonts in `index.css` — blocking all Epic 1 feature work.

**Approach:** Establish `src/app/` as the bootstrap entry with React Router (public `/login`, protected wrapper), export the full DESIGN.md token set to `src/shared/styles/tokens.css`, wire global styles to load tokens first, and scaffold the architecture folder seed with minimal placeholder routes.

## Boundaries & Constraints

**Always:**
- Feature-sliced layout under `src/` per AD-1: `app/`, `features/`, `entities/`, `api/`, `shared/`, `stores/`, `mocks/`
- Tokens as CSS custom properties in `src/shared/styles/tokens.css`; feature CSS uses `var(--*)` only (AD-7)
- `tokens.css` imported before any other app styles in the bootstrap chain
- Public route: `/login`; protected routes wrapped by `<ProtectedRoute>` (stub auth check — always redirects to `/login` until Story 1.3)
- Do not implement login UI, auth store, MSW, or Zustand in this story

**Ask First:**
- Adding path aliases (`@/`) to `tsconfig`/`vite.config` if relative imports become unwieldy

**Never:**
- Build feature screens (Login form, Landing, Shell) — those are Stories 1.4–1.6
- Install Zustand or MSW (Story 1.3+)
- Delete or break ACL Markdown Studio middleware in `vite.config.ts`
- Use literal hex/px for values that have tokens in feature code added here

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| App boot | `npm run dev` | App renders without console errors; router active | Fix import/path errors before marking done |
| Public route | Navigate to `/login` | Login placeholder page renders (no shell) | N/A |
| Protected route | Navigate to `/` while unauthenticated | Redirect to `/login` | N/A |
| Unknown route | Navigate to `/foo` | Fallback redirect or 404 placeholder | No blank screen |
| Production build | `npm run build` | `tsc -b && vite build` succeeds | Resolve TS errors |
| Vercel SPA | Direct URL hit on `/login` in preview | Page loads (not 404) | SPA rewrite required |

</frozen-after-approval>

## Code Map

- `src/main.tsx` — current entry; replace `App` import with `app/` bootstrap
- `src/App.tsx` + `src/App.css` — placeholder VelocityOne logo; **remove or relocate** — do not leave as parallel entry
- `src/index.css` — hardcoded Roboto/`#f5f7fa`; refactor to import `tokens.css` and use token vars for body defaults
- `index.html` — Inter font preconnect exists (weight 600 only); extend to weights 400/500/600/700 for typography tokens
- `package.json` — React 19.2.8 + Vite 8.2.2 only; **add `react-router-dom`** (arch spine lists React Router 8.4.0)
- `vite.config.ts` — ACL markdown middleware; **read-only** — do not remove `aclMarkdownSaverPlugin`
- `vercel.json` — missing SPA fallback rewrite; add `{ "source": "/((?!api/).*)", "destination": "/index.html" }` or equivalent
- `tsconfig.app.json` — no path aliases yet; optional `@/*` → `src/*` in vite + tsconfig
- `_acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md` — **source of truth** for all token values (colors, typography, spacing, rounded)

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- add `react-router-dom` dependency -- routing skeleton requires it
- [x] `src/shared/styles/tokens.css` -- create CSS custom properties for every DESIGN.md color, typography, spacing, and rounded token -- UX-DR1, AD-7
- [x] `src/shared/styles/globals.css` -- base reset/body styles referencing token vars; import `tokens.css` first -- AD-10
- [x] `src/index.css` -- replace with re-export of `globals.css` or delete and point `main.tsx` at `globals.css` -- single style entry
- [x] `src/app/ProtectedRoute.tsx` -- wrapper rendering `<Outlet>` when authenticated stub is true, else `<Navigate to="/login" />` -- skeleton for Story 1.3
- [x] `src/app/router.tsx` -- define routes: `/login` (public), `/` + future protected paths behind `<ProtectedRoute>` -- FR routing seed
- [x] `src/app/App.tsx` -- root layout with `<BrowserRouter>` + route outlet -- bootstrap target
- [x] `src/app/providers.tsx` -- minimal provider shell (empty fragment ok) -- extension point for 1.3+
- [x] `src/features/login/LoginPage.tsx` -- stub placeholder ("Login — coming in Story 1.4") -- satisfies `/login` route
- [x] `src/features/landing/LandingPage.tsx` -- stub placeholder behind protected route -- satisfies `/` route
- [x] `src/entities/`, `src/api/`, `src/stores/`, `src/mocks/`, `src/shared/ui/`, `src/shared/lib/` -- create with `.gitkeep` or `index.ts` barrel -- AD-1 folder seed
- [x] `src/main.tsx` -- import from `src/app/App.tsx` instead of legacy `App.tsx` -- wire new bootstrap
- [x] `vercel.json` -- add SPA rewrite for client-side routes -- AD-10 deployment
- [x] Delete `src/App.tsx` and `src/App.css` -- remove superseded placeholder

**Acceptance Criteria:**
- Given the app starts, when the developer runs `npm run dev`, then React Router is active with no runtime errors
- Given an unauthenticated user, when they navigate to `/`, then they are redirected to `/login`
- Given a user on `/login`, when the page renders, then a stub login placeholder is shown without the application shell
- Given `tokens.css`, when inspected, then all DESIGN.md color, typography, spacing, and radius tokens exist as `--color-*`, `--font-*`, `--spacing-*`, `--radius-*` custom properties
- Given global styles, when loaded, then `tokens.css` is imported before any feature CSS
- Given `src/`, when listed, then `features/`, `entities/`, `api/`, `shared/`, `stores/`, `mocks/` directories exist per architecture seed
- Given `npm run build`, when executed, then the build completes without TypeScript or Vite errors

## Spec Change Log

## Verification

**Commands:**
- `npm install` -- expected: `react-router-dom` installed
- `npm run build` -- expected: clean build, zero TS errors
- `npm run lint` -- expected: no new lint errors in changed files

**Manual checks:**
- Open `http://localhost:5173/login` — stub login page visible
- Open `http://localhost:5173/` — redirects to `/login`
- Inspect `:root` in DevTools — token custom properties present

## Suggested Review Order

**Bootstrap & routing**

- App entry wires providers and the data-router provider.
  [`App.tsx:5`](../../src/app/App.tsx#L5)

- Route table defines public login, protected home, and catch-all 404.
  [`router.tsx:7`](../../src/app/router.tsx#L7)

- Auth guard stub redirects unauthenticated users to login until Story 1.3.
  [`ProtectedRoute.tsx:6`](../../src/app/ProtectedRoute.tsx#L6)

**Design tokens & global styles**

- All DESIGN.md colors, typography, spacing, and radius as CSS variables.
  [`tokens.css:1`](../../src/shared/styles/tokens.css#L1)

- Global reset loads tokens first, then applies body defaults from vars.
  [`globals.css:1`](../../src/shared/styles/globals.css#L1)

- Single style entry re-exports globals for the bootstrap chain.
  [`index.css:1`](../../src/index.css#L1)

**Feature stubs & deployment**

- Public login stub satisfies `/login` without application shell.
  [`LoginPage.tsx:1`](../../src/features/login/LoginPage.tsx#L1)

- Protected landing stub behind route guard for `/`.
  [`LandingPage.tsx:1`](../../src/features/landing/LandingPage.tsx#L1)

- Vercel SPA rewrite enables direct URL hits on client routes.
  [`vercel.json:13`](../../vercel.json#L13)
