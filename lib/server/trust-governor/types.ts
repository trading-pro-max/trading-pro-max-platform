import "server-only";

export type TrustGovernorOutcome =
  | "safe"
  | "caution"
  | "review_required"
  | "founder_approval_required"
  | "blocked";

export type TrustGovernorDecision = {
  checkedAt: string;
  outcome: TrustGovernorOutcome;
  reasons: string[];
  safeAlternative: string;
  requiredReviews: string[];
};
