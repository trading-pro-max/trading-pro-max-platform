import type {
  AlkonRuntimeConsequence,
  AlkonRuntimeGravity,
  AlkonRuntimeLawDecision,
  AlkonRuntimeNextFate,
} from "./types";

export function decideAlkonRuntimeNextFate(
  law: AlkonRuntimeLawDecision,
  gravity: AlkonRuntimeGravity,
  consequence: AlkonRuntimeConsequence
): AlkonRuntimeNextFate {
  if (law.lawDecision === "black_holed") {
    return {
      fate: "black_hole",
      reason: "The request is forbidden and cannot move toward execution or public reality.",
      nextSafeAction: law.safeAlternative,
      noExecution: true,
      noDeletion: true,
    };
  }

  if (law.lawDecision === "blocked") {
    return {
      fate: "restrict",
      reason: "Runtime law blocks this until the failed rules are cleared.",
      nextSafeAction: law.safeAlternative,
      noExecution: true,
      noDeletion: true,
    };
  }

  if (gravity.gravity === "P0_critical" || consequence.nextFateRecommendation === "tribunal_review") {
    return {
      fate: "tribunal_review",
      reason: "High-gravity or sensitive consequence needs private tribunal/review proof.",
      nextSafeAction: "Prepare review packet and wait for Founder decision where required.",
      noExecution: true,
      noDeletion: true,
    };
  }

  if (consequence.nextFateRecommendation === "draft_task") {
    return {
      fate: "draft_task",
      reason: "The issue can become a scoped local task with validation proof.",
      nextSafeAction: "Draft the task; do not execute external systems.",
      noExecution: true,
      noDeletion: true,
    };
  }

  return {
    fate: "monitor",
    reason: "The entity remains useful as monitored local readiness.",
    nextSafeAction: "Monitor proof, value, public boundary, and memory.",
    noExecution: true,
    noDeletion: true,
  };
}
