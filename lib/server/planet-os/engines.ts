import "server-only";

import { getBuildPlannerSnapshot, planSafeBuildTask } from "@/lib/server/build-planner";
import { getCompanionContextSnapshot } from "@/lib/server/companion";
import { classifyContentFactoryDraft } from "@/lib/server/content-factory";
import { getFounderCommandReportingSnapshot } from "@/lib/server/founder-command";
import { evaluateGuardianLegalRules } from "@/lib/server/guardian-legal";
import { getProductTruthSnapshot } from "@/lib/server/product";
import { getStateExplanationSnapshot } from "@/lib/server/state-explanations";
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
  };
  buildPlanner: {
    defaultPlan: ReturnType<typeof getBuildPlannerSnapshot>;
    forbiddenLaunchPlan: ReturnType<typeof planSafeBuildTask>;
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
    },
    buildPlanner: {
      defaultPlan: getBuildPlannerSnapshot(),
      forbiddenLaunchPlan: planSafeBuildTask("activate production launch with secrets"),
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
