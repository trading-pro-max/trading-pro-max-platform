import { ALKON_RUNTIME_MANDATORY_LESSONS } from "./memory-layer";
import {
  SAMPLE_ALKON_RUNTIME_INPUTS,
  runAlkonRuntime,
  runAlkonRuntimeSamples,
} from "./engine";
import type {
  AlkonRuntimeInput,
  AlkonRuntimeInputCategory,
  AlkonRuntimeLayer,
  AlkonRuntimeSnapshot,
} from "./types";

export const ALKON_RUNTIME_BLACK_HOLE_CATEGORIES: AlkonRuntimeInputCategory[] = [
  "billing_request",
  "live_request",
  "broker_feed_request",
  "real_money_request",
  "social_publish_request",
  "secret_risk",
];

function layerStatuses(): AlkonRuntimeSnapshot["layerStatuses"] {
  const readyLayers: AlkonRuntimeLayer[] = [
    "space",
    "time",
    "law",
    "gravity",
    "orbit",
    "life",
    "civilization",
    "economy",
    "defense",
    "communication",
    "reality",
    "consequence",
    "memory",
  ];

  return readyLayers.reduce<AlkonRuntimeSnapshot["layerStatuses"]>(
    (statuses, layer) => ({
      ...statuses,
      [layer]:
        layer === "economy" || layer === "defense" || layer === "communication"
          ? "readiness_only"
          : layer === "law"
            ? "blocked_guard_ready"
            : "ready",
    }),
    {} as AlkonRuntimeSnapshot["layerStatuses"]
  );
}

export function getAlkonRuntimeSnapshot(
  checkedAt = new Date().toISOString()
): AlkonRuntimeSnapshot {
  const sampleReports = runAlkonRuntimeSamples();

  return {
    snapshotId: "alkon_digital_universe_runtime",
    name: "Alkon Digital Universe Runtime",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    activeInputs: SAMPLE_ALKON_RUNTIME_INPUTS,
    layerStatuses: layerStatuses(),
    sampleReports,
    blackHoleCategories: ALKON_RUNTIME_BLACK_HOLE_CATEGORIES,
    highGravityIssues: sampleReports
      .filter((report) =>
        ["P0_critical", "black_hole"].includes(report.gravity.gravity)
      )
      .map((report) => report.birth.runtimeEntityId),
    pendingReviews: sampleReports
      .filter((report) =>
        ["review_required", "founder_approval_required"].includes(
          report.law.lawDecision
        )
      )
      .map((report) => report.birth.runtimeEntityId),
    founderDecisionsNeeded: sampleReports
      .filter((report) => report.reality.founderDecisionRequired)
      .map((report) => report.birth.runtimeEntityId),
    memoryLessons: ALKON_RUNTIME_MANDATORY_LESSONS,
    nextSafeFates: sampleReports.map((report) => report.nextFate),
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
    },
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      productionSecretsUntouched: true,
      noPaymentExecution: true,
      noDeletionExecution: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noSecretsExposed: true,
      noImagesOrRasterAssets: true,
      noFakeClaims: true,
    },
    createdAt: checkedAt,
  };
}

export function getAlkonRuntimeReadiness(checkedAt = new Date().toISOString()) {
  const snapshot = getAlkonRuntimeSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noDeletion: true,
    noPayments: true,
    noSecrets: true,
    noExternalCalls: true,
    snapshot,
  };
}

export function getAlkonRuntimeSampleInput(input?: Partial<AlkonRuntimeInput>) {
  const report = runAlkonRuntime({
    category: "founder_idea",
    title: "Create safe local runtime readiness",
    description:
      "Give a product idea place, time, law, gravity, orbit, proof, memory, and next fate without execution.",
    requestedBy: "founder",
    affectedWorld: "private_alkon",
    hasRollback: true,
    ...input,
  });

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    sampleOnly: true,
    noExecution: true,
    noDeletion: true,
    noPayments: true,
    noSecrets: true,
    report,
  };
}

export function getAlkonRuntimeNextFate(checkedAt = new Date().toISOString()) {
  const snapshot = getAlkonRuntimeSnapshot(checkedAt);

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noDeletion: true,
    noPayments: true,
    noSecrets: true,
    nextSafeFates: snapshot.nextSafeFates,
    blackHoleCategories: snapshot.blackHoleCategories,
  };
}
