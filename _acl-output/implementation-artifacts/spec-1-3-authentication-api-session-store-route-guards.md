---
title: 'Story 1.3 — Authentication API, Session Store & Route Guards'
tier: Tier 1 (Self-Contained)
status: In Review
type: feature
created: 2026-09-23
review_loop_iteration: 0
context:
  - _acl-output/implementation-artifacts/epic-1-scope.md
  - _acl-output/implementation-artifacts/spec-1-1-application-foundation-tokens.md
  - _acl-output/implementation-artifacts/spec-1-2-shared-ui-primitives.md
  - _acl-output/planning-artifacts/architecture/architecture-fleet-360-new-2026-09-23/ARCHITECTURE-SPINE.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `ProtectedRoute` uses a hardcoded `isAuthenticated = false` stub; there is no session persistence, auth API, MSW mock, or Zustand store — protected routes cannot reflect real auth state and Story 1.4 Login cannot call a working `authApi.login`.

**Approach:** Add `Session` entity, `ApiError` envelope, `authApi` adapter, MSW login handler, `useAuthStore` with `fleet360:session` hydration, wire `ProtectedRoute` to the store, and register protected route stubs for `/devices` and `/devices/:deviceId`.

## Boundaries & Constraints

**Always:**
- Session persisted under `localStorage` key `fleet360:session` as JSON (AD-5)
- Only `api/` modules call `fetch`; stores call `authApi`, never `fetch` directly (AD-3)
- MSW intercepts same URL paths as `api/` adapters; toggle via `VITE_USE_MSW` (default `true` in dev) (AD-4)
- `api/` throws `ApiError { code, message, status }`; `useAuthStore` exposes `error: string | null` (AD-9)
- `ProtectedRoute` reads `useAuthStore`; unauthenticated → redirect `/login` with `state.from` preserved (AD-5)
- Phase 1 mock accepts any valid-format email + non-empty password; invalid credentials return 401 with user-facing message
- Protected paths: `/`, `/devices`, `/devices/:deviceId` — all behind `<ProtectedRoute>`

**Ask First:**
- Adding `.env.example` for `VITE_API_BASE_URL` and `VITE_USE_MSW`

**Never:**
- Build Login page UI or form validation — Story 1.4
- Implement `devicesApi`, device store, or device screens — Epic 2
- Use HttpOnly cookies or real backend integration
- Put fetch/MSW logic inside feature components

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No session | Navigate to `/` or `/devices` | Redirect to `/login` | N/A |
| Valid login | `authApi.login({ email, password })` with valid format | Returns `Session` entity; store persists to localStorage | N/A |
| Invalid login | Wrong credentials (mock: email `fail@example.com`) | `ApiError` 401; store `error` set | UI shows store error string only |
| Hydration | Page reload with valid `fleet360:session` | Store restores session; protected routes accessible | Corrupt JSON → clear storage, treat as logged out |
| Logout | `useAuthStore.logout()` | Store cleared; localStorage key removed | N/A |
| MSW off | `VITE_USE_MSW=false` | App boots without MSW worker; api calls hit `VITE_API_BASE_URL` | Network errors → ApiError |

</frozen-after-approval>

## Code Map

- `src/app/ProtectedRoute.tsx:4` — **replace** `const isAuthenticated = false` with `useAuthStore` selector; preserve `Navigate` + `state.from`
- `src/app/router.tsx` — add protected child routes `/devices` and `/devices/:deviceId` with stub placeholders (not full device UI)
- `src/app/providers.tsx` — extension point for MSW init + optional auth hydration trigger
- `src/main.tsx` — async MSW bootstrap before render when `import.meta.env.VITE_USE_MSW !== 'false'`
- `src/api/.gitkeep` — replace with `client.ts`, `authApi.ts`
- `src/entities/.gitkeep` — replace with `session.ts`, `user.ts` (minimal types)
- `src/stores/.gitkeep` — replace with `useAuthStore.ts`
- `src/mocks/.gitkeep` — replace with `handlers/auth.ts`, `browser.ts`
- `src/shared/lib/.gitkeep` — replace with `ApiError.ts`
- `package.json` — add `zustand`, `msw`; no other deps
- `vite.config.ts` — ACL middleware **read-only**; no changes unless MSW requires env define

## Tasks & Acceptance

**Execution:**
- [ ] `package.json` -- add `zustand` and `msw` dependencies -- AD-2, AD-4
- [ ] `src/shared/lib/ApiError.ts` -- class `{ code, message, status }` with static `fromResponse` helper -- AD-9
- [ ] `src/entities/user.ts` -- `User` type (id, email, displayName) -- AD-6
- [ ] `src/entities/session.ts` -- `Session` type (token, user, expiresAt ISO string) -- AD-6
- [ ] `src/api/client.ts` -- `apiFetch(path, options)` using `VITE_API_BASE_URL`; throws `ApiError` on non-2xx -- AD-3
- [ ] `src/api/authApi.ts` -- `login(credentials)` POST `/auth/login`; map DTO → `Session` -- AD-3, AD-6
- [ ] `src/mocks/handlers/auth.ts` -- MSW handler for `POST */auth/login`; accept valid format; reject `fail@example.com` -- AD-4
- [ ] `src/mocks/browser.ts` -- `setupWorker` exporting handlers; `startMSW()` async init -- AD-4
- [ ] `src/stores/useAuthStore.ts` -- Zustand store: `session`, `error`, `isAuthenticated`, `login`, `logout`, `hydrate`; persist/read `fleet360:session` -- AD-2, AD-5
- [ ] `src/app/ProtectedRoute.tsx` -- read `isAuthenticated` from store; redirect with `state.from` -- AD-5, NFR-6
- [ ] `src/app/router.tsx` -- add `/devices` and `/devices/:deviceId` stub routes under protected layout -- FR routing seed
- [ ] `src/features/devices/DevicesStubPage.tsx` -- minimal "Devices — Coming soon" placeholder -- route stub only
- [ ] `src/main.tsx` -- await `startMSW()` then call `useAuthStore.getState().hydrate()` before render -- boot sequence
- [ ] Delete `src/api/.gitkeep`, `src/entities/.gitkeep`, `src/stores/.gitkeep`, `src/mocks/.gitkeep`, `src/shared/lib/.gitkeep` -- replaced by real modules

**Acceptance Criteria:**
- Given no session in localStorage, when user navigates to `/`, `/devices`, or `/devices/:id`, then redirect to `/login`
- Given valid credentials via `useAuthStore.login()`, when login succeeds, then `Session` is stored under `fleet360:session` and `isAuthenticated` is true
- Given invalid credentials, when login fails, then store `error` contains user-facing message and no session is persisted
- Given page reload with valid session, when app boots, then `hydrate()` restores authenticated state without re-login
- Given `logout()`, when called, then store and `fleet360:session` are cleared
- Given `npm run build`, when executed, then build completes with zero TypeScript errors

## Spec Change Log

## Verification

**Commands:**
- `npm install` -- expected: zustand and msw installed
- `npm run build` -- expected: clean build
- `npm run lint` -- expected: no new lint errors

**Manual checks:**
- DevTools → Application → localStorage: after programmatic `login()`, `fleet360:session` key present
- Navigate to `/` with session → Landing stub renders (not redirected)
- Call `logout()` in console via store → `/` redirects to login
