import "server-only";

export type OperatorPreparationState =
  | "closed_ready_for_operator_activation"
  | "blocked_prerequisite_missing";

export type OperatorActivationState =
  | "closed_operator_internal_active"
  | "blocked_prerequisite_missing";

export type OperatorActionGate =
  | "execute_directly"
  | "stop_for_legal"
  | "stop_for_money"
  | "blocked_product_truth"
  | "blocked_security";

export type OperatorReadinessCheck = {
  id: string;
  label: string;
  state: OperatorPreparationState;
  status: string;
  evidence: string[];
};

export type OperatorPermission = {
  id: string;
  label: string;
  gate: OperatorActionGate;
  meaning: string;
  examples: string[];
};

export type OperatorWorkItem = {
  id: string;
  title: string;
  source: "daily_work_loop" | "infinity" | "kernel" | "product_truth";
  gate: OperatorActionGate;
  canExecute: boolean;
  output: string;
};

export type OperatorBlockedAction = {
  id: string;
  title: string;
  gate: OperatorActionGate;
  reason: string;
  whatOperatorCanPrepare: string;
};

export type OperatorNextAction = {
  next: "Operator Mode controlled activation";
  reason: string;
  blockedUntil: string[];
};

export type OperatorControlledNextAction = {
  next: "Local Day One Readiness / Boot Gate";
  reason: string;
  blockedUntil: string[];
};

export type AlKawnOperatorPreparation = {
  id: "al_kawn_operator_preparation";
  title: "Operator Mode preparation";
  status: OperatorPreparationState;
  summary: string;
  requiredWording: string[];
  readiness: OperatorReadinessCheck[];
  permissions: OperatorPermission[];
  workQueue: OperatorWorkItem[];
  blockedActions: OperatorBlockedAction[];
  reportingToAhmad: string[];
  nextAction: OperatorNextAction;
};

export type OperatorCycle = {
  id: "operator_cycle";
  status: OperatorActivationState;
  stages: string[];
  stopRules: string[];
};

export type OperatorLedgerEntry = {
  id: string;
  phase: string;
  result: string;
  evidence: string[];
};

export type OperatorControlledActivation = {
  id: "operator_controlled_activation";
  title: "Operator Mode controlled activation";
  status: OperatorActivationState;
  summary: string;
  requiredWording: string[];
  cycle: OperatorCycle;
  ledger: OperatorLedgerEntry[];
  currentWork: OperatorWorkItem;
  humanMessage: string;
  nextAction: OperatorControlledNextAction;
};
