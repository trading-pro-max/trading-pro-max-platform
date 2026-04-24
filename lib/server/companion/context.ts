import "server-only";

import { getAssistantTierSnapshot } from "@/lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getProductTruthSnapshot } from "@/lib/server/product/truth";
import type { CompanionContextInput, CompanionContextSnapshot } from "./types";

export function getCompanionContextSnapshot(
  input: CompanionContextInput = {},
  checkedAt = new Date().toISOString()
): CompanionContextSnapshot {
  const planTier = input.planTier ?? "demo_free";
  const assistantPlan =
    planTier === "demo_free" ? "evaluation" : planTier;
  const assistantTier = getAssistantTierSnapshot(assistantPlan).current;
  const planEntitlements = getPlanEntitlementSnapshot(planTier, checkedAt);
  const productTruth = getProductTruthSnapshot(checkedAt);

  return {
    checkedAt,
    mode: "companion_context_engine",
    source: input.sessionState === "authenticated_safe" ? "authenticated_safe" : "default_safe",
    route: input.route ?? "/en",
    selectedAsset: input.selectedAsset ?? "EUR/USD",
    timeframe: input.timeframe ?? "1m",
    marketFeedState: "fallback_first",
    executionTruth: {
      paperMode: "available",
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked",
      feedActivation: "blocked",
    },
    account: {
      sessionState: input.sessionState ?? "anonymous",
      planTier,
      accountType: "standard",
      accountTypeStatus: "standard_active",
    },
    assistantTier: {
      tier: assistantTier.tier,
      label: assistantTier.label,
      availability: assistantTier.availability,
      currentAccess: assistantTier.currentAccess,
      upgradeState: assistantTier.upgradeState,
    },
    planEntitlements: {
      currentPlan: planEntitlements.currentPlan,
      billing: planEntitlements.truth.billing,
      paidAccess: planEntitlements.truth.paidAccess,
      vipActivation: planEntitlements.truth.vipActivation,
      enterpriseActivation: planEntitlements.truth.enterpriseActivation,
      founderCommandAccess: planEntitlements.truth.founderCommandAccess,
      performanceFee: planEntitlements.truth.performanceFee,
    },
    productTruth: {
      liveExecution: productTruth.summary.liveExecution,
      realMoneyRouting: productTruth.summary.realMoneyRouting,
      billing: productTruth.summary.billing,
      publicLaunch: productTruth.summary.publicLaunch,
      socialPublishing: productTruth.summary.socialPublishing,
      islamicCertification: productTruth.summary.islamicCertification,
      performanceRevenue: productTruth.summary.performanceRevenue,
      founderCommand: productTruth.summary.founderCommand,
    },
    preferences: {
      language: input.language ?? "en",
      theme: input.theme ?? "system",
      skillLevel: "unknown",
    },
    diagnostics: {
      readiness: "ready",
      feedbackState: "available_guarded",
      aiIqContextQuality: "bounded",
    },
    safety: {
      secretsIncluded: false,
      privateSensitiveDataIncluded: false,
      brokerCredentialsIncluded: false,
      rawTokensIncluded: false,
      canExecuteTrades: false,
      canActivateLive: false,
      guaranteeClaimsAllowed: false,
      winRateClaimsAllowed: false,
    },
    guidanceBoundaries: [
      "Explain platform state and safe next steps.",
      "Do not execute trades or enable live execution.",
      "Do not activate broker/feed or billing.",
      "Do not claim guaranteed signals, win rates, or financial advice.",
      "Do not bypass auth, entitlement, or safety boundaries.",
    ],
  };
}
