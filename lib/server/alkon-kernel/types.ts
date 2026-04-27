export type KernelCommandId =
  | "command_0_creator_runtime_oath"
  | "command_1_zero_truth"
  | "command_2_reality_ownership"
  | "command_3_reality_trial"
  | "command_4_evidence_chain"
  | "command_5_memory_law"
  | "command_6_return_to_heart"
  | "command_7_one_next_action"
  | "command_8_command_passport"
  | "command_9_builder_selection"
  | "command_10_daily_operating_loop"
  | "command_11_infinite_governed_evolution"
  | "command_12_founder_final_authority"
  | "command_13_treasury_discipline"
  | "command_14_legal_reality_gate"
  | "command_15_public_trust_gate"
  | "command_16_local_day_one_gate";

export type KernelStatus =
  | "inactive"
  | "bootstrapping"
  | "active_with_notes"
  | "active"
  | "blocked";

export type RealityLayer =
  | "private_alkon_universe"
  | "public_pro_max_reality"
  | "invisible_operating_layer";

export type KernelDecision =
  | "accept"
  | "classify"
  | "request_evidence"
  | "request_ahmad_review"
  | "return_to_heart"
  | "delay"
  | "archive"
  | "block"
  | "black_hole";

export type KernelCommandState =
  | "ready"
  | "active_with_notes"
  | "needs_review"
  | "blocked"
  | "future";

export type KernelCommandStatus = {
  commandId: KernelCommandId;
  label: string;
  status: KernelCommandState;
  decision: KernelDecision;
  privateOnly: true;
  publicExposureAllowed: false;
  summary: string;
  nextAction: string;
};

export type FounderWill = {
  projectVision: string;
  primeWorld: "Pro Max Trading";
  firstHeart: "Trading Workspace / Chart";
  operatingLaw: string;
};

export type FounderPreference = {
  preferenceId: string;
  label: string;
  value: string;
  sensitive: false;
};

export type FounderAuthorityRule = {
  ruleId: string;
  action: string;
  founderRequired: boolean;
  reason: string;
};

export type FounderPresenceRequirement = {
  requirementId: string;
  decision: string;
  required: boolean;
  cannotBeAutomated: boolean;
};

export type AhmadFounderSource = {
  name: "Ahmad";
  role: "Founder Source";
  authority: "final_sensitive_authority";
  owns: "Alkon";
  publicExposure: false;
  founderSourceStatus: "active";
  alkonOperatesUnderAhmadAuthority: true;
};

export type AhmadSovereignDigitalTwin = {
  twinId: "ahmad_sovereign_operational_twin";
  purpose: "operational_digital_twin_foundation";
  publicExposure: false;
  digitalTwinReadiness: "ready_with_notes";
  allowedMemory: string[];
  forbiddenMemory: string[];
  sensitiveDataStoredInCode: false;
  rawPersonalDataStored: false;
  founderAuthorityRequiredForSensitiveActions: true;
  futureSensitiveDataRequiresEncryptedVault: true;
};

export type CreatorRuntimeOath = {
  oathStatus: "active";
  oath: "Alkon creates. Reality judges. Evidence proves. Memory preserves. Ahmad decides.";
  privateOnly: true;
  publicExposureAllowed: false;
  noExecutionByItself: true;
  unsafeActivationBlocked: true;
  sensitiveActionRequiresAhmad: true;
};

export type ZeroTruthFinding = {
  findingId: string;
  area: string;
  layer: RealityLayer;
  status: "accepted" | "ready_with_notes" | "needs_review" | "blocked";
  summary: string;
  nextAction: string;
};

export type ZeroTruthAudit = {
  zeroTruthStatus: "needs_review" | "clean" | "blocked";
  deletesRepo: false;
  resetsProject: false;
  breaksWorkingSystems: false;
  findings: ZeroTruthFinding[];
  blockers: string[];
  oneNextActionCandidate: string;
};

export type RealityOwnershipClassification = {
  status: "classified";
  layers: Array<{
    layer: RealityLayer;
    surfaces: string[];
    publicVisible: boolean;
    rule: string;
  }>;
  mixedRealityWithoutGate: "needs_review_or_blocked";
  publicReceivesSanitizedTruthOnly: true;
};

export type RealityTrialOutcome =
  | "accepted"
  | "accepted_with_notes"
  | "needs_visual_review"
  | "needs_fix"
  | "needs_evidence"
  | "needs_founder_decision"
  | "delayed"
  | "archived"
  | "blocked"
  | "black_hole";

export type RealityTrialInput = {
  codeReality?: boolean;
  testsReality?: boolean;
  visualAcceptance?: boolean;
  humanValue?: boolean;
  productTruth?: boolean;
  safety?: boolean;
  law?: boolean;
  finance?: boolean;
  timing?: boolean;
  evidence?: boolean;
  memory?: boolean;
  founderApproval?: boolean;
};

export type RealityTrial = {
  trialId: "alkon_reality_trial";
  outcome: RealityTrialOutcome;
  realityHasVetoPower: true;
  checks: Record<keyof Required<RealityTrialInput>, boolean>;
  missing: string[];
  nextAction: string;
};

export type EvidenceChain = {
  evidenceStatus:
    | "complete"
    | "complete_with_notes"
    | "needs_proof"
    | "blocked";
  requiredEvidence: string[];
  presentEvidence: string[];
  missingEvidence: string[];
  closureAllowed: boolean;
  dirtyGitBlocksClosure: true;
  failedValidationBlocksClosure: true;
  publicLeakIsP0: true;
};

export type KernelMemoryLaw = {
  memoryStatus: "ready";
  lessons: string[];
  sensitiveDataStoredInCode: false;
  publicExposure: false;
};

export type ReturnToHeartDecision = {
  heart: string[];
  decision: KernelDecision;
  reason: string;
  nextAction: string;
};

export type OneNextActionDecision = {
  oneNextAction: string;
  whyThisNow: string;
  whatNotToDo: string[];
  founderDecisionNeeded: boolean;
};

export type CommandPassport = {
  passportStatus: "preview_ready";
  mission: string;
  whyNow: string;
  ownershipLayer: RealityLayer;
  allowedScope: string[];
  forbiddenScope: string[];
  likelyFiles: string[];
  validationRequired: string[];
  screenshotsRequired: boolean;
  productTruthConstraints: string[];
  publicPrivateBoundaries: string[];
  stopConditions: string[];
  wakeReportFormat: string[];
  nextFate: string;
  noExecution: true;
};

export type BuilderSelection = {
  selectionStatus: "ready";
  recommendedBuilder: string;
  builders: Array<{
    builder: string;
    role: string;
    leader: boolean;
    allowed: boolean;
  }>;
  codexIsBuilderNotLeader: true;
};

export type DailyOperatingLoop = {
  dailyLoopStatus: "not_started" | "ready" | "active_with_notes" | "active" | "blocked";
  steps: string[];
  privateOnly: true;
  oneNextAction: OneNextActionDecision;
};

export type InfiniteGovernedEvolution = {
  evolutionStatus: "active_with_notes" | "active" | "blocked";
  allowedEvolution: string[];
  forbiddenWithoutGates: string[];
  publicExposure: false;
};

export type FounderFinalAuthority = {
  founderDecisionRequired: boolean;
  reason: string;
  allowedWithoutFounder: string[];
  blockedUntilFounder: string[];
};

export type TreasuryDiscipline = {
  treasuryStatus: "readiness_only";
  rules: string[];
  bankCardDataInCode: false;
  paymentExecutionFromApp: false;
  ahmadApprovalRequiredForPayment: true;
};

export type LegalRealityGate = {
  legalStatus: "needs_review";
  requiredReview: string[];
  blockedReason: string;
  safeAlternative: string;
};

export type PublicTrustGate = {
  publicTrustStatus: "pass_with_notes" | "blocked";
  trustIssues: string[];
  safeFix: string;
  publicAlkonLeakBlocked: true;
};

export type LocalDayOneGate = {
  localDayOneStatus:
    | "not_ready"
    | "ready_with_notes"
    | "ready"
    | "started"
    | "blocked";
  requirements: Array<{
    requirement: string;
    passed: boolean;
  }>;
  ahmadVisualAcceptanceRequired: true;
  startsAutomatically: false;
  nextAction: string;
};

export type KernelReport = {
  reportId: "alkon_kernel_report";
  summary: string;
  blockers: string[];
  nextAction: string;
};

export type AlkonKernelSnapshot = {
  checkedAt: string;
  mode: "alkon_complete_sovereign_kernel";
  status: KernelStatus;
  visibility: "private_founder_only";
  founderOnly: true;
  readOnly: true;
  publicExposure: false;
  noExecution: true;
  founderSource: AhmadFounderSource;
  digitalTwin: AhmadSovereignDigitalTwin;
  founderWill: FounderWill;
  preferences: FounderPreference[];
  authorityRules: FounderAuthorityRule[];
  presenceRequirements: FounderPresenceRequirement[];
  creatorRuntimeOath: CreatorRuntimeOath;
  zeroTruth: ZeroTruthAudit;
  realityOwnership: RealityOwnershipClassification;
  realityTrial: RealityTrial;
  evidenceChain: EvidenceChain;
  memoryLaw: KernelMemoryLaw;
  returnToHeart: ReturnToHeartDecision;
  oneNextAction: OneNextActionDecision;
  commandPassport: CommandPassport;
  builderSelection: BuilderSelection;
  dailyOperatingLoop: DailyOperatingLoop;
  infiniteGovernedEvolution: InfiniteGovernedEvolution;
  founderFinalAuthority: FounderFinalAuthority;
  treasuryDiscipline: TreasuryDiscipline;
  legalRealityGate: LegalRealityGate;
  publicTrustGate: PublicTrustGate;
  localDayOneGate: LocalDayOneGate;
  commandStatuses: KernelCommandStatus[];
  report: KernelReport;
  publicExposureStatus: {
    publicUiVisible: false;
    publicApiRoutesExposed: false;
    publicNavigationVisible: false;
    diagnosticsLeak: false;
    kernelDoctrinePublic: false;
  };
  productTruthStatus: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedActivationBlocked: true;
    billingActivationBlocked: true;
    publicLaunchInactive: true;
    productionActivationBlocked: true;
    noShellExecutionFromWebApp: true;
    noSecretsExposed: true;
    noImagesOrRasterAssets: true;
    noPublicAlkonKernelExposure: true;
  };
};
