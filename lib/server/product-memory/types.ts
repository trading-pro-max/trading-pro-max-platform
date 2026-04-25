import "server-only";

export type ProductMemoryDomain =
  | "founder_acceptance"
  | "visual_feedback"
  | "local_day_report"
  | "journal_note"
  | "coach_note"
  | "decision_replay_note"
  | "build_decision"
  | "codex_task_outcome"
  | "validation_summary"
  | "product_gap"
  | "plan_readiness_note"
  | "assistant_learning_note";

export type ProductMemoryStatus =
  | "draft"
  | "accepted"
  | "needs_polish"
  | "confusing"
  | "too_much"
  | "missing"
  | "blocked_by_design"
  | "future"
  | "resolved"
  | "archived";

export type ProductMemorySensitivity =
  | "public_safe"
  | "internal"
  | "founder_only"
  | "sensitive_do_not_store"
  | "secret_forbidden";

export type ProductMemoryVisibility =
  | "user_visible"
  | "internal_readiness"
  | "founder_only"
  | "hidden";

export type ProductMemoryTruthImpact =
  | "none"
  | "preserves_truth"
  | "requires_review"
  | "blocked_if_claimed";

export type ProductMemoryFounderDecisionImpact =
  | "none"
  | "review_later"
  | "decision_needed"
  | "acceptance_required"
  | "blocked";

export type ProductMemoryItem = {
  id: string;
  domain: ProductMemoryDomain;
  title: string;
  summary: string;
  status: ProductMemoryStatus;
  tags: string[];
  source: string;
  relatedArea: string;
  sensitivity: ProductMemorySensitivity;
  visibility: ProductMemoryVisibility;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  productTruthImpact: ProductMemoryTruthImpact;
  founderDecisionImpact: ProductMemoryFounderDecisionImpact;
  safeToPersist: boolean;
  redactionRequired: boolean;
};

export type ProductMemoryDraftInput = Omit<
  ProductMemoryItem,
  "id" | "createdAt" | "updatedAt" | "safeToPersist" | "redactionRequired"
> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ProductMemoryStoreResult =
  | {
      ok: true;
      item: ProductMemoryItem;
      rejectedReason: null;
    }
  | {
      ok: false;
      item: null;
      rejectedReason: string;
    };

export type ProductMemoryDomainSummary = {
  domain: ProductMemoryDomain;
  total: number;
  safeToPersist: number;
  founderOnly: number;
  redactionRequired: number;
  open: number;
};

export type ProductMemorySafetyPolicy = {
  allowedStorage: string[];
  forbiddenStorage: string[];
  defaultStorageMode: "local_internal_readiness_only";
  productionStorageActive: false;
  externalSyncActive: false;
  surveillanceAllowed: false;
  secretPersistenceAllowed: false;
  rawSensitiveUserDataAllowed: false;
  fakeMetricsAllowed: false;
};

export type ProductMemoryStoreSnapshot = {
  checkedAt: string;
  mode: "persistent_product_memory_foundation";
  storage: {
    persistence: "deterministic_local_readiness_model";
    databaseMigrationCreated: false;
    productionStorageActive: false;
    externalSyncActive: false;
    persistenceGap: string;
  };
  policy: ProductMemorySafetyPolicy;
  items: ProductMemoryItem[];
  domainSummary: ProductMemoryDomainSummary[];
  rejectedExamples: Array<{
    sensitivity: ProductMemorySensitivity;
    rejected: true;
    reason: string;
  }>;
  founderSummary: {
    recentAcceptanceDecisions: ProductMemoryItem[];
    openProductGaps: ProductMemoryItem[];
    recentValidationSummaries: ProductMemoryItem[];
    buildDecisions: ProductMemoryItem[];
    localDayReports: ProductMemoryItem[];
    journalCoachReadiness: string;
    memorySafetyStatus: "safe_readiness_only";
    forbiddenStorageReminders: string[];
  };
  truth: {
    secretsStored: false;
    privateSensitiveDataStored: false;
    rawUserTrackingEnabled: false;
    fakeUsersStored: false;
    fakeRevenueStored: false;
    fakeMetricsStored: false;
    productionStorageActive: false;
    automaticExternalSync: false;
    launchAutomation: false;
  };
};

export type FounderAcceptanceMemoryCategory =
  | "public_entry"
  | "workstation"
  | "chart"
  | "execution"
  | "tpm_assistant"
  | "journal_coach"
  | "settings"
  | "diagnostics"
  | "plan_clarity"
  | "visual_identity"
  | "swiss_precision"
  | "local_operation"
  | "product_truth"
  | "overall_satisfaction";

export type ProductGapCategory =
  | "visual"
  | "ux"
  | "chart"
  | "execution"
  | "assistant"
  | "journal_coach"
  | "plan_clarity"
  | "settings"
  | "diagnostics"
  | "founder_command"
  | "community"
  | "media"
  | "academy"
  | "desktop_mobile"
  | "launch_forbidden";

export type ProductGapMemory = {
  id: string;
  category: ProductGapCategory;
  gap: string;
  severity: "low" | "medium" | "high" | "blocker";
  founderFeedback: string;
  affectedSurface: string;
  suggestedFix: string;
  ownerMinistry: string;
  status: ProductMemoryStatus;
  nextAction: string;
};

export type ValidationMemoryCommandStatus = {
  command: string;
  status: "pass" | "fail" | "not_run";
};
