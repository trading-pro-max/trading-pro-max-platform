# Alkon Codebase Architecture Map

Status: active_with_notes

Official path:

`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Mission:

Recompose the codebase architecture from Zero Truth without deleting uncertain files, breaking routes, exposing Alkon publicly, or enabling unsafe activation.

Current source inventory:

| Area | Observed file count | Ownership |
| --- | ---: | --- |
| `lib` | 598 | Invisible Operating Layer, Private Alkon Universe, public-safe support libraries |
| `docs` | 565 | Docs / Reports |
| `modules` | 273 | Public Pro Max Reality, Private Alkon Universe, shell/workspace components |
| `app` | 245 | Routes and APIs split between public-safe and founder-only |
| `artifacts` | 45 | Tests / Evidence generated or support artifacts |
| `tests` | 38 | Tests / Evidence |
| `public` | 17 | Public Assets |
| `reports` | 13 | Docs / Reports |
| `scripts` | 8 | Tools / Builder |
| `tools` | 7 | Tools / Builder |
| `prisma` | 3 | Tools / Builder and runtime schema support |

Layer classification:

1. Public Pro Max Reality
   - `app/page.tsx`
   - `app/[locale]/page.tsx`
   - `app/settings/page.tsx`
   - `app/diagnostics/page.tsx`
   - public-safe API routes outside `/api/founder`
   - `modules/product`
   - `modules/brand`
   - public shell components under `modules/shell`
   - public-safe support in `lib/brand`, `lib/plans`, `lib/environment`, `lib/assistant`, `lib/market`

2. Private Alkon Universe
   - `app/founder/*`
   - `app/api/founder/*`
   - `modules/founder-command`
   - `modules/shell/components/PrivateFounderShell.tsx`
   - `lib/server/alkon`
   - `lib/server/alkon-chat`
   - `lib/server/alkon-kernel`
   - `lib/server/alkon-operating-mode`
   - `lib/server/devices`
   - `lib/server/founder-command`
   - `lib/server/reality-production`
   - `lib/server/self-correction`

3. Invisible Operating Layer
   - `lib/server/invisible-operating-layer`
   - `lib/server/product`
   - `lib/server/security`
   - public-safe diagnostics and readiness translators
   - public Product Truth route summaries

4. Tools / Builder
   - `tools/alkon-local-builder`
   - `scripts`
   - Prisma config and seed scripts
   - package scripts for build, smoke, regression, and Alkon local builder

5. Tests / Evidence
   - `tests/regression`
   - `playwright.config.ts`
   - `test-results`
   - generated evidence screenshots

6. Docs / Reports
   - `docs/product`
   - `docs/*` domain folders
   - `reports`
   - root README and agent guidance

7. Public Assets
   - `public/assets`
   - `public/brand`
   - root public SVG starter assets as cleanup candidates

Target architecture decision:

The repository already follows the high-level public/private split in route space: public pages live outside `/founder`, private Founder surfaces live under `/founder`, and founder APIs live under `/api/founder`. This pass does not perform broad route or module moves because that would create high import churn and unnecessary route risk.

Protected systems:

- Product Truth and readiness gates
- Founder Command and Alkon private systems
- Alkon chat / command interface
- Local Builder scaffold
- Security, legal, treasury, launch readiness, and safety modules
- Reports and wake memory
- Public shell and workspace route
- Public assets with known SVG/vector scope

Boundary observations:

- Public UI has no approved path to link to `/founder/alkon`, `/founder/pocket`, or `/api/founder/*`.
- Founder UI imports private Alkon state and renders private identity inside `PrivateFounderShell`.
- Some public-safe planning libraries contain private taxonomy words for internal classification. These are boundary candidates, not confirmed leaks, because public route tests validate rendered output.
- `scripts` may use local process APIs as terminal-only tools; they are not imported by web routes.

Risks:

- `modules/shell` owns both public shell and trading workspace concerns; splitting it now would be broad and import-sensitive.
- `app/theme-localization.css` remains a large CSS island with public, workspace, and visual classes.
- `app/founder-command.css` remains a private CSS island shared across Founder surfaces.
- Root public starter SVG files may be unused but are not proven safe to delete.

Safe moves performed:

- Architecture doctrine added under `docs/product`.
- Architecture map and cleanup report added under `reports`.
- Regression proof added under `tests/regression`.

Postponed moves:

- Workspace component grouping under `modules/workspace`.
- Assistant/companion naming consolidation.
- Shell component split between public shell and workspace shell.
- CSS domain split.
- Public root starter SVG cleanup.
