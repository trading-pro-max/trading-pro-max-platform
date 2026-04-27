export type AlkonChatIntentType =
  | "ask_status"
  | "ask_zero_truth"
  | "ask_one_next_action"
  | "ask_wake_report"
  | "ask_kernel_status"
  | "ask_reality_trial"
  | "ask_evidence"
  | "ask_memory"
  | "ask_device_status"
  | "ask_local_day_one"
  | "ask_what_not_to_do"
  | "prepare_command_passport"
  | "classify_idea"
  | "visual_review_guidance"
  | "focused_correction_request"
  | "founder_decision_request"
  | "unsafe_execution_request"
  | "unknown";

export type AlkonChatDecision =
  | "answer"
  | "answer_with_warning"
  | "prepare_passport_preview"
  | "request_ahmad_decision"
  | "refuse_unsafe"
  | "return_to_heart"
  | "ask_for_focus"
  | "no_action";

export type AlkonChatLanguage = "ar" | "en" | "mixed";

export type AlkonChatMessage = {
  id: string;
  role: "founder" | "alkon" | "system";
  content: string;
  createdAt: string;
  language?: AlkonChatLanguage;
};

export type AlkonChatSession = {
  sessionId: string;
  founder: "Ahmad";
  messages: AlkonChatMessage[];
  stateless: true;
  readOnly: true;
};

export type AlkonChatIntent = {
  type: AlkonChatIntentType;
  confidence: number;
  language: AlkonChatLanguage;
  matchedTerms: string[];
  originalMessage: string;
};

export type AlkonChatSafetyResult = {
  allowed: boolean;
  blocked: boolean;
  reason: string;
  safeAlternative: string;
  blockedActions: string[];
};

export type AlkonChatKernelReference = {
  status: string;
  statusLabel: string;
  commandCount: number;
  zeroTruth: string;
  zeroTruthLabel: string;
  realityTrial: string;
  realityTrialLabel: string;
  evidence: string;
  evidenceLabel: string;
  memory: string;
};

export type AlkonChatRealityTrialResult = {
  outcome: string;
  outcomeLabel: string;
  missing: string[];
  nextAction: string;
};

export type AlkonChatOneNextActionResult = {
  action: string;
  whyNow: string;
  founderDecisionNeeded: boolean;
};

export type AlkonChatMemoryReference = {
  memoryStatus: string;
  lessons: string[];
  persistence: "stateless_read_only";
};

export type AlkonChatDeviceSummary = {
  windows: string;
  iphone: string;
  samsung: string;
  phonesReviewOnly: true;
  blockedOnPhones: string[];
};

export type AlkonChatContext = {
  checkedAt: string;
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExecution: true;
  noShell: true;
  noCodex: true;
  noPayments: true;
  noExternalCalls: true;
  noSecrets: true;
  currentStatus: string;
  currentStatusLabel: string;
  currentHeart: string;
  blockers: string[];
  oneNextAction: AlkonChatOneNextActionResult;
  whatNotToDo: string[];
  evidenceSummary: string;
  localDayOneStatus: string;
  localDayOneStatusLabel: string;
  visualAcceptance: string;
  visualAcceptanceLabel: string;
  deviceSummary: AlkonChatDeviceSummary;
  latestWakeReportSummary: string;
  operatingMode: {
    status: string;
    statusLabel: string;
    activationDecision: string;
    activationDecisionLabel: string;
  };
  kernel: AlkonChatKernelReference;
  realityTrial: AlkonChatRealityTrialResult;
  memory: AlkonChatMemoryReference;
};

export type AlkonChatCommandPassportDraft = {
  mission: string;
  whyNow: string;
  affectedLayer: string;
  ownership: string;
  allowedScope: string[];
  forbiddenScope: string[];
  likelyFiles: string[];
  validation: string[];
  visualProof: string[];
  wakeReportFormat: string[];
  productTruthRules: string[];
  publicPrivateBoundary: string[];
  stopConditions: string[];
  previewOnly: true;
  noExecution: true;
};

export type AlkonChatResponseSection = {
  title: string;
  body: string;
  tone?: "default" | "warning" | "blocked" | "ready";
};

export type AlkonChatResponse = {
  checkedAt: string;
  intent: AlkonChatIntent;
  decision: AlkonChatDecision;
  safety: AlkonChatSafetyResult;
  response: string;
  sections: AlkonChatResponseSection[];
  oneNextAction?: AlkonChatOneNextActionResult;
  commandPassportDraft?: AlkonChatCommandPassportDraft;
  memoryReference: AlkonChatMemoryReference;
  kernelReference: AlkonChatKernelReference;
  realityTrial: AlkonChatRealityTrialResult;
  blockedActions: string[];
  context: AlkonChatContext;
};

export type AlkonChatReadiness = {
  checkedAt: string;
  status: "ready_with_notes";
  statusLabel: "Ready with notes";
  founderOnly: true;
  readOnly: true;
  previewOnly: true;
  noExecution: true;
  noShell: true;
  noCodex: true;
  noPayments: true;
  noLiveExecution: true;
  noBilling: true;
  noBrokerFeed: true;
  noRealMoney: true;
  noExternalCalls: true;
  noSecrets: true;
  publicExposure: false;
  availableIntents: AlkonChatIntentType[];
  promptChips: string[];
  currentOneNextAction: string;
  commandPassportReady: true;
};

export type AlkonSovereignCommandInterfaceSnapshot = {
  checkedAt: string;
  readiness: AlkonChatReadiness;
  context: AlkonChatContext;
  statusResponse: AlkonChatResponse;
  nextActionResponse: AlkonChatResponse;
  commandPassportResponse: AlkonChatResponse;
  unsafeRequestResponse: AlkonChatResponse;
  promptChips: string[];
};
