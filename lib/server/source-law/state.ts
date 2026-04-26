import { evaluateSourceLawSamples, evaluateSourceLawTarget } from "./engine";
import { SOURCE_LAW_MEMORY_LESSONS } from "./memory";
import type { SourceLawSnapshot, SourceLawTarget } from "./types";
import { AHMAD_VISION_CORE } from "./vision-core";

export function getSourceLawSnapshot(
  checkedAt = new Date().toISOString()
): SourceLawSnapshot {
  const sampleReports = evaluateSourceLawSamples();
  const primaryReport = sampleReports[0];
  const driftSignals = sampleReports.flatMap((report) =>
    report.driftSignals.filter((signal) => signal.driftDetected)
  );
  const delayedActions = Array.from(
    new Set(
      sampleReports
        .filter((report) =>
          ["delay", "archive", "return_to_prime_world", "aligned_later"].includes(
            report.decision
          )
        )
        .map((report) => report.target.title)
    )
  );
  const blockedActions = Array.from(
    new Set(
      sampleReports
        .filter((report) => report.decision === "block")
        .map((report) => report.target.title)
    )
  );
  const founderReviewNeeds = Array.from(
    new Set(
      sampleReports
        .filter(
          (report) =>
            report.decision === "needs_founder_review" ||
            report.vision.founderReviewNeeded
        )
        .map((report) => report.oneCorrectAction.founderDecisionNeeded)
    )
  );

  return {
    snapshotId: "alkon_sovereign_source_law",
    name: "Alkon Sovereign Source Law",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    primeWorld: "Pro Max Trading",
    sourceLaw:
      "Ahmad vision -> human value -> truth -> safety -> proof -> one correct action now.",
    visionCore: AHMAD_VISION_CORE,
    visionAlignment: primaryReport.vision,
    humanValueStatus: primaryReport.humanValue,
    truthStatus: primaryReport.truth,
    safetyStatus: primaryReport.safety,
    proofStatus: primaryReport.proof,
    driftSignals,
    oneCorrectAction: primaryReport.oneCorrectAction,
    sampleReports,
    delayedActions,
    blockedActions,
    founderReviewNeeds,
    primeWorldFocusStatus: "protected",
    memoryLessons: SOURCE_LAW_MEMORY_LESSONS,
    nextSafeActions: [
      "Use Source Law privately before accepting any action.",
      "Return theory-only or expansion work to memory unless it serves Station 1.",
      "Close Living Market Core proof before future-world expansion.",
      "Require truth, safety, validation, public leak, Product Truth, visual, Git, commit, and push proof before closure.",
      "Ask Ahmad for one review decision only when visual identity, money, law, security, or launch is touched.",
    ],
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
      publicSourceLawDoctrineVisible: false,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionSecretsUntouched: true,
      authSecurityPreserved: true,
      noSecretsExposed: true,
      noPublicSourceLawExposure: true,
      noShellExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
    },
    createdAt: checkedAt,
  };
}

export function getSourceLawReadiness(
  checkedAt = new Date().toISOString()
) {
  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noPayments: true,
    noExternalCalls: true,
    noSecrets: true,
    noPublicNavigation: true,
    noPublicApi: true,
    noPublicDoctrine: true,
    snapshot: getSourceLawSnapshot(checkedAt),
  };
}

export function getSourceLawOneCorrectAction(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getSourceLawSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noSecrets: true,
    oneCorrectAction: snapshot.oneCorrectAction,
    delayedActions: snapshot.delayedActions,
    blockedActions: snapshot.blockedActions,
  };
}

export function getSourceLawSampleEvaluation(
  target?: Partial<SourceLawTarget>
) {
  const base = getSourceLawSnapshot().sampleReports[0].target;

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noSecrets: true,
    report: evaluateSourceLawTarget({ ...base, ...target }),
  };
}
