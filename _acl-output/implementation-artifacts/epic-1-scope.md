---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T06:51:01.723Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
---

# Epic 1 Scope: Secure Access & Application Navigation

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable operators to sign in, discover product modules from a Landing hub, and navigate the fleet application with persistent shell navigation and site-scoped context. This epic establishes the authentication boundary, routing skeleton, design token system, shared UI primitives, and application shell that all later device-management features depend on.

## Stories

- Story 1.1: Application Foundation & Design Tokens
- Story 1.2: Shared UI Primitives
- Story 1.3: Authentication API, Session Store & Route Guards
- Story 1.4: Login Page
- Story 1.5: Landing Hub
- Story 1.6: Application Shell & Navigation Stubs
- Story 1.7: Site Selector & Shell State

## Requirements & Constraints

- Unauthenticated users must authenticate via email/password; protected routes redirect to `/login` when no session exists.
- Login validates email format and non-empty password before submit; invalid credentials show errors without redirect.
- Landing is the default post-login destination with three module cards (Devices, Sites, Users); only Devices is fully functional in Phase 1.
- Application Shell appears on Devices and Device Detail routes with header nav (Dashboard, Devices, Sites, Users, Alarms), site selector, notification bell, and profile avatar.
- Site Selector defaults to "All Sites" and filters fleet data by selected site.
- Dashboard, Sites, Users, and Alarms nav items route to Phase 2 stubs.
- Session tokens stored securely under `localStorage` key `fleet360:session`; passwords over HTTPS; no credentials in client logs.
- Login and primary flows meet WCAG 2.1 AA for contrast, keyboard navigation, and form labels.
- API failures display user-friendly messages; no raw stack traces in UI.

## Technical Decisions

- **Feature-sliced SPA**: Each feature area maps to `src/features/<name>/`; slices do not import from sibling slices.
- **Zustand stores** (`useAuthStore`, `useDeviceStore`, `useShellStore`) own all mutable application state; components read stores, not local server state.
- **API adapter boundary**: Only `src/api/` calls `fetch`; typed functions per resource with DTO→entity mapping.
- **MSW mocking**: Handlers intercept same URL paths as `api/` adapters; swap to production via `VITE_USE_MSW=false`.
- **Route guards**: `<ProtectedRoute>` reads auth store; unauthenticated access redirects to `/login`; logout clears store and storage.
- **Canonical entities**: `Device`, `Site`, `Session`, `User`, `DeviceFilter` defined once in `src/entities/`.
- **Design tokens**: Exported to `shared/styles/tokens.css` as CSS custom properties; feature styles use `var(--color-*)`, `var(--spacing-*)` — no literal hex for tokenized values.
- **Static SPA on Vercel**: Config via `VITE_API_BASE_URL`, `VITE_USE_MSW`; no SSR in Phase 1.
- **Stack**: React 19.2.8, TypeScript 6.0.2, Vite 8.2.2, Zustand 5.0.15, React Router 8.4.0, MSW 2.15.0.
- **Routing**: Public `/login`; protected `/`, `/devices`, `/devices/:deviceId/:tab?`; stubs at `/dashboard`, `/sites`, `/users`, `/alarms`.
- **Structural seed**: `src/app/`, `src/features/{login,landing,shell,devices/...}`, `src/entities/`, `src/api/`, `src/shared/{ui,styles,lib}`, `src/stores/`, `src/mocks/`.
- **Brownfield**: Extend existing React + Vite codebase; Phase 1 auth mock accepts any valid-format credentials.

## UX & Interaction Patterns

- Design token system covers colors (primary-blue, primary-red, navy-deep, status colors, device-type colors), typography scale (page-title through logo-fleet), spacing (xs through xl, shell-padding, card-padding), and border-radius (sm, md, lg, pill).
- Login: split layout with navy form panel (~40%) and hero image (~60%); red primary CTA; consent copy with Terms/Privacy links.
- Landing: two-band layout without Application Shell; three equal module cards.
- Shell: fixed 64px header; active nav shows blue icon + label + red 3px bottom border; Site Selector as blue pill with chevron.
- Microcopy follows voice-and-tone spec — no celebratory language; stub pages use "Coming soon" with back navigation.
- Interactive primitives show blue focus ring; badges include text labels (not color-only).

## Cross-Story Dependencies

- Story 1.1 (foundation, tokens, routing skeleton) must complete before all other Epic 1 stories.
- Story 1.2 (shared UI primitives) depends on 1.1 tokens; required by 1.4 (Login), 1.5 (Landing), and 1.6 (Shell).
- Story 1.3 (auth store + route guards) must complete before 1.4–1.7 protected routes function correctly.
- Stories 1.4 (Login) and 1.5 (Landing) can proceed after 1.1–1.3.
- Stories 1.6 (Shell) and 1.7 (Site Selector) depend on 1.1–1.3 and benefit from 1.2 primitives.
- Epic 2 (Fleet Device Operations) depends on Epic 1 auth, shell, and site-scoped navigation being in place.
