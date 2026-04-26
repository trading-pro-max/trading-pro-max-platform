import "server-only";

import type {
  CodexExecutionPermit,
  CodexTaskCategory,
  CodexTaskPassport,
  CodexWorkerLevel,
} from "./types";

const autoSubmitEligibleLowRiskCategories: CodexTaskCategory[] = [
  "docs_update",
  "test_update",
];

function maxWorkerLevelForPermit(
  passport: CodexTaskPassport,
  blocked: boolean
): CodexWorkerLevel {
  if (blocked) return "restricted";
  if (passport.workerLevel === "builder_low") return "builder_low";

  return "drafter";
}

export function decideCodexExecutionPermit(
  passport: CodexTaskPassport
): CodexExecutionPermit {
  const blockedCategory =
    passport.category === "billing_blocked" ||
    passport.category === "broker_feed_blocked" ||
    passport.category === "live_execution_blocked" ||
    passport.category === "launch_blocked" ||
    passport.category === "secrets";

  if (!passport.valid || blockedCategory) {
    return {
      permitId: `permit_${passport.taskId}`,
      taskId: passport.taskId,
      decision: "permit_blocked",
      reason:
        passport.invalidReasons[0] ??
        "The task falls inside a hard-blocked construction category.",
      safeNextAction:
        "Record the request as blocked readiness only; do not submit to Codex.",
      requiredReviews: passport.requiredReviews,
      blockedReason:
        passport.invalidReasons.join("; ") ||
        "Billing/live/broker/feed/secrets/launch scope is blocked.",
      autoSubmitAllowed: false,
      maxWorkerLevel: "restricted",
    };
  }

  if (
    autoSubmitEligibleLowRiskCategories.includes(passport.category) &&
    passport.riskLevel === "low" &&
    !passport.founderApprovalRequired
  ) {
    return {
      permitId: `permit_${passport.taskId}`,
      taskId: passport.taskId,
      decision: "permit_auto_submit_low_risk",
      reason:
        "Low-risk docs/tests/lint/type task has a valid passport and validation commands.",
      safeNextAction:
        "Keep as Level 3.1 readiness only until an external approved runner exists.",
      requiredReviews: passport.requiredReviews,
      blockedReason: null,
      autoSubmitAllowed: true,
      maxWorkerLevel: maxWorkerLevelForPermit(passport, false),
    };
  }

  if (passport.category === "copy_cleanup" && passport.riskLevel === "low") {
    return {
      permitId: `permit_${passport.taskId}`,
      taskId: passport.taskId,
      decision: "permit_draft_only",
      reason:
        "Minor copy cleanup may be drafted, but public language review remains required.",
      safeNextAction:
        "Prepare the Codex-ready prompt for manual review; do not auto-submit from the web app.",
      requiredReviews: passport.requiredReviews,
      blockedReason: null,
      autoSubmitAllowed: false,
      maxWorkerLevel: "builder_low",
    };
  }

  if (
    passport.founderApprovalRequired ||
    passport.legalReviewRequired ||
    passport.guardianReviewRequired ||
    passport.securityReviewRequired
  ) {
    return {
      permitId: `permit_${passport.taskId}`,
      taskId: passport.taskId,
      decision: "permit_founder_review",
      reason:
        "The task touches sensitive, visual, public, security, legal, or Founder-controlled scope.",
      safeNextAction:
        "Hold the task for Founder/review decision before external Codex submission.",
      requiredReviews: passport.requiredReviews,
      blockedReason: null,
      autoSubmitAllowed: false,
      maxWorkerLevel: maxWorkerLevelForPermit(passport, false),
    };
  }

  return {
    permitId: `permit_${passport.taskId}`,
    taskId: passport.taskId,
    decision: "permit_draft_only",
    reason:
      "The task can be compiled into a Codex-ready draft, but web-app execution is not allowed.",
    safeNextAction: "Use manual-only prompt review unless a later permit upgrades it.",
    requiredReviews: passport.requiredReviews,
    blockedReason: null,
    autoSubmitAllowed: false,
    maxWorkerLevel: maxWorkerLevelForPermit(passport, false),
  };
}

export { autoSubmitEligibleLowRiskCategories };
