export type RealityConversionSource =
  | "founder_instruction"
  | "idea"
  | "bug"
  | "visual_rejection"
  | "desktop_issue"
  | "codex_result"
  | "future_world"
  | "user_reality_signal";

export type RealityConversionLayer =
  | "private_alkon_minus_zero"
  | "public_pro_max"
  | "invisible_operating_layer"
  | "tools_builder"
  | "tests_evidence"
  | "docs_reports"
  | "public_assets";

export type RealityConversionRisk =
  | "low"
  | "medium"
  | "high"
  | "blocked_until_ahmad";

export type RealityConversionStatus =
  | "passport_ready"
  | "evidence_required"
  | "ahmad_decision_required"
  | "blocked";

export type RealityConversionNextFate =
  | "prepare_command_passport"
  | "collect_evidence"
  | "ask_ahmad"
  | "delay"
  | "block"
  | "return_to_zero_truth";

export type RealityConversionPassport = {
  id: string;
  title: string;
  purpose: string;
  owner: "Ahmad";
  source: RealityConversionSource;
  layer: RealityConversionLayer;
  risk: RealityConversionRisk;
  status: RealityConversionStatus;
  jarId:
    | "jar_1_p0_reality"
    | "jar_2_heart"
    | "jar_3_user_comfort"
    | "jar_4_public_trust"
    | "jar_5_private_alkon"
    | "jar_7_evidence"
    | "jar_9_founder_decision";
  allowedTools: string[];
  forbiddenTools: string[];
  evidenceRequired: string[];
  firstStep: string;
  ahmadDecisionRequired: boolean;
  nextFate: RealityConversionNextFate;
  publicExposureAllowed: boolean;
  productTruth: {
    liveExecutionBlocked: true;
    realMoneyBlocked: true;
    brokerFeedInactive: true;
    billingInactive: true;
    noFakeClaims: true;
  };
};

export type RealityConversionResource = {
  id: string;
  name: string;
  role: string;
  allowed: boolean;
  boundary: string;
};

export type RealityConversionSnapshot = {
  checkedAt: string;
  status: "active_with_notes";
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExecution: true;
  noPublicExposure: true;
  passports: RealityConversionPassport[];
  resources: RealityConversionResource[];
  productTruth: RealityConversionPassport["productTruth"];
  firstRealityStep: string;
  oneNextRealityAction: string;
  blockedActions: string[];
  evidenceRequired: string[];
  returnsToZeroTruth: true;
};
