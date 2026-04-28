# Alkon Cleanup Candidates

Status: active_with_notes

Rule:

No uncertain file is deleted in this recomposition pass. Every uncertain item is classified and postponed until evidence proves the safe move, merge, archive, or deletion.

Cleanup candidates:

| Candidate | Type | Reason | Action |
| --- | --- | --- | --- |
| `public/file.svg` | cleanup_candidate | Root starter SVG, no confirmed product ownership in this pass. | Keep until usage audit proves removal safe. |
| `public/globe.svg` | cleanup_candidate | Root starter SVG, possible duplicate with product earth assets. | Keep until usage audit proves removal safe. |
| `public/next.svg` | cleanup_candidate | Root starter framework SVG. | Keep until usage audit proves removal safe. |
| `public/vercel.svg` | cleanup_candidate | Root starter framework SVG. | Keep until usage audit proves removal safe. |
| `public/window.svg` | cleanup_candidate | Root starter SVG. | Keep until usage audit proves removal safe. |
| `.next/` | protected_candidate | Generated build output, not active source. | Do not commit or edit manually. |
| `tsconfig.tsbuildinfo` | protected_candidate | Generated TypeScript build info. | Do not treat as source. |
| `.tpm-updates/` | protected_candidate | Local/generated update memory. | Do not delete without Ahmad approval. |
| `artifacts/` | protected_candidate | Evidence and generated support artifacts. | Keep outside active source ownership. |
| `.env.production.local` | protected_candidate | Local sensitive configuration. | Do not expose, copy, or commit secrets. |
| `.env.production.local.backup` | protected_candidate | Local sensitive backup. | Do not expose, copy, or commit secrets. |
| `.env.production.local.backup-before-old-secrets` | protected_candidate | Local sensitive backup. | Do not expose, copy, or commit secrets. |
| `app/theme-localization.css` | css_cleanup_candidate | Large mixed CSS island for public, workspace, and visual language. | Split later only with visual regression proof. |
| `app/founder-command.css` | css_cleanup_candidate | Private Founder CSS island shared by multiple private surfaces. | Split later only with visual regression proof. |
| `modules/shell` | merge_candidate | Owns public shell, workspace shell, chart shell, and private shell entry. | Split later into public shell/workspace shell/private shell only if imports are mapped. |
| `modules/companion` and `lib/server/companion` | move_candidate | Product language targets Assistant, while current code still uses companion naming. | Rename later with route/API compatibility plan. |
| `modules/chart`, `modules/decision`, `modules/execution`, `modules/market` | move_candidate | These belong conceptually to `modules/workspace`. | Postpone broad move because workspace imports are route-critical. |
| `lib/brand/*` private taxonomy references | boundary_candidate | Internal brand architecture may contain private labels but should not render them publicly. | Keep and enforce public leak tests. |
| `lib/plans/*` private taxonomy references | boundary_candidate | Plan modeling may reference realm/private concepts internally. | Keep and enforce public-safe output tests. |
| `scripts/generate-launch-secrets.mjs` | protected_candidate | Terminal-only secret generation support. | Keep out of web imports; do not run in this mission. |
| `scripts/tpm-canonical-routes-smoke.mjs` | protected_candidate | Terminal-only smoke harness uses local process controls. | Keep out of web imports; allowed for validation. |
| `docs/legacy-salvage-report.md` | archive_candidate | Historical archive references are documentation of salvage, not current path. | Keep as historical record; official path docs govern current work. |
| `modules/shell/components/PlatformShellV2.tsx` chart classes | protected_candidate | Existing chart internals are shared by current workspace tests and should not be demolished blindly. | Current mission owns layout through clean-zero route CSS; deeper refactor requires separate route-proof pass. |
| `modules/shell/components/TradingWorkstation.tsx` activity shelf | cleanup_candidate | Old Open positions / History / Audit shelf remains for compatibility but is no longer above the chart. | Keep below the core until a focused activity-history replacement is approved. |
| `modules/companion/components/CompanionLauncher` workspace launcher | protected_candidate | Existing regression coverage expects the launcher on the workspace route. | Keep as secondary Assistant entry; do not let it cover chart or execution. |
| repeated historical workspace CSS blocks in `app/theme-localization.css` | css_cleanup_candidate | Clean-zero route now overrides them, but the file still contains earlier workspace strata. | Split or remove only after visual regression proves no route drift. |
| `/en` workspace route | compatibility_candidate | `/trading` is now canonical, but `/en` remains useful for older locale-compatible proofs. | Keep until a focused locale route strategy is approved. |
| `modules/shell` public/workspace/private split | risky_move_candidate | Shell components span public header, workspace terminal, and private Founder shell. | Split only after import map and route proof. |
| Founder API auth hardening | needs_ahmad_decision | Current private API boundary is route/private/read-only, not a full auth wall. | Design separately before public deployment. |
| Jar API exposure | protected_candidate | Jar currently renders privately and has no public API. | Keep private; add Founder-only API later only if Ahmad approves. |

Protected systems:

- Founder Command
- Alkon command/chat interface
- Alkon Kernel and operating mode
- Reality Production
- Self-Correction
- Device Constellation
- Product Truth
- Security, legal, treasury, launch readiness, and Local Day One gates
- Wake Report fabric
- Local Builder

Next cleanup rule:

Move or delete only after a focused proof shows no broken imports, no route regression, no public/private leak, and no Product Truth regression.

## 2026-04-28 - Permission-to-Exist Amendment

New cleanup law:

- Unknown files, folders, routes, APIs, components, CSS layers, reports, tests, tools, assets, visual surfaces, and future ideas do not move directly into execution.
- Cleanup candidates enter Jar 6 Cleanup unless they are sensitive, public-leaking, route-breaking, Product Truth-breaking, or Ahmad-decision items.
- Sensitive cleanup maps to Jar 0 Black Hole.
- Public leak or Product Truth cleanup maps to Jar 1 P0 Reality.
- Ahmad visual acceptance and unknown ownership map to Jar 9 Founder Decision.

New reports:

- `reports/alkon-codebase-existence-classification.md`
- `reports/alkon-css-existence-map.md`
- `reports/visual-cleanup-candidates.md`
- `reports/visual-duplicate-layer-map.md`

## 2026-04-28 - Swiss Earth / Logo / Chart Visual Amendment

New cleanup candidates:

| Candidate | Type | Reason | Action |
| --- | --- | --- | --- |
| Old chart overlay CSS in `app/compact-modes.css` | css_cleanup_candidate | The rendered market-structure, floating, AI, and depth overlay layers were removed from the chart body, but historical responsive CSS still contains their selectors. | Keep for now; remove only in a focused CSS deletion pass with full route and visual proof. |
| Earlier chart overlay sections in `app/theme-localization.css` | css_cleanup_candidate | Final Swiss rebuild CSS overrides active layout, but older overlay rules still exist in the large CSS island. | Keep until a broad CSS split/removal pass is approved. |
| Legacy moon orbit marker in `ProMaxProceduralEarth` | compatibility_candidate | The orbit is visually suppressed to remove toy-like noise, but the DOM marker remains for legacy proof contracts. | Keep hidden until legacy identity tests are retired or migrated. |
| Approved photoreal Earth texture intake | needs_ahmad_decision | Procedural fallback improved, but true photorealism requires a licensed local texture manifest and Ahmad approval. | Do not add external images; prepare a Command Passport only if Ahmad wants texture intake. |
