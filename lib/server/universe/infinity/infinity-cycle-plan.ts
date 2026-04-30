import "server-only";

import type { InfinityCycleStage } from "./types";

export function getInfinityCyclePlan(): InfinityCycleStage[] {
  return [
    {
      id: "read_current_state",
      order: 1,
      title: "Read current state",
      action: "Read wake state, desktop state, reports, and current private readiness.",
      safetyRule: "No uncontrolled infinite loop.",
      output: "Current state snapshot prepared.",
    },
    {
      id: "read_daily_work_loop",
      order: 2,
      title: "Read daily work loop",
      action: "Use selected daily work, blockers, memory snapshot, and one next action.",
      safetyRule: "Daily Work Loop feeds Infinity preparation.",
      output: "Daily loop input loaded.",
    },
    {
      id: "read_product_truth",
      order: 3,
      title: "Read Product Truth",
      action: "Check public, money, broker, legal, privacy, and ALKON boundaries.",
      safetyRule: "Product Truth controls every cycle.",
      output: "Truth boundaries loaded.",
    },
    {
      id: "kernel_verdict",
      order: 4,
      title: "Check kernel verdict",
      action: "Ask the Universe Operating Kernel whether the work is internal, stopped, or blocked.",
      safetyRule: "Universe Operating Kernel remains the execution judge.",
      output: "Kernel verdict prepared.",
    },
    {
      id: "legal_money_gates",
      order: 5,
      title: "Check legal/money gates",
      action: "Stop legal and money tasks for Ahmad before any execution decision.",
      safetyRule: "Legal and Money gates stop execution for Ahmad.",
      output: "Legal and money stops verified.",
    },
    {
      id: "select_safe_internal_work",
      order: 6,
      title: "Select safe internal work",
      action: "Select one internal item from the daily loop that does not touch public, money, broker, legal, or external automation.",
      safetyRule: "Safe internal work only.",
      output: "One safe internal item selected.",
    },
    {
      id: "prepare_internal_task",
      order: 7,
      title: "Prepare internal task/report",
      action: "Prepare a report, checklist, task draft, or status refresh without external side effects.",
      safetyRule: "External actions remain blocked.",
      output: "Internal task/report prepared.",
    },
    {
      id: "update_memory_snapshot",
      order: 8,
      title: "Update memory snapshot",
      action: "Update private memory/report snapshot with no secrets and no private documents.",
      safetyRule: "No secrets in reports.",
      output: "Memory snapshot ready for review.",
    },
    {
      id: "prepare_next_action",
      order: 9,
      title: "Prepare next action",
      action: "Produce one next action only and explain why blocked alternatives remain stopped.",
      safetyRule: "One next action remains enforced.",
      output: "One next action prepared.",
    },
    {
      id: "stop_wait_safe_trigger",
      order: 10,
      title: "Stop / wait for next safe trigger",
      action: "End the cycle and wait for Ahmad, a manual trigger, or a future approved scheduler.",
      safetyRule: "Infinity cycle waits for safe trigger.",
      output: "Cycle stopped safely.",
    },
  ];
}
