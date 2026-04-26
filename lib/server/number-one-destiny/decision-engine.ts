import { evaluateAbsoluteCompletion } from "./absolute-completion";
import { calculateDestinyScore } from "./destiny-score";
import { detectDestinyDrift } from "./drift-detector";
import { evaluateFounderEnergy } from "./founder-energy-gate";
import { selectNumberOneMemoryLesson } from "./memory";
import { evaluateNorthStar } from "./north-star";
import { evaluatePublicClaimFirewall } from "./public-claim-firewall";
import { selectApplicableStandards } from "./standards-authority";
import { protectPrimeWorld } from "./worldline-protection";
import type { DestinyDecision, NumberOneEvaluationTarget, NumberOneReport } from "./types";

export const SAMPLE_NUMBER_ONE_TARGETS: NumberOneEvaluationTarget[] = [
  {
    targetId: "living_market_core_chart_focus",
    title: "Living Market Core chart focus",
    description:
      "Improve the Trading Workspace so chart hierarchy, paper-safe truth, and Assistant guidance are clearer.",
    type: "workspace",
    affectedSurface: "Trading Workspace",
    publicVisible: true,
    servesHumanNeed: true,
    improvesPrimeWorld: true,
    affectsChart: true,
    hasFunctionalProof: true,
    hasTruthProof: true,
    hasSafetyProof: true,
    hasOperationalProof: true,
    hasMemoryRule: true,
    hasCostJustification: true,
    hasFounderAcceptance: false,
    hasVisualAcceptance: false,
    hasTests: true,
    canDelegateToCodex: true,
    stationStatus: "station_1_open",
  },
  {
    targetId: "public_number_one_claim",
    title: "Public #1 claim",
    description: "Say Pro Max is the world's best global financial center with guaranteed profit.",
    type: "public_copy",
    affectedSurface: "Home",
    publicVisible: true,
    servesHumanNeed: false,
    improvesPrimeWorld: false,
    involvesPublicClaim: true,
    claimText: "Pro Max is #1, world's best, regulated, and guaranteed profit.",
    hasTests: false,
    stationStatus: "station_1_open",
  },
  {
    targetId: "future_world_seed",
    title: "Future world seed",
    description:
      "Evaluate a future Pro Max world as internal readiness without public exposure or launch.",
    type: "future_world",
    affectedSurface: "Alkon Genesis",
    publicVisible: false,
    servesHumanNeed: true,
    improvesPrimeWorld: false,
    expandsFutureWorld: true,
    createsNewWorld: true,
    hasFunctionalProof: false,
    hasTests: true,
    hasMemoryRule: true,
    hasCostJustification: true,
    canDelegateToCodex: true,
    stationStatus: "station_1_open",
  },
];

function resolveDecision(report: Omit<NumberOneReport, "decision" | "nextSafeAction">): DestinyDecision {
  if (!report.publicClaimFirewall.allowed) return "block";
  if (report.score.recommendedDecision === "block") return "block";
  if (report.worldlineProtection.requiredDelay) return "pursue_after_prime_world";
  if (report.founderEnergy.founderAttentionRequired) return "founder_decision_required";
  if (report.score.overallScore >= 8) return "pursue_now";
  if (report.score.overallScore >= 6) return "improve";
  return "review_required";
}

function nextSafeAction(decision: DestinyDecision, target: NumberOneEvaluationTarget): string {
  switch (decision) {
    case "block":
      return "Block or rewrite the target so public claims, dangerous activation, and internal leakage are removed.";
    case "pursue_after_prime_world":
      return "Keep as private readiness until Pro Max Trading closes Station 1 and Prime World acceptance gates.";
    case "founder_decision_required":
      return `Present one decision to Ahmad: approve, delay, or reject ${target.title}.`;
    case "pursue_now":
      return "Proceed with safe local build, tests, proof, and no public #1 claim.";
    case "improve":
      return "Improve weak dimensions and collect proof before calling this complete.";
    case "review_required":
      return "Route for private review and evidence collection.";
    case "monitor":
      return "Monitor for drift and preserve Product Truth.";
    case "delay":
      return "Delay until gates and proof exist.";
    case "remove_or_archive":
      return "Archive or remove from priority if value cannot be proven.";
  }
}

export function evaluateNumberOneTarget(
  target: NumberOneEvaluationTarget
): NumberOneReport {
  const partial = {
    reportId: `number_one_report_${target.targetId ?? target.type}`,
    target,
    northStar: evaluateNorthStar(target),
    score: calculateDestinyScore(target),
    driftSignals: detectDestinyDrift(target),
    completionChecks: evaluateAbsoluteCompletion(target),
    applicableStandards: selectApplicableStandards(target),
    founderEnergy: evaluateFounderEnergy(target),
    worldlineProtection: protectPrimeWorld(target),
    publicClaimFirewall: evaluatePublicClaimFirewall(target),
    memoryLesson: selectNumberOneMemoryLesson(target),
  };
  const decision = resolveDecision(partial);

  return {
    ...partial,
    decision,
    nextSafeAction: nextSafeAction(decision, target),
  };
}

export function evaluateNumberOneSamples() {
  return SAMPLE_NUMBER_ONE_TARGETS.map((target) => evaluateNumberOneTarget(target));
}
