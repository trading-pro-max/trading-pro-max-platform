import "server-only";

import { getBrandOccasionThemes } from "@/lib/brand/occasion-themes";
import { getBrandIntelligenceSampleDecisions } from "./engine";
import { getIdentityEvolutionSnapshot } from "./evolution";
import { getBrandGenomeSnapshot } from "./genome";
import { getIdentityGuardianSnapshot } from "./guardian";
import { getIdentityMemorySnapshot } from "./memory";
import { getBrandPlanDNASnapshot } from "./plan-dna";
import { getBrandStateLanguageSnapshot } from "./state-language";
import { getBrandSurfaceSimulationSnapshot } from "./surface-simulation";
import type { LivingBrandIntelligenceSnapshot } from "./types";

export function getLivingBrandIntelligenceSnapshot(
  checkedAt = new Date().toISOString()
): LivingBrandIntelligenceSnapshot {
  return {
    checkedAt,
    mode: "tpm_living_brand_intelligence",
    status: "ready",
    genome: getBrandGenomeSnapshot(checkedAt),
    sampleDecisions: getBrandIntelligenceSampleDecisions(),
    guardianReadiness: "ready",
    planDNAReadiness: "ready",
    stateLanguageReadiness: "ready",
    occasionGovernanceReadiness: "ready",
    surfaceSimulationReadiness: "ready",
    truth: {
      rasterAssetsUsed: false,
      externalImagesUsed: false,
      liveExecutionActivated: false,
      realMoneyActivated: false,
      brokerFeedActivated: false,
      billingActivated: false,
      publicLaunchActivated: false,
      fakeSwissClaim: false,
      publicInternalTerminologyLeakAllowed: false,
    },
  };
}

export function getPublicBrandIntelligenceSummary(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getLivingBrandIntelligenceSnapshot(checkedAt);
  const defaultDecision = snapshot.sampleDecisions[0];

  return {
    ok: true,
    checkedAt,
    status: snapshot.status,
    summary:
      "Pro Max identity decisions are ready for Pro Max Trading public-safe surfaces, plan truth, state language, motion safety, and local/internal separation.",
    readiness: {
      genome: "ready",
      planDNA: snapshot.planDNAReadiness,
      stateLanguage: snapshot.stateLanguageReadiness,
      identityGuardian: snapshot.guardianReadiness,
      occasionGovernance: snapshot.occasionGovernanceReadiness,
      surfaceSimulation: snapshot.surfaceSimulationReadiness,
    },
    publicPlanNames: ["Free", "Pro", "VIP", "Institutional"],
    publicAssistantName: "Pro Max Assistant",
    defaultDecision: {
      earthMarkVariant: defaultDecision.earthMarkVariant,
      earthMarkState: defaultDecision.earthMarkState,
      earthMarkAnimated: defaultDecision.earthMarkAnimated,
      identityIntensity: defaultDecision.identityIntensity,
      motionIntensity: defaultDecision.motionIntensity,
      accentPalette: defaultDecision.accentPalette,
      planVisualDNA: defaultDecision.planVisualDNA,
      stateVisualLanguage: defaultDecision.stateVisualLanguage,
      occasionSkin: defaultDecision.occasionSkin,
      brandVoice: defaultDecision.brandVoice,
      allowedTerminology: defaultDecision.allowedTerminology,
      blockedTerminology: defaultDecision.blockedTerminology,
      safeCopyRules: defaultDecision.safeCopyRules,
      visualGuardrails: defaultDecision.visualGuardrails,
      requiresFounderApproval: defaultDecision.requiresFounderApproval,
      requiresLegalReview: defaultDecision.requiresLegalReview,
      requiresGuardianReview: defaultDecision.requiresGuardianReview,
      publicSafe: defaultDecision.publicSafe,
    },
    truth: snapshot.truth,
  };
}

export function getBrandIntelligenceInternalReadiness(
  checkedAt = new Date().toISOString()
) {
  return {
    checkedAt,
    snapshot: getLivingBrandIntelligenceSnapshot(checkedAt),
    genome: getBrandGenomeSnapshot(checkedAt),
    planDNA: getBrandPlanDNASnapshot(),
    stateLanguage: getBrandStateLanguageSnapshot(),
    guardian: getIdentityGuardianSnapshot(checkedAt),
    memory: getIdentityMemorySnapshot(checkedAt),
    evolution: getIdentityEvolutionSnapshot(),
    simulation: getBrandSurfaceSimulationSnapshot(),
    occasionThemes: getBrandOccasionThemes(),
  };
}
