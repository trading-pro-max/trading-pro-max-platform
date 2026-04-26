import type {
  DestinyDecision,
  DestinyDimension,
  DestinyDimensionId,
  NumberOneEvaluationTarget,
  NumberOneScore,
} from "./types";
import { evaluatePublicClaimFirewall } from "./public-claim-firewall";

const DIMENSIONS: DestinyDimensionId[] = [
  "human_value",
  "number_one_quality",
  "product_truth",
  "law_compliance",
  "safety_security",
  "time_cost_worthiness",
  "proof_of_closure",
  "founder_energy",
  "prime_world_protection",
  "user_trust",
  "visual_excellence",
  "operational_readiness",
];

function scoreDimension(
  dimensionId: DestinyDimensionId,
  target: NumberOneEvaluationTarget
): DestinyDimension {
  const publicClaim = evaluatePublicClaimFirewall(target);

  const proofRequired: string[] = [];
  let score = 7;
  let reason = "Baseline private quality alignment is present.";

  switch (dimensionId) {
    case "human_value":
      score = target.servesHumanNeed ? 8 : 4;
      reason = target.servesHumanNeed
        ? "Serves a real user, Founder, support, learning, clarity, or safety need."
        : "Human need is not yet proven.";
      if (!target.servesHumanNeed) proofRequired.push("human need proof");
      break;
    case "number_one_quality":
      score = target.hasFunctionalProof && !target.addsClutter ? 8 : 5;
      reason = target.addsClutter
        ? "Added clutter weakens #1-level quality."
        : "Quality depends on proof, restraint, and clear usefulness.";
      proofRequired.push("quality proof");
      break;
    case "product_truth":
      score =
        target.involvesLiveExecution ||
        target.involvesRealMoney ||
        target.involvesBrokerFeed ||
        target.involvesBilling
          ? 1
          : publicClaim.allowed
            ? 9
            : 2;
      reason = publicClaim.allowed
        ? "Product Truth remains protected."
        : "Public claim wording violates Product Truth.";
      if (!publicClaim.allowed) proofRequired.push("claim rewrite");
      break;
    case "law_compliance":
      score =
        target.involvesRegulatedActivity || target.involvesLegal
          ? target.hasLegalReview
            ? 7
            : 3
          : 8;
      reason = target.involvesRegulatedActivity
        ? "Regulated or legal-sensitive work requires review."
        : "No legal-sensitive movement is active.";
      if (score < 7) proofRequired.push("legal or Guardian review");
      break;
    case "safety_security":
      score = target.involvesSecurity
        ? target.hasSafetyProof
          ? 7
          : 3
        : 8;
      reason = target.involvesSecurity
        ? "Security-sensitive work needs explicit safety proof."
        : "No security weakening is requested.";
      if (score < 7) proofRequired.push("security proof");
      break;
    case "time_cost_worthiness":
      score = target.hasCostJustification && !target.increasesFounderLoad ? 8 : 5;
      reason = target.hasCostJustification
        ? "Time and cost have an explicit reason."
        : "Time/cost worthiness is not yet justified.";
      if (!target.hasCostJustification) proofRequired.push("time/cost justification");
      break;
    case "proof_of_closure":
      score = target.hasFunctionalProof && target.hasTests ? 8 : 4;
      reason = target.hasFunctionalProof && target.hasTests
        ? "Closure has functional and test proof."
        : "No closure without tests and functional evidence.";
      if (score < 8) proofRequired.push("functional proof", "tests");
      break;
    case "founder_energy":
      score = target.increasesFounderLoad ? 4 : target.requiresFounderNow ? 6 : 8;
      reason = target.increasesFounderLoad
        ? "Founder decision load is too high."
        : "Founder load is controlled.";
      if (target.increasesFounderLoad) proofRequired.push("one next decision summary");
      break;
    case "prime_world_protection":
      score = target.expandsFutureWorld && target.stationStatus !== "station_1_closed" ? 3 : 8;
      reason = target.expandsFutureWorld
        ? "Future-world expansion must not weaken Pro Max Trading."
        : "Prime World remains protected.";
      if (score < 8) proofRequired.push("Prime World protection proof");
      break;
    case "user_trust":
      score = publicClaim.allowed && !target.addsClutter ? 8 : 3;
      reason = publicClaim.allowed
        ? "Trust language stays truthful and restrained."
        : "Public claim risk harms trust.";
      if (score < 8) proofRequired.push("trust-safe copy");
      break;
    case "visual_excellence":
      score = target.hasVisualAcceptance || !["visual_identity", "workspace", "page", "component"].includes(target.type)
        ? 7
        : 5;
      reason = target.hasVisualAcceptance
        ? "Visual acceptance evidence exists."
        : "Visual-sensitive work needs review before final acceptance.";
      if (score < 7) proofRequired.push("visual proof or Founder visual review");
      break;
    case "operational_readiness":
      score = target.hasOperationalProof ? 8 : 5;
      reason = target.hasOperationalProof
        ? "Operational readiness proof exists."
        : "Operational readiness remains incomplete.";
      if (!target.hasOperationalProof) proofRequired.push("operational proof");
      break;
  }

  return { dimensionId, score, reason, proofRequired };
}

function capScore(
  score: number,
  target: NumberOneEvaluationTarget
): { score: number; cap: number; reason: string } {
  const publicClaim = evaluatePublicClaimFirewall(target);

  if (
    target.involvesLiveExecution ||
    target.involvesRealMoney ||
    target.involvesBrokerFeed ||
    target.involvesBilling ||
    target.involvesRegulatedActivity
  ) {
    return {
      score: Math.min(score, 2),
      cap: 2,
      reason:
        "Dangerous activation, billing, broker/feed, real-money, or regulated activity blocks #1 alignment.",
    };
  }

  if (!publicClaim.allowed) {
    return {
      score: Math.min(score, 4),
      cap: 4,
      reason: "Public claim risk caps the score until copy is rewritten.",
    };
  }

  if (!target.hasFunctionalProof || !target.hasTests) {
    return {
      score: Math.min(score, 6),
      cap: 6,
      reason: "No proof and tests means the score cannot exceed 6.",
    };
  }

  if (target.hasVisualAcceptance === false) {
    return {
      score: Math.min(score, 7),
      cap: 7,
      reason: "Missing visual acceptance prevents final-level scoring.",
    };
  }

  return {
    score: Math.min(score, 9),
    cap: 9,
    reason: "No fake 10/10. Independent proof and Founder acceptance are required later.",
  };
}

export function calculateDestinyScore(
  target: NumberOneEvaluationTarget
): NumberOneScore {
  const dimensions = DIMENSIONS.map((dimension) => scoreDimension(dimension, target));
  const rawTotal = dimensions.reduce((sum, dimension) => sum + dimension.score, 0);
  const rawOverall = Math.round((rawTotal / 120) * 10);
  const capped = capScore(rawOverall, target);
  const weakestDimensions = [...dimensions]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((dimension) => dimension.dimensionId);
  const requiredProof = Array.from(
    new Set(dimensions.flatMap((dimension) => dimension.proofRequired))
  );

  let recommendedDecision: DestinyDecision = "improve";
  let priority: NumberOneScore["priority"] = "P2";

  if (capped.score <= 2) {
    recommendedDecision = "block";
    priority = "blocked";
  } else if (capped.score <= 4) {
    recommendedDecision = "review_required";
    priority = "P1";
  } else if (target.expandsFutureWorld && target.stationStatus !== "station_1_closed") {
    recommendedDecision = "pursue_after_prime_world";
    priority = "P3";
  } else if (capped.score >= 8) {
    recommendedDecision = target.requiresFounderNow
      ? "founder_decision_required"
      : "pursue_now";
    priority = "P1";
  }

  return {
    totalScore: rawTotal,
    maxScore: 120,
    overallScore: capped.score,
    noFakeTenOutOfTen: true,
    scoreCap: capped.cap,
    scoreCapReason: capped.reason,
    dimensions,
    weakestDimensions,
    priority,
    recommendedDecision,
    requiredProof,
  };
}
