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
