import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const outDir = join(root, '_acl-output', 'implementation-artifacts')
const baseline = '844d5683d3899bdc5111429ae2ea7850662def34'
const created = '2026-10-14'

const specs = [
  {
    file: 'spec-1-4-login-page.md',
    title: 'Story 1.4 — Login Page',
    context: [
      '_acl-output/implementation-artifacts/spec-1-3-authentication-api-session-store-route-guards.md',
      '_acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md',
    ],
    problem:
      'Login route was a placeholder; operators could not authenticate through the branded split-layout experience.',
    approach:
      'Build `LoginPage` with validation, `useAuthStore.login`, hero imagery, legal copy, and redirect to Landing on success.',
    codeMap: [
      'src/features/login/LoginPage.tsx — form, validation, auth integration',
      'src/features/login/LoginPage.module.css — split layout UX-DR14',
      'src/shared/ui/FleetLogo.tsx — branded title',
    ],
    tasks: [
      'src/features/login/LoginPage.tsx -- split layout, labels, submit, error display -- FR-1, FR-5',
      'src/features/login/LoginPage.module.css -- navy panel + hero -- UX-DR14',
      'src/app/router.tsx -- public /login route -- AD-5',
    ],
    ac: [
      'Given /login, when rendered, then split layout with email/password fields and Login CTA',
      'Given invalid email or empty password, when submit, then inline errors and no API call',
      'Given valid credentials, when submit succeeds, then session persists and user lands on /',
      'Given fail@example.com, when submit, then error shows without redirect',
    ],
    verify: ['npm run build', 'npm run lint', 'Manual: /login keyboard submit and Forgot Password link'],
  },
  {
    file: 'spec-1-5-landing-hub.md',
    title: 'Story 1.5 — Landing Hub',
    context: ['_acl-output/implementation-artifacts/epic-1-scope.md'],
    problem: 'Post-login hub was a stub; users could not discover modules.',
    approach: 'Two-band Landing with three module cards and CTAs; no Application Shell.',
    codeMap: [
      'src/features/landing/LandingPage.tsx',
      'src/features/landing/LandingPage.module.css',
    ],
    tasks: [
      'src/features/landing/LandingPage.tsx -- welcome band + module cards -- FR-6',
      'src/app/router.tsx -- protected index route / -- FR-6',
    ],
    ac: [
      'Given authenticated user on /, when page loads, then two-band layout without shell',
      'Given Devices card, when Manage Devices clicked, then navigate to /devices with shell',
      'Given Sites/Users cards, when clicked, then Phase 2 coming-soon routes',
    ],
    verify: ['npm run build', 'Manual: login then verify Landing layout'],
  },
  {
    file: 'spec-1-6-application-shell-navigation-stubs.md',
    title: 'Story 1.6 — Application Shell & Navigation Stubs',
    context: ['_acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md'],
    problem: 'Fleet modules lacked persistent header navigation.',
    approach: 'ApplicationShell layout with nav, utilities, and ComingSoon stubs for Phase 2 routes.',
    codeMap: [
      'src/features/shell/ApplicationShell.tsx',
      'src/features/shell/ComingSoonPage.tsx',
      'src/app/router.tsx -- shell-wrapped device routes',
    ],
    tasks: [
      'src/features/shell/ApplicationShell.tsx -- 64px header nav -- FR-9, UX-DR16',
      'src/features/shell/ComingSoonPage.tsx -- stub escape nav -- FR-11',
      'src/app/router.tsx -- dashboard/sites/users/alarms stubs -- FR-11',
    ],
    ac: [
      'Given /devices, when rendered, then shell header with five nav items',
      'Given Devices route, when active, then blue label and red underline',
      'Given Dashboard nav click, when rendered, then Coming soon with back navigation',
      'Given viewport <768px, when shell renders, then icon-only nav labels hidden',
    ],
    verify: ['npm run build', 'Manual: resize shell nav'],
  },
  {
    file: 'spec-1-7-site-selector-shell-state.md',
    title: 'Story 1.7 — Site Selector & Shell State',
    context: ['_acl-output/implementation-artifacts/epic-1-scope.md'],
    problem: 'Operators could not scope fleet data by site from the header.',
    approach: 'useShellStore with fleet360:shell persistence and SiteSelector dropdown in shell.',
    codeMap: [
      'src/stores/useShellStore.ts',
      'src/features/shell/SiteSelector.tsx',
      'src/features/devices/DevicesRouteLayout.tsx -- site filter on fetch',
    ],
    tasks: [
      'src/stores/useShellStore.ts -- site id state + hydrate -- FR-10',
      'src/features/shell/SiteSelector.tsx -- blue pill dropdown -- UX-DR5',
      'src/features/devices/DevicesListPage.tsx -- respects site scope via store polling -- FR-10',
    ],
    ac: [
      'Given shell visible, when selector opens, then All Sites default and six sites listed',
      'Given site selected, when devices list loads, then API filter uses siteId',
      'Given All Sites, when selected, then full fleet scope restored',
    ],
    verify: ['npm run build', 'Manual: change site and verify device list count'],
  },
  {
    file: 'spec-2-1-domain-entities-device-api-layer.md',
    title: 'Story 2.1 — Domain Entities & Device API Layer',
    context: [
      '_acl-output/planning-artifacts/architecture/architecture-fleet-360-new-2026-09-23/ARCHITECTURE-SPINE.md',
    ],
    problem: 'Device features lacked shared entities and API adapters.',
    approach: 'Canonical entities, devicesApi/uploadApi, MSW handlers and fixtures.',
    codeMap: [
      'src/entities/device.ts',
      'src/api/devicesApi.ts',
      'src/api/uploadApi.ts',
      'src/mocks/fixtures/devices.ts',
      'src/mocks/handlers/devices.ts',
      'src/mocks/handlers/upload.ts',
    ],
    tasks: [
      'src/entities/* -- Device, Site, DeviceFilter, upload types -- AD-6',
      'src/api/devicesApi.ts -- list/get/update/remove -- AD-3',
      'src/api/uploadApi.ts -- parse/commit -- AD-3',
      'src/mocks/* -- aligned URL paths -- AD-4',
    ],
    ac: [
      'Given MSW enabled, when devicesApi.list called, then typed Device[] returned',
      'Given API error, when non-2xx, then ApiError thrown',
      'Given fixtures, when listed, then multi-site mixed device types present',
    ],
    verify: ['npm run build', 'npm run lint'],
  },
  {
    file: 'spec-2-2-device-store-status-polling.md',
    title: 'Story 2.2 — Device Store & Status Polling',
    context: ['_acl-output/implementation-artifacts/spec-2-1-domain-entities-device-api-layer.md'],
    problem: 'Device list did not refresh automatically.',
    approach: 'useDeviceStore with 30s polling started/stopped in DevicesRouteLayout.',
    codeMap: [
      'src/stores/useDeviceStore.ts',
      'src/features/devices/DevicesRouteLayout.tsx',
    ],
    tasks: [
      'src/stores/useDeviceStore.ts -- fetch, startPolling, stopPolling -- AD-8',
      'src/features/devices/DevicesRouteLayout.tsx -- lifecycle hook -- AD-8',
    ],
    ac: [
      'Given user on /devices, when layout mounts, then list fetch runs and 30s poll starts',
      'Given user leaves devices routes, when unmount, then interval cleared',
      'Given detail route, when open, then same store cache used',
    ],
    verify: ['npm run build', 'Manual: observe network poll on /devices'],
  },
  {
    file: 'spec-2-3-bulk-device-upload-flow.md',
    title: 'Story 2.3 — Bulk Device Upload Flow',
    context: ['_acl-output/planning-artifacts/briefs/brief-fleet-360-new-2026-09-23/addendum.md'],
    problem: 'Administrators could not bulk onboard devices via XLSX.',
    approach: 'Upload page with dropzone, template download (xlsx), parse validation table, commit.',
    codeMap: [
      'src/features/devices/DeviceUploadPage.tsx',
      'src/features/devices/uploadTemplate.ts',
      'src/api/uploadApi.ts',
    ],
    tasks: [
      'src/features/devices/DeviceUploadPage.tsx -- dropzone, load data, save -- FR-12–15',
      'src/features/devices/uploadTemplate.ts -- template columns -- FR-13',
      'src/mocks/handlers/upload.ts -- parse/commit -- AD-4',
    ],
    ac: [
      'Given non-xlsx file, when selected, then rejection message',
      'Given valid xlsx, when Load Data, then validation rows shown',
      'Given all valid rows, when Save & Next, then navigate to /devices',
    ],
    verify: ['npm run build', 'Manual: upload flow end-to-end'],
  },
  {
    file: 'spec-2-4-device-list-empty-states.md',
    title: 'Story 2.4 — Device List & Empty States',
    context: ['_acl-output/implementation-artifacts/spec-2-2-device-store-status-polling.md'],
    problem: 'Operators needed a scannable registry table.',
    approach: 'DevicesListPage with table, indicators, skeleton, and empty states.',
    codeMap: ['src/features/devices/DevicesListPage.tsx'],
    tasks: [
      'src/features/devices/DevicesListPage.tsx -- table, skeleton, empties -- FR-16',
    ],
    ac: [
      'Given devices exist, when list renders, then status icon cluster per row',
      'Given row click, when activated, then /devices/:id/overview',
      'Given zero fleet, when loaded, then upload empty state',
      'Given filters empty result, when applied, then clear filters message',
    ],
    verify: ['npm run build'],
  },
  {
    file: 'spec-2-5-filters-panel.md',
    title: 'Story 2.5 — Filters Panel',
    context: ['_acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md'],
    problem: 'Large fleets need fast triage filters.',
    approach: 'Slide-over FiltersPanel, FilterChip, session-persisted applied filters.',
    codeMap: [
      'src/features/devices/panels/FiltersPanel.tsx',
      'src/shared/ui/FilterChip.tsx',
      'src/stores/useDeviceListUiStore.ts',
    ],
    tasks: [
      'src/features/devices/panels/FiltersPanel.tsx -- slide-over + apply -- FR-17',
      'src/features/devices/deviceListUtils.ts -- client filter -- FR-17',
    ],
    ac: [
      'Given filters open, when Apply, then panel closes and match count shown',
      'Given Clear all, when clicked, then defaults restored',
      'Given Escape/outside click, when triggered, then panel dismisses',
    ],
    verify: ['npm run build'],
  },
  {
    file: 'spec-2-6-sort-panel-row-actions.md',
    title: 'Story 2.6 — Sort Panel & Row Actions',
    context: ['_acl-output/implementation-artifacts/spec-2-4-device-list-empty-states.md'],
    problem: 'Operators need sort and per-row maintenance actions.',
    approach: 'SortPanel, kebab menu, confirm remove, DeviceEditPage.',
    codeMap: [
      'src/features/devices/panels/SortPanel.tsx',
      'src/features/devices/ConfirmDialog.tsx',
      'src/features/devices/DeviceEditPage.tsx',
    ],
    tasks: [
      'src/features/devices/panels/SortPanel.tsx -- sort fields -- FR-18',
      'src/features/devices/DevicesListPage.tsx -- kebab edit/remove -- FR-19',
      'src/features/devices/DeviceEditPage.tsx -- minimal edit form -- FR-19',
    ],
    ac: [
      'Given sort applied, when list renders, then rows ordered by field/direction',
      'Given remove confirmed, when API succeeds, then row removed',
      'Given edit saved, when submitted, then detail reflects changes',
    ],
    verify: ['npm run build'],
  },
  {
    file: 'spec-2-7-device-detail-header-tab-navigation.md',
    title: 'Story 2.7 — Device Detail Header & Tab Navigation',
    context: ['_acl-output/planning-artifacts/ux-designs/ux-fleet-360-new-2026-09-23/DESIGN.md'],
    problem: 'Per-device workflows need consistent header and tabs.',
    approach: 'DeviceDetailPage header, InsightCard, tab links updating URL.',
    codeMap: [
      'src/features/devices/DeviceDetailPage.tsx',
      'src/features/devices/deviceDetailTabs.ts',
      'src/shared/ui/InsightCard.tsx',
    ],
    tasks: [
      'src/features/devices/DeviceDetailPage.tsx -- header + tabs -- FR-20, FR-21',
      'src/app/router.tsx -- /devices/:id/:tab -- FR-21',
    ],
    ac: [
      'Given device detail, when rendered, then breadcrumb, badges, insight card visible',
      'Given tab click, when navigated, then URL updates without full reload',
      'Given back control, when used, then return to list',
    ],
    verify: ['npm run build'],
  },
  {
    file: 'spec-2-8-overview-analytics-tabs.md',
    title: 'Story 2.8 — Overview & Analytics Tabs',
    context: ['_acl-output/implementation-artifacts/spec-2-7-device-detail-header-tab-navigation.md'],
    problem: 'Managers need runtime summary and trends per device.',
    approach: 'DeviceDetailTabContent overview chart + analytics strip with a11y summary.',
    codeMap: ['src/features/devices/DeviceDetailTabContent.tsx'],
    tasks: [
      'src/features/devices/DeviceDetailTabContent.tsx -- overview + analytics tabs -- FR-22, FR-23',
    ],
    ac: [
      'Given overview tab, when rendered, then 7-day runtime bars and health sections',
      'Given analytics tab, when rendered, then historical runtime visualization',
      'Given overview chart, when inspected, then screen reader summary present',
    ],
    verify: ['npm run build'],
  },
  {
    file: 'spec-2-9-controls-maintenance-tabs.md',
    title: 'Story 2.9 — Controls & Maintenance Tabs',
    context: ['_acl-output/implementation-artifacts/spec-2-7-device-detail-header-tab-navigation.md'],
    problem: 'Technicians need setpoint controls and service records.',
    approach: 'Dial controls with offline disable; maintenance warranty/notes/documents.',
    codeMap: ['src/features/devices/DeviceDetailTabContent.tsx'],
    tasks: [
      'src/features/devices/DeviceDetailTabContent.tsx -- controls + maintenance -- FR-24, FR-25',
    ],
    ac: [
      'Given online device on Controls, when arrows used, then dial values change',
      'Given offline device, when Controls tab, then dials disabled with N/A',
      'Given Maintenance tab, when rendered, then warranty grid and notes field',
    ],
    verify: ['npm run build', 'Manual: dev-003 offline controls'],
  },
  {
    file: 'spec-2-10-device-info-schedule-stub.md',
    title: 'Story 2.10 — Device Info & Schedule Stub',
    context: ['_acl-output/planning-artifacts/epics.md'],
    problem: 'Technicians need hardware metadata; Schedule is Phase 2.',
    approach: 'Device Info KV grids; Schedule tab shows Phase 2 placeholder with escape.',
    codeMap: ['src/features/devices/DeviceDetailTabContent.tsx'],
    tasks: [
      'src/features/devices/DeviceDetailTabContent.tsx -- device-info + schedule stub -- FR-26, FR-27',
    ],
    ac: [
      'Given Device Info tab, when rendered, then two-column KV grids',
      'Given Schedule tab, when rendered, then Coming in Phase 2 with back navigation',
      'Given tab bar, when viewed, then Schedule remains visible',
    ],
    verify: ['npm run build'],
  },
]

function renderSpec(s) {
  const tasks = s.tasks.map((t) => `- [x] \`${t.split(' -- ')[0]}\` -- ${t.split(' -- ').slice(1).join(' -- ')}`).join('\n')
  const ac = s.ac.map((line) => `- ${line}`).join('\n')
  const codeMap = s.codeMap.map((line) => `- ${line}`).join('\n')
  const contextYaml = s.context.map((c) => `  - ${c}`).join('\n')
  const verify = s.verify.map((v) => `- \`${v}\` -- expected: pass`).join('\n')

  return `---
status: In Review
title: '${s.title}'
tier: Tier 1 (Self-Contained)
type: feature
created: ${created}
review_loop_iteration: 0
baseline_commit: ${baseline}
context:
${contextYaml}
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** ${s.problem}

**Approach:** ${s.approach}

## Boundaries & Constraints

**Always:**
- Feature-sliced code under \`src/features/devices/\` and shared primitives in \`src/shared/ui/\`
- API access only through \`src/api/\`; MSW paths must match adapters (AD-3, AD-4)

**Ask First:**
- Adding new npm dependencies beyond \`xlsx\` for upload template

**Never:**
- Real backend integration or SSR in Phase 1

</frozen-after-approval>

## Code Map

${codeMap}

## Tasks & Acceptance

**Execution:**
${tasks}

**Acceptance Criteria:**
${ac}

## Spec Change Log

## Verification

**Commands:**
${verify}
`
}

for (const spec of specs) {
  writeFileSync(join(outDir, spec.file), renderSpec(spec), 'utf8')
  console.log('wrote', spec.file)
}
