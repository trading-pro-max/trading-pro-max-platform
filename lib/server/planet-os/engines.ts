import "server-only";

import {
  getBuildPlannerReadinessSnapshot,
  getBuildPlannerSnapshot,
  planSafeBuildTask,
} from "@/lib/server/build-planner";
import { getCompanionContextSnapshot } from "@/lib/server/companion";
import {
  classifyContentFactoryDraft,
  getContentFactoryReadinessSnapshot,
} from "@/lib/server/content-factory";
import { getFounderPersonalCompanionSnapshot } from "@/lib/server/founder-command/founder-companion";
import { getFounderCommandReportingSnapshot } from "@/lib/server/founder-command";
import { evaluateGuardianLegalRules } from "@/lib/server/guardian-legal";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getStateExplanationSnapshot } from "@/lib/server/state-explanations";
import { getPlatformClockSnapshot } from "@/lib/server/time/platform-clock";
import { getVisualAcceptanceSnapshot } from "@/lib/server/visual-acceptance";
import { getPlanEntitlementSnapshot } from "@/lib/plans/entitlements";
import { getPlanetBlueprintSnapshot } from "./blueprint";

export type PlanetCoreEnginesSnapshot = {
  checkedAt: string;
  mode: "planet_core_engines";
  enginesEstablished: 10;
  blueprint: ReturnType<typeof getPlanetBlueprintSnapshot>;
  productTruth: ReturnType<typeof getProductTruthSnapshot>;
  founderReporting: ReturnType<typeof getFounderCommandReportingSnapshot>;
  founderCompanion: ReturnType<typeof getFounderPersonalCompanionSnapshot>;
  platformClock: ReturnType<typeof getPlatformClockSnapshot>;
  planEntitlements: ReturnType<typeof getPlanEntitlementSnapshot>;
  companionContext: ReturnType<typeof getCompanionContextSnapshot>;
  guardianLegalRules: {
    blockedClaim: ReturnType<typeof evaluateGuardianLegalRules>;
    safeClaim: ReturnType<typeof evaluateGuardianLegalRules>;
  };
  visualAcceptance: ReturnType<typeof getVisualAcceptanceSnapshot>;
  stateExplanations: ReturnType<typeof getStateExplanationSnapshot>;
  contentFactory: {
    blockedDraft: ReturnType<typeof classifyContentFactoryDraft>;
    reviewedDraft: ReturnType<typeof classifyContentFactoryDraft>;
    educationTip: ReturnType<typeof classifyContentFactoryDraft>;
    vipClaim: ReturnType<typeof classifyContentFactoryDraft>;
    islamicClaim: ReturnType<typeof classifyContentFactoryDraft>;
    liveClaim: ReturnType<typeof classifyContentFactoryDraft>;
    readiness: ReturnType<typeof getContentFactoryReadinessSnapshot>;
  };
  buildPlanner: {
    defaultPlan: ReturnType<typeof getBuildPlannerSnapshot>;
    forbiddenLaunchPlan: ReturnType<typeof planSafeBuildTask>;
    companionPlan: ReturnType<typeof planSafeBuildTask>;
    mediaPlan: ReturnType<typeof planSafeBuildTask>;
    secretForbiddenPlan: ReturnType<typeof planSafeBuildTask>;
    liveForbiddenPlan: ReturnType<typeof planSafeBuildTask>;
    readiness: ReturnType<typeof getBuildPlannerReadinessSnapshot>;
  };
  truth: {
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerFeedBillingLaunch: "not_faked";
    secrets: "not_exposed";
    socialPublishing: "blocked";
  };
};

export function getPlanetCoreEnginesSnapshot(
  checkedAt = new Date().toISOString()
): PlanetCoreEnginesSnapshot {
  return {
    checkedAt,
    mode: "planet_core_engines",
    enginesEstablished: 10,
    blueprint: getPlanetBlueprintSnapshot(checkedAt),
    productTruth: getProductTruthSnapshot(checkedAt),
    founderReporting: getFounderCommandReportingSnapshot(checkedAt),
    founderCompanion: getFounderPersonalCompanionSnapshot(checkedAt),
    platformClock: getPlatformClockSnapshot(checkedAt),
    planEntitlements: getPlanEntitlementSnapshot("demo_free", checkedAt),
    companionContext: getCompanionContextSnapshot({}, checkedAt),
    guardianLegalRules: {
      blockedClaim: evaluateGuardianLegalRules({
        text: "Guaranteed profit and live trading active",
        category: "product_claim",
      }),
      safeClaim: evaluateGuardianLegalRules({
        text: "Paper-only decision support with no guarantee",
        category: "product_claim",
      }),
    },
    visualAcceptance: getVisualAcceptanceSnapshot(checkedAt),
    stateExplanations: getStateExplanationSnapshot(checkedAt),
    contentFactory: {
      blockedDraft: classifyContentFactoryDraft({
        contentType: "text_post",
        text: "Guaranteed profit with public launch and billing active",
      }),
      reviewedDraft: classifyContentFactoryDraft({
        contentType: "academy_post",
        text: "Paper-mode education and platform safety explanation",
      }),
      educationTip: classifyContentFactoryDraft({
        contentType: "academy_post",
        text: "Paper-mode education and platform safety explanation",
      }),
      vipClaim: classifyContentFactoryDraft({
        contentType: "pro_vip_teaser",
        text: "VIP advanced Assistant requires entitlement, safety review, legal review, and private approval.",
      }),
      islamicClaim: classifyContentFactoryDraft({
        contentType: "text_post",
        text: "Sharia certified Islamic account is active",
      }),
      liveClaim: classifyContentFactoryDraft({
        contentType: "product_update",
        text: "Live trading active with broker connected",
      }),
      readiness: getContentFactoryReadinessSnapshot(checkedAt),
    },
    buildPlanner: {
      defaultPlan: getBuildPlannerSnapshot(),
      forbiddenLaunchPlan: planSafeBuildTask("activate production launch with secrets"),
      companionPlan: planSafeBuildTask("user Companion UI readiness", checkedAt),
      mediaPlan: planSafeBuildTask("media content workflow", checkedAt),
      secretForbiddenPlan: planSafeBuildTask("rotate secret token in private vault", checkedAt),
      liveForbiddenPlan: planSafeBuildTask("enable live execution and billing", checkedAt),
      readiness: getBuildPlannerReadinessSnapshot(checkedAt),
    },
    truth: {
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerFeedBillingLaunch: "not_faked",
      secrets: "not_exposed",
      socialPublishing: "blocked",
    },
  };
}
