export type EntityType =
  | "public_page"
  | "private_page"
  | "route"
  | "api"
  | "component"
  | "feature"
  | "plan_realm"
  | "assistant_intent"
  | "journal_coach_surface"
  | "market_surface"
  | "support_surface"
  | "academy_surface"
  | "community_surface"
  | "alkon_subsystem"
  | "codex_task"
  | "worker"
  | "satellite"
  | "station"
  | "risk"
  | "memory_lesson"
  | "test"
  | "launch_gate"
  | "environment_state"
  | "visual_identity";

export type EntityWorld =
  | "public_earth"
  | "private_alkon"
  | "invisible_operating_layer";

export type EntityVisibility =
  | "public_user"
  | "authenticated_user"
  | "internal_readiness"
  | "founder_private"
  | "hidden";

export type EntityLifecycle =
  | "idea"
  | "planned"
  | "drafted"
  | "built"
  | "tested"
  | "accepted"
  | "monitored"
  | "improved"
  | "deprecated"
  | "removed"
  | "archived";

export type EntityValueDimension =
  | "user_value"
  | "founder_value"
  | "safety_value"
  | "trust_value"
  | "learning_value"
  | "business_value"
  | "technical_value"
  | "operational_value";

export type EntityRiskLevel =
  | "safe"
  | "review_required"
  | "founder_approval_required"
  | "blocked"
  | "black_hole";

export type EntityStatus =
  | "active"
  | "partial"
  | "planned"
  | "future"
  | "blocked"
  | "internal_only"
  | "deprecated"
  | "archived"
  | "missing_owner"
  | "missing_validation"
  | "missing_memory_rule"
  | "orphaned";

export type EntityValidationMethod =
  | "typescript"
  | "eslint"
  | "build"
  | "regression_test"
  | "smoke_route"
  | "screenshot_proof"
  | "product_truth_check"
  | "public_private_leak_check"
  | "api_safety_check"
  | "visual_acceptance"
  | "founder_review"
  | "security_review"
  | "launch_gate";

export type EntityValueScore = Record<EntityValueDimension, number>;

export type EntityValidation = {
  methods: EntityValidationMethod[];
  evidence: string[];
  productTruthCheck: boolean;
  publicPrivateLeakCheck: boolean;
};

export type AlkonEntity = {
  entityId: string;
  name: string;
  type: EntityType;
  visibility: EntityVisibility;
  world: EntityWorld;
  purpose: string;
  serves: string[];
  ownerArea: string;
  ownerWorker: string;
  relatedSystems: string[];
  dependencies: string[];
  outputs: string[];
  boundaries: string[];
  lifecycle: EntityLifecycle;
  valueScore: EntityValueScore;
  riskLevel: EntityRiskLevel;
  validation: EntityValidation;
  reportTarget: string;
  memoryRule: string;
  deprecationRule: string;
  removalRule: string;
  publicVisible: boolean;
  founderVisible: boolean;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
};

export type EntityMeaningStatus =
  | "meaningful"
  | "partial_meaning"
  | "redundant"
  | "unclear"
  | "orphaned"
  | "should_deprecate"
  | "should_remove";

export type EntityMeaningResolution = {
  entityId: string;
  meaningStatus: EntityMeaningStatus;
  reasonToExist: string;
  valueSummary: string;
  removalImpact: string;
  recommendedAction: "keep" | "improve" | "review" | "deprecate" | "remove";
  missingFields: string[];
};

export type EntityRelationshipNode = {
  entityId: string;
  dependencies: string[];
  dependents: string[];
  owner: string;
  reportsTo: string;
  memoryRule: string;
  validationMethods: EntityValidationMethod[];
  riskLevel: EntityRiskLevel;
  boundary: EntityWorld;
};

export type EntityRelationshipGraph = {
  nodes: EntityRelationshipNode[];
  orphanedEntities: string[];
  circularRisks: string[];
  missingDependencies: string[];
  publicPrivateBoundaryRisks: string[];
  ownerlessEntities: string[];
  untestedEntities: string[];
  memorylessEntities: string[];
};

export type EntityLifecycleDecision = {
  entityId: string;
  from: EntityLifecycle;
  to: EntityLifecycle;
  allowed: boolean;
  reason: string;
};

export type EntityValueRiskReport = {
  entityId: string;
  valueSummary: {
    averageValue: number;
    strongestDimensions: EntityValueDimension[];
    weakestDimensions: EntityValueDimension[];
  };
  riskSummary: {
    publicLeakRisk: number;
    secretRisk: number;
    fakeClaimRisk: number;
    authSecurityRisk: number;
    visualClutterRisk: number;
    productTruthRisk: number;
    launchActivationRisk: number;
    maintenanceComplexity: number;
  };
  recommendedAction: "keep" | "improve" | "review" | "quarantine" | "block";
  priority: "P0" | "P1" | "P2" | "P3";
};

export type EntityValidationReport = {
  entityId: string;
  status: "valid" | "missing_validation";
  requiredMethods: EntityValidationMethod[];
  missingMethods: EntityValidationMethod[];
  reason: string;
};

export type EntityMemoryReport = {
  entityId: string;
  status: "memory_ready" | "missing_memory";
  appliedRules: string[];
  repeatedMistakesPrevented: string[];
  founderPreferences: string[];
  futureRules: string[];
};

export type EntityDeprecationReport = {
  entityId: string;
  shouldDeprecate: boolean;
  canRemove: boolean;
  protectedCore: boolean;
  reason: string;
  requiredMigration: string[];
};

export type OntologyCompletenessStatus =
  | "complete"
  | "partial"
  | "blocked"
  | "missing_owner"
  | "missing_validation"
  | "missing_memory"
  | "orphaned"
  | "needs_cleanup";

export type OntologyCompletenessReport = {
  entityId: string;
  status: OntologyCompletenessStatus;
  missingFields: string[];
  cleanupPriority: "P0" | "P1" | "P2" | "none";
  recommendedAction: string;
};

export type AlkonOntologySnapshot = {
  snapshotId: "alkon_ontology_existence_system";
  name: "Alkon Ontology & Existence System";
  visibility: "private_founder_only";
  publicExposure: false;
  ontologyStatus: "ready";
  entityCount: number;
  publicEntityCount: number;
  privateEntityCount: number;
  invisibleEntityCount: number;
  completeEntities: number;
  partialEntities: number;
  orphanedEntities: string[];
  deprecatedCandidates: string[];
  cleanupPriorities: {
    P0: string[];
    P1: string[];
    P2: string[];
  };
  highestRisks: string[];
  nextSafeActions: string[];
  founderReviewNeeded: string[];
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
  };
  registry: AlkonEntity[];
  meanings: EntityMeaningResolution[];
  relationshipGraph: EntityRelationshipGraph;
  completeness: OntologyCompletenessReport[];
  valueRiskReports: EntityValueRiskReport[];
  validationReports: EntityValidationReport[];
  memoryReports: EntityMemoryReport[];
  deprecationReports: EntityDeprecationReport[];
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    socialPublishingInactive: true;
    productionSecretsUntouched: true;
    noShellExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
    noSecretsExposed: true;
    noFakeClaims: true;
  };
  createdAt: string;
};
