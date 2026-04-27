export type SelfCorrectionSignalType =
  | "visual_blocker"
  | "route_blocker"
  | "public_private_leak"
  | "product_truth_risk"
  | "failed_tests"
  | "dirty_git"
  | "missing_wake_report"
  | "codex_dependency_risk"
  | "local_day_one_blocker"
  | "heart_drift";

export type SelfCorrectionSeverity = "P0" | "P1" | "P2" | "P3";

export type SelfCorrectionSignal = {
  signalId: string;
  type: SelfCorrectionSignalType;
  severity: SelfCorrectionSeverity;
  detected: boolean;
  summary: string;
  correction: string;
};

export type SelfCorrectionPassport = {
  passportId: string;
  valid: boolean;
  mission: string;
  allowedScope: string[];
  forbiddenScope: string[];
  validationRequired: string[];
};

export type SelfCorrectionEvidenceChain = {
  evidenceId: string;
  required: string[];
  present: string[];
  missing: string[];
};

export type SelfCorrectionSnapshot = {
  checkedAt: string;
  mode: "alkon_self_correction";
  status: "ready_with_notes";
  visibility: "private_founder_only";
  founderOnly: true;
  readOnly: true;
  publicExposure: false;
  signals: SelfCorrectionSignal[];
  priorityOrder: SelfCorrectionSignalType[];
  returnToHeart: string;
  passport: SelfCorrectionPassport;
  evidence: SelfCorrectionEvidenceChain;
  memory: string[];
  dailyLoop: string[];
  nextAction: string;
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

