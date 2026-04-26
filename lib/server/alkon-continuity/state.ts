import { getAlkonLegitimacySnapshot } from "@/lib/server/alkon-legitimacy";
import { getAlkonOntologySnapshot } from "@/lib/server/alkon-ontology";
import { getFinalConvergenceSnapshot } from "@/lib/server/final-convergence";
import { getMediaIntelligenceSnapshot } from "@/lib/server/media-intelligence";
import { getTreasuryLifeSnapshot } from "@/lib/server/treasury-life";
import { runAlkonContinuity, runAlkonContinuitySamples } from "./engine";
import type {
  AlkonContinuityReport,
  AlkonContinuitySnapshot,
  AlkonEntityBirthRequest,
} from "./types";

function unique(values: string[]) {
  return [...new Set(values)];
}

function summarizeReports(reports: AlkonContinuityReport[]) {
  return {
    reviewRequired: reports
      .filter((report) => report.decision.outcome === "review_required")
      .map((report) => report.identity.entityId),
    founderApprovalRequired: reports
      .filter((report) => report.decision.founderReviewNeeded)
      .map((report) => report.identity.entityId),
    blockedBirths: reports
      .filter((report) => report.decision.outcome === "block_birth")
      .map((report) => report.identity.entityId),
    blackHoled: reports
      .filter((report) => report.decision.outcome === "black_hole")
      .map((report) => report.identity.entityId),
    monitoredEntities: reports
      .filter((report) => report.decision.outcome === "monitor")
      .map((report) => report.identity.entityId),
    staleEntities: reports
      .filter((report) => report.life.health === "stale" || report.life.health === "duplicated")
      .map((report) => report.identity.entityId),
    cleanupCandidates: reports
      .filter((report) => report.life.health === "cleanup_candidate")
      .map((report) => report.identity.entityId),
    deprecationCandidates: reports
      .filter((report) => report.deprecation.shouldDeprecate)
      .map((report) => report.identity.entityId),
    removalCandidates: reports
      .filter((report) => report.removal.canRemove)
      .map((report) => report.identity.entityId),
  };
}

export function getAlkonContinuitySnapshot(
  checkedAt = new Date().toISOString()
): AlkonContinuitySnapshot {
  const sampleReports = runAlkonContinuitySamples();
  const summary = summarizeReports(sampleReports);
  const ontology = getAlkonOntologySnapshot(checkedAt);
  const legitimacy = getAlkonLegitimacySnapshot(checkedAt);
  const finalConvergence = getFinalConvergenceSnapshot(checkedAt);
  const treasuryLife = getTreasuryLifeSnapshot();
  const mediaIntelligence = getMediaIntelligenceSnapshot();

  return {
    snapshotId: "alkon_sovereign_creation_continuity_system",
    name: "Alkon Sovereign Creation & Continuity System",
    visibility: "private_founder_only",
    publicExposure: false,
    readiness: "ready",
    entityCount: ontology.entityCount,
    birthsPending: sampleReports.filter(
      (report) =>
        report.decision.outcome === "allow_birth" ||
        report.decision.outcome === "review_required" ||
        report.decision.outcome === "founder_approval_required"
    ).length,
    ...summary,
    evolutionRules: sampleReports.map((report) => report.evolution),
    memoryLessons: unique(sampleReports.flatMap((report) => report.memory.lessonsApplied)),
    sampleReports,
    nextSafeActions: [
      "Route every new idea through birth, identity, law, function, integration, proof, life, evolution, deprecation/removal, memory, and report.",
      "Use Alkon Ontology for meaning and ownership, Sovereign Legitimacy for whether an action deserves to exist, and Final Convergence for next safe layer proposals.",
      "Prepare cleanup and removal reports only; do not delete from the web app.",
      "Keep public Earth clean: no Alkon, continuity, birth/death, internal lifecycle, Product Memory internals, Codex tasks, or tribunal language.",
    ],
    relatedSystems: [
      ontology.name,
      legitimacy.name,
      `Final Convergence: ${finalConvergence.status}`,
      `Treasury Life: ${treasuryLife.status}`,
      `Media Intelligence: ${mediaIntelligence.status}`,
      "Product Memory",
      "Result Tribunal",
      "Codex Governance",
      "Earth Reality",
      "Launch Readiness",
    ],
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

export function getAlkonContinuityReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonContinuitySnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noDeletion: true,
    noSecrets: true,
    noExternalCalls: true,
    snapshot,
  };
}

export function getAlkonContinuitySampleBirth(
  request?: Partial<AlkonEntityBirthRequest>
) {
  const report = runAlkonContinuity({
    source: "founder_idea",
    text: "Create a calmer chart-first workspace improvement with no public Alkon exposure.",
    requestedBy: "founder",
    surface: "Trading Workspace",
    currentStage: "laptop_planet",
    ...request,
  });

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noDeletion: true,
    noSecrets: true,
    report,
  };
}

export function getAlkonContinuityCleanupCandidates(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonContinuitySnapshot(checkedAt);

  return {
    ok: true,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noDeletion: true,
    cleanupCandidates: snapshot.cleanupCandidates,
    deprecationCandidates: snapshot.deprecationCandidates,
    removalCandidates: snapshot.removalCandidates,
    sampleReports: snapshot.sampleReports.filter(
      (report) =>
        report.life.health === "cleanup_candidate" ||
        report.deprecation.shouldDeprecate ||
        report.removal.decision !== "not_needed"
    ),
  };
}
