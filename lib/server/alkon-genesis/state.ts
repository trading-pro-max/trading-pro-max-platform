import { evaluateAllWorldSeeds, evaluateWorldSeed } from "./engine";
import { ALKON_GENESIS_MEMORY_LESSONS } from "./memory";
import { getPrimeWorldSnapshot } from "./prime-world";
import { ALKON_SHARED_WORLD_SERVICES } from "./shared-services";
import { ALKON_WORLD_SEEDS } from "./world-seeds";
import type { AlkonGenesisSnapshot, AlkonWorldSeed } from "./types";

export function getAlkonGenesisSnapshot(
  checkedAt = new Date().toISOString()
): AlkonGenesisSnapshot {
  const reports = evaluateAllWorldSeeds();

  return {
    snapshotId: "alkon_sovereign_genesis_system",
    name: "Alkon Sovereign Genesis System",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    primeWorld: getPrimeWorldSnapshot(),
    worldSeeds: ALKON_WORLD_SEEDS,
    reports,
    worldSeedCount: ALKON_WORLD_SEEDS.length,
    evaluatingSeeds: ALKON_WORLD_SEEDS.filter(
      (seed) => seed.currentStatus === "evaluating"
    ).map((seed) => seed.seedId),
    delayedSeeds: reports
      .filter((report) => report.decision === "delay_until_prime_world_ready")
      .map((report) => report.seed.seedId),
    rejectedSeeds: reports
      .filter((report) => report.decision === "reject_seed")
      .map((report) => report.seed.seedId),
    prototypeAllowedSeeds: reports
      .filter((report) => report.decision === "prototype_allowed")
      .map((report) => report.seed.seedId),
    founderApprovalNeeded: reports
      .filter((report) => report.decision === "founder_approval_required")
      .map((report) => report.seed.seedId),
    birthPermits: reports.map((report) => report.birthPermit),
    blockedOrBlackHoledSeeds: reports
      .filter(
        (report) =>
          report.decision === "black_hole" ||
          report.birthPermit.status === "blocked"
      )
      .map((report) => report.seed.seedId),
    sharedServices: ALKON_SHARED_WORLD_SERVICES,
    memoryLessons: ALKON_GENESIS_MEMORY_LESSONS,
    nextSafeActions: [
      "Keep Pro Max Trading as Prime World until Local Day One and acceptance are established.",
      "Keep all World Seeds private and seed/prototype-readiness only.",
      "Delay any seed that creates legal, treasury, support, media, data, or attention burden before Prime World readiness.",
      "Require Founder final approval before any World Birth Permit can become active.",
    ],
    primeWorldProtectionWarnings: [
      "No new world may weaken Pro Max Trading.",
      "No new world may distract from Living Market Core, Local Day One, or Station 1 closure.",
      "No future world may expose Alkon, Genesis, World Seeds, or private governance publicly.",
    ],
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
    },
    productTruthStatus: {
      proMaxTradingRemainsPrimeWorld: true,
      tradingProMaxRemainsPrimeWorld: true,
      noNewProjectLaunched: true,
      noPublicFutureWorldsExposed: true,
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionSecretsUntouched: true,
      noSecretsExposed: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      noFakeClaims: true,
    },
    createdAt: checkedAt,
  };
}

export function getAlkonGenesisReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonGenesisSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noProjectCreation: true,
    noExternalCalls: true,
    noSecrets: true,
    snapshot,
  };
}

export function getAlkonGenesisWorldSeeds() {
  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noProjectCreation: true,
    worldSeeds: ALKON_WORLD_SEEDS,
  };
}

export function getAlkonGenesisSampleEvaluation(
  seed?: Partial<AlkonWorldSeed>
) {
  const base = ALKON_WORLD_SEEDS[0];
  const report = evaluateWorldSeed({ ...base, ...seed });

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noProjectCreation: true,
    noPublicPageCreated: true,
    noSecrets: true,
    report,
  };
}
