# Trading Pro Max Legacy Salvage Report

Generated on: 2026-04-23  
Target repository: `C:\Users\ahmad\Desktop\trading-pro-max-platform`

## 1. Donor repositories audited

- `C:\Users\ahmad\Desktop\trading-pro-max-full`
- `C:\Users\ahmad\Desktop\trading-pro-max`
- `C:\Users\ahmad\Desktop\trading-pro-max\tpm9-updated`

These repositories were treated strictly as donor/reference sources. The current platform remained the architecture source of truth.

## 2. Adopt now (directly integrated)

1. Canonical route smoke harness pattern from:
   - `trading-pro-max-full/scripts/tpm-canonical-routes-smoke.mjs`
   - Integrated as: `scripts/tpm-canonical-routes-smoke.mjs`
   - Purpose: deterministic runtime confidence checks for canonical UI and API routes with local server management and log-tail diagnostics.

2. Deterministic market fixture generation patterns from:
   - `trading-pro-max-full/lib/terminal/market-provider.js`
   - Integrated as:
     - `lib/server/market-data/deterministic.ts`
     - `lib/server/market-data/service.ts` (adoption integration)
   - Purpose: stable quote/candle generation without external feed dependency.

3. Readiness scoring pattern from:
   - `trading-pro-max/src/services/bridge-state.js`
   - `trading-pro-max/src/services/link-state.js`
   - Integrated as:
     - `lib/server/diagnostics/readiness-score.ts`
     - applied in `lib/server/connectors/broker.ts`
     - applied in `lib/server/market-data/service.ts`
     - surfaced in `lib/server/diagnostics/health.ts`

## 3. Refactor then adopt (cleaned before integration)

1. Connector readiness state pattern from:
   - `trading-pro-max-full/lib/terminal/connector-readiness.js`
   - Refactored/integrated as:
     - `lib/server/connectors/readiness.ts`
     - usage in `lib/server/connectors/broker.ts`
   - Cleanup performed: reduced to strict typed state normalization and validation summary helpers.

2. Workspace persistence normalization and migration-safe parsing from:
   - `trading-pro-max-full/lib/terminal/persistence.js`
   - Refactored/integrated as:
     - `lib/server/workspace/normalization.ts`
     - usage in `lib/server/workspace/state.ts`
     - exports in `lib/server/workspace/index.ts`
   - Cleanup performed: removed legacy desk coupling, retained schema-safe normalization and alias migration behavior.

3. Freshness/degraded/session classification from:
   - `trading-pro-max-full/app/api/product/live-data/route.js`
   - Refactored/integrated as:
     - `lib/server/market-data/freshness.ts`
     - usage in `lib/server/market-data/service.ts`
   - Cleanup performed: converted to framework-agnostic pure functions and aligned with current fallback-first truth semantics.

4. Watchlist normalization and dedupe patterns from:
   - `trading-pro-max-full/app/_components/product-watchlists.js`
   - Refactored/integrated as:
     - `lib/watchlists/normalization.ts`
     - usage in `modules/shell/hooks/use-platform-state.ts`
   - Cleanup performed: extracted pure symbol/tag/merge helpers only; removed legacy UI/store coupling.

## 4. Reference only (not imported directly)

- `trading-pro-max-full/scripts/tpm-operator-desk-validate.mjs`  
  Useful contract-checking idea, but tied to obsolete route/component topology.

- `trading-pro-max-full/docs/ARCHITECTURE.md`  
  Useful high-level decomposition reference only.

- `trading-pro-max/tpm9-updated/apps/api/src/routes/*.ts` and `src/lib/*.ts`  
  Retained as API organization reference, not imported due security defaults and contract divergence.

## 5. Discarded categories

- Backup/generated debris:
  - `apps_backup_*`, `src_backup_*`, `runtime/auto-build/*`, `desktop/build-runtime/*`
- Broken/stale artifacts:
  - `*.broken-*`, placeholder smoke scripts without assertions
- Insecure defaults:
  - demo secrets, permissive CORS defaults, fake auth defaults from legacy API configs
- Old UI sprawl and monolithic subsystems:
  - legacy expansive page trees and coupled stores not compatible with normalized current UI

## 6. Desktop/mobile-relevant salvage findings

Integrated backend contract foundation for future multi-client expansion:

- `lib/server/platform/client-contracts.ts`
  - Shared cross-client contract truth for web/desktop/mobile shells.
  - Explicitly marks desktop/mobile as `future_ready`, not active.
  - Preserves execution safety (`paper_only_live_blocked`) and no fake delivery claims.

Surface integration:

- `lib/server/diagnostics/health.ts`
- `app/api/health/route.ts`
- `modules/shell/types/platform-state.ts`

This creates a grounded backend contract surface for future desktop (Electron/Tauri) and mobile (React Native/native wrapper) clients without adding UI noise.

## 7. Validation and regression updates

Updated regression coverage:

- `tests/regression/verified-platform-truth.spec.ts`
  - readiness/freshness assertions for market feed
  - architecture readiness assertions for broker/feed
  - future client expansion contract assertions (desktop/mobile marked future-ready)

Added runtime harness script:

- `scripts/tpm-canonical-routes-smoke.mjs`
- `package.json` script: `smoke:routes`

## 8. Archive and deletion

Archive root:
- `C:\Users\ahmad\Desktop\legacy-trading-pro-max-archives`

Archive outputs:
- `C:\Users\ahmad\Desktop\legacy-trading-pro-max-archives\trading-pro-max-full-20260423-122430`
- `C:\Users\ahmad\Desktop\legacy-trading-pro-max-archives\trading-pro-max-20260423-122430`
- `C:\Users\ahmad\Desktop\legacy-trading-pro-max-archives\tpm9-updated-20260423-122430`

Archive format note:
- Timestamped archive directories were used as an equivalent archive format to preserve complete donor trees reliably before deletion.

Deleted donor paths:
- `C:\Users\ahmad\Desktop\trading-pro-max-full`
- `C:\Users\ahmad\Desktop\trading-pro-max`
- `C:\Users\ahmad\Desktop\trading-pro-max\tpm9-updated`

Deletion safety rationale:
- archives created and verified before deletion
- migration changes validated locally
- migration changes committed and pushed
- donor repositories no longer required for runtime or build
