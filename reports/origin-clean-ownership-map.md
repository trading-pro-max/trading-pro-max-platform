# Origin-Clean Ownership Map

Status: active_with_notes

| Layer | Primary folders / files | Visibility | Evidence |
| --- | --- | --- | --- |
| Public Pro Max Reality | `app/page.tsx`, `app/trading/page.tsx`, `app/[locale]/page.tsx`, `app/settings`, `app/diagnostics`, `modules/product`, public shell/workspace components | Public-safe | Public leak tests, route tests, screenshots |
| Private Alkon -0 | `app/founder`, `app/api/founder`, `modules/founder-command`, `lib/server/alkon-*`, `lib/server/jar-build`, `lib/server/founder-command`, `lib/server/devices`, `lib/server/reality-production`, `lib/server/self-correction` | Founder/internal | Founder route/API tests and reports |
| Invisible Operating Layer | `lib/server/product`, `lib/server/security`, readiness translators, public-safe state summaries | Internal-to-public-safe | Product Truth API and diagnostics tests |
| Tools / Builder | `scripts`, `tools/alkon-local-builder`, `prisma`, package scripts | Local terminal only | build/smoke/prisma validation |
| Tests / Evidence | `tests/regression`, `test-results` | Test/evidence | Playwright regression and screenshots |
| Docs / Reports | `docs/product`, `reports`, `README.md` | Internal docs/reporting | Architecture and wake reports |
| Public Assets | `public/assets`, `public/brand`, approved static SVG | Public | Raster asset guard |

Ownership decisions:

- `/trading` is now the canonical public workspace route.
- `/en` stays as compatibility and must not be linked as primary public navigation.
- Founder routes remain private route space and do not reuse public navigation.
- Reports and docs are internal memory, not public UI.

Permission-to-Exist amendment:

- Every entity now has a required existence review: owner, purpose, visibility, boundary, evidence, lifecycle, and next fate.
- `lib/server/existence-architecture` owns the private classifier/gate engine.
- Public Pro Max cannot render Permission-to-Exist, Jar internals, Alkon -0, Founder Command, Kernel, Zero Truth, Reality Trial, or internal governance terms.
- Unowned or unproven entities move to Inbox/Jar reports before execution.
