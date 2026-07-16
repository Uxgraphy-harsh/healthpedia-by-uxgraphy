
## Goal

Make every childcare sub-page behave exactly like its main mini-app counterpart — same UI, same CTAs, same detail views and sub-sheets — but scoped to the selected child so data doesn't mix with the primary user's records.

## Approach

Instead of duplicating ~3,000 lines of mini-app code inside `ChildSubApp.tsx`, extract each main app's body into a reusable headless component. Then both the main mini-app route and the child overlay render the same component, differing only in the surrounding shell and the data scope key.

### Step 1 — Extract content components

For each of these six apps, split the current page file into:

- `pages/apps/<App>.tsx` — thin wrapper: `AppLockGate` + `MiniAppShell` + `<AppContent scope="user" />`
- `pages/apps/<App>Content.tsx` — the full body: lists, FABs, bottom sheets, detail overlays, sub-sheets. Accepts `scope: string` (used as a localStorage key and as a data namespace) and `scopeLabel: string` (shown in copy like "For Aarav").

Apps to refactor:
1. Prescriptions (multi-step add sheet, prescription detail overlay, medicine schedule, linked reports)
2. Symptoms (aggregated cards, detail with timeline, add sheet with severity + triggers + attachments)
3. Allergies (grouped by category, add sheet with suggestions + severity control)
4. Insurance (policy cards + add sheet)
5. Notes (list + add sheet with cross-app @-references)
6. Vault (folder grid + search overlay + report detail + upload sheet)

### Step 2 — Persist per-scope data

Each content component reads/writes its state under a key that includes the scope, e.g. `hp:prescriptions:user` for the primary user and `hp:prescriptions:child:<kidId>` for a baby. This keeps the child's records isolated from the parent's without any backend work.

### Step 3 — Rewire `ChildSubApp.tsx`

Replace the current ad-hoc renderers and the single generic add sheet with:

```text
<ChildOverlayShell kid={kid} showSearch={appId==="vault"}>
  {appId === "prescriptions" && <PrescriptionsContent scope={`child:${kid.id}`} scopeLabel={kid.name} />}
  {appId === "symptoms"      && <SymptomsContent      scope={`child:${kid.id}`} scopeLabel={kid.name} />}
  ...etc
</ChildOverlayShell>
```

The overlay keeps the current top bar (back button, child chip, optional search) and the child's own bottom bar handling. All CTAs, detail pages, and sub-sheets come from the shared content component, so they automatically match the main app.

### Step 4 — Seed sensible baby defaults

When a child scope is first opened and has no stored data, seed the list with the small baby-appropriate mock set that's already in `ChildSubApp.tsx` (Amoxicillin syrup, diaper rash, peanut allergy, Star Health Junior, pediatric visits folder, etc.) so the pages don't look empty.

## Technical notes

- No routing changes; child overlays remain modal on top of `/apps/childcare`.
- No backend changes; storage is `localStorage`-backed as it is today for the main apps that already persist.
- `MiniAppShell` is not used inside child overlays — the child overlay provides its own top bar so the two headers don't stack.
- Shared components live next to the page file (`PrescriptionsContent.tsx` beside `Prescriptions.tsx`) to keep the diff local per app.
- Rollout order: Prescriptions first (largest and the one you asked about), then Notes and Insurance (small), then Symptoms, Allergies, Vault.

## Scope confirmation

This is a large refactor across 6 files plus `ChildSubApp.tsx`. Before I start, confirm:

1. Data isolation via `localStorage` per child is acceptable (no backend involved).
2. It's OK if the primary user's existing records stay where they are and only the code path changes — no data migration.
3. You want all six apps done in one go, not just Prescriptions first.
