# Alkon Next Command

Recommended next command:

Ahmad reviews the Zero Codebase Architecture map, cleanup candidates, and visual proof, then chooses one focused cleanup or move only if it has clear route, import, Product Truth, and public/private boundary proof.

Review:

- `reports/alkon-codebase-architecture-map.md`
- `reports/alkon-cleanup-candidates.md`
- `docs/product/alkon-zero-codebase-architecture.md`
- `docs/product/pro-max-public-private-folder-law.md`
- `docs/product/invisible-operating-layer-architecture.md`
- `docs/product/codebase-ownership-classification.md`
- `test-results/alkon-zero-codebase-architecture/public-home-clean-after-architecture.png`
- `test-results/alkon-zero-codebase-architecture/founder-alkon-after-architecture.png`
- `test-results/alkon-zero-codebase-architecture/founder-pocket-after-architecture.png`
- `test-results/alkon-zero-codebase-architecture/workspace-after-architecture.png`
- `test-results/alkon-zero-codebase-architecture/diagnostics-public-safe.png`
- `test-results/alkon-zero-codebase-architecture/public-no-alkon-leak.png`

Reason:

The active project now has an explicit ownership map. Broad folder moves are intentionally postponed where import risk is high. Cleanup should proceed in small, governed passes with evidence.

Safe next cleanup options:

- Audit root public starter SVG usage before any asset cleanup.
- Split `modules/shell` ownership only after an import map proves public shell, workspace shell, and private shell boundaries.
- Split `app/theme-localization.css` only with screenshots for Home, Workspace, Settings, Diagnostics, Founder Alkon, and Pocket.
- Rename companion/Assistant internals only with API compatibility and public copy proof.

Blocked:

- public launch
- production activation
- billing activation
- broker/feed activation
- live execution
- real money
- payment execution
- shell execution from the web app
- Codex execution from the web app
- public Alkon exposure
- public Founder navigation
- external account connection
- social publishing
- secrets exposure
- raw sensitive personal data in code
- image generation or public raster assets
- deletion of uncertain files
