# Pro Max Chart Body Death Audit

Mission: identify why the previous Trading chart body felt damaged and rebuild only the focused visual core.

Findings:

- Old rendered overlays sat above price action: market structure zones, floating bar, AI panel, and depth panel.
- Depth and intelligence panels created translucent blocks that competed with candles and price movement.
- Chart controls were distributed around the plot instead of being grouped into a clean command strip.
- Market depth and Assistant context felt like chart overlays rather than supporting information.
- Volume was conditional and could disappear unless the VOL indicator or bars chart type was active.
- Earlier CSS islands still contain legacy overlay styling, especially in `app/compact-modes.css` and older sections of `app/theme-localization.css`.

Classification:

- `tpmv2-chart-market-structure`: remove_from_render.
- `tpmv2-chart-floating-bar`: remove_from_render.
- `tpmv2-chart-ai-panel`: remove_from_render.
- `tpmv2-chart-depth-panel`: remove_from_render.
- Price scale, time scale, candles, line path, EMA/RSI, price marker, volume: keep_logic and rebuild visual structure.
- Chart controls: rebuild as compact command strip and support strip.
- Legacy CSS rules for old chart overlays: cleanup_candidate, postponed until a broader CSS deletion pass.

Fix applied:

- `PlatformShellV2.ChartCard` now renders `tpmv2-chart-surface-swiss`.
- Old obstruction selectors are not rendered.
- Chart body has `data-old-overlay-artifacts="removed"`.
- Volume layer is always visible.
- Market depth and guidance moved below chart body.
- Execution rail marked `data-execution-attached-to-chart="true"`.

Risk:

- Legacy CSS still contains old class rules for compatibility and prior responsive modes, but final Swiss rebuild CSS overrides active layout.
- Destructive CSS deletion postponed to avoid broad visual regressions.
