import type { SelfCorrectionSignal, SelfCorrectionSignalType } from "./types";

const PRIORITY: SelfCorrectionSignalType[] = [
  "public_private_leak",
  "product_truth_risk",
  "route_blocker",
  "failed_tests",
  "dirty_git",
  "missing_wake_report",
  "visual_blocker",
  "local_day_one_blocker",
  "heart_drift",
  "codex_dependency_risk",
];

export function prioritizeSelfCorrection(signals: SelfCorrectionSignal[]) {
  return [...signals].sort(
    (a, b) => PRIORITY.indexOf(a.type) - PRIORITY.indexOf(b.type)
  );
}

export { PRIORITY as SELF_CORRECTION_PRIORITY };

