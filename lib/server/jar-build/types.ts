export type JarId =
  | "jar_0_black_hole"
  | "jar_1_p0_reality"
  | "jar_2_heart"
  | "jar_3_user_comfort"
  | "jar_4_public_trust"
  | "jar_5_private_alkon"
  | "jar_6_cleanup"
  | "jar_7_evidence"
  | "jar_8_future_worlds"
  | "jar_9_founder_decision";

export type JarDecision =
  | "produce_now"
  | "prepare_command"
  | "validate_only"
  | "ask_ahmad"
  | "delay"
  | "archive"
  | "block"
  | "black_hole"
  | "return_to_heart";

export type JarItemSource =
  | "founder_instruction"
  | "bug"
  | "idea"
  | "rejection"
  | "cleanup_candidate"
  | "desktop_sorting"
  | "codex_result"
  | "local_builder_result"
  | "future_world"
  | "evidence";

export type JarVisibility = "private_only";

export type JarLifecycleState =
  | "new"
  | "classified"
  | "prioritized"
  | "exit_permit_required"
  | "ready_for_command_passport"
  | "delayed"
  | "blocked"
  | "archived";

export type JarDefinition = {
  id: JarId;
  number: number;
  name: string;
  shortName: string;
  purpose: string;
  accepts: string[];
  exitRule: string;
  visibility: JarVisibility;
};

export type JarBuildItem = {
  id: string;
  title: string;
  source: JarItemSource;
  summary: string;
  jarId: JarId;
  decision: JarDecision;
  priority: number;
  sensitivity: "normal" | "sensitive" | "dangerous";
  lifecycle: JarLifecycleState;
  publicExposureAllowed: false;
  reason: string;
  blockedActions: string[];
  evidenceRequired: string[];
  exitPermitRequired: true;
  commandPassportRequired: boolean;
  nextAction: string;
};

export type JarRealityTrialResult = {
  itemId: string;
  passed: boolean;
  verdict: "safe_to_prepare" | "needs_ahmad" | "blocked" | "delay";
  reasons: string[];
  missingEvidence: string[];
};

export type JarExitPermit = {
  itemId: string;
  jarId: JarId;
  decision: JarDecision;
  status: "approved_for_preview" | "needs_ahmad_decision" | "blocked" | "delayed";
  exitPermitRequired: true;
  commandPassportAllowed: boolean;
  requiresAhmadDecision: boolean;
  reason: string;
  validationRequired: string[];
  stopConditions: string[];
};

export type JarCommandPassportPreview = {
  itemId: string;
  status: "preview_ready" | "blocked_until_exit_permit";
  mission: string;
  ownershipLayer: string;
  allowedScope: string[];
  forbiddenScope: string[];
  validation: string[];
  evidence: string[];
  stopConditions: string[];
  previewOnly: true;
  noExecution: true;
};

export type JarOneNextAction = {
  itemId: string;
  title: string;
  jarId: JarId;
  action: string;
  whyNow: string;
  decision: JarDecision;
};

export type JarBuildSnapshot = {
  checkedAt: string;
  status: "active_with_notes";
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExecution: true;
  noPublicExposure: true;
  registry: JarDefinition[];
  inbox: JarBuildItem[];
  counts: Record<JarId, number>;
  priorities: JarBuildItem[];
  oneNextAction: JarOneNextAction;
  exitPermits: JarExitPermit[];
  commandPassportPreview: JarCommandPassportPreview;
  memory: {
    persistence: "report_only";
    latestLesson: string;
    returnsToZeroTruth: true;
    publicSensitiveDataStored: false;
  };
};
