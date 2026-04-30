import "server-only";

export type InfinityPreparationState =
  | "not_started"
  | "preparing"
  | "ready_with_notes"
  | "blocked_by_prerequisite"
  | "requires_ahmad_decision"
  | "future_gate";

export type InfinityReadinessCheck = {
  id: string;
  label: string;
  state: InfinityPreparationState;
  status: string;
  evidence: string[];
  notes: string[];
};

export type InfinityCycleStage = {
  id: string;
  order: number;
  title: string;
  action: string;
  safetyRule: string;
  output: string;
};

export type InfinityBoundary = {
  id: string;
  label: string;
  verdict: "allow_internal" | "stop_for_ahmad" | "blocked" | "future_gate";
  wording: string;
  reason: string;
};

export type InfinityAutomationItem = {
  id: string;
  title: string;
  scope: "safe_internal" | "blocked";
  reason: string;
  productTruthImpact: string;
};

export type InfinityNextAction = {
  next: "Infinity Mode controlled activation";
  reason: string;
  blockedUntil: string[];
};

export type AlKawnInfinityPreparation = {
  id: "al_kawn_infinity_preparation";
  title: "Infinity Mode preparation";
  state: InfinityPreparationState;
  summary: string;
  requiredWording: string[];
  readiness: InfinityReadinessCheck[];
  cyclePlan: InfinityCycleStage[];
  boundaries: InfinityBoundary[];
  safeAutomation: InfinityAutomationItem[];
  blockedActions: InfinityAutomationItem[];
  dailyLoopConnection: string[];
  productTruth: string[];
  kernelStatus: string;
  nextAction: InfinityNextAction;
};
