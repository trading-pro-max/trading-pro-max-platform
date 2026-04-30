import "server-only";

export type DailyWorkItemStatus =
  | "ready"
  | "active"
  | "blocked"
  | "future_gate"
  | "needs_ahmad";

export type DailyWorkItem = {
  id: string;
  title: string;
  layer: string;
  status: DailyWorkItemStatus;
  category: "safe_internal" | "legal_stop" | "money_stop" | "product_truth_block";
  nextStep: string;
  whoDecides: "الكون" | "Ahmad";
  reason: string;
};

export type DailyPriority = {
  id: string;
  label: string;
  priority: "high" | "medium" | "low";
  reason: string;
};

export type AlKawnDailyWorkLoop = {
  id: "al_kawn_daily_work_loop";
  title: "Daily Work Loop is active.";
  state: "active";
  rule: string;
  checklist: string[];
  priorities: DailyPriority[];
  safeWorkItems: DailyWorkItem[];
  blockedItems: DailyWorkItem[];
  oneNextAction: "Daily Work Loop enhancement";
};

export type DailyWorkReport = {
  title: string;
  path: "reports/daily/al-kawn-daily-work-loop.md";
  summary: string;
  safeInternalWork: string[];
  blockedWork: string[];
  oneNextAction: "Daily Work Loop enhancement";
};
