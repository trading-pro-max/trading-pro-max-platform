import "server-only";
import type { AccountReviewState } from "../../../modules/shell/types/platform-state";
import {
  getAccountComplianceSnapshot,
  recordComplianceAuditEvent,
  setComplianceReviewState,
  type AccountComplianceSnapshot,
  type ComplianceReviewRecord,
} from "./state";

export type OperatorReviewAction =
  | "mark_in_progress"
  | "approve_for_paper"
  | "restrict_account"
  | "block_account"
  | "reopen_review";

export type OperatorReviewInput = {
  accountId: string;
  operatorUserId: string;
  operatorLabel: string;
  action: OperatorReviewAction;
  reason?: string | null;
  note?: string | null;
};

export type OperatorReviewResult = {
  action: OperatorReviewAction;
  review: ComplianceReviewRecord;
  compliance: AccountComplianceSnapshot;
};

export class ComplianceTransitionError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400
  ) {
    super(message);
    this.name = "ComplianceTransitionError";
  }
}

const OPERATOR_REVIEW_ACTIONS: readonly OperatorReviewAction[] = [
  "mark_in_progress",
  "approve_for_paper",
  "restrict_account",
  "block_account",
  "reopen_review",
];

const TERMINAL_REVIEW_STATES: readonly AccountReviewState[] = [
  "approved_for_paper",
  "restricted",
  "rejected",
];

export function isOperatorReviewAction(
  value: string
): value is OperatorReviewAction {
  return OPERATOR_REVIEW_ACTIONS.includes(value as OperatorReviewAction);
}

function normalizeOptionalText(value: string | null | undefined, maxLength = 1000) {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function allDisclosuresAccepted(snapshot: AccountComplianceSnapshot) {
  return snapshot.disclosures.every((disclosure) => disclosure.state === "accepted");
}

function targetStateForAction(action: OperatorReviewAction): AccountReviewState {
  if (action === "mark_in_progress") return "in_progress";
  if (action === "approve_for_paper") return "approved_for_paper";
  if (action === "restrict_account") return "restricted";
  if (action === "block_account") return "rejected";

  return "pending_review";
}

function allowedActionsForState(
  state: AccountReviewState
): readonly OperatorReviewAction[] {
  if (state === "not_started") return ["mark_in_progress"];
  if (state === "in_progress") {
    return ["approve_for_paper", "restrict_account", "block_account", "reopen_review"];
  }
  if (state === "pending_review") {
    return ["mark_in_progress", "approve_for_paper", "restrict_account", "block_account"];
  }
  if (state === "approved_for_paper") {
    return ["restrict_account", "block_account", "reopen_review"];
  }
  if (state === "restricted") return ["block_account", "reopen_review"];
  if (state === "rejected") return ["reopen_review"];

  return [];
}

function assertOperatorTransitionAllowed(input: {
  action: OperatorReviewAction;
  snapshot: AccountComplianceSnapshot;
  reason: string | null;
}) {
  const currentState = input.snapshot.review.state;
  const allowedActions = allowedActionsForState(currentState);

  if (!allowedActions.includes(input.action)) {
    throw new ComplianceTransitionError(
      "invalid_review_transition",
      `Cannot apply ${input.action} while review is ${currentState}.`
    );
  }

  if (input.action === "approve_for_paper" && !allDisclosuresAccepted(input.snapshot)) {
    throw new ComplianceTransitionError(
      "disclosures_required",
      "Cannot approve for paper before all required disclosures are accepted."
    );
  }

  if (
    (input.action === "restrict_account" || input.action === "block_account") &&
    !input.reason
  ) {
    throw new ComplianceTransitionError(
      "reason_required",
      "Restricted and blocked outcomes require a reason."
    );
  }

  if (
    input.action === "reopen_review" &&
    TERMINAL_REVIEW_STATES.includes(currentState) &&
    !input.reason
  ) {
    throw new ComplianceTransitionError(
      "reason_required",
      "Reopening a decided review requires a reason."
    );
  }
}

export async function applyOperatorReviewAction(
  input: OperatorReviewInput
): Promise<OperatorReviewResult> {
  const before = await getAccountComplianceSnapshot(input.accountId);

  if (!before) {
    throw new ComplianceTransitionError(
      "account_not_found",
      "Account was not found.",
      404
    );
  }

  if (before.account.userId === input.operatorUserId) {
    throw new ComplianceTransitionError(
      "self_review_not_allowed",
      "Operator review actions cannot target the operator's own account.",
      403
    );
  }

  const reason = normalizeOptionalText(input.reason);
  const note = normalizeOptionalText(input.note);

  assertOperatorTransitionAllowed({
    action: input.action,
    snapshot: before,
    reason,
  });

  const targetState = targetStateForAction(input.action);
  const review = await setComplianceReviewState({
    accountId: input.accountId,
    userId: input.operatorUserId,
    actorRole: "operator",
    state: targetState,
    decisionReason: reason ?? note,
    reviewerId: input.operatorUserId,
    reviewerLabel: input.operatorLabel,
    skipAudit: true,
  });
  const after = await getAccountComplianceSnapshot(input.accountId);

  if (!after) {
    throw new ComplianceTransitionError(
      "account_not_found",
      "Account was not found after review update.",
      404
    );
  }

  await recordComplianceAuditEvent({
    action: "operator_review_action",
    kind: "review_state_changed",
    scope: "compliance",
    actorRole: "operator",
    userId: input.operatorUserId,
    accountId: input.accountId,
    message: "Operator review action applied.",
    metadata: {
      operatorAction: input.action,
      targetUserId: after.account.userId,
      previousReviewState: before.review.state,
      resultingReviewState: after.review.state,
      resultingLifecycleState: after.account.lifecycleState,
      resultingPaperState: after.activation.paperState,
      resultingLiveState: "blocked",
      resultingActivationReason: after.activation.reason,
      resultingActivationNextStep: after.activation.nextStep,
      reviewerId: input.operatorUserId,
      reviewerLabel: input.operatorLabel,
      reason,
      note,
    },
  });

  return {
    action: input.action,
    review,
    compliance: after,
  };
}
