import "server-only";

export type DailyLoopState =
  | "idle"
  | "awake"
  | "scanning"
  | "planning"
  | "working_internal"
  | "blocked_legal"
  | "blocked_money"
  | "blocked_product_truth"
  | "waiting_for_next_cycle"
  | "ready_for_report";

export type DailyPriorityCategory =
  | "product_truth"
  | "protection"
  | "desktop"
  | "architecture"
  | "reports"
  | "tests"
  | "visual_consistency"
  | "trading_readiness"
  | "future_gates";

export type DailyWorkItemStatus =
  | "ready"
  | "selected"
  | "active"
  | "blocked"
  | "future_gate"
  | "needs_ahmad";

export type DailyStopGate = "none" | "legal" | "money" | "product_truth";

export type DailyChecklistSection = {
  id: string;
  title: string;
  status: "checked" | "ready" | "visible" | "updated";
  checks: string[];
};

export type DailyPriority = {
  id: string;
  category: DailyPriorityCategory;
  label: string;
  priority: "high" | "medium" | "low";
  rule: string;
  reason: string;
};

export type DailyWorkItem = {
  id: string;
  title: string;
  layer: string;
  reason: string;
  priority: DailyPriorityCategory;
  status: DailyWorkItemStatus;
  canExecuteDirectly: boolean;
  stopGate: DailyStopGate;
  expectedOutput: string;
  nextStep: string;
};

export type DailySelectedWorkItem = DailyWorkItem & {
  selectedReason: string;
  todayOutput: string;
};

export type DailyBlocker = {
  id: string;
  title: string;
  reason: string;
  gate: "legal" | "money" | "product_truth" | "security" | "public";
  whatAlKawnCanPrepare: string;
  ahmadMustDecide: string;
};

export type DailyProgressState = {
  state: DailyLoopState;
  label: string;
  completed: string[];
  active: string[];
  waiting: string[];
  blockersVisible: boolean;
  reportStatus: "Daily WAKE REPORT updated.";
};

export type DailyMemorySnapshot = {
  path: "reports/daily/al-kawn-daily-memory-snapshot.md";
  currentDateTimeSource: string;
  latestClosedMission: string;
  currentDailyState: DailyLoopState;
  selectedSafeWorkItem: string;
  blockers: string[];
  nextAction: "Daily Work Loop enhancement";
  notDone: string[];
  noSecrets: true;
};

export type DailyNextAction = {
  next: "Daily Work Loop enhancement";
  reason: string;
  selectedFrom: string;
  stoppedAlternatives: string[];
};

export type AlKawnDailyWorkLoop = {
  id: "al_kawn_daily_work_loop";
  title: "Daily Work Loop enhancement";
  state: DailyLoopState;
  rule: string;
  requiredWording: string[];
  checklist: DailyChecklistSection[];
  priorities: DailyPriority[];
  safeWorkItems: DailyWorkItem[];
  blockedItems: DailyBlocker[];
  selectedWorkItem: DailySelectedWorkItem;
  progress: DailyProgressState;
  memorySnapshot: DailyMemorySnapshot;
  nextAction: DailyNextAction;
  oneNextAction: "Daily Work Loop enhancement";
};

export type DailyWorkReport = {
  title: string;
  path: "reports/daily/al-kawn-daily-work-loop.md";
  summary: string;
  checked: string[];
  safeInternalWork: string[];
  blockedWork: string[];
  selectedWorkItem: string;
  oneNextAction: "Daily Work Loop enhancement";
};
