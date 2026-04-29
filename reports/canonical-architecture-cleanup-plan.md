# Canonical Architecture Cleanup Plan

Official audited path:
`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Status: cleanup_required_before_depth_or_infinity

## What Should Be Cleaned First

1. Canonical hierarchy source
   - Update `lib/server/universe-management/index.ts` only after Ahmad approves exact target definitions.
   - Add الكون / Universe, Universe One, Swiss Local Constitution, Pro Max Galaxy, Earth Planet, and Global Layer in one governed pass.

2. Existing kernel canonicalization
   - Treat `lib/server/alkon-kernel/*` as the existing kernel.
   - Add a Universe Operating Kernel wrapper only if it imports/wraps the existing kernel.
   - Do not duplicate command/state/gate logic.

3. Earth/logo identity cleanup
   - Keep `app/_components/ProMaxCosmicIdentity.tsx` and `app/_components/ProMaxLivingEarth.tsx` primary.
   - Convert older module-level Earth/logo components into compatibility wrappers where safe.

4. Planet/Earth API classification
   - Classify `app/api/planet/*` and `lib/server/planet-*/*` under Earth Planet or cleanup candidates.
   - Do not delete without tests and evidence.

5. Brand Gate wording normalization
   - Normalize `ready_with_notes` and `frozen_deferred` into a structured state.

6. Tests
   - Add target-model tests after hierarchy cleanup.
   - Keep old hierarchy tests as compatibility until migration is complete.

## What Must Not Be Touched Casually

- `lib/server/product/truth.ts`
- `lib/server/alkon-kernel/*`
- `lib/server/jar-build/*`
- `lib/server/reality-conversion/*`
- `lib/server/existence-architecture/*`
- Brand Gate modules and reports
- historical closure reports
- local/procedural asset manifest
- `/founder/alkon`
- `/founder/command`
- `/founder/pocket`
- Product Truth visibility in `/founder/universe` and `/trading`

## Blocked Until Cleanup

- Ultimate 100% Depth
- Universe Infinity Mode
- desktop/mobile app implementation
- public launch
- billing
- real money
- broker execution
- legal approval claims
- FINMA/licensed/regulated claims
- public Universe/الكون exposure
- public ALKON exposure

## Recommended Cleanup Commit Scope

Next mission should be:

controlled canonical cleanup

Allowed:

- docs
- registry updates
- hierarchy source updates after Ahmad approval
- tests
- compatibility wrappers
- reports

Not allowed:

- new product surfaces
- new kernel
- Infinity Mode runtime
- native app implementation
- launch/billing/trading activation
