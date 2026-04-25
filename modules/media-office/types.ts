export type ContentLifecycleState =
  | "idea"
  | "draft"
  | "brand_review"
  | "guardian_review"
  | "legal_review"
  | "founder_approval"
  | "scheduled"
  | "published"
  | "blocked"
  | "archived";

export type MediaRiskClassification =
  | "safe_auto_publish_candidate_later"
  | "approval_required"
  | "blocked";
