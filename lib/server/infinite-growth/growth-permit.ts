import type {
  GrowthPermit,
  GrowthPermitOutcome,
  InfiniteGrowthDecision,
  InfiniteGrowthDecisionReport,
  InfiniteGrowthGate,
  InfiniteGrowthIdea,
  SwissLawGravityResult,
} from "./types";

function permitOutcome(
  decision: InfiniteGrowthDecision,
  gates: InfiniteGrowthGate[],
  gravity: SwissLawGravityResult,
  idea: InfiniteGrowthIdea
): GrowthPermitOutcome {
  if (
    decision === "black_hole_forbidden_now" ||
    gravity.gravity === "black_hole" ||
    gates.some((gate) => gate.status === "black_hole")
  ) {
    return "permit_black_hole";
  }

  if (decision === "blocked_until_cleared") {
    return "permit_blocked_until_cleared";
  }

  if (decision === "delayed_until_ready") {
    return "permit_delayed_until_ready";
  }

  if (decision === "founder_approval_required") {
    return "permit_founder_approval_required";
  }

  if (
    decision === "privacy_review_required" ||
    decision === "accounting_review_required" ||
    decision === "legal_review_required" ||
    decision === "regulatory_review_required"
  ) {
    return "permit_review_required";
  }

  if (decision === "allow_public_safe") {
    return "permit_public_safe";
  }

  if (decision === "allow_readiness_only") {
    return "permit_readiness_only";
  }

  if (decision === "allow_local_only" || idea.domain === "safe_local_build") {
    return "permit_local_build";
  }

  return "permit_safe_creation";
}

export function createGrowthPermit(
  report: Omit<InfiniteGrowthDecisionReport, "permit">
): GrowthPermit {
  const outcome = permitOutcome(
    report.decision,
    report.gates,
    report.gravity,
    report.idea
  );

  return {
    permitId: `growth_permit_${report.idea.domain}_${outcome}`,
    outcome,
    title: report.idea.title,
    domain: report.idea.domain,
    allowedActions: report.allowedScope,
    forbiddenActions: [
      ...report.domainRule.forbiddenActions,
      ...report.blockedScope,
    ].filter((item, index, list) => list.indexOf(item) === index),
    requiredProof: report.domainRule.requiredProof,
    requiredReview: report.failedGates
      .flatMap((gate) => gate.requiredReview)
      .filter((item, index, list) => item && list.indexOf(item) === index),
    founderDecisionRequired: report.founderApprovalRequired,
    swissLawGravitySummary: `${report.gravity.gravity}: ${report.gravity.nextSafeAction}`,
    productTruthSummary:
      report.gates.find((gate) => gate.gateId === "ProductTruthGate")?.reason ??
      "Product Truth check required.",
    nextSafeAction: report.nextSafeAction,
  };
}
