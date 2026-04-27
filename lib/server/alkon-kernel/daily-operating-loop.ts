import { getKernelOneNextAction } from "./one-next-action";
import type { DailyOperatingLoop } from "./types";

export const KERNEL_DAILY_LOOP_STEPS = [
  "Read Wake Report",
  "Read current station",
  "Check Product Truth",
  "Check public/private boundary",
  "Check heart",
  "Check Assistant",
  "Check visual acceptance",
  "Check validation and Git status",
  "Detect drift",
  "Return one next action",
  "Wait for Ahmad decision",
];

export function getKernelDailyOperatingLoop(): DailyOperatingLoop {
  return {
    dailyLoopStatus: "active_with_notes",
    steps: KERNEL_DAILY_LOOP_STEPS,
    privateOnly: true,
    oneNextAction: getKernelOneNextAction(),
  };
}
