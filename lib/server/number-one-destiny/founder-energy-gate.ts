import type { FounderEnergyImpact, NumberOneEvaluationTarget } from "./types";

export function evaluateFounderEnergy(
  target: NumberOneEvaluationTarget
): FounderEnergyImpact {
  const sensitive =
    target.requiresFounderNow ||
    target.hasVisualAcceptance === false ||
    target.involvesMoney ||
    target.involvesLegal ||
    target.involvesSecurity ||
    target.expandsFutureWorld ||
    target.involvesRegulatedActivity;

  if (target.increasesFounderLoad) {
    return {
      founderAttentionRequired: true,
      decisionLoad: "overload",
      oneNextDecision:
        "Choose only whether this target is still the one most important Prime World task.",
      canDelegateToCodex: false,
      delayReason:
        "Founder energy overload requires reducing the decision surface to one next critical choice.",
    };
  }

  if (sensitive) {
    return {
      founderAttentionRequired: true,
      decisionLoad: "medium",
      oneNextDecision: `Approve, delay, or reject: ${target.title}.`,
      canDelegateToCodex: Boolean(target.canDelegateToCodex && !target.involvesSecurity),
      delayReason:
        "Sensitive decisions remain with Ahmad; Codex may draft only low-risk supporting work.",
    };
  }

  return {
    founderAttentionRequired: false,
    decisionLoad: "low",
    oneNextDecision:
      "No Founder interruption required; continue low-risk draft and validation work.",
    canDelegateToCodex: target.canDelegateToCodex ?? true,
    delayReason: "No delay required for Founder energy.",
  };
}
