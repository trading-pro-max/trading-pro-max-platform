export type OperatingModeStatus =
  | "inactive"
  | "preparing"
  | "active_with_notes"
  | "active"
  | "blocked";

export type ZeroTruthStatus =
  | "clean"
  | "needs_review"
  | "has_blockers"
  | "blocked";

export type ActivationDecision =
  | "activate"
  | "activate_with_notes"
  | "delay"
  | "blocked";

export type FindingSeverity =
  | "P0_critical"
  | "P1_high"
  | "P2_standard"
  | "P3_future"
  | "blocked"
  | "black_hole";

export type OperatingEvidenceStatus =
  | "present"
  | "missing"
  | "needs_review"
  | "blocked";

export type OperatingFindingClassification =
  | "accepted"
  | "ready_with_notes"
  | "needs_visual_review"
  | "needs_fix"
  | "blocked"
  | "future";

export type ActivationGateOutcome =
  | "pass"
  | "pass_with_notes"
  | "needs_review"
  | "blocked"
  | "future";

export type DailyOperatingLoopStatus =
  | "not_started"
  | "ready"
  | "active_with_notes"
  | "active"
  | "blocked";

export type FounderDecisionRequest = {
  requestId: string;
  needed: boolean;
  requestedDecision: string;
  acceptableAnswers: string[];
  sensitiveAction: boolean;
  finalAuthority: "Ahmad";
};

export type OperatingRealityFinding = {
  findingId: string;
  area:
    | "public_pro_max_reality"
    | "private_alkon_universe"
    | "invisible_operating_layer"
    | "prime_world"
    | "trading_workspace"
    | "assistant"
    | "product_truth"
    | "visual_acceptance"
    | "header_logo_earth_identity"
    | "settings_diagnostics"
    | "apps_plans_support"
    | "tests_build_git"
    | "reports_wake_report"
    | "public_leak_status"
    | "station_1"
    | "local_day_one";
  label: string;
  classification: OperatingFindingClassification;
  severity: FindingSeverity;
  evidenceStatus: OperatingEvidenceStatus;
  summary: string;
  evidence: string[];
  risk: string | null;
  needsAhmad: boolean;
  nextAction: string;
};

export type ZeroTruthAudit = {
  checkedAt: string;
  auditId: "alkon_zero_truth_audit";
  status: ZeroTruthStatus;
  doctrine: "reality_audit_not_deletion";
  deletesProject: false;
  resetsCodebase: false;
  rebuildsFromBlank: false;
  findings: OperatingRealityFinding[];
  blockers: OperatingRealityFinding[];
  visualNotes: string[];
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionActivationBlocked: true;
    socialPublishingInactive: true;
    noFakeClaims: true;
    noSecretsExposed: true;
    noShellExecutionFromWebApp: true;
    noImagesOrRasterAssets: true;
    overall: "preserved" | "blocked";
  };
  publicPrivateBoundaryStatus: "preserved" | "blocked";
  productTruthSummary: string;
  oneNextActionCandidate: string;
  localDayOneReadiness: {
    readyToStart: boolean;
    visualAcceptanceRequired: boolean;
    status: "waiting_ahmad_visual_acceptance" | "ready" | "blocked";
  };
};

export type ActivationGate = {
  gateId:
    | "ProductTruthGate"
    | "PublicPrivateBoundaryGate"
    | "BuildValidationGate"
    | "GitCleanGate"
    | "WakeReportGate"
    | "LivingMarketCoreGate"
    | "VisualAcceptanceGate"
    | "AssistantReadinessGate"
    | "SettingsDiagnosticsGate"
    | "AlkonPrivateReadinessGate"
    | "LocalDayOneGate";
  label: string;
  outcome: ActivationGateOutcome;
  blocksActivation: boolean;
  blocksLocalDayOne: boolean;
  evidence: string;
  nextAction: string;
};

export type AlkonOneNextAction = {
  actionId:
    | "fix_p0_truth_security_build_or_public_leak"
    | "wait_for_wake_report"
    | "ask_ahmad_visual_review"
    | "create_focused_visual_correction"
    | "final_universal_closure"
    | "start_local_day_one"
    | "continue_daily_operating_loop";
  oneNextAction: string;
  whyThisNow: string;
  delayedActions: string[];
  blockedActions: string[];
  founderDecisionNeeded: boolean;
  founderDecisionRequest: FounderDecisionRequest;
};

export type AlkonDailyOperatingLoop = {
  checkedAt: string;
  dailyLoopStatus: DailyOperatingLoopStatus;
  todayFocus: string;
  loop: string[];
  oneNextAction: AlkonOneNextAction;
  driftDetected: boolean;
  driftNotes: string[];
  whatNotToDo: string[];
  founderDecisionNeeded: boolean;
};

export type InfiniteGovernedEvolutionStatus = {
  evolutionStatus: OperatingModeStatus;
  allowedGrowth: string[];
  gatedGrowth: string[];
  forbiddenGrowth: string[];
  nextSafeEvolution: string;
  productTruthPreserved: true;
  publicExposure: false;
};

export type OperatingMemoryLesson = {
  lessonId: string;
  lesson: string;
  futureGuard: string;
  requiredTest: string;
};

export type AlkonOperatingModeOptions = {
  productTruthSafe?: boolean;
  publicPrivateBoundarySafe?: boolean;
  buildValidationPassed?: boolean;
  gitClean?: boolean;
  wakeReportPresent?: boolean;
  livingMarketCoreAccepted?: boolean;
  visualAcceptance?: "pending" | "accepted" | "rejected";
  assistantReady?: boolean;
  settingsDiagnosticsReady?: boolean;
  alkonPrivateReady?: boolean;
  localDayOneStarted?: boolean;
  currentVisualCommandRunning?: boolean;
  finalUniversalClosurePassed?: boolean;
};

export type AlkonOperatingModeSnapshot = {
  checkedAt: string;
  mode: "alkon_operating_mode";
  name: "Alkon Operating Mode";
  visibility: "private_founder_only";
  publicExposure: false;
  status: OperatingModeStatus;
  activationDecision: ActivationDecision;
  founderOnly: true;
  readOnly: true;
  noExecution: true;
  zeroTruthAudit: ZeroTruthAudit;
  activationGates: ActivationGate[];
  dailyOperatingLoop: AlkonDailyOperatingLoop;
  oneNextAction: AlkonOneNextAction;
  infiniteGovernedEvolution: InfiniteGovernedEvolutionStatus;
  memoryLessons: OperatingMemoryLesson[];
  founderDecisionNeeded: boolean;
  localDayOneGate: {
    readyToStart: boolean;
    blockedUntilAhmadVisualAcceptance: boolean;
    status: "waiting_ahmad_visual_acceptance" | "ready" | "blocked";
  };
  productTruthStatus: ZeroTruthAudit["productTruthStatus"] & {
    authSecurityPreserved: true;
    noUncontrolledAutomation: true;
    noPublicAlkonOperatingModeExposure: true;
    noZeroTruthPublicExposure: true;
  };
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
    publicOperatingModeLanguageVisible: false;
  };
};
