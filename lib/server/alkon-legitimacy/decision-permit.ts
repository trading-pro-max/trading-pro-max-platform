import type {
  AlkonAuthorityLevel,
  AlkonDecisionPermit,
  AlkonDecisionPermitOutcome,
  AlkonDecisionRiskLevel,
  AlkonLegitimacyDimension,
  AlkonLegitimacyRequest,
  AlkonLegitimacyReview,
} from "./types";

const OUTCOME_WEIGHT = {
  pass: 0,
  review_required: 1,
  founder_approval_required: 2,
  delayed_until_ready: 3,
  blocked: 4,
  black_holed: 5,
} as const;

export function inferAuthorityLevel(
  request: AlkonLegitimacyRequest,
  reviews: AlkonLegitimacyReview[]
): AlkonAuthorityLevel {
  if (reviews.some((review) => review.outcome === "black_holed")) {
    return "constitutionally_forbidden";
  }
  if (reviews.some((review) => review.outcome === "blocked")) {
    return "constitutionally_forbidden";
  }
  if (
    reviews.some((review) => review.outcome === "founder_approval_required") ||
    request.publicVisible ||
    request.riskHint === "high" ||
    request.riskHint === "critical"
  ) {
    return "founder_final_decision";
  }
  if (reviews.some((review) => review.outcome === "review_required")) {
    return "approve_sensitive";
  }
  if (request.affectedWorld === "private_alkon") return "draft_only";
  return "approve_low_risk";
}

export function inferRiskLevel(
  request: AlkonLegitimacyRequest,
  reviews: AlkonLegitimacyReview[]
): AlkonDecisionRiskLevel {
  if (reviews.some((review) => review.outcome === "black_holed")) {
    return "black_hole";
  }
  if (reviews.some((review) => review.outcome === "blocked")) return "critical";
  if (
    reviews.some((review) => review.outcome === "founder_approval_required") ||
    request.riskHint === "critical"
  ) {
    return "critical";
  }
  if (
    reviews.some((review) => review.outcome === "delayed_until_ready") ||
    request.riskHint === "high"
  ) {
    return "high";
  }
  if (reviews.some((review) => review.outcome === "review_required")) {
    return "medium";
  }
  return request.riskHint ?? "low";
}

export function createDecisionPermit(
  request: AlkonLegitimacyRequest,
  reviews: AlkonLegitimacyReview[]
): AlkonDecisionPermit {
  const highest = reviews.reduce(
    (max, review) => Math.max(max, OUTCOME_WEIGHT[review.outcome]),
    0
  );
  const outcome: AlkonDecisionPermitOutcome =
    highest >= OUTCOME_WEIGHT.black_holed
      ? "permit_black_holed"
      : highest >= OUTCOME_WEIGHT.blocked
        ? "permit_blocked"
        : highest >= OUTCOME_WEIGHT.delayed_until_ready
          ? "permit_delayed_until_ready"
          : highest >= OUTCOME_WEIGHT.founder_approval_required
            ? "permit_founder_approval_required"
            : highest >= OUTCOME_WEIGHT.review_required
              ? "permit_review_required"
              : request.affectedWorld === "private_alkon"
                ? "permit_draft_only"
                : "permit_report_only";
  const failedDimensions = reviews
    .filter((review) => review.outcome !== "pass")
    .map((review) => review.dimension);
  const requiredReviews = Array.from(
    new Set(reviews.flatMap((review) => review.requiredReview))
  );
  const authorityLevel = inferAuthorityLevel(request, reviews);
  const riskLevel = inferRiskLevel(request, reviews);

  return {
    permitId: `permit_${request.actionCategory}_${request.currentStage}`,
    outcome,
    actionCategory: request.actionCategory,
    authorityLevel,
    riskLevel,
    legitimacySummary:
      failedDimensions.length === 0
        ? "All legitimacy dimensions passed for report/draft readiness."
        : `${failedDimensions.length} legitimacy dimensions require review, delay, block, or Founder approval.`,
    failedDimensions: failedDimensions as AlkonLegitimacyDimension[],
    requiredReviews,
    safeAlternative:
      reviews.find((review) => review.outcome !== "pass")?.safeAlternative ??
      "Keep this as read-only report or draft until the Founder chooses the next safe step.",
    rollbackRequirement: request.hasRollback
      ? "Rollback evidence present."
      : "Rollback evidence required before sensitive action.",
    auditRequirement:
      "Create readiness-only audit record with no secrets, no bank/card data, and no payment execution.",
    memoryLesson:
      reviews.find((review) => review.outcome !== "pass")?.memoryLesson ??
      "Legitimate authority remains tied to Product Truth and safe timing.",
    nextSafeAction:
      outcome === "permit_report_only" || outcome === "permit_draft_only"
        ? "Prepare report or draft only; do not execute externally."
        : outcome === "permit_black_holed" || outcome === "permit_blocked"
          ? "Block and record the reason in Founder Command."
          : "Collect evidence and request the required review before action.",
    mayExecuteFromWebApp: false,
    paymentExecutionEnabled: false,
    externalCallsEnabled: false,
    secretsAllowed: false,
  };
}
