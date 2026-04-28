export type BrandCandidateSource =
  | "current_working_name"
  | "current_product_name"
  | "private_internal_name"
  | "founder_candidate"
  | "generated_candidate"
  | "migration_candidate";

export type BrandRiskLevel = "low" | "medium" | "high" | "critical" | "unknown";

export type BrandDecision =
  | "accept_for_internal_use"
  | "working_name_only"
  | "needs_search"
  | "needs_legal_review"
  | "reject"
  | "black_hole"
  | "ready_for_ahmad_review";

export type BrandUseStatus =
  | "working_name_only"
  | "working_product_name_only"
  | "private_internal_name"
  | "private_internal_only"
  | "candidate_only";

export type DomainReadinessStatus =
  | "unknown"
  | "needs_check"
  | "available_claimed_by_ahmad"
  | "unavailable"
  | "parked"
  | "conflict_risk"
  | "review_required";

export type LegalReviewStatus =
  | "not_started"
  | "required"
  | "in_review"
  | "cleared_with_notes"
  | "blocked";

export type BrandAdoptionStatus =
  | "blocked"
  | "needs_search"
  | "needs_legal_review"
  | "ready_for_ahmad_review"
  | "approved_for_private_trial"
  | "approved_for_public_use";

export type BrandCandidate = {
  id: string;
  name: string;
  source: BrandCandidateSource;
  useStatus: BrandUseStatus;
  decision: BrandDecision;
  riskLevel: BrandRiskLevel;
  riskLabel?: string;
  publicUseAllowed: boolean;
  globalLaunchAllowed: boolean;
  reasons: string[];
  internalSafeUsage: string;
  nextSafeAction: string;
  ahmadApprovalRequired: boolean;
};

export type TrademarkSearchTask = {
  id: string;
  candidateName: string;
  registry: "WIPO" | "USPTO" | "EUIPO_TMVIEW" | "SWISS_IPI" | "PHONETIC" | "NEWS_SURFACE" | "LEGAL_REVIEW";
  task: string;
  status: "needs_manual_check" | "completed" | "blocked";
  externalCallMade: false;
};

export type DomainSearchTask = {
  id: string;
  candidateName: string;
  domainOrHandle: string;
  status: DomainReadinessStatus;
  task: string;
  externalCallMade: false;
  purchaseAttempted: false;
};

export type ConflictRisk = {
  level: BrandRiskLevel;
  reasons: string[];
  majorConflictFamilies: string[];
};

export type LanguageRisk = {
  level: BrandRiskLevel;
  languagesToReview: Array<"Arabic" | "English" | "German" | "French" | "Italian" | "Spanish">;
  notes: string[];
};

export type SectorRisk = {
  level: BrandRiskLevel;
  sectorsToReview: Array<"finance" | "technology" | "trading" | "assistant" | "academy" | "business">;
  notes: string[];
};

export type AhmadBrandApproval = {
  required: true;
  status: "not_requested" | "requested" | "approved" | "rejected";
  approvalScope: "candidate_review" | "private_trial" | "public_use";
};

export type BrandAdoptionPlan = {
  adoptionStatus: BrandAdoptionStatus;
  blockers: string[];
  nextAction: string;
  ahmadApproval: AhmadBrandApproval;
};

export type BrandMigrationPlan = {
  status: "plan_only";
  executeNow: false;
  steps: string[];
  forbiddenNow: string[];
};

export type BrandClearanceSnapshot = {
  checkedAt: string;
  status: "active_with_notes";
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExternalCalls: true;
  noDomainPurchase: true;
  noPayments: true;
  noLegalClaims: true;
  publicExposure: false;
  currentNames: BrandCandidate[];
  candidateShortlist: BrandCandidate[];
  trademarkSearchTasks: TrademarkSearchTask[];
  domainSearchTasks: DomainSearchTask[];
  conflictRisk: ConflictRisk;
  languageRisk: LanguageRisk;
  sectorRisk: SectorRisk;
  legalReviewStatus: LegalReviewStatus;
  adoptionGate: BrandAdoptionPlan;
  migrationPlan: BrandMigrationPlan;
  blockedClaims: string[];
  nextSafeBrandAction: string;
};
