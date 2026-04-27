export type RealityProductionSignalType =
  | "founder_command"
  | "product_gap"
  | "visual_feedback"
  | "test_result"
  | "public_risk"
  | "local_builder_task";

export type RealityProductionDecision =
  | "right_to_exist"
  | "right_to_build"
  | "right_to_appear"
  | "needs_evidence"
  | "needs_ahmad"
  | "blocked";

export type RealityProductionSignal = {
  signalId: string;
  type: RealityProductionSignalType;
  title: string;
  meaning: string;
  publicVisible: boolean;
  sensitive: boolean;
};

export type RealityProductionGate = {
  gateId: string;
  label: string;
  passed: boolean;
  decision: RealityProductionDecision;
  reason: string;
};

export type RealityProductionBuilder = {
  builderId: "alkon" | "codex" | "ahmad" | "reality";
  role: string;
  leader: boolean;
  allowedWork: string[];
  forbiddenWork: string[];
};

export type RealityProductionPassport = {
  passportId: string;
  mission: string;
  owner: "Alkon";
  builder: "Codex";
  evidenceRequired: string[];
  forbiddenScope: string[];
  valid: boolean;
};

export type RealityProductionEvidenceChain = {
  evidenceId: string;
  required: string[];
  present: string[];
  missing: string[];
  canClose: boolean;
};

export type RealityProductionTribunalResult = {
  tribunalId: string;
  decision: "accepted_with_notes" | "needs_fix" | "blocked";
  realityJudgment: string;
  memoryRequired: boolean;
};

export type RealityProductionSnapshot = {
  checkedAt: string;
  mode: "alkon_reality_production";
  status: "ready_with_notes";
  visibility: "private_founder_only";
  founderOnly: true;
  readOnly: true;
  publicExposure: false;
  codexIsBuilderNotLeader: true;
  signals: RealityProductionSignal[];
  gates: RealityProductionGate[];
  builders: RealityProductionBuilder[];
  selectedBuilder: RealityProductionBuilder;
  passport: RealityProductionPassport;
  evidence: RealityProductionEvidenceChain;
  tribunal: RealityProductionTribunalResult;
  memory: string[];
  nextFate: "ahmad_visual_review";
  productTruth: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedInactive: true;
    billingInactive: true;
    publicLaunchInactive: true;
    noPublicAlkonExposure: true;
    noShellExecutionFromWebApp: true;
    noCodexExecutionFromWebApp: true;
    noSecretsExposed: true;
  };
};

