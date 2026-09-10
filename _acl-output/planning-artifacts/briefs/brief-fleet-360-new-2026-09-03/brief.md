---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-10T07:10:56.349Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
workflow_mode: greenfield
title: Fleet 360 — Product Brief
created: 2026-09-03
updated: 2026-09-03
source: Figma Fleet-360_BK (Login + Landing)
design_reference: https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811
---

# Product Brief: Fleet 360

## Executive Summary

**Fleet 360** is a web-based fleet and operations management platform that gives organizations complete visibility into connected devices, physical sites, and user access — with secure, real-time analytics. This brief covers the first user-facing surfaces: the **Login** screen (authentication entry) and the **Landing** screen (post-login home hub).

The product positions Fleet 360 as a professional, enterprise-grade application under the ACL Digital brand. Users authenticate with email and password, then land on a dashboard-style home page that routes them to three core administration areas: **Devices**, **Sites**, and **Users**. The design emphasizes trust (legal compliance on login), clarity (strong visual hierarchy), and speed-to-action (prominent red CTAs).

Design source: [Fleet-360_BK Figma file](https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811).

## The Problem

Operations and fleet managers today juggle disconnected tools for device monitoring, site oversight, and user permissions. Without a unified entry point:

- Users waste time finding the right module after signing in
- Authentication feels disconnected from the product brand and trust signals
- There is no clear mental model for what Fleet 360 offers at first glance

Fleet 360 must solve the **first mile** of the user journey: secure sign-in and an immediate, understandable map of what the platform can do.

## The Solution

Fleet 360 delivers two foundational screens:

### 1. Login Page

A split-layout authentication screen (1366×768 desktop baseline) that combines brand presence with a focused sign-in form.

**Layout & visual design**

| Element | Specification |
|---------|---------------|
| Layout | Split screen — login form on the left (~40%), hero imagery on the right (~60%) |
| Background | Navy blue gradient overlay (`#003366` → `#0D578B`) on industrial/HVAC imagery |
| Primary brand color | Red `#E50026` (Login button) |
| Typography | Roboto (form labels, body); white text on dark left panel |
| Logo | Fleet 360 wordmark at top of form area |

**Functional elements**

| Component | Behavior |
|-----------|----------|
| Email field | Label "Email", placeholder "Enter Email", white input with `#AFC3BC` border, 48px height, 6px radius |
| Password field | Label "Password", placeholder "Enter Password", same styling as email |
| Forgot Password | Right-aligned underlined link — "Forgot Password?" |
| Login button | Full-width red CTA, 48px height, label "Login" |
| Legal consent | Copy: "By clicking login, you hereby agree to our Terms and Conditions & Privacy Notice" (linked) |
| Footer branding | "Powered by ACL Digital" — an ALTEN group company |

**User flow**

1. User arrives at Login (unauthenticated)
2. Enters email and password
3. Clicks Login (implicitly accepts terms)
4. On success → navigates to Landing page
5. Forgot Password → password recovery flow (out of scope for this brief, but link is required)

### 2. Landing Page

A post-authentication home hub that welcomes the user and surfaces the three primary administration modules.

**Layout & visual design**

| Element | Specification |
|---------|---------------|
| Layout | Two horizontal bands — white hero (top ~58%), dark slate footer strip (bottom ~35%) |
| Hero background | White |
| Footer background | `#515D6D` (neutral gray) |
| Logo | Fleet 360 — "Fleet" in sky blue, "360" in navy `#264072` |
| Typography | Inter/Roboto; hero headline `#264072`, body `#1E2A2C` |
| Primary CTA color | Red `#E50026`, pill-shaped buttons |

**Hero section (top)**

| Element | Content |
|---------|---------|
| Logo | Large Fleet 360 wordmark (left) |
| Welcome text | "Welcome to" (24px) + "Fleet 360" (32px bold) |
| Tagline | "Complete visibility into your data, total control over your insights. Empowering secure, real-time analytics with precision and speed." (20px) |

**Module navigation strip (bottom)**

Three equal columns, each with icon + title + description + CTA:

| Module | Icon | Description | CTA |
|--------|------|-------------|-----|
| **Devices** | Map/location point icon | "Manage devices effortlessly with unified control and real-time insights." | Manage Devices |
| **Sites** | Map pin in frame icon | "Manage sites with seamless oversight and instant control with visual hierarchy" | Manage Sites |
| **Users** | User silhouette icon | "Assigns roles per site with granular access controls for easy user management." | Manage Users |

**User flow**

1. Authenticated user lands on Landing after login
2. Reads welcome message and product value proposition
3. Chooses one of three module CTAs to enter Devices, Sites, or Users administration (downstream flows out of scope)

## What Makes This Different

- **Unified hub model** — One landing page maps the entire product surface area (Devices, Sites, Users) instead of hiding modules in nested menus
- **Enterprise trust signals** — Terms & Privacy on login, ACL Digital / ALTEN group branding
- **Operations-first visual language** — Industrial imagery on login reinforces fleet/infrastructure context
- **Consistent design system** — Shared red primary (`#E50026`), Roboto typography, and 6px/100px border radii across both screens

## Who This Serves

**Primary users**

- **Fleet / Operations Managers** — Need quick access to device and site oversight after login
- **IT / System Administrators** — Manage user roles and site-level access from the Users module entry point

**Secondary users**

- **Executives / Stakeholders** — Landing page tagline communicates platform value at a glance

**Success for these users**

- Sign in within seconds with clear form affordances
- Immediately understand what Fleet 360 offers (devices, sites, users)
- Reach the right module in one click from Landing

## Success Criteria

| Metric | Target |
|--------|--------|
| Login completion rate | ≥ 95% of valid credential attempts succeed without error |
| Time to first module | User reaches a module CTA within 10 seconds of landing |
| Visual fidelity | Implemented screens match Figma spec within agreed tolerance (colors, spacing, typography) |
| Accessibility baseline | Form fields labeled, focus states visible, legal links keyboard-accessible |
| Responsive behavior | [ASSUMPTION] Desktop-first (1366px); tablet/mobile adaptation deferred |

## Scope

### In scope (this brief)

- **Login page** — Email/password form, Forgot Password link, Login CTA, terms consent copy, ACL Digital footer, split hero layout
- **Landing page** — Welcome hero, tagline, three module cards (Devices, Sites, Users) with icons, descriptions, and CTAs
- **Navigation** — Login → Landing on successful authentication
- **Design tokens** — Primary red `#E50026`, navy blues, neutral grays, Roboto/Inter fonts

### Out of scope (deferred)

- Forgot Password recovery flow implementation
- Devices, Sites, and Users module interiors (list views, CRUD, maps, etc.)
- Registration / sign-up
- Multi-factor authentication
- Mobile/tablet breakpoints (unless specified later)
- Backend API design and authentication protocol (OAuth, SAML, etc.) — assumed to exist

## Vision

Fleet 360 aims to become the single pane of glass for fleet and IoT operations — starting with a polished authentication experience and a clear home hub. As the platform matures, the Landing page may evolve to show live KPIs, alerts, and personalized shortcuts, but the three-pillar model (Devices, Sites, Users) establishes the product's structural backbone.

## Design Reference Summary

| Screen | Figma node | Dimensions |
|--------|------------|------------|
| Login | `1228:11322` | 1366 × 768 |
| Landing | `227:3884` | 1366 × 768 |

**Key design tokens**

| Token | Value | Usage |
|-------|-------|-------|
| Primary / CTA | `#E50026` | Login button, module CTAs |
| Navy (text) | `#264072` | Landing headlines |
| Neutral dark | `#1E2A2C` | Body text, icon color |
| Footer background | `#515D6D` | Landing module strip |
| Input border | `#AFC3BC` | Form field borders |
| Font — primary | Roboto | Forms, landing body |
| Font — secondary | Inter | Landing welcome line |
