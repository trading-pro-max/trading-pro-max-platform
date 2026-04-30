import "server-only";

import { getAlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import { getInfinityControlledActivation } from "@/lib/server/universe/infinity";
import { getUniverseKernelReadiness } from "@/lib/server/universe/kernel";
import type { OperatorReadinessCheck } from "./types";

export function getOperatorReadiness(): OperatorReadinessCheck[] {
  const infinity = getInfinityControlledActivation();
  const dailyLoop = getAlKawnDailyWorkLoop();
  const kernel = getUniverseKernelReadiness();
  const state =
    infinity.status === "closed_controlled_internal_active"
      ? "closed_ready_for_operator_activation"
      : "blocked_prerequisite_missing";

  return [
    {
      id: "infinity_controlled",
      label: "Infinity controlled activation",
      state,
      status: `Infinity status: ${infinity.status}.`,
      evidence: [
        "Infinity feeds Operator preparation.",
        "Safe internal cycles only.",
        "No background daemon.",
      ],
    },
    {
      id: "daily_loop",
      label: "Daily Work Loop",
      state,
      status: `Daily selected work: ${dailyLoop.selectedWorkItem.title}.`,
      evidence: [
        "Daily work becomes operator work.",
        "One next action remains enforced.",
        "Daily blockers remain visible.",
      ],
    },
    {
      id: "kernel_truth",
      label: "Kernel and Product Truth",
      state: kernel.ok ? state : "blocked_prerequisite_missing",
      status: `Kernel status: ${kernel.status}.`,
      evidence: [
        "Universe Operating Kernel is the execution judge.",
        "Product Truth overrides operator actions.",
        "Legal and Money gates stop execution for Ahmad.",
      ],
    },
  ];
}
