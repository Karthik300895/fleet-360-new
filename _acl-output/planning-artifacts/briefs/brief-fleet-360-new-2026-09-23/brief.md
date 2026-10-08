---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-09-23T04:28:59.088Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: "Product Brief: Fleet 360"
project_type: greenfield
created: "2026-09-23"
updated: "2026-09-23"
---

# Product Brief: Fleet 360

## Executive Summary

Fleet 360 is a greenfield web application for monitoring and managing connected HVAC and building-automation devices across multiple commercial sites. Operators and facility managers need a single place to see fleet health, drill into individual units, and act on alerts — without juggling spreadsheets, vendor portals, or site-by-site tools.

Phase 1 focuses on three foundational surfaces defined in the Figma design ([Fleet 360_BK](https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811)): **Login**, **Landing**, and **Devices**. Together they establish secure access, a module hub after sign-in, and the core device-management experience — from bulk upload through filtered views to per-device operational detail.

The product is branded as **Fleet 360** (VelocityOne / ACL Digital ecosystem) and targets enterprise facility teams managing Air, Water, and Cooler device types across a multi-site hierarchy.

## The Problem

Facility and operations teams responsible for distributed HVAC fleets face fragmented visibility:

- **No unified entry point** — credentials, site context, and module navigation are inconsistent across tools.
- **Device data is scattered** — serial numbers, connectivity, power state, and location live in spreadsheets or vendor silos.
- **Slow triage** — operators cannot quickly filter hundreds of units by site, connection status, device type, or power mode to find what needs attention.
- **Shallow device insight** — when something fails, teams lack a single screen showing runtime, alerts, controls, maintenance schedules, and technical metadata.

The cost is delayed response to outages, missed maintenance windows, and excess energy consumption that goes unnoticed until billing cycles.

## The Solution

Fleet 360 delivers a browser-based control plane with three Phase 1 pillars:

| Surface | Purpose |
|---------|---------|
| **Login** | Secure, branded authentication with email/password and legal consent |
| **Landing** | Post-login hub directing users to Devices, Sites, or Users modules |
| **Devices** | End-to-end device lifecycle UI: bulk upload, list/filter/sort, and rich per-device detail |

The experience follows a consistent shell — global header with site selector, primary nav (Dashboard, Devices, Sites, Users, Alarms), notifications, and profile — so users retain context as they move between modules.

## What Makes This Different

- **Fleet-first, not site-first** — global "All Sites" context with drill-down filters (site → floor → area) keeps both portfolio and local views in one product.
- **Operational depth per device** — a single device record spans Overview, Analytics, Controls, Schedule, Maintenance, and Device Info tabs, matching how technicians actually work.
- **Bulk onboarding** — Excel template upload accelerates greenfield fleet setup instead of one-by-one provisioning.
- **Insight-driven headers** — contextual insight cards (energy spikes, maintenance due, air quality changes) surface anomalies without opening sub-pages.

[ASSUMPTION] Differentiation vs. incumbent BMS portals is UX cohesion and multi-site fleet operations, not proprietary hardware — the moat is execution quality and integration speed.

## Who This Serves

**Primary: Facility / Operations Manager**
- Manages 50–500+ devices across multiple buildings
- Needs morning dashboard checks, alert triage, and delegation to technicians
- Success = fewer undetected outages, faster filter-to-action workflows

**Secondary: Field Technician**
- Opens a specific RTU/HVAC unit for controls, maintenance history, and serial/MAC metadata
- Success = all required data on one device detail page without calling the office

**Secondary: Fleet Administrator**
- Onboards devices via spreadsheet upload, assigns site hierarchy
- Success = accurate device registry with minimal manual entry

## Success Criteria

| Signal | Target (Phase 1) |
|--------|------------------|
| Authentication | Users complete login and reach Landing in &lt; 3 clicks |
| Module discovery | 90% of test users identify correct path to Devices from Landing without guidance |
| Device upload | Admin uploads a valid XLSX template and sees parsed file ready to load |
| Filter efficacy | User applies site + connection + type filters and sees narrowed device set |
| Device detail | Technician reaches Controls or Maintenance tab from device header in &lt; 2 clicks |
| Design fidelity | Implemented screens match Figma layouts for Login, Landing, Devices shell |

## Scope

### In Scope — Phase 1 (this brief)

**Login**
- Email and password fields, Forgot Password link, Login CTA
- Terms & Conditions / Privacy Notice consent copy
- Branded hero (industrial HVAC imagery), Fleet 360 title, ACL Digital footer

**Landing**
- Welcome hero with product value proposition
- Three module cards: Devices, Sites, Users — each with icon, description, and CTA
- Navigation to Devices module (Sites/Users CTAs may route to placeholder or Phase 2 stubs)

**Devices**
- Shared application header (logo, site selector dropdown, primary nav, bell, profile)
- Upload Devices flow (drag-and-drop, browse, template download, file preview, Load Data, Save & Next / Cancel)
- Filters panel (Sites hierarchy, Connections, Device Type, Power, Mode — Apply / Clear all)
- Sort panel (Order: Asc/Desc; Sort by: Device Name, Serial Number, MAC Address, Meeting Setpoint, Heating Hours, Cooling Hours)
- Device detail shell with breadcrumb, status badges (Online, device type), contact/location, Insight card
- Device sub-tabs: Overview, Analytics, Controls, Maintenance, Device Info (content per Figma)
- Row-level actions menu (Edit, Remove)

### Out of Scope — Phase 1

- Sites module (beyond Landing CTA stub)
- Users module (beyond Landing CTA stub)
- Dashboard analytics page (design exists; separate epic)
- Alarms list and notification delivery backend
- Real device telemetry ingestion / IoT platform integration (mock or API contract only)
- Mobile-native apps
- SSO / MFA (unless required by security review)
- Schedule tab implementation detail (design present; defer if not in sprint 1)

## Vision

Fleet 360 becomes the system of record for connected building devices: real-time fleet health on the Dashboard, predictive maintenance from runtime analytics, role-based access per site, and alarm workflows that close the loop from detection to resolution. Phase 1 lays the authentication, navigation, and device-management foundation that every subsequent module builds on.

## Design Reference

- **Figma:** [Fleet 360_BK — node 104:7811](https://www.figma.com/design/8xLlOjW5FTCc879C4UcUM8/Fleet-360_BK?node-id=104-7811)
- **Local screenshots:** `public/Fleet 360_BK (2)/` (Login.jpg, Landing.jpg, Manage Devices_Card.jpg, Filters_Device.png, device detail frames, etc.)
- **Detailed page specifications:** see `addendum.md` in this folder

## Open Questions

1. Authentication provider — custom auth API, OAuth, or enterprise IdP? [ASSUMPTION: email/password with REST API]
2. Is "Forgot Password" in scope for MVP or UI-only stub?
3. Sites/Users Landing CTAs — disabled state, "Coming soon", or minimal stub pages?
4. Device list view — grid vs. table; Figma shows detail/upload/filter but list layout needs confirmation
5. Real-time updates — WebSocket push for device status or polling interval?
6. XLSX template schema — column definitions and validation rules for bulk upload
