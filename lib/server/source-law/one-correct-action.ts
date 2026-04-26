import type { OneCorrectActionDecision, SourceDriftSignal, SourceLawTarget } from "./types";

export type OneCorrectActionContext = {
  currentStation?: "station_1_open" | "station_1_closed" | "future";
  livingMarketCoreClosed?: boolean;
  assistantFirstClosed?: boolean;
  visualAcceptancePending?: boolean;
  auditCleanupPending?: boolean;
  p0SecurityTruthOrBuildFailure?: boolean;
  founderEnergyHigh?: boolean;
  driftSignals?: SourceDriftSignal[];
  target?: SourceLawTarget;
};

export function decideOneCorrectAction(
  context: OneCorrectActionContext = {}
): OneCorrectActionDecision {
  const currentStation = context.currentStation ?? "station_1_open";
  const driftSignals = context.driftSignals ?? [];
  const target = context.target;

  if (context.p0SecurityTruthOrBuildFailure) {
    return {
      oneCorrectAction:
        "Fix the P0 truth, security, or build failure before any feature expansion.",
      whyThisNow:
        "Source Law puts truth, safety, and proof before product growth or polish.",
      delayedActions: ["Living Market Core polish", "future worlds", "media work"],
      blockedActions: ["public claims", "launch", "billing", "live execution"],
      founderDecisionNeeded:
        "Only one Founder decision is needed if the P0 fix changes security, public truth, or visual identity.",
    };
  }

  if (
    currentStation === "station_1_open" &&
    context.livingMarketCoreClosed !== true
  ) {
    return {
      oneCorrectAction:
        "Close Living Market Core proof for Pro Max Trading before expansion.",
      whyThisNow:
        "The chart/workspace is the heart of the Prime World, and Station 1 cannot close while it remains unaccepted.",
      delayedActions: [
        "future product worlds",
        "media expansion",
        "billing readiness",
        "nonessential Alkon theory",
      ],
      blockedActions: [
        "live execution activation",
        "real-money routing",
        "broker/feed activation",
        "billing activation",
        "public launch claim",
      ],
      founderDecisionNeeded: context.visualAcceptancePending
        ? "Ahmad visual acceptance is needed only for the chart/workspace identity decision."
        : "No extra Founder decision is needed until proof shows the next visual or safety fork.",
    };
  }

  if (target?.expandsFutureWorld || driftSignals.some((signal) => signal.driftType === "expansion_before_prime_world")) {
    return {
      oneCorrectAction:
        "Return expansion to private memory and keep the next build on Pro Max Trading.",
      whyThisNow:
        "Future worlds are valid only as private readiness while the Prime World is still being accepted.",
      delayedActions: ["future-world prototypes", "public world seeds", "new product pages"],
      blockedActions: ["new product launch", "future-world public exposure"],
      founderDecisionNeeded:
        "No Founder decision is needed now unless a seed would directly protect the Prime World.",
    };
  }

  if (context.assistantFirstClosed && target?.type === "assistant_behavior") {
    return {
      oneCorrectAction:
        "Monitor Assistant behavior and reopen only with evidence of a real user gap.",
      whyThisNow:
        "Closed Assistant work should not be reopened by excitement or complexity.",
      delayedActions: ["new Assistant layers", "long generic replies"],
      blockedActions: ["trading signals", "internal doctrine exposure"],
      founderDecisionNeeded:
        "Founder review is needed only for sensitive wording, public claims, or identity changes.",
    };
  }

  return {
    oneCorrectAction:
      "Proceed only with the smallest proven action that improves Pro Max Trading human value.",
    whyThisNow:
      "Source Law selects one action by vision, human value, truth, safety, and proof.",
    delayedActions: ["unproven expansion", "theory-only documentation", "nonessential polish"],
    blockedActions: ["unsafe activation", "secret exposure", "public private-doctrine exposure"],
    founderDecisionNeeded: context.founderEnergyHigh
      ? "Ask Ahmad for one decision only, then delegate all low-risk work to draft."
      : "Founder review is needed only if the action touches money, law, security, launch, or visual acceptance.",
  };
}
