import "server-only";

import { getAssistantTierSnapshot } from "@/lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getTpmBrainContextSnapshot } from "@/lib/server/brain";
import { getProductTruthSnapshot } from "@/lib/server/product/truth";
import type {
  CompanionContextInput,
  CompanionContextSnapshot,
  CompanionIntentAvailability,
} from "./types";

const companionIntents: CompanionIntentAvailability[] = [
  {
    intent: "explain_platform_state",
    label: "Explain platform state",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Explain readiness, fallback, paper/live truth, and diagnostics only.",
    responseStyle: "calm, compact, platform-aware",
    blockedLanguage: ["live ready", "production ready", "guaranteed outcome"],
  },
  {
    intent: "explain_blocked_state",
    label: "Explain why blocked",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Use why-blocked state explanations and safe next steps.",
    responseStyle: "direct reason plus safe alternative",
    blockedLanguage: ["bypass", "force enable", "unlock now"],
  },
  {
    intent: "explain_market_context",
    label: "Explain market context",
    demoFree: "allowed",
    pro: "planned",
    vip: "planned",
    enterprise: "future",
    safetyBoundary: "Decision support only; no prediction certainty or trade signal.",
    responseStyle: "educational, fallback-labeled",
    blockedLanguage: ["sure signal", "win-rate", "guaranteed profit"],
  },
  {
    intent: "explain_plan_access",
    label: "Explain plan access",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "No billing or paid activation claim.",
    responseStyle: "truthful entitlement summary",
    blockedLanguage: ["paid active", "VIP enabled", "checkout available"],
  },
  {
    intent: "guide_to_settings",
    label: "Guide to settings",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Navigation guidance only; cannot change secrets or enable live systems.",
    responseStyle: "short navigation hint",
    blockedLanguage: ["configure broker", "activate billing"],
  },
  {
    intent: "guide_to_diagnostics",
    label: "Guide to diagnostics",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Diagnostics guidance only; no owner controls or private data.",
    responseStyle: "compact route and readiness guidance",
    blockedLanguage: ["Founder Command", "secret values", "production keys"],
  },
  {
    intent: "guide_to_feedback",
    label: "Guide to feedback",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Feedback drafting only; no private sensitive data.",
    responseStyle: "short draft with route/context summary",
    blockedLanguage: ["password", "token", "broker credentials"],
  },
  {
    intent: "draft_feedback",
    label: "Draft feedback",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Draft locally and avoid secrets or private data.",
    responseStyle: "structured issue summary",
    blockedLanguage: ["secret", "token", "password"],
  },
  {
    intent: "journal_prompt",
    label: "Journal prompt",
    demoFree: "allowed",
    pro: "planned",
    vip: "planned",
    enterprise: "future",
    safetyBoundary: "Reflection only; no financial advice or performance guarantee.",
    responseStyle: "paper-session coaching",
    blockedLanguage: ["you should trade", "guaranteed improvement"],
  },
  {
    intent: "session_summary",
    label: "Session summary",
    demoFree: "allowed",
    pro: "planned",
    vip: "planned",
    enterprise: "future",
    safetyBoundary: "Paper-session summary only; no performance guarantee.",
    responseStyle: "reflective and non-predictive",
    blockedLanguage: ["you would have won", "guaranteed better result"],
  },
  {
    intent: "learning_help",
    label: "Learning help",
    demoFree: "allowed",
    pro: "allowed",
    vip: "allowed",
    enterprise: "future",
    safetyBoundary: "Education only; no financial advice.",
    responseStyle: "skill-level adaptive",
    blockedLanguage: ["financial advice", "buy now", "sure trade"],
  },
  {
    intent: "founder_unavailable_for_user",
    label: "Founder Command unavailable",
    demoFree: "blocked",
    pro: "blocked",
    vip: "blocked",
    enterprise: "blocked",
    safetyBoundary: "Founder Command is owner-only and never a user-plan feature.",
    responseStyle: "clear private-access explanation",
    blockedLanguage: ["admin access", "Founder route", "plan unlock"],
  },
];

export function getCompanionContextSnapshot(
  input: CompanionContextInput = {},
  checkedAt = new Date().toISOString()
): CompanionContextSnapshot {
  const planTier = input.planTier ?? "demo_free";
  const assistantPlan =
    planTier === "demo_free" ? "evaluation" : planTier;
  const assistantTier = getAssistantTierSnapshot(assistantPlan).current;
  const planEntitlements = getPlanEntitlementSnapshot(planTier, checkedAt);
  const planetAccess = planEntitlements.citizenAccess.currentLayer;
  const productTruth = getProductTruthSnapshot(checkedAt);
  const brain = getTpmBrainContextSnapshot(
    {
      route: input.route,
      selectedAsset: input.selectedAsset,
      timeframe: input.timeframe,
      planId: planTier,
      skillLevel: input.skillLevel,
      riskProfile: input.riskProfile,
    },
    checkedAt
  );

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
    planetAccess: {
      citizenClass: planetAccess.citizenClass,
      activeLayer: planetAccess.activeLayer,
      companionLevel: planetAccess.companionLevel,
      visibleCities: planetAccess.visibleCities,
      lockedFeatures: planetAccess.lockedFeatures,
      plannedFeatures: planetAccess.plannedFeatures,
      hiddenFeatures: planetAccess.hiddenFeatures,
      founderCommandUserVisible: planEntitlements.citizenAccess.founderCommandUserVisible,
      performanceFeeUserVisible: planEntitlements.citizenAccess.performanceFeeUserVisible,
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
      skillLevel: input.skillLevel ?? brain.skillProfile.skillLevel,
      riskProfile: input.riskProfile ?? brain.skillProfile.riskProfile,
    },
    brain: {
      contextQuality: brain.contextQuality,
      decisionSupportMode: brain.decisionSupportMode,
      userGuidanceMode: brain.userGuidanceMode,
      safeNextActions: brain.safeNextActions,
      blockedCapabilities: brain.blockedCapabilities,
    },
    intents: companionIntents,
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
