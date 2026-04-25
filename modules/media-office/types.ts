export type ContentLifecycleState =
  | "idea"
  | "draft"
  | "brand_review"
  | "guardian_review"
  | "legal_review"
  | "founder_approval"
  | "scheduled_later"
  | "blocked"
  | "archived";

export type MediaRiskClassification =
  | "safe_draft"
  | "review_required"
  | "founder_approval_required"
  | "blocked";
