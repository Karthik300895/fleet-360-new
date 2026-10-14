---
status: Approved
reviewed_by: Manager (via Markdown Studio)
review_timestamp: 2026-10-14T07:00:58.083Z
gate_signature: ACL-STUDIO-APPROVAL-APPROVED
title: 'Story 2.3 — Bulk Device Upload Flow'
tier: Tier 1 (Self-Contained)
type: feature
created: 2026-10-14
review_loop_iteration: 0
baseline_commit: 844d5683d3899bdc5111429ae2ea7850662def34
context:
  - _acl-output/planning-artifacts/briefs/brief-fleet-360-new-2026-09-23/addendum.md
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Administrators could not bulk onboard devices via XLSX.

**Approach:** Upload page with dropzone, template download (xlsx), parse validation table, commit.

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

- src/features/devices/DeviceUploadPage.tsx
- src/features/devices/uploadTemplate.ts
- src/api/uploadApi.ts

## Tasks & Acceptance

**Execution:**
- [x] `src/features/devices/DeviceUploadPage.tsx` -- dropzone, load data, save -- FR-12–15
- [x] `src/features/devices/uploadTemplate.ts` -- template columns -- FR-13
- [x] `src/mocks/handlers/upload.ts` -- parse/commit -- AD-4

**Acceptance Criteria:**
- Given non-xlsx file, when selected, then rejection message
- Given valid xlsx, when Load Data, then validation rows shown
- Given all valid rows, when Save & Next, then navigate to /devices

## Spec Change Log

## Verification

**Commands:**
- `npm run build` -- expected: pass
- `Manual: upload flow end-to-end` -- expected: pass
