# Codebase Ownership Classification

Status: active_with_notes

Official project path:

`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Ownership map:

| Layer | Current owners | Notes |
| --- | --- | --- |
| Public Pro Max Reality | `app/page.tsx`, `app/[locale]/*`, `app/settings`, `app/diagnostics`, public-safe API routes, `modules/product`, `modules/brand`, public parts of `modules/shell`, `lib/brand`, `lib/plans`, `lib/environment` | Public UI must remain Pro Max / Pro Max Center only. |
| Private Alkon Universe | `app/founder/*`, `app/api/founder/*`, `modules/founder-command`, `modules/shell/components/PrivateFounderShell.tsx`, `lib/server/alkon*`, `lib/server/founder-command`, `lib/server/reality-production`, `lib/server/self-correction`, `lib/server/devices`, `lib/server/alkon-chat` | Founder-only, private command, read-only unless governed later. |
| Invisible Operating Layer | `lib/server/invisible-operating-layer`, public-safe readiness translators, Product Truth summaries, diagnostics summaries | Translates private truth into public-safe status. |
| Tools / Builder | `tools/alkon-local-builder`, `scripts`, Prisma config, package scripts | Terminal-only; no web shell or Codex execution. |
| Tests / Evidence | `tests/regression`, `playwright.config.ts`, `test-results`, validation artifacts | Evidence must prove routes, boundaries, and Product Truth. |
| Docs / Reports | `docs`, `docs/product`, `reports`, root README/agent guidance | Reports are private operational memory unless explicitly made public-safe. |
| Public Assets | `public/assets`, `public/brand`, root public SVGs | SVG/vector assets only in this pass; no raster assets added. |

Current safe normalization:

- Architecture doctrine is placed in `docs/product`.
- Architecture operational evidence is placed in `reports`.
- Local builder remains in `tools/alkon-local-builder`.
- Existing public assets remain in `public` with cleanup candidates documented for root starter SVGs.

Postponed normalization:

- Broad module reshaping into `modules/workspace`, `modules/assistant`, and `modules/settings-diagnostics` is postponed because current imports are route-critical.
- Broad `lib/server` consolidation is postponed because the private Alkon systems are intentionally numerous and test-covered.
- CSS splitting is postponed except for safe obvious fixes.
