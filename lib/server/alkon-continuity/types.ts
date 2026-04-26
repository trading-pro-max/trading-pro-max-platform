export type AlkonContinuityEntityCategory =
  | "public_page"
  | "private_page"
  | "route"
  | "api"
  | "component"
  | "feature"
  | "visual_identity"
  | "assistant_intent"
  | "plan_realm"
  | "environment_state"
  | "market_surface"
  | "journal_coach_surface"
  | "support_surface"
  | "academy_surface"
  | "community_surface"
  | "app_platform_surface"
  | "alkon_subsystem"
  | "security_system"
  | "treasury_system"
  | "media_system"
  | "launch_gate"
  | "codex_task"
  | "worker"
  | "memory_lesson"
  | "test"
  | "cleanup_candidate";

export type AlkonContinuityWorld =
  | "public_earth"
  | "private_alkon"
  | "invisible_operating_layer";

export type AlkonContinuityLifecycleState =
  | "idea"
  | "proposed"
  | "reviewed"
  | "approved_for_draft"
  | "drafted"
  | "built"
  | "validated"
  | "accepted"
  | "monitored"
  | "improved"
  | "deprecated"
  | "archived"
  | "removed"
  | "blocked"
  | "black_holed";

export type AlkonContinuityDecision =
  | "allow_birth"
  | "review_required"
  | "founder_approval_required"
  | "delay_until_ready"
  | "block_birth"
  | "black_hole"
  | "monitor"
  | "improve"
  | "deprecate"
  | "archive"
  | "remove";

export type AlkonContinuityRiskLevel =
  | "safe"
  | "review_required"
  | "founder_approval_required"
  | "blocked"
  | "black_hole";

export type AlkonBirthSource =
  | "founder_idea"
  | "product_gap"
  | "visual_rejection"
  | "build_failure"
  | "validation_result"
  | "user_confusion"
  | "support_gap"
  | "security_risk"
  | "media_need"
  | "treasury_need"
  | "launch_readiness_need"
  | "cleanup_candidate"
  | "assistant_intent"
  | "public_page_requirement"
  | "alkon_subsystem_requirement";

export type AlkonEntityBirthRequest = {
  source: AlkonBirthSource;
  text: string;
  requestedBy: "founder" | "system" | "review" | "test";
  categoryHint?: AlkonContinuityEntityCategory;
  worldHint?: AlkonContinuityWorld;
  surface?: string;
  publicVisible?: boolean;
  requiresSecrets?: boolean;
  requestsImageGeneration?: boolean;
  explicitImageApproval?: boolean;
  requestsDeletion?: boolean;
  dependentsMigrated?: boolean;
  founderApproval?: boolean;
  hasDependencyMap?: boolean;
  currentStage?: "laptop_planet" | "waitlist" | "beta" | "soft_launch" | "production";
};

export type AlkonEntityBirthCandidate = {
  candidateId: string;
  proposedName: string;
  category: AlkonContinuityEntityCategory;
  world: AlkonContinuityWorld;
  source: AlkonBirthSource;
  reasonProposed: string;
  serves: string[];
  timing: "now" | "later" | "future" | "blocked";
  publicVisible: boolean;
  memoryApplied: string[];
  sensitiveFlags: string[];
};

export type AlkonEntityIdentity = {
  entityId: string;
  name: string;
  category: AlkonContinuityEntityCategory;
  world: AlkonContinuityWorld;
  owner: string;
  surface: string;
  status: "identified" | "anonymous_rejected" | "needs_owner";
  visibility: "public_user" | "authenticated_user" | "founder_private" | "internal_readiness" | "hidden";
  risk: AlkonContinuityRiskLevel;
  lifecycleState: AlkonContinuityLifecycleState;
  reportTarget: string;
  publicVisible: boolean;
  founderVisible: boolean;
};

export type AlkonEntityLawOutcome =
  | "allow"
  | "review_required"
  | "founder_approval_required"
  | "delayed_until_ready"
  | "blocked"
  | "black_holed";

export type AlkonEntityLawReview = {
  entityId: string;
  outcome: AlkonEntityLawOutcome;
  reasons: string[];
  requiredReviews: string[];
  safeAlternative: string;
  productTruthPreserved: boolean;
  publicPrivateBoundaryPreserved: boolean;
};

export type AlkonEntityFunction = {
  entityId: string;
  functionStatus: "clear" | "review_required" | "deprecate_or_block";
  categories: Array<
    | "explain"
    | "guide"
    | "protect"
    | "build"
    | "validate"
    | "report"
    | "learn"
    | "support"
    | "improve_trust"
    | "reduce_risk"
    | "reduce_clutter"
    | "prepare_launch"
    | "preserve_memory"
    | "route_intent"
    | "guard_truth"
  >;
  summary: string;
  value: {
    user: number;
    founder: number;
    safety: number;
    trust: number;
    business: number;
    technical: number;
  };
  expectedOutput: string;
};

export type AlkonEntityIntegration = {
  entityId: string;
  completeness: "complete" | "partial" | "blocked";
  ownerSystem: string;
  connectedSystems: string[];
  dependencies: string[];
  dependentSystems: string[];
  tests: string[];
  docsRequired: boolean;
  missingDependencies: string[];
  orphanedRisk: boolean;
  circularRisk: boolean;
  publicPrivateRisk: boolean;
};

export type AlkonEntityProof = {
  entityId: string;
  status: "proven" | "missing_validation" | "review_required";
  proofTypes: Array<
    | "typescript"
    | "eslint"
    | "build"
    | "regression"
    | "smoke_route"
    | "screenshot"
    | "public_leak_check"
    | "product_truth_check"
    | "security_check"
    | "api_safety_check"
    | "visual_acceptance"
    | "founder_review"
    | "legal_guardian_review"
    | "treasury_review"
    | "rollback_proof"
  >;
  missingProof: string[];
  cannotBeAccepted: boolean;
};

export type AlkonEntityLifeState = {
  entityId: string;
  health: "healthy" | "needs_improvement" | "stale" | "duplicated" | "risky" | "cleanup_candidate" | "deprecation_candidate";
  reasons: string[];
  monitoredSignals: string[];
  nextReview: string;
};

export type AlkonEntityEvolution = {
  entityId: string;
  evolutionRule: string;
  appliesTo: string[];
  requiredTest: string;
  futureGuard: string;
  founderApprovalNeeded: boolean;
};

export type AlkonEntityDeprecation = {
  entityId: string;
  shouldDeprecate: boolean;
  reason: string;
  protectedCore: boolean;
  requiredMigration: string[];
};

export type AlkonEntityRemoval = {
  entityId: string;
  canRemove: boolean;
  decision: "not_needed" | "dependency_migration_required" | "founder_approval_required" | "blocked" | "ready_to_archive";
  reason: string;
  rollbackRequired: boolean;
  memoryArchiveRequired: boolean;
};

export type AlkonEntityContinuityMemory = {
  entityId: string;
  lessonsApplied: string[];
  futureGuards: string[];
  founderPreferences: string[];
  reportTarget: string;
};

export type AlkonContinuityReport = {
  reportId: string;
  candidate: AlkonEntityBirthCandidate;
  identity: AlkonEntityIdentity;
  lawReview: AlkonEntityLawReview;
  function: AlkonEntityFunction;
  integration: AlkonEntityIntegration;
  proof: AlkonEntityProof;
  life: AlkonEntityLifeState;
  evolution: AlkonEntityEvolution;
  deprecation: AlkonEntityDeprecation;
  removal: AlkonEntityRemoval;
  memory: AlkonEntityContinuityMemory;
  decision: {
    outcome: AlkonContinuityDecision;
    risk: AlkonContinuityRiskLevel;
    reason: string;
    nextSafeAction: string;
    founderReviewNeeded: boolean;
  };
};

export type AlkonContinuitySnapshot = {
  snapshotId: "alkon_sovereign_creation_continuity_system";
  name: "Alkon Sovereign Creation & Continuity System";
  visibility: "private_founder_only";
  publicExposure: false;
  readiness: "ready";
  entityCount: number;
  birthsPending: number;
  reviewRequired: string[];
  founderApprovalRequired: string[];
  blockedBirths: string[];
  blackHoled: string[];
  monitoredEntities: string[];
  staleEntities: string[];
  cleanupCandidates: string[];
  deprecationCandidates: string[];
  removalCandidates: string[];
  evolutionRules: AlkonEntityEvolution[];
  memoryLessons: string[];
  sampleReports: AlkonContinuityReport[];
  nextSafeActions: string[];
  relatedSystems: string[];
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
  };
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionSecretsUntouched: true;
    noDeletionExecution: true;
    noShellExecutionFromWebApp: true;
    noDirectCodexExecutionFromWebApp: true;
    noSecretsExposed: true;
    noImagesOrRasterAssets: true;
    noFakeClaims: true;
  };
  createdAt: string;
};
