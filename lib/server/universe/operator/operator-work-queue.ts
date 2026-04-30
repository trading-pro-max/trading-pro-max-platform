import "server-only";

import { getAlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import type { OperatorWorkItem } from "./types";

export function getOperatorWorkQueue(): OperatorWorkItem[] {
  const dailyLoop = getAlKawnDailyWorkLoop();

  return [
    {
      id: "daily_selected_work",
      title: dailyLoop.selectedWorkItem.title,
      source: "daily_work_loop",
      gate: "execute_directly",
      canExecute: true,
      output: dailyLoop.selectedWorkItem.expectedOutput,
    },
    {
      id: "product_truth_scan",
      title: "Product Truth scan",
      source: "product_truth",
      gate: "execute_directly",
      canExecute: true,
      output: "Forbidden-claim scan and private status correction notes.",
    },
    {
      id: "validation_plan",
      title: "Validation planning",
      source: "kernel",
      gate: "execute_directly",
      canExecute: true,
      output: "Internal validation checklist and regression plan.",
    },
    {
      id: "operator_daily_briefing",
      title: "Daily briefing",
      source: "infinity",
      gate: "execute_directly",
      canExecute: true,
      output: "Arabic-first internal briefing for Ahmad.",
    },
  ];
}
