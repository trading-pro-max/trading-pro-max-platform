import "server-only";

export type LivingAutonomousIntelligenceState =
  | "observing"
  | "understanding"
  | "selecting_action"
  | "ready_to_execute_internal"
  | "executing_internal"
  | "validating"
  | "reporting"
  | "waiting_for_safe_trigger"
  | "stopped_money"
  | "stopped_legal"
  | "blocked_product_truth"
  | "blocked_secret_exposure"
  | "needs_ahmad_decision";

export type AwarenessItem = {
  id: string;
  label: string;
  layer: string;
  state: string;
  evidence: string;
};

export type ContextSource = {
  id: string;
  label: string;
  sourceType:
    | "report"
    | "doc"
    | "test"
    | "registry"
    | "control_surface"
    | "memory_snapshot"
    | "product_truth"
    | "kernel"
    | "desktop"
    | "local_auth";
  status: "available" | "ready" | "protected";
  path: string;
};

export type SelfObservation = {
  state: LivingAutonomousIntelligenceState;
  observedAtSource: "device_time_when_rendered";
  summary: string;
  observations: string[];
};

export type SelectedIntelligentAction = {
  id: string;
  title: string;
  layer: string;
  reason: string;
  risk: "low" | "medium" | "high";
  verdict: "execute_internal" | "prepare_internal_only" | "stop_for_ahmad" | "blocked";
  validationPlan: string[];
  reportPath: string;
  nextAction: string;
};

export type DecisionEngine = {
  priorities: string[];
  selectedAction: SelectedIntelligentAction;
  requiredWording: string[];
};

export type AutonomousCycleStage = {
  order: number;
  label: string;
  state: LivingAutonomousIntelligenceState;
  action: string;
  safetyRule: string;
};

export type AutonomousCycle = {
  triggerSources: string[];
  stages: AutonomousCycleStage[];
  result: "model_executed_internal_report_only";
  stopRule: "Intelligence cycle stops after report.";
};

export type IntelligenceBoundary = {
  id: string;
  label: string;
  gate: "money" | "legal" | "external" | "public" | "secret" | "product_truth";
  rule: string;
};

export type IntelligenceReport = {
  path: "reports/intelligence/al-kawn-living-autonomous-intelligence.md";
  cycleReportPath: "reports/intelligence/al-kawn-intelligence-cycle-report.md";
  selectedActionPath: "reports/intelligence/al-kawn-intelligence-selected-action.md";
  nextActionPath: "reports/intelligence/al-kawn-intelligence-next-action.md";
  triggerSource: "model_safe_trigger";
  observedState: string;
  selectedAction: string;
  validationResult: string;
  didNotDo: string[];
};

export type AlKawnLivingAutonomousIntelligence = {
  id: "al_kawn_living_autonomous_intelligence";
  title: "Al-Kawn Living Autonomous Intelligence";
  state: LivingAutonomousIntelligenceState;
  definition: string;
  requiredWording: string[];
  awareness: AwarenessItem[];
  contextSources: ContextSource[];
  selfObservation: SelfObservation;
  decisionEngine: DecisionEngine;
  selectedAction: SelectedIntelligentAction;
  autonomousCycle: AutonomousCycle;
  boundaries: IntelligenceBoundary[];
  report: IntelligenceReport;
  spokenSummary: string[];
  nextAction: string;
};
