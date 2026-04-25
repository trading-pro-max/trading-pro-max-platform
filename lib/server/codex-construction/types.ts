import "server-only";

import type { ConstructionAutonomyLevel } from "@/lib/server/planet-consciousness";
import type {
  PlanetConstructionEvent,
  PlanetConstructionReview,
  PlanetConstructionRiskLevel,
} from "@/lib/server/planet-events";

export type CodexConstructionTaskType =
  | "visual_polish"
  | "interface_cleanup"
  | "assistant_behavior"
  | "journal_coach"
  | "plan_copy"
  | "diagnostics_readiness"
  | "founder_command"
  | "docs_update"
  | "test_update"
  | "safety_rule_update"
  | "media_readiness"
  | "blocked_launch_request"
  | "blocked_billing_request"
  | "blocked_live_request";

export type CodexTaskDraft = {
  taskId: string;
  title: string;
  taskType: CodexConstructionTaskType;
  mission: string;
  objective: string;
  currentBaseline: string;
  scope: string[];
  likelyFiles: string[];
  forbiddenScope: string[];
  productTruthRequirements: string[];
  publicLanguageRules: string[];
  safetyRules: string[];
  guardianLegalRequirements: string[];
  founderApprovalRequired: boolean;
  acceptanceCriteria: string[];
  validationCommands: string[];
  screenshotRequirements: string[];
  finalResponseFormat: string[];
  rollbackCleanupRule: string;
  expectedCommitMessage: string;
  autonomyLevel: ConstructionAutonomyLevel;
  requiredReviews: PlanetConstructionReview[];
  prompt: string;
  executionTruth: "draft_only_not_sent_not_executed";
};

export type ConstructionQueueStatus =
  | "proposed"
  | "drafted"
  | "waiting_review"
  | "waiting_founder"
  | "approved_for_codex"
  | "sent_to_codex_later"
  | "running_external"
  | "validation_pending"
  | "passed"
  | "failed"
  | "blocked"
  | "archived";

export type ConstructionQueueItem = {
  taskId: string;
  title: string;
  sourceEvent: PlanetConstructionEvent;
  ownerMinistry: string;
  taskType: CodexConstructionTaskType;
  riskLevel: PlanetConstructionRiskLevel;
  autonomyLevel: ConstructionAutonomyLevel;
  status: ConstructionQueueStatus;
  draftPrompt: string;
  requiredReviews: PlanetConstructionReview[];
  founderApprovalRequired: boolean;
  blockedReason: string | null;
  validationPlan: string[];
  expectedArtifacts: string[];
  createdAt: string;
  updatedAt: string;
};

export type ValidationClassification =
  | "passed"
  | "partial"
  | "failed"
  | "dirty_repo"
  | "lint_failed"
  | "build_failed"
  | "tests_failed"
  | "smoke_failed"
  | "visual_proof_missing"
  | "screenshot_missing"
  | "product_truth_violation"
  | "public_language_leak"
  | "internal_scope_leak"
  | "secrets_risk"
  | "fake_activation_risk"
  | "needs_cleanup"
  | "ready_to_accept";

export type ValidationInterpretation = {
  checkedAt: string;
  status: ValidationClassification;
  commandsRun: string[];
  changedFiles: string[];
  commitHash: string | null;
  pushed: boolean;
  clean: boolean;
  blockers: string[];
  recommendedNextAction: string;
};

export type ConstructionQueueSnapshot = {
  checkedAt: string;
  mode: "codex_construction_queue_readiness";
  items: ConstructionQueueItem[];
  summary: {
    total: number;
    blocked: number;
    waitingReview: number;
    waitingFounder: number;
    drafted: number;
    externalExecutionActive: false;
  };
  truth: {
    noAutomaticExternalSending: true;
    noUncontrolledExecution: true;
    blockedItemsStayBlocked: true;
  };
};
