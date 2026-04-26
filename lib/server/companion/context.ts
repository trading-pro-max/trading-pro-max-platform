import "server-only";

import { getAssistantTierSnapshot } from "@/lib/assistant/tiers";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getPlanRealmForPlanId } from "@/lib/plans/realms";
import { getTpmBrainContextSnapshot } from "@/lib/server/brain";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getProductTruthSnapshot } from "@/lib/server/product/truth";
import { getStateExplanation } from "@/lib/server/state-explanations";
import {
  companionAllowedIntents,
  companionBlockedIntentRegistry,
} from "./intents";
import type {
  CompanionContextInput,
  CompanionContextSnapshot,
} from "./types";

function publicPlanName(planTier: CompanionContextSnapshot["account"]["planTier"]) {
  if (planTier === "pro") return "Pro";
  if (planTier === "vip") return "VIP";
  if (planTier === "enterprise") return "Institutional";
  return "Free";
}

export function getCompanionContextSnapshot(
  input: CompanionContextInput = {},
  checkedAt = new Date().toISOString()
): CompanionContextSnapshot {
  const planTier = input.planTier ?? "demo_free";
  const assistantPlan =
    planTier === "demo_free" ? "evaluation" : planTier;
  const assistantTier = getAssistantTierSnapshot(assistantPlan).current;
  const planEntitlements = getPlanEntitlementSnapshot(planTier, checkedAt);
  const realm = getPlanRealmForPlanId(planEntitlements.currentPlan);
  const planetAccess = planEntitlements.citizenAccess.currentLayer;
  const productTruth = getProductTruthSnapshot(checkedAt);
  const journalCoach = getJournalCoachSnapshot(checkedAt);
  const live = getStateExplanation("live_disabled");
  const realMoney = getStateExplanation("real_money_blocked");
  const broker = getStateExplanation("broker_unavailable");
  const feed = getStateExplanation("feed_fallback");
  const billing = getStateExplanation("billing_inactive");
  const pro = getStateExplanation("pro_locked");
  const vip = getStateExplanation("vip_locked");
  const institutional = getStateExplanation("institutional_future");
  const islamic = getStateExplanation("islamic_certification_not_certified");
  const launch = getStateExplanation("launch_not_active");
  const social = getStateExplanation("social_publishing_inactive");
  const restrictedControls = getStateExplanation("founder_command_private");
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
      publicPlanName: publicPlanName(planEntitlements.currentPlan),
      billing: planEntitlements.truth.billing,
      paidAccess: planEntitlements.truth.paidAccess,
      vipActivation: planEntitlements.truth.vipActivation,
      enterpriseActivation: planEntitlements.truth.enterpriseActivation,
      institutionalActivation: planEntitlements.truth.institutionalActivation,
      founderCommandAccess: planEntitlements.truth.founderCommandAccess,
      ownerCommandAccess: planEntitlements.truth.ownerCommandAccess,
      performanceFee: planEntitlements.truth.performanceFee,
    },
    realm: {
      realmId:
        realm.realmId === "alkon_universe" ? "free_earth" : realm.realmId,
      publicPlanName: publicPlanName(planEntitlements.currentPlan),
      activationState:
        realm.activationState === "future" ? "future" : realm.activationState === "active" ? "active" : "planned",
      earthPerspective: realm.earthPerspective,
      assistantBehavior: realm.assistantBehavior,
      journalCoachDepth: realm.journalCoachDepth,
      workspaceBehavior: realm.workspaceBehavior,
      reportsDepth: realm.reportsDepth,
      appsPlatformsAccess: realm.appsPlatformsAccess,
      supportAccess: realm.supportAccess,
      upgradeExplanation: realm.upgradeExplanation,
    },
    planAccess: {
      planClass: planetAccess.citizenClass,
      label: planetAccess.label,
      activeLayer: planetAccess.activeLayer,
      assistantLevel: planetAccess.companionLevel,
      visibleSurfaces: planetAccess.visibleCities,
      lockedCapabilities: planetAccess.lockedFeatures,
      plannedCapabilities: planetAccess.plannedFeatures,
      hiddenCapabilities: planetAccess.hiddenFeatures,
      ownerCommandUserVisible: planEntitlements.citizenAccess.founderCommandUserVisible,
      performanceFeeUserVisible: planEntitlements.citizenAccess.performanceFeeUserVisible,
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
    whyBlocked: {
      liveDisabled: live.userCopy,
      realMoneyBlocked: realMoney.userCopy,
      brokerUnavailable: broker.userCopy,
      feedFallback: feed.userCopy,
      billingInactive: billing.userCopy,
      proPlanned: pro.userCopy,
      vipPlanned: vip.userCopy,
      institutionalFuture: institutional.userCopy,
      islamicNotCertified: islamic.userCopy,
      launchInactive: launch.userCopy,
      socialPublishingInactive: social.userCopy,
      restrictedControlsPrivate: restrictedControls.userCopy,
    },
    journalCoach: {
      readiness: "basic_safe_prompts_active",
      persistence: journalCoach.memoryFoundation.persistence,
      accountSafePersistence: journalCoach.memoryFoundation.accountSafePersistence,
      canSuggestJournalNotes: true,
      canSuggestCoachPrompts: true,
      canPromiseResults: false,
      canGiveFinancialAdvice: false,
      canFakePersistence: false,
    },
    memoryReadiness: {
      mode: "session_local_foundation",
      localNotesSupported: true,
      safeSummariesOnly: true,
      accountSafePersistence: "planned",
      productionSync: "inactive",
      surveillance: "blocked",
    },
    settingsReadiness: {
      route: "/settings",
      canGuide: true,
      canChangeSecrets: false,
      canActivateBilling: false,
    },
    diagnosticsReadiness: {
      route: "/diagnostics",
      canGuide: true,
      rawSecretsVisible: false,
      ownerOnlyDataVisible: false,
    },
    preferences: {
      language: input.language ?? "en",
      theme: input.theme ?? "system",
      skillLevel: input.skillLevel ?? brain.skillProfile.skillLevel,
      riskProfile: input.riskProfile ?? brain.skillProfile.riskProfile,
    },
    dailyUse: {
      assistantName: "TPM Assistant",
      role: "safe_daily_workspace_assistant",
      modes: [
        "orientation",
        "platform_state_help",
        "why_blocked_help",
        "journal_help",
        "coach_help",
        "feedback_help",
        "settings_help",
        "diagnostics_help",
        "plan_explanation",
        "learning_help",
        "session_summary",
      ],
      publicLanguage: ["Free", "Pro", "VIP", "Institutional", "TPM Assistant"],
      nonAdvice: true,
      nonExecuting: true,
      nonPredictive: true,
      localOperationSupport: true,
    },
    brain: {
      contextQuality: brain.contextQuality,
      decisionSupportMode: brain.decisionSupportMode,
      userGuidanceMode: brain.userGuidanceMode,
      safeNextActions: brain.safeNextActions,
      blockedCapabilities: brain.blockedCapabilities,
    },
    intents: companionAllowedIntents,
    blockedIntentRegistry: companionBlockedIntentRegistry,
    diagnostics: {
      readiness: "ready",
      feedbackState: "available_guarded",
      aiIqContextQuality: "bounded",
      assistantDailyUse: "ready",
      whyBlockedIntegration: "ready",
      journalCoachIntegration: "ready",
      blockedIntentCoverage: "ready",
    },
    safety: {
      secretsIncluded: false,
      privateSensitiveDataIncluded: false,
      brokerCredentialsIncluded: false,
      paymentDataIncluded: false,
      socialTokensIncluded: false,
      rawPrivateLogsIncluded: false,
      rawTokensIncluded: false,
      canExecuteTrades: false,
      canActivateLive: false,
      canActivateBilling: false,
      canActivateBrokerFeed: false,
      canPublishSocial: false,
      financialAdviceAllowed: false,
      legalAdviceAllowed: false,
      guaranteeClaimsAllowed: false,
      winRateClaimsAllowed: false,
      pressureToTradeAllowed: false,
    },
    guidanceBoundaries: [
      "Explain platform state and safe next steps.",
      "Do not execute trades or enable live execution.",
      "Do not activate broker/feed or billing.",
      "Do not claim guaranteed signals, win rates, or financial advice.",
      "Do not bypass auth, entitlement, or safety boundaries.",
      "Keep restricted controls and internal governance terms out of normal user guidance.",
    ],
    blockedIntents: companionBlockedIntentRegistry.map((intent) => intent.intent),
  };
}
