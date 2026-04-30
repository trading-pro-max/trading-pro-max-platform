import "server-only";

export type AlKawnWakeStateValue =
  | "asleep"
  | "ready_to_wake"
  | "waking"
  | "awake"
  | "awake_with_notes"
  | "operating"
  | "operating_private_daily_loop"
  | "blocked_by_missing_prerequisite"
  | "needs_ahmad_decision";

export type AlKawnWakeStepStatus =
  | "checked"
  | "loaded"
  | "prepared"
  | "active"
  | "blocked"
  | "future_gate";

export type AlKawnWakeSequenceStep = {
  id: string;
  label: string;
  status: AlKawnWakeStepStatus;
  details: string;
  evidence: string[];
};

export type AlKawnWakeReadiness = {
  state: AlKawnWakeStateValue;
  status: string;
  prerequisites: string[];
  notes: string[];
};

export type AlKawnWakeBoundary = {
  id: string;
  label: string;
  verdict: "execute_directly" | "stop_for_ahmad" | "block_immediately";
  wording: string;
  reason: string;
};

export type AlKawnWakeNextAction = {
  next: "Daily Work Loop enhancement";
  reason: string;
  selectedBy: "Universe Operating Kernel";
  blockedAlternatives: string[];
};

export type AlKawnDailyWakeReport = {
  title: "Daily WAKE REPORT prepared";
  path: "reports/daily/al-kawn-daily-wake-report.md";
  dateSource: string;
  wakeState: AlKawnWakeStateValue;
  kernelState: string;
  productTruthState: string;
  spokenBriefing: string[];
  safeInternalWork: string[];
  blockedLegalMoneyActions: string[];
  oneNextAction: string;
  whatAlKawnDidNotDo: string[];
};

export type AlKawnWakeState = {
  id: "al_kawn_wake_state";
  title: "Al-Kawn Wake State";
  state: AlKawnWakeStateValue;
  summary: string;
  requiredWording: string[];
  localAccessStatus: string;
  productTruthStatus: "Product Truth loaded.";
  kernelStatus: "Universe Operating Kernel checked.";
  humanSpokenInterfaceState: "Human Spoken Interface is active.";
  dailyWorkLoopState: "Daily Work Loop is active.";
  dailyWakeReportPath: "reports/daily/al-kawn-daily-wake-report.md";
  oneNextAction: AlKawnWakeNextAction;
  sequence: AlKawnWakeSequenceStep[];
  readiness: AlKawnWakeReadiness;
  boundaries: AlKawnWakeBoundary[];
};
