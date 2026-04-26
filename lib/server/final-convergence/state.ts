import "server-only";

import {
  getLocalDayOneReadinessSnapshot,
  getLocalLivingDayLoopSnapshot,
} from "@/lib/server/local-ops";

import { getAutomationGovernorSnapshot } from "./automation-level-governor";
import { getConvergenceScoreSnapshot } from "./convergence-score";
import { getFinalConvergenceLayers } from "./layer-registry";
import { getLayerGrowthEngineSnapshot } from "./layer-growth-engine";
import type { FinalConvergenceSnapshot } from "./types";

export function getFinalConvergenceSnapshot(
  checkedAt = new Date().toISOString()
): FinalConvergenceSnapshot {
  const layers = getFinalConvergenceLayers();
  const convergenceScore = getConvergenceScoreSnapshot();
  const layerGrowth = getLayerGrowthEngineSnapshot(layers);
  const automationGovernor = getAutomationGovernorSnapshot();
  const localDayOne = getLocalDayOneReadinessSnapshot(checkedAt);
  const localLivingLoop = getLocalLivingDayLoopSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "tpm_final_convergence_governed_layer_growth",
    status: convergenceScore.status,
    founderOnly: true,
    publicExposure: false,
    layerRegistryStatus: "ready",
    convergenceScore,
    layerGrowth,
    automationGovernor,
    layers,
    blockedEscalations: [
      ...new Set([
        ...layerGrowth.blockedEscalations,
        ...automationGovernor.blockedActions,
        "fake Swiss legal/company status",
        "fake Islamic/Sharia certification",
        "uncontrolled autonomy",
      ]),
    ],
    nextSafeActions: [
      "Use this snapshot as the private final-convergence operating map.",
      "Run public leak prevention and full validation before accepting any future layer.",
      "Prepare Codebase Reality Audit, then Safe Cleanup, then Local Day One.",
      "Keep all growth proposal-only until Founder approval and validation evidence exist.",
    ],
    localDayReadiness: {
      status: localDayOne.gateStatus,
      readyToStart: localDayOne.readyToStartLocalDayOne,
      nextAction:
        localLivingLoop.today.nextSafeAction ??
        "Begin local review only after Founder decision.",
    },
    realityAuditReadiness: {
      status: "needed",
      cleanupExecutionActive:
        localLivingLoop.codebaseRealityAudit.cleanupExecutionActive,
      route: "prepare_audit_then_safe_cleanup",
    },
    cleanupReadiness: {
      status: "planned",
      executionActive: false,
      nextAction: localLivingLoop.codebaseRealityAudit.nextSafeAction,
    },
    founderReviewNeeds: [
      ...convergenceScore.founderReviewNeeded,
      ...automationGovernor.requiresFounderApproval,
    ],
    publicPrivateBoundaryStatus: "preserved",
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedBillingLaunchInactive: true,
      productionSecretsUntouched: true,
      noUncontrolledAutomation: true,
      noShellExecutionFromWebApp: true,
      noDirectCodexExecutionFromWebApp: true,
      noSecretsExposed: true,
      noPublicAlkonOrConvergenceLeak: true,
      noImagesOrRasterAssets: true,
      overall: "preserved",
    },
  };
}

export function getFinalConvergenceReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getFinalConvergenceSnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    mode: "founder_final_convergence_readiness",
    status: snapshot.status,
    score: snapshot.convergenceScore.score,
    layerCount: snapshot.layers.length,
    growthProposalCount: snapshot.layerGrowth.proposals.length,
    automationMaximumLevel: snapshot.automationGovernor.currentMaximumLevel,
    publicExposure: snapshot.publicExposure,
    founderOnly: snapshot.founderOnly,
    nextSafeActions: snapshot.nextSafeActions,
    productTruthStatus: snapshot.productTruthStatus,
  };
}
