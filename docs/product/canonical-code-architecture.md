# Canonical Code Architecture

Official path:
`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Status: controlled_canonical_cleanup_primary_guide

This guide applies the Canonical Architecture Registry to code ownership. It prevents duplicated kernels, duplicated Earth identities, route contradictions, and unsafe public/private boundary drift.

## Primary Sources

Future work must use these primary sources before creating anything new:

- `lib/server/universe-management/index.ts` for the current canonical hierarchy.
- `lib/server/project-universe-truth/index.ts` for route-consumable Universe/Product Truth snapshots.
- `lib/server/universe/architecture-registry/*` for architecture classification and next action.
- `lib/server/product/truth.ts` for Product Truth.
- `lib/server/alkon-kernel/*` as the existing kernel foundation.
- `lib/server/jar-build/*` for Jar intake.
- `lib/server/reality-conversion/*` for Reality Passport work.
- `lib/server/existence-architecture/*` for Permission-to-Exist.
- `app/_components/ProMaxCosmicIdentity.tsx` and `app/_components/ProMaxLivingEarth.tsx` for the canonical Earth/Moon identity.
- `app/trading/_components/*` for the trading surface on Earth Planet.

Primary sources are the only future truth.

## Compatibility Layers

Compatibility layers must wrap or delegate to primary logic where safe:

- `app/[locale]/*` stays a compatibility route layer.
- `app/api/founder/infinite-growth/*` and `lib/server/infinite-growth/*` stay governed-growth compatibility, not Infinity Mode.
- `lib/server/earth-reality/*` stays compatibility for Living Earth Reality.
- `app/_components/ProMaxEarthIdentity.tsx` stays a compatibility wrapper around the app-level Living Earth identity.
- Older hierarchy tests stay compatibility until the cleanup test set fully replaces them.

Compatibility layers must wrap primary logic.

## Protected Systems

Protected systems must not be removed or casually modified:

- `/founder/alkon`, `/founder/command`, `/founder/pocket`
- Product Truth engine and API
- Brand Gate modules/APIs/reports
- desktop/mobile strategy modules/APIs
- soundscape consent/off-by-default behavior
- local/procedural asset manifest
- historical closure reports

## Cleanup Candidates

Cleanup candidates remain controlled, not deleted:

- `app/api/planet/*`
- `lib/server/planet-*/*`
- older module-level brand/Earth/logo components under `modules/brand/components/*`

They require controlled cleanup, reference checks, and regression proof before removal or migration.

## Needs Ahmad Decision

These are documented, but not implemented by this cleanup:

- Ahmad Digital Vault
- Protection Core
- Swiss Local Constitution details
- Global Layer details
- Planet API reuse/retirement strategy
- native desktop/mobile runtime path

## No Second Kernel

The existing `lib/server/alkon-kernel/*` is the only kernel foundation currently allowed. It is now canonicalized through `lib/server/universe/kernel/*`.

`lib/server/universe/kernel/*` is the Universe Operating Kernel adapter. It imports the existing kernel and exposes:

- `getUniverseKernelState()`
- `getUniverseKernelRole()`
- `getUniverseKernelPermissions()`
- `getUniverseKernelGuards()`
- `getUniverseKernelNextAction()`
- `getUniverseKernelTruth()`
- `getUniverseKernelReadiness()`

Existing kernel canonicalized as Universe Operating Kernel. Universe Operating Kernel is the root private operating brain. Product Truth overrides every action. Swiss Local Constitution is above the Global Layer. Dangerous actions require Ahmad approval or remain blocked. No duplicate kernel exists.

Future imports that need the official Universe Operating Kernel should use `lib/server/universe/kernel/*`. Code that needs the protected historical implementation may use `lib/server/alkon-kernel/*`, but it must not create parallel command, state, gate, Local Day One, or one-next-action logic.

## Absolute Founder Boundary

`lib/server/universe/founder-boundary/*` is the primary boundary module for what الكون may execute alone and what requires Ahmad approval.

Required exports:

- `getFounderBoundaryRules()`
- `getNeverAloneActions()`
- `getApprovalRequiredActions()`
- `getSafeInternalActions()`
- `canAlKawnExecuteAlone(action)`
- `requiresAhmadApproval(action)`
- `explainFounderBoundary(action)`

Universe Operating Kernel enforces Absolute Founder Boundary. Future Operator Mode, Infinity Mode, native apps, or external integrations must import this boundary and must not bypass it.

## Public / Private Boundary

Public routes must not expose الكون, Universe internals, ALKON internals, Founder Command, Jar internals, Permission-to-Exist internals, kernel internals, legal internals, or sensitive private governance.

Private Founder routes may show private truth when read-only, gated, and not connected to unsafe execution.

## Forbidden Activation

This architecture does not allow public launch, billing, real money, broker execution, live broker/feed claims, legal approval claims, FINMA claims, licensed/regulated claims, investment advice claims, guaranteed profit, guaranteed win, or risk-free claims.

## Next Code Action

The safest next code action after Absolute Founder Boundary 100 is Al-Kawn Visual Map: make the private hierarchy visibly understandable before Operator Mode, Ultimate Depth, or Infinity Mode resumes.
