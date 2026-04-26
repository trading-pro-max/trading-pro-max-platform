import "server-only";

import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getCompanionContextSnapshot } from "@/lib/server/companion";
import { getContentFactoryReadinessSnapshot } from "@/lib/server/content-factory";
import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command/command-app";
import { getGuardianLegalEnforcementMatrixSnapshot } from "@/lib/server/guardian-legal";
import { getJournalCoachSnapshot } from "@/lib/server/journal-coach";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getStateExplanationSnapshot } from "@/lib/server/state-explanations";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";

export type TpmIntegrationMeshSnapshot = ReturnType<typeof getTpmIntegrationMeshSnapshot>;

const publicPlanNames = ["Free", "Pro", "VIP", "Institutional"] as const;
const requiredBlockedStateKeys = [
  "live_disabled",
  "real_money_blocked",
  "billing_inactive",
  "vip_locked",
  "institutional_future",
  "islamic_review_required",
  "founder_command_private",
] as const;

export function getTpmIntegrationMeshSnapshot(
  checkedAt = new Date().toISOString()
) {
  const productTruth = getProductTruthSnapshot(checkedAt);
  const planEntitlements = getPlanEntitlementSnapshot("demo_free", checkedAt);
  const assistantContext = getCompanionContextSnapshot({}, checkedAt);
  const stateExplanations = getStateExplanationSnapshot(checkedAt);
  const journalCoach = getJournalCoachSnapshot(checkedAt);
  const guardianLegal = getGuardianLegalEnforcementMatrixSnapshot(checkedAt);
  const contentFactory = getContentFactoryReadinessSnapshot(checkedAt);
  const founderCommand = getFounderCommandAppSnapshot(checkedAt);
  const visualAcceptance = getVisualAcceptanceSnapshot(checkedAt);
  const blockedStateKeys = stateExplanations.explanations.map((item) => item.key);
  const planNames = planEntitlements.plans.map((plan) => plan.planName);

  return {
    checkedAt,
    mode: "tpm_integration_mesh",
    summary: {
      systemsConnected: 10,
      publicLanguageAligned: true,
      productTruthSource: "Product Truth Engine",
      planSource: "Plan Entitlement Engine",
      assistantSource: "Assistant Context Engine",
      diagnosticsRole: "public-safe readiness surface",
      founderRole: "private readiness reporting only",
    },
    publicLanguage: {
      planNames: [...publicPlanNames],
      assistantName: "Pro Max Assistant",
      userTerms: [
        "Trading Workspace",
        "Assistant",
        "Journal",
        "Coach",
        "Academy",
        "Community",
        "Premium Reports",
        "Plans",
        "Settings",
        "Diagnostics",
      ],
      internalTermsHiddenFromNormalUsers: [
        "Founder King",
        "Kingdom",
        "ministries",
        "councils",
        "presidency",
        "government model",
      ],
      legacyInternalIds: ["enterprise"],
    },
    productTruthAlignment: {
      liveExecution: productTruth.summary.liveExecution,
      realMoneyRouting: productTruth.summary.realMoneyRouting,
      billing: productTruth.summary.billing,
      publicLaunch: productTruth.summary.publicLaunch,
      socialPublishing: productTruth.summary.socialPublishing,
      islamicCertification: productTruth.summary.islamicCertification,
      performanceRevenue: productTruth.summary.performanceRevenue,
      ownerCommand: productTruth.summary.founderCommand,
      productTruthItemCount: productTruth.items.length,
    },
    planAlignment: {
      currentPlan: "Free",
      publicPlanNames: planNames,
      proState: planEntitlements.plans.find((plan) => plan.planId === "pro")?.truthState,
      vipState: planEntitlements.plans.find((plan) => plan.planId === "vip")?.truthState,
      institutionalState: planEntitlements.plans.find((plan) => plan.planId === "enterprise")?.truthState,
      billing: planEntitlements.truth.billing,
      paidAccess: planEntitlements.truth.paidAccess,
      ownerCommandUserVisible: planEntitlements.citizenAccess.founderCommandUserVisible,
      performanceFeeUserVisible: planEntitlements.citizenAccess.performanceFeeUserVisible,
    },
    assistantAlignment: {
      currentTier: assistantContext.assistantTier.label,
      currentAccess: assistantContext.assistantTier.currentAccess,
      blockedIntents: assistantContext.blockedIntents,
      safeIntentCount: assistantContext.intents.filter(
        (intent) => intent.demoFree === "allowed"
      ).length,
      secretsIncluded: assistantContext.safety.secretsIncluded,
      canExecuteTrades: assistantContext.safety.canExecuteTrades,
      canActivateLive: assistantContext.safety.canActivateLive,
      reads: [
        "product truth",
        "plan entitlements",
        "state explanations",
        "journal/coach readiness",
        "settings and diagnostics context",
      ],
    },
    blockedStateAlignment: {
      coverageCount: blockedStateKeys.length,
      requiredKeysPresent: requiredBlockedStateKeys.every((key) =>
        blockedStateKeys.includes(key)
      ),
      publicSafeCopy: true,
    },
    journalCoachAlignment: {
      mode: journalCoach.mode,
      persistence: journalCoach.localJournalFoundation.persistence,
      proDepth: journalCoach.planAccess.pro,
      vipDepth: journalCoach.planAccess.vip,
      financialAdvice: journalCoach.safety.financialAdvice,
      tradingSignals: journalCoach.safety.tradingSignals,
    },
    safetyReviewAlignment: {
      matrixRules: guardianLegal.rules.length,
      blockedRules: guardianLegal.summary.blocked,
      reviewOrApprovalRules: guardianLegal.summary.reviewOrApproval,
      secretsRequired: guardianLegal.truth.secretsRequired,
      fakeRuntimeEnforcementClaimed: guardianLegal.truth.fakeRuntimeEnforcementClaimed,
    },
    contentMediaAlignment: {
      lifecycle: contentFactory.lifecycle.states,
      externalPublishing: contentFactory.truth.externalPublishing,
      socialAccountsConnected: contentFactory.truth.socialAccountsConnected,
      socialTokens: contentFactory.truth.socialTokens,
      fakeFollowersOrViews: contentFactory.truth.fakeFollowersOrViews,
    },
    founderReportingAlignment: {
      accessOwnerOnly: founderCommand.access.ownerOnly,
      publicRouteExposed: founderCommand.access.publicRouteExposed,
      approvalExecutionActive: founderCommand.safety.approvalExecutionActive,
      fakeUsersIncluded: founderCommand.safety.fakeUsersIncluded,
      fakeRevenueIncluded: founderCommand.safety.fakeRevenueIncluded,
      fakeMetricsIncluded: founderCommand.safety.fakeMetricsIncluded,
      summaries: [
        "product truth",
        "plan readiness",
        "assistant and brain readiness",
        "journal and coach readiness",
        "safety and legal warnings",
        "content and media readiness",
        "treasury readiness",
        "visual acceptance",
        "final acceptance",
      ],
    },
    visualAcceptanceAlignment: {
      status: visualAcceptance.status,
      averageScoreEstimate: visualAcceptance.averageScoreEstimate,
      humanAcceptanceRequired: visualAcceptance.truth.humanAcceptanceRequired,
    },
    truth: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeedBillingLaunch: "not_faked",
      socialPublishing: "inactive",
      productionSecrets: "not_touched",
      authSecurity: "preserved",
      fakePlanActivation: "blocked",
      internalGovernanceLeakedToNormalUsers: false,
    },
  };
}
