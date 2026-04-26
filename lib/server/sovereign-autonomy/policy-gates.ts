import "server-only";

import { blockedSovereignCategories } from "./event-state";
import type {
  AutonomyLevel,
  PolicyGateDecision,
  PolicyGateEvaluation,
  PolicyGateName,
  PolicyGateResult,
  SovereignEvent,
  SovereignReviewArea,
} from "./types";

export const allowedAutonomyLevelsNow: AutonomyLevel[] = [
  "level_1_detect",
  "level_2_draft",
  "level_3_0_codex_ready_task_draft_only",
  "level_3_1_approved_low_risk_codex_submission_readiness_only",
];

export const blockedAutonomyLevelsNow: AutonomyLevel[] = [
  "level_0_blocked",
  "level_4_future_low_risk_auto_fix",
  "level_5_forbidden_for_now",
];

export const forbiddenSovereignActions = [
  "secrets exposure",
  "production secrets",
  "live execution",
  "real money",
  "billing activation",
  "broker/feed activation",
  "social publishing",
  "public launch",
  "fake activation",
  "fake metrics",
  "fake partnership",
  "guaranteed profit",
  "win-rate",
  "internal public leakage",
  "unapproved Founder Command exposure",
];

function result(
  gate: PolicyGateName,
  decision: PolicyGateDecision,
  reason: string,
  requiredReviews: SovereignReviewArea[] = []
): PolicyGateResult {
  return {
    gate,
    decision,
    reason,
    requiredReviews,
  };
}

function gateDecisionRank(decision: PolicyGateDecision) {
  if (decision === "quarantined") return 5;
  if (decision === "blocked") return 4;
  if (decision === "founder_approval_required") return 3;
  if (decision === "review_required") return 2;
  return 1;
}

function strongestDecision(decisions: PolicyGateDecision[]): PolicyGateDecision {
  return decisions.reduce((strongest, current) =>
    gateDecisionRank(current) > gateDecisionRank(strongest) ? current : strongest
  );
}

function autonomyForDecision(
  event: SovereignEvent,
  decision: PolicyGateDecision
): AutonomyLevel {
  if (decision === "quarantined" || decision === "blocked") {
    return "level_0_blocked";
  }

  if (decision === "founder_approval_required") {
    return "level_3_0_codex_ready_task_draft_only";
  }

  if (decision === "review_required" || event.riskLevel === "medium") {
    return "level_2_draft";
  }

  return "level_3_1_approved_low_risk_codex_submission_readiness_only";
}

export function evaluateSovereignPolicyGates(
  event: SovereignEvent,
  checkedAt = new Date().toISOString()
): PolicyGateEvaluation {
  const isHardBlocked = blockedSovereignCategories.has(event.type);
  const gates: PolicyGateResult[] = [
    result(
      "Product Truth Gate",
      isHardBlocked ? "blocked" : "allowed",
      isHardBlocked
        ? "The event touches a hard Product Truth boundary."
        : "Product Truth remains preservable.",
      ["product_truth"]
    ),
    result(
      "Plan Entitlement Gate",
      event.type === "billing_requested" ? "blocked" : "allowed",
      event.type === "billing_requested"
        ? "Billing and paid entitlement activation are inactive."
        : "No plan entitlement activation is requested.",
      ["plan_entitlement"]
    ),
    result(
      "Public/Private Boundary Gate",
      event.type === "internal_language_leak" ||
        event.type === "public_private_boundary_risk"
        ? "blocked"
        : "allowed",
      event.type === "internal_language_leak" ||
        event.type === "public_private_boundary_risk"
        ? "Internal operating language cannot appear in the public user world."
        : "The public/private boundary is clear for this event.",
      ["public_private_boundary", "quality"]
    ),
    result(
      "Guardian Gate",
      event.requiredReviews.includes("guardian") ? "review_required" : "allowed",
      event.requiredReviews.includes("guardian")
        ? "Guardian review is required before any sensitive change."
        : "No Guardian blocker is detected.",
      event.requiredReviews.includes("guardian") ? ["guardian"] : []
    ),
    result(
      "Legal Gate",
      event.requiredReviews.includes("legal") ? "review_required" : "allowed",
      event.requiredReviews.includes("legal")
        ? "Legal/claims review is required."
        : "No legal claim risk is detected.",
      event.requiredReviews.includes("legal") ? ["legal"] : []
    ),
    result(
      "Trust Governor Gate",
      event.type === "social_publish_requested" ||
        event.type === "launch_requested" ||
        event.type === "billing_requested"
        ? "blocked"
        : "allowed",
      "Trust state must remain truthful: no fake users, revenue, claims, or external activation.",
      ["trust_governor"]
    ),
    result(
      "Security Sovereignty Gate",
      event.type === "security_risk" ||
        event.type === "live_execution_requested" ||
        event.type === "real_money_requested" ||
        event.type === "broker_feed_requested"
        ? "blocked"
        : "allowed",
      event.type === "security_risk"
        ? "Security risk is quarantined until reviewed."
        : "No security activation is allowed from this event.",
      ["security"]
    ),
    result(
      "Secrets Gate",
      event.type === "secrets_risk" ? "quarantined" : "allowed",
      event.type === "secrets_risk"
        ? "Secrets cannot be stored, displayed, sent to Codex, or exposed."
        : "No secret material is present.",
      ["secrets", "security"]
    ),
    result(
      "Visual Acceptance Gate",
      event.requiredReviews.includes("visual_acceptance")
        ? "review_required"
        : "allowed",
      event.requiredReviews.includes("visual_acceptance")
        ? "Ahmad visual review is required before visual acceptance."
        : "No visual acceptance gate is needed.",
      event.requiredReviews.includes("visual_acceptance")
        ? ["visual_acceptance"]
        : []
    ),
    result(
      "Founder Approval Gate",
      event.requiredReviews.includes("founder") || event.riskLevel === "high"
        ? "founder_approval_required"
        : "allowed",
      event.requiredReviews.includes("founder") || event.riskLevel === "high"
        ? "Founder review is required before any sensitive or identity change."
        : "Founder approval is not required for draft readiness.",
      event.requiredReviews.includes("founder") || event.riskLevel === "high"
        ? ["founder"]
        : []
    ),
  ];

  const overallDecision = strongestDecision(gates.map((gate) => gate.decision));
  const hardBlocks = gates
    .filter((gate) => gate.decision === "blocked" || gate.decision === "quarantined")
    .map((gate) => `${gate.gate}: ${gate.reason}`);

  return {
    checkedAt,
    eventId: event.eventId,
    overallDecision,
    autonomyLevel: autonomyForDecision(event, overallDecision),
    gates,
    hardBlocks,
    allowedNow: allowedAutonomyLevelsNow,
    forbiddenNow: forbiddenSovereignActions,
  };
}
