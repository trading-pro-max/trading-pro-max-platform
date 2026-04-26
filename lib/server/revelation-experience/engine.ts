import { buildRevelationChecks, buildRevelationGates } from "./gates";
import type {
  PublicRevelationSnapshot,
  RevelationCheck,
  RevelationDiagnosticsProbe,
  RevelationProductTruth,
  RevelationSnapshot,
  RevelationStage,
} from "./types";

const productTruth: RevelationProductTruth = {
  paperSafeActive: true,
  webCurrent: true,
  desktopPlanned: true,
  mobilePlanned: true,
  liveExecutionBlocked: true,
  realMoneyBlocked: true,
  brokerFeedInactive: true,
  billingInactive: true,
  publicLaunchInactive: true,
  noFakeClaims: true,
  noImagesOrRasterAssets: true,
  noShellExecution: true,
};

function checksForStage(checks: RevelationCheck[], stage: RevelationStage) {
  return checks.filter((check) => check.stage === stage);
}

export function getRevelationExperienceSnapshot(
  checkedAt = new Date().toISOString()
): RevelationSnapshot {
  const checks = buildRevelationChecks();
  const gates = buildRevelationGates();
  const blockedIssues = checks
    .filter((check) => check.status === "blocked")
    .map((check) => check.checkId);
  const needsPolish = checks
    .filter((check) => check.status === "needs_polish")
    .map((check) => check.checkId);

  return {
    checkedAt,
    mode: "living_earth_revelation_experience",
    status: blockedIssues.length > 0 ? "blocked" : "ready_with_notes",
    publicName: "Living Earth Revelation Experience",
    first3Seconds: checksForStage(checks, "first_3_seconds"),
    first10Seconds: checksForStage(checks, "first_10_seconds"),
    first30Seconds: checksForStage(checks, "first_30_seconds"),
    first3Minutes: checksForStage(checks, "first_3_minutes"),
    firstDay: checksForStage(checks, "first_day"),
    gates,
    blockedIssues,
    needsPolish,
    nextSafeActions: [
      "Keep Home calm and Assistant-first without adding more above-fold buttons.",
      "Use visual proof for dark, light, reduced motion, static, and high contrast modes.",
      "Keep Workspace terminal-only, chart-first, paper-safe, and free from public navigation.",
      "Run human visual acceptance before claiming final logo or Living Market Core polish.",
    ],
    visualAcceptanceNeeded: true,
    productTruth,
    publicCopy:
      "Trading Pro Max reveals itself as a calm Earth-native, paper-safe web workspace: clear in seconds, guided by TPM Assistant, useful in Workspace, and honest over time.",
    founderReadiness: {
      revelationReadiness: "ready_with_notes",
      first3SecondsStatus: "needs_polish",
      first10SecondsStatus: "pass",
      first30SecondsStatus: "pass",
      first3MinutesStatus: "needs_polish",
      firstDayStatus: "pass",
      visualAcceptanceNotes: [
        "logo_visual_acceptance_needed",
        "workspace_chart_pulse_polish_needed",
      ],
    },
  };
}

export function getPublicRevelationExperienceSnapshot(
  checkedAt = new Date().toISOString()
): PublicRevelationSnapshot {
  const snapshot = getRevelationExperienceSnapshot(checkedAt);

  return {
    checkedAt: snapshot.checkedAt,
    mode: snapshot.mode,
    status: snapshot.status,
    publicName: snapshot.publicName,
    first3Seconds: snapshot.first3Seconds,
    first10Seconds: snapshot.first10Seconds,
    first30Seconds: snapshot.first30Seconds,
    first3Minutes: snapshot.first3Minutes,
    firstDay: snapshot.firstDay,
    blockedIssues: snapshot.blockedIssues,
    needsPolish: snapshot.needsPolish,
    nextSafeActions: [
      "Enter Trading Workspace.",
      "Ask TPM Assistant for Start, Why blocked, Bigger chart, Calmer, Plans, Apps, Support, or Journal.",
      "Use Settings for Static Mode, Low Motion, High Contrast, Personal Reality, and Adaptive Atmosphere.",
      "Use Diagnostics for public-safe readiness truth.",
    ],
    productTruth: snapshot.productTruth,
    publicCopy: snapshot.publicCopy,
  };
}

export function getRevelationExperienceDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): RevelationDiagnosticsProbe {
  const snapshot = getRevelationExperienceSnapshot(checkedAt);

  return {
    key: "living_earth_revelation_experience",
    label: "Revelation readiness",
    status: snapshot.blockedIssues.length > 0 ? "degraded" : "ready",
    summary: "Living Earth first-use experience ready with notes",
    detail:
      "Home trust, product clarity, Assistant guidance, Workspace usefulness, Journal/Coach continuity, Product Truth, boundary, and accessibility gates are deterministic and public-safe.",
    checkedAt,
  };
}
