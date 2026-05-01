export type AlKawnCommandVerdict =
  | "execute_internal_now"
  | "prepare_internal_report"
  | "requires_ahmad_money_decision"
  | "requires_ahmad_external_decision"
  | "requires_ahmad_legal_decision"
  | "blocked_product_truth"
  | "blocked_secret_exposure"
  | "needs_clarification"
  | "unsupported_yet";

export type AlKawnCommandIntentId =
  | "capability_summary"
  | "explain_current_screen"
  | "internal_health_check"
  | "organize_daily_work"
  | "safe_internal_cycle"
  | "show_next_action"
  | "show_product_truth"
  | "show_local_day_one"
  | "money"
  | "legal"
  | "external"
  | "secret_exposure"
  | "product_truth_violation"
  | "unknown";

export type AlKawnCommandIntentExample = {
  id: AlKawnCommandIntentId;
  label: string;
  description: string;
  verdict: AlKawnCommandVerdict;
  quickAction: boolean;
  matchPhrases: string[];
};

export type AlKawnCommandClassification = {
  commandText: string;
  normalizedCommand: string;
  intentId: AlKawnCommandIntentId;
  intentLabel: string;
  verdict: AlKawnCommandVerdict;
  reason: string;
  layer: string;
  risk: "none" | "money" | "legal" | "external" | "product_truth" | "secret";
  supported: boolean;
  matchedPhrases: string[];
};

export type AlKawnCommandEvidence = {
  id: string;
  label: string;
  detail: string;
};

export type AlKawnCommandExecutionResult = {
  commandText: string;
  classification: AlKawnCommandClassification;
  executed: boolean;
  executionMode: "local_deterministic" | "stopped_for_ahmad" | "blocked" | "not_supported";
  title: string;
  responseLines: string[];
  evidence: AlKawnCommandEvidence[];
  reportPath: string;
  reportWriteStatus: "static_report_available" | "in_memory_only" | "not_written";
  nextAction: string;
};

export type AlKawnCommandExecutionReport = {
  id: string;
  title: string;
  commandText: string;
  verdict: AlKawnCommandVerdict;
  summary: string;
  evidence: AlKawnCommandEvidence[];
  reportPath: string;
  wroteRuntimeFile: boolean;
  productTruth: string;
  localDayOne: "ready_not_started";
};

export type AlKawnCommandExecutionState = {
  id: "al_kawn_command_first_real_execution_mvp";
  status: "active_internal_mvp";
  supportedCommandCount: number;
  supportedCommands: AlKawnCommandIntentExample[];
  visibleTruth: string[];
  reportPath: string;
  nextAction: string;
};
