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
## Al-Kawn Ontological Code Rule

All future code must enter through the Existence Contract rule in `lib/server/universe/ontological-law/*`.

Each route, API, component, module, report, doc, test, asset, script, task, decision, or future feature must declare:

- why it exists
- which layer owns it
- truth source
- Product Truth impact
- privacy, legal, money, and security touch
- execution verdict
- rollback/explanation path
- report/test evidence

Compatibility code may remain only when it wraps primary logic. No duplicate kernel, duplicate truth model, or orphan entity may become new truth.

## Al-Kawn Visual Map Code Rule

The canonical founder-facing visual architecture map lives in `lib/server/universe/visual-map/*` and is rendered only by the private `/founder/universe` command center.

Required exports:

- `getAlKawnVisualMap()`
- `getAlKawnVisualMapNodes()`
- `getAlKawnVisualMapEdges()`
- `getAlKawnVisualMapLegend()`
- `getAlKawnVisualMapBoundaries()`
- `getAlKawnVisualMapSummary()`
- `explainVisualMapNode(nodeId)`
- `getAlKawnVisualMapLayers()`
- `getAlKawnVisualMapConnections()`
- `getAlKawnVisualMapTruth()`
- `getAlKawnVisualMapNextAction()`

Future UI work must import this primary model instead of creating page-local hierarchy truth. The Visual Map must show Ahmad as origin, الكون as Ahmad's private electronic self, Product Truth as highest truth law, Universe Operating Kernel as execution judge, Pro Max Galaxy inside الكون, Earth Planet inside Pro Max Galaxy, /trading and Pro Max Center inside Earth Planet, Swiss Local Constitution above Global Layer, ALKON private/background, and legal/money gates stopping execution for Ahmad.

The next safest code action after the Visual Map is Al-Kawn Desktop Operating Environment. Infinity Mode and Operator Mode remain blocked until Ahmad explicitly resumes them.

## Al-Kawn Desktop Operating Environment Code Rule

The desktop-first private route lives at `app/desktop/kawn/page.tsx`.

Its primary server model lives in `lib/server/universe/desktop-interface/*` and exports:

- `getAlKawnDesktopState()`
- `getAlKawnDesktopBootState()`
- `getAlKawnDesktopWelcomeMessage()`
- `getAlKawnDesktopQuickActions()`
- `getAlKawnDesktopResponseForIntent()`
- `getAlKawnDesktopCommandResult()`
- `getAlKawnDesktopDecisionCenter()`
- `getAlKawnDesktopTaskCenter()`
- `getAlKawnDesktopReportCenter()`
- `getAlKawnDesktopAppointmentCenter()`
- `getAlKawnDesktopRealityCenter()`
- `getAlKawnDesktopProductTruth()`
- `getAlKawnDesktopLayerState()`

The route is the private desktop command client for الكون. It must not define new Product Truth, new kernel truth, or a separate hierarchy. It surfaces existing canonical meaning through a desktop operating layout.

If native Electron, Tauri, or another shell is introduced later, it must target `/desktop/kawn` or wrap the primary desktop route instead of duplicating desktop truth. Native shell finalization requires security, signing, distribution, no-secrets, and Ahmad approval gates.

## Al-Kawn Unified Visual Identity Code Rule

## Al-Kawn Desktop Shell Finalization Code Rule

`/desktop/kawn` is the Al-Kawn private desktop home.

Current shell type is `next_route_only`. Native Electron/Tauri packaging is not present, so native signing and private distribution remain future gates.

Code rules:

- Keep `/desktop/kawn` as the private desktop command route.
- Use `lib/server/universe/desktop-interface/*` as the desktop state owner.
- Use `npm run desktop:check` for route-only desktop shell validation.
- Do not add signing, release, store, public distribution, payment, broker, or external account scripts without Ahmad approval.
- Do not store secrets in Git or a desktop bundle.
- Product Truth overrides every action.

## Private Desktop Packaging Gate Code Rule

`lib/server/universe/desktop-packaging-gate/` is the canonical owner for private desktop packaging readiness.

Required exports:

- `getDesktopPackagingGate()`
- `getDesktopShellReadiness()`
- `getNativeDesktopShellReadiness()`
- `getDesktopPackageReadiness()`
- `getDesktopSigningReadiness()`
- `getDesktopPrivateDistributionReadiness()`
- `getDesktopAuthReadiness()`
- `getDesktopSecretSafety()`
- `getDesktopPackagingNextAction()`

The gate does not package, sign, release, or distribute anything. It records shell readiness, native shell readiness, package readiness, signing readiness, private distribution readiness, local auth readiness, secret safety, Product Truth safety, and next safe action.

Packaging is not public distribution. Public desktop distribution is blocked. Signing and private distribution require future approval. No secrets are stored in the desktop bundle.

## Local Packaged Auth Gate Code Rule

`lib/server/universe/local-packaged-auth-gate/` is the canonical owner for private packaged-app access readiness.

Required exports:

- `getLocalPackagedAuthGate()`
- `getLocalAuthReadiness()`
- `getDesktopAccessModel()`
- `getPackagedAppLockReadiness()`
- `getSessionTimeoutReadiness()`
- `getAuthSecretSafety()`
- `getLocalAuthNextAction()`

The gate defines Ahmad-only local access. It does not connect external auth providers, does not create customer login, does not claim production-grade auth, and does not store secrets in Git or the app bundle.

Product Truth overrides local auth claims.

## Private Desktop Packaging Preparation Code Rule

`lib/server/universe/desktop-packaging-preparation/` is the canonical owner for private desktop packaging preparation readiness.

The preparation layer reads the prior packaging/auth gates, checks current packaging capability, and exposes a private UI readiness panel. It must not package, sign, release, publish, upload, or distribute the app.

Safe script:

- `desktop:package:check`

Blocked scripts:

- release scripts
- signing scripts
- publish scripts
- upload scripts
- auto-update scripts
- payment or billing scripts

Current result: no native shell and no packaging tool exist, so artifact-producing packaging remains future-gated. Local PIN / Passphrase Auth is preserved, and the next safe action is a readiness-only Private Desktop Local Build Dry Run.

Required exports include both canonical and compatibility names:

- `getDesktopPackagingPreparation()`
- `getDesktopPackagingCapability()`
- `getNativeShellStatus()`
- `getPackageScriptStatus()`
- `getPackagingAuthDependency()`
- `getPackagingSecretSafety()`
- `getDesktopPackagingPreparationNextAction()`
- `getPrivateDesktopPackagingPreparation()`

## Private Desktop Local Build Dry Run Code Rule

`lib/server/universe/desktop-local-build-dry-run/` is the canonical owner for the private desktop local build dry-run readiness model.

Safe script:

- `desktop:package:dry-run`

The script runs `scripts/al-kawn-desktop-local-build-dry-run.mjs` and is local readiness-only. It must not create package artifacts, sign production builds, upload artifacts, publish installers, enable auto-update, or create public distribution.

Current result: no native shell and no packaging tool exist. Local PIN / Passphrase Auth is preserved as the current route-level private lock, while native packaged-app hardening remains future-gated. The dry run can verify readiness only. Product Truth overrides local build.

## Local PIN / Passphrase Auth Code Rule

`lib/server/universe/local-desktop-auth/` is the canonical server owner for Local PIN / Passphrase Auth policy, readiness, status, boundaries, and next action.

Required exports include:

- `getLocalDesktopAuthPolicy()`
- `getLocalDesktopAuthReadiness()`
- `getLocalDesktopAuthStatus()`
- `getLocalDesktopAuthBoundaries()`
- `getLocalDesktopAuthNextAction()`

`lib/client/al-kawn-local-auth/` is the local browser/device auth utility layer for `/desktop/kawn`.

Client behavior:

- setup a local PIN/passphrase
- store only a salted PBKDF2 verifier
- use Web Crypto when available
- avoid plaintext PIN/passphrase storage
- keep unlocked session state local to the browser/device
- provide manual lock
- use a 30-minute session timeout
- show reset warning

This layer must never claim public auth, customer login, external auth provider connection, production-grade auth, legal identity verification, financial identity verification, or absolute security.

## Private Desktop Distribution Gate Code Rule

`lib/server/universe/desktop-distribution-gate/` is the canonical owner for private desktop distribution readiness.

Required exports include:

- `getDesktopDistributionGate()`
- `getPrivateDistributionReadiness()`
- `getPublicDistributionBlock()`
- `getProductionSigningGate()`
- `getDesktopArtifactPolicy()`
- `getDesktopDistributionNextAction()`

The gate defines distribution as private Ahmad-only. It must not upload installers, publish release artifacts, perform production signing, enable auto-update, or create public desktop distribution. Product Truth overrides distribution.

## Al-Kawn Control Surfaces Code Rule

Canonical control surfaces live in `lib/server/universe/control-surfaces/*`.

Required exports include:

- `getAlKawnControlSurfaces()`
- `getControlSurfaceById(surfaceId)`
- `getControlSurfaceRegistry()`
- `getControlSurfaceActions(surfaceId)`
- `getControlSurfaceBoundaries(surfaceId)`
- `getControlSurfaceSummary()`
- `getControlSurfaceNextAction()`

Future automation must read these surfaces before Infinity Mode, Operator Mode, Self-Building, Local Day One, money, broker, public launch, or external-account work is prepared.

The desktop route `/desktop/kawn` is the main control UI. `/founder/universe` shows only a compact control summary. `/trading` stays compact and chart-first.

Canonical visual tokens live in `app/_styles/al-kawn-visual-tokens.css` and are imported by `app/layout.tsx`.

Canonical visual wrappers live in `app/_components/al-kawn-visual/*`.

Future UI work should reuse:

- `AlKawnCosmicIdentity`
- `AlKawnProductTruthStrip`
- `AlKawnStatusChip`
- `AlKawnPanel`
- `AlKawnSectionHeader`
- `AlKawnRealitySourceChip`
- `AlKawnLayerBadge`

## Wake State Code Rule

Canonical wake state code lives in `lib/server/universe/wake-state/*`.

Required exports include:

- `getAlKawnWakeState()`
- `getAlKawnWakeSequence()`
- `getAlKawnWakeReadiness()`
- `getAlKawnWakeBoundaries()`
- `getAlKawnWakeNextAction()`
- `getAlKawnDailyWakeReport()`

Canonical daily work loop code lives in `lib/server/universe/daily-work-loop/*`.

Required exports include:

- `getAlKawnDailyWorkLoop()`
- `getDailyWorkChecklist()`
- `getDailyPriorities()`
- `getDailySafeWorkItems()`
- `getDailyBlockedItems()`
- `getDailyWorkReport()`

Canonical human spoken interface code lives in `lib/server/universe/human-spoken-interface/*`.

Required exports include:

- `getAlKawnHumanSpokenInterfaceState()`
- `getAlKawnSpokenWakeMessage()`
- `getAlKawnSpokenDailyBriefing()`
- `getAlKawnSpokenNeedsFromAhmad()`
- `getAlKawnSpokenBlockers()`
- `getAlKawnSpokenNextAction()`
- `getAlKawnSpokenToneRules()`

The desktop route `/desktop/kawn` renders the main wake panel. `/founder/universe` renders a compact wake summary. `/trading` stays compact and must not carry a daily loop panel.

Daily report files live under `reports/daily/` and must not contain secrets.

## Infinity Preparation Code Rule

Canonical Infinity preparation code lives in `lib/server/universe/infinity/*`.

Required exports include:

- `getAlKawnInfinityPreparation()`
- `getInfinityReadiness()`
- `getInfinityCyclePlan()`
- `getInfinityBoundaries()`
- `getInfinitySafeAutomation()`
- `getInfinityBlockedActions()`
- `getInfinityNextAction()`

Infinity preparation is a readiness model only. It must not create an uncontrolled loop, a background daemon, public automation, billing, payments, receiving money, real money, broker execution, legal claims, external account work, public الكون, public ALKON, or secrets movement.

The desktop route `/desktop/kawn` renders the main Infinity preparation panel. `/founder/universe` renders a compact summary. `/trading` remains compact.

## Living Autonomous Intelligence Code Rule

Canonical living intelligence code lives in `lib/server/universe/living-autonomous-intelligence/*`.

Required exports include:

- `getAlKawnLivingAutonomousIntelligence()`
- `getAlKawnAwarenessModel()`
- `getAlKawnContextReader()`
- `getAlKawnSelfObservation()`
- `getAlKawnDecisionEngine()`
- `getAlKawnActionSelector()`
- `getAlKawnAutonomousCycle()`
- `getAlKawnIntelligenceBoundaries()`
- `getAlKawnIntelligenceReport()`
- `getAlKawnIntelligenceNextAction()`

The module reads internal sources only, selects one safe internal action, reports what it did, and stops for the next safe trigger. It must not create uncontrolled loops, hidden daemons, public exposure, money movement, legal execution, external account access, or secret exposure.

## Final Internal Operating Sequence Code Rule

Infinity controlled activation lives in `lib/server/universe/infinity/controlled-activation.ts`, `infinity-cycle-state.ts`, and `infinity-cycle-ledger.ts`.

Operator preparation and controlled activation live in `lib/server/universe/operator/*`.

Local Day One Boot Gate lives in `lib/server/universe/local-day-one/*`.

Required exports include:

- `getInfinityControlledActivation()`
- `getInfinityCycleState()`
- `getInfinityCycleTriggerRules()`
- `getInfinityCycleLedger()`
- `getInfinityControlledNextAction()`
- `getAlKawnOperatorPreparation()`
- `getOperatorControlledActivation()`
- `getLocalDayOneReadiness()`
- `getLocalDayOneBootGate()`

These modules are private internal readiness and activation models only. They must not start public launch, money, broker, legal claims, external accounts, background daemons, uncontrolled loops, public الكون, public ALKON, or Local Day One without Ahmad.

No route should create a separate Earth/Moon identity, a separate Product Truth chip style, a separate page palette, or a second visual law for الكون. Trading may use compact density for readability, but must still carry the same Product Truth, Earth Planet, and Pro Max Galaxy meaning.
## Project Root Order Code Rule

Canonical device-fabric code lives in `lib/server/universe/device-fabric/*`.

Required exports include:

- `getAlKawnDeviceUniverseFabric()`
- `getAhmadPersonalDeviceDomain()`
- `getAlKawnCommandWorkspaceDomain()`
- `getActiveRepoDomain()`
- `getDeviceIntakeGate()`
- `getDeviceClassificationGate()`
- `getDeviceProtectionGate()`
- `getDeviceFabricNextAction()`

Canonical modular-worlds code lives in `lib/server/universe/modular-worlds/*`.

Required exports include:

- `getAlKawnModularWorlds()`
- `getWorldRegistry()`
- `getWorldById(worldId)`
- `getWorldContracts()`
- `getWorldBoundaries()`
- `getWorldIntegrationMap()`
- `getWorldNextAction()`

Root order rules:

- الكون يبقى داخل أجهزة أحمد الشخصية فقط.
- الاستخدام شخصي لأحمد فقط.
- الكون لا يبدأ من مجلد؛ الكون يبدأ من جهاز أحمد الشخصي.
- لابتوب أحمد هو نطاق الكون المحلي.
- AL-KAWN هو مركز قيادة داخل نطاق الجهاز.
- كل مشروع داخل الكون له مجلد كامل مستقل.
- كل المشاريع تعمل معًا عبر Al-Kawn Core.
- الربط يتم عبر Contracts واضحة وليس عبر فوضى ملفات.
- لا حذف قبل الجرد والتصنيف.
- لا نقل للريبو النشط قبل تقرير migration.
- Product Truth يحكم كل شيء.
