# Alkon Codebase Existence Classification

Official code path:

`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Status: active_with_notes

| Group | Owner | Purpose | Visibility | Lifecycle | Next fate |
| --- | --- | --- | --- | --- | --- |
| `app/` | Public Pro Max plus private Founder routes | route entrypoints | mixed by route | active | protect |
| `app/founder/` | Private Alkon -0 | Founder-only command surfaces | private_founder_only | active | protect |
| `app/api/founder/` | Private Alkon -0 | read-only private snapshots | private_founder_only | active_with_notes | protect |
| `modules/shell/` | Public Pro Max / workspace shell | public and workspace layout | public_safe | active_with_notes | improve |
| `modules/founder-command/` | Private Alkon -0 | Founder private panels | private_founder_only | active | protect |
| `lib/server/existence-architecture/` | Private Alkon -0 | Permission-to-Exist classifier and gate | private_founder_only | active_with_notes | keep |
| `lib/server/jar-build/` | Private Alkon -0 | Jar intake and exit permit system | private_founder_only | active_with_notes | protect |
| `lib/server/*` | Invisible Operating Layer | product truth, readiness, private state | invisible_internal | active_with_notes | protect |
| `tools/` | Tools / Builder | terminal-only local builder | tool_local_only | active_with_notes | protect |
| `docs/` | Docs / Reports | doctrine and governance memory | docs_reports_only | active | keep |
| `reports/` | Docs / Reports | evidence and Wake Reports | docs_reports_only | active | keep |
| `tests/` | Tests / Evidence | regression and proof | test_evidence_only | active | keep |
| `public/` | Public Assets | approved public SVG/static assets | public_asset_only | cleanup_candidate | improve |
| config files | Tools / Builder | build/test/tool configuration | tool_local_only | active | protect |

Unclassified files:

No destructive action was taken. Any future unowned file enters Inbox / Jar before execution.
