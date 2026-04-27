# Alkon Zero Codebase Architecture

Status: active_with_notes

Official project path:

`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Zero Truth:

Every active file must belong to one reality layer. The repository is not a blank rewrite target and must not be cleaned by blind deletion. Architecture recomposition means ownership, import boundaries, route stability, evidence, and safe postponement when a move could create broad import risk.

Ownership layers:

1. Public Pro Max Reality
2. Private Alkon Universe
3. Invisible Operating Layer
4. Tools / Builder
5. Tests / Evidence
6. Docs / Reports
7. Public Assets

Target architecture:

```text
app/
  public routes
  founder private routes
  public-safe API routes
  founder-only API routes
modules/
  brand
  public-reality
  product
  workspace
  assistant
  journal-coach
  settings-diagnostics
  founder-command
  shell
lib/
  alkon
  alkon-kernel
  alkon-operating-mode
  alkon-zero-to-zero
  reality-production
  self-correction
  devices
  invisible-operating-layer
  product-truth
  security
  reports
  brand
tools/
  alkon-local-builder
docs/product/
  product doctrine and Alkon doctrine
reports/
  wake reports, operating status, architecture map, cleanup candidates
tests/regression/
  regression and proof tests
public/assets/
  approved public assets only
```

Folder law:

- Public Pro Max files may only render public-safe product language.
- Private Alkon files may render Founder-only language and internal command doctrine.
- The Invisible Operating Layer translates private truth into public-safe states.
- Tools may read the workspace and prepare reports, but must not execute Codex, shell from the web app, payments, launch, billing, broker/feed, live trading, or real-money actions.
- Tests and reports prove the boundary instead of relying on intent.
- Uncertain files become cleanup_candidate, move_candidate, merge_candidate, archive_candidate, protected_candidate, or boundary_candidate.

Current recomposition decision:

No broad core `app/`, `modules/`, or `lib/` moves are performed in this pass. The existing route surface is large and import-sensitive. The safe recomposition is to classify ownership, document candidate moves, protect public/private language boundaries, and keep routes validated.

Protected invariants:

- Pro Max remains the public reality.
- Alkon remains Founder-only.
- Founder routes and founder APIs are not public navigation.
- Product Truth remains blocked for live execution, real money, broker/feed, billing, public launch, fake downloads, fake plan activation, #1/global/regulated claims, trading signals, profit promises, and win-rate claims.
- Local Day One remains not_started until Ahmad explicitly accepts visual reality.
