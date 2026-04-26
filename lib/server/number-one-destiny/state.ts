import { evaluateAbsoluteCompletion } from "./absolute-completion";
import {
  SAMPLE_NUMBER_ONE_TARGETS,
  evaluateNumberOneSamples,
  evaluateNumberOneTarget,
} from "./decision-engine";
import { NUMBER_ONE_MEMORY_LESSONS } from "./memory";
import { evaluateNorthStar } from "./north-star";
import { evaluatePublicClaimFirewall } from "./public-claim-firewall";
import { PRO_MAX_STANDARDS } from "./standards-authority";
import type { NumberOneEvaluationTarget, NumberOneDestinySnapshot } from "./types";

export function getNumberOneDestinySnapshot(
  checkedAt = new Date().toISOString()
): NumberOneDestinySnapshot {
  const sampleReports = evaluateNumberOneSamples();
  const primeTarget = SAMPLE_NUMBER_ONE_TARGETS[0];
  const claimTarget = SAMPLE_NUMBER_ONE_TARGETS[1];
  const futureWorldTarget = SAMPLE_NUMBER_ONE_TARGETS[2];
  const topDrifts = sampleReports.flatMap((report) =>
    report.driftSignals.filter((signal) => signal.driftDetected)
  );
  const weakDimensions = Array.from(
    new Set(sampleReports.flatMap((report) => report.score.weakestDimensions))
  );

  return {
    snapshotId: "pro_max_number_one_destiny_alignment",
    name: "Pro Max Number One Destiny Alignment",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    internalMission:
      "Make Pro Max worthy of becoming the world's #1 Earth-native financial intelligence and trading command platform.",
    publicClaimStatus: "forbidden",
    noPublicNumberOneClaim: true,
    primeWorld: "Pro Max Trading",
    currentStationStatus: "station_1_open",
    northStar: evaluateNorthStar(primeTarget),
    scoresByLayer: sampleReports.map((report) => report.score),
    sampleReports,
    topDrifts,
    weakDimensions,
    standards: PRO_MAX_STANDARDS,
    completionChecks: evaluateAbsoluteCompletion(primeTarget),
    founderEnergy: sampleReports[0].founderEnergy,
    worldlineProtection: sampleReports[2].worldlineProtection,
    claimFirewallExamples: [
      evaluatePublicClaimFirewall("Pro Max Trading is paper-safe and AI-guided."),
      evaluatePublicClaimFirewall(claimTarget),
    ],
    memoryLessons: NUMBER_ONE_MEMORY_LESSONS,
    nextOneCriticalDecision:
      "Protect Living Market Core and Local Day One before any future-world expansion.",
    nextSafeActions: [
      "Use #1 only as a private internal quality standard.",
      "Keep public copy truthful: paper-safe, planned, inactive, future, readiness, transparent.",
      "Prioritize Living Market Core, Pro Max Assistant clarity, Reality Audit, Safe Cleanup, and Local Day One.",
      "Delay future worlds unless they are private readiness and do not weaken Pro Max Trading.",
      "Require proof, tests, visual review where needed, and Founder acceptance before closure.",
    ],
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
      publicNumberOneClaimVisible: false,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionSecretsUntouched: true,
      authSecurityPreserved: true,
      noPublicNumberOneBestGlobalRegulatedClaims: true,
      noFakeClaims: true,
      noAlkonNumberOneExposureToPublicUsers: true,
      noShellExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
    },
    createdAt: checkedAt,
  };
}

export function getNumberOneDestinyReadiness(
  checkedAt = new Date().toISOString()
) {
  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noPublicNavigation: true,
    noSecrets: true,
    noExternalCalls: true,
    noFakeMetrics: true,
    publicNumberOneClaimForbidden: true,
    snapshot: getNumberOneDestinySnapshot(checkedAt),
  };
}

export function getNumberOneDestinySampleEvaluation(
  target?: Partial<NumberOneEvaluationTarget>
) {
  const base = SAMPLE_NUMBER_ONE_TARGETS[0];
  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noSecrets: true,
    report: evaluateNumberOneTarget({ ...base, ...target }),
  };
}
