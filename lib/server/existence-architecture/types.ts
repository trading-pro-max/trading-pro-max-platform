import type { JarId } from "@/lib/server/jar-build";

export type ExistenceEntityType =
  | "desktop_folder"
  | "code_folder"
  | "file"
  | "route"
  | "api"
  | "component"
  | "css_layer"
  | "report"
  | "doc"
  | "test"
  | "tool"
  | "asset"
  | "visual_surface"
  | "future_idea"
  | "jar_item"
  | "builder_output";

export type ExistenceOwnershipLayer =
  | "private_alkon_minus_zero"
  | "public_pro_max"
  | "invisible_operating_layer"
  | "tools_builder"
  | "tests_evidence"
  | "docs_reports"
  | "public_assets"
  | "inbox_needs_sorting"
  | "archive_do_not_use"
  | "sensitive_do_not_commit"
  | "unknown_needs_ahmad";

export type ExistencePurpose = {
  summary: string;
  servesCurrentHeart: boolean;
  currentHeartReason: string;
};

export type ExistenceVisibility =
  | "public_safe"
  | "private_founder_only"
  | "invisible_internal"
  | "tool_local_only"
  | "test_evidence_only"
  | "docs_reports_only"
  | "public_asset_only"
  | "archive_only"
  | "sensitive_local_only"
  | "unknown";

export type ExistenceBoundary = {
  publicExposureAllowed: boolean;
  founderOnly: boolean;
  readOnly: boolean;
  noExecution: boolean;
  noShell: boolean;
  noCodex: boolean;
  noPayments: boolean;
  noSecrets: boolean;
};

export type ExistenceRisk = {
  level: "none" | "low" | "medium" | "high" | "p0";
  categories: string[];
  summary: string;
};

export type ExistenceEvidence = {
  status: "present" | "documented_reason" | "missing";
  tests: string[];
  reports: string[];
  visualProof: string[];
  reason?: string;
};

export type ExistenceLifecycle =
  | "active"
  | "active_with_notes"
  | "readiness_only"
  | "future"
  | "deprecated"
  | "cleanup_candidate"
  | "protected"
  | "blocked";

export type ExistenceNextFate =
  | "keep"
  | "improve"
  | "merge"
  | "move"
  | "archive"
  | "protect"
  | "delete_later_after_review"
  | "needs_ahmad_decision"
  | "block"
  | "black_hole";

export type ExistenceDecision =
  | "allowed"
  | "allowed_with_notes"
  | "needs_classification"
  | "needs_evidence"
  | "needs_boundary"
  | "needs_ahmad"
  | "move_to_jar"
  | "move_to_inbox"
  | "block"
  | "black_hole";

export type ExistenceEntity = {
  id: string;
  name: string;
  path: string;
  type: ExistenceEntityType;
  owner: ExistenceOwnershipLayer;
  purpose: ExistencePurpose;
  visibility: ExistenceVisibility;
  boundary: ExistenceBoundary;
  risk: ExistenceRisk;
  evidence: ExistenceEvidence;
  lifecycle: ExistenceLifecycle;
  nextFate: ExistenceNextFate;
  requiresAhmad: boolean;
  notes: string[];
};

export type ExistenceQuestionAnswer = {
  question: string;
  answer: string;
  answered: boolean;
};

export type ExistenceReview = {
  entityId: string;
  answers: ExistenceQuestionAnswer[];
  missingAnswers: string[];
  decision: ExistenceDecision;
  jarId: JarId;
  reason: string;
};

export type ExistenceGateResult = {
  entityId: string;
  allowed: boolean;
  decision: ExistenceDecision;
  reasons: string[];
  jarId: JarId;
};

export type ExistenceReport = {
  title: string;
  status: "ready" | "ready_with_notes" | "blocked";
  summary: string;
  entities: ExistenceEntity[];
  unknowns: ExistenceEntity[];
  blockers: ExistenceEntity[];
  cleanupCandidates: ExistenceEntity[];
  protectedEntities: ExistenceEntity[];
};

export type ExistenceSnapshot = {
  checkedAt: string;
  status: "active_with_notes";
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExecution: true;
  noPublicExposure: true;
  totalEntitiesReviewed: number;
  unknownEntities: ExistenceEntity[];
  blockedEntities: ExistenceEntity[];
  cleanupCandidates: ExistenceEntity[];
  protectedEntities: ExistenceEntity[];
  jarMappedItems: ExistenceReview[];
  routeHealth: "canonical_with_compatibility";
  apiBoundaryHealth: "founder_private_read_only_with_notes";
  componentHealth: "connected_with_cleanup_candidates";
  cssHealth: "owned_with_cleanup_candidates";
  oneNextStructuralAction: string;
  whatNotToDo: string[];
  desktopEntities: ExistenceEntity[];
  codebaseEntities: ExistenceEntity[];
  routeEntities: ExistenceEntity[];
  apiEntities: ExistenceEntity[];
  componentEntities: ExistenceEntity[];
  cssEntities: ExistenceEntity[];
  reviews: ExistenceReview[];
  gates: ExistenceGateResult[];
};
