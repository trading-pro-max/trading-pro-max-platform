import "server-only";

import { getPlanEntitlementContract, getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getProductTruthSnapshot } from "@/lib/server/product/truth";
import { evaluateGuardianLegalRules } from "@/lib/server/guardian-legal";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getPlanetOsStatusSnapshot } from "@/lib/server/planet-os/state";
import { getStateExplanationSnapshot } from "@/lib/server/state-explanations";
import { getUserSkillProfileSnapshot } from "@/lib/server/user-profile";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";
import type { TpmBrainContextInput, TpmBrainContextSnapshot } from "./types";

export function getTpmBrainContextSnapshot(
  input: TpmBrainContextInput = {},
  checkedAt = new Date().toISOString()
): TpmBrainContextSnapshot {
  const planId = input.planId ?? "demo_free";
  const planSnapshot = getPlanEntitlementSnapshot(planId, checkedAt);
  const plan = getPlanEntitlementContract(planSnapshot.currentPlan);
  const productTruth = getProductTruthSnapshot(checkedAt);
  const skillProfile = getUserSkillProfileSnapshot(
    {
      skillLevel: input.skillLevel,
      riskProfile: input.riskProfile,
    },
    checkedAt
  );
  const journalCoach = getJournalCoachSnapshot(checkedAt);
  const planet = getPlanetOsStatusSnapshot(checkedAt);
  const visualAcceptance = getVisualAcceptanceSnapshot(checkedAt);
  const stateExplanations = getStateExplanationSnapshot(checkedAt);
  const legalEvaluation = evaluateGuardianLegalRules({
    text: "live trading active guaranteed profit VIP signals Sharia certified",
    category: "product_claim",
  });
  const blockedCapabilityLabels = productTruth.items
    .filter((item) => item.state === "blocked" || item.state === "inactive")
    .slice(0, 8)
    .map((item) => item.label);

  return {
    checkedAt,
    mode: "tpm_brain_context_layer",
    route: input.route ?? "/en",
    selectedAsset: input.selectedAsset ?? "EUR/USD",
    timeframe: input.timeframe ?? "1m",
    contextQuality: "bounded",
    decisionSupportMode: "paper_decision_support",
    userGuidanceMode:
      skillProfile.skillLevel === "advanced" || skillProfile.skillLevel === "professional"
        ? "advanced_review"
        : skillProfile.skillLevel === "intermediate"
        ? "guided_operator"
        : "beginner_safe",
    founderGuidanceMode: "founder_command_summary",
    skillProfile: {
      skillLevel: skillProfile.skillLevel,
      riskProfile: skillProfile.riskProfile,
      guidanceDepth: skillProfile.guidanceDepth,
    },
    plan: {
      currentPlan: planSnapshot.currentPlan,
      companionLevel: plan.companionLevel,
      paidAccess: planSnapshot.truth.paidAccess,
      vipActivation: planSnapshot.truth.vipActivation,
    },
    marketContext: {
      feedTruth: "fallback_first",
      selectedAsset: input.selectedAsset ?? "EUR/USD",
      timeframe: input.timeframe ?? "1m",
      predictiveCertainty: "blocked",
    },
    planetReadiness: {
      status: planet.status,
      engineReadiness: "deterministic_contracts",
      ministryReports: planet.ministries.length,
    },
    journalCoachReadiness: {
      mode: journalCoach.mode,
      promptsActive: journalCoach.prompts.filter((prompt) => prompt.state === "active").length,
      decisionReplay: "foundation_ready",
    },
    safetySummary: [
      `Live execution is ${productTruth.summary.liveExecution}.`,
      `Real-money routing is ${productTruth.summary.realMoneyRouting}.`,
      `Billing is ${productTruth.summary.billing}.`,
      "Assistant output remains decision support, not financial advice.",
    ],
    guardianLegalSummary: [
      `Guardian/Legal outcome for risky claims: ${legalEvaluation.outcome}.`,
      "Guarantees, win-rate, fake live, fake billing, and fake Sharia certification claims are blocked.",
    ],
    visualAcceptanceSummary: [
      `Visual acceptance remains ${visualAcceptance.status}.`,
      "Human acceptance by Ahmad is required before final visual claims.",
    ],
    stateExplanationSummary: stateExplanations.explanations
      .filter((item) => item.severity === "blocked")
      .slice(0, 8)
      .map((item) => item.key),
    riskCautions: [
      "Fallback market context must stay labeled.",
      "No assistant intent may execute, route money, or activate integrations.",
      "Plan upgrades cannot imply paid access while billing is inactive.",
    ],
    safeNextActions: [
      "Use paper mode and journal prompts for rehearsal.",
      "Review why-blocked cards before assuming a capability exists.",
      "Keep diagnostics and Founder briefing as readiness truth only.",
    ],
    blockedCapabilities: blockedCapabilityLabels,
    degradedSignals: [
      "External feed is fallback-first.",
      "Production, monitoring, and native apps remain unconfigured or planned.",
    ],
    truth: {
      secretsIncluded: false,
      brokerCredentialsIncluded: false,
      privateSensitiveDataIncluded: false,
      fakeMetricsIncluded: false,
      fakeWinRateIncluded: false,
      predictiveCertaintyClaimed: false,
      autoTradingEnabled: false,
      realMoneyEnabled: false,
    },
  };
}
