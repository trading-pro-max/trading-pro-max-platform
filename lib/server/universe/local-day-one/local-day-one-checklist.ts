import "server-only";

import { getInfinityControlledActivation } from "@/lib/server/universe/infinity";
import { getLocalDesktopAuthStatus } from "@/lib/server/universe/local-desktop-auth";
import { getOperatorControlledActivation } from "@/lib/server/universe/operator";
import { getAlKawnWakeState } from "@/lib/server/universe/wake-state";
import { getAlKawnDailyWorkLoop } from "@/lib/server/universe/daily-work-loop";
import { getUniverseKernelReadiness } from "@/lib/server/universe/kernel";
import type { LocalDayOneChecklistItem } from "./types";

export function getLocalDayOneChecklist(): LocalDayOneChecklistItem[] {
  const infinity = getInfinityControlledActivation();
  const operator = getOperatorControlledActivation();
  const localAuth = getLocalDesktopAuthStatus();
  const wake = getAlKawnWakeState();
  const daily = getAlKawnDailyWorkLoop();
  const kernel = getUniverseKernelReadiness();

  return [
    {
      id: "desktop",
      label: "Desktop ready",
      status: "ready",
      evidence: "/desktop/kawn is the private command home.",
    },
    {
      id: "local_auth",
      label: "Local auth ready",
      status: "ready_with_notes",
      evidence: `Local auth status: ${localAuth.state}; ${localAuth.sessionTimeout}.`,
    },
    {
      id: "product_truth",
      label: "Product Truth ready",
      status: "ready",
      evidence: "Product Truth is enforced.",
    },
    {
      id: "kernel",
      label: "Kernel ready",
      status: kernel.ok ? "ready_with_notes" : "blocked",
      evidence: `Universe Operating Kernel: ${kernel.status}.`,
    },
    {
      id: "wake_state",
      label: "Wake State ready",
      status: "ready",
      evidence: `Wake State: ${wake.state}.`,
    },
    {
      id: "daily_loop",
      label: "Daily Work Loop ready",
      status: "ready",
      evidence: `Daily loop: ${daily.state}; selected work: ${daily.selectedWorkItem.title}.`,
    },
    {
      id: "infinity",
      label: "Infinity controlled ready",
      status:
        infinity.status === "closed_controlled_internal_active"
          ? "ready"
          : "blocked",
      evidence: `Infinity controlled activation: ${infinity.status}.`,
    },
    {
      id: "operator",
      label: "Operator controlled ready",
      status:
        operator.status === "closed_operator_internal_active" ? "ready" : "blocked",
      evidence: `Operator controlled activation: ${operator.status}.`,
    },
    {
      id: "legal_money",
      label: "Legal/Money gates ready",
      status: "ready",
      evidence: "Legal and Money gates remain Ahmad gates.",
    },
    {
      id: "blocked_external",
      label: "Public/money/broker/legal blocked",
      status: "ready",
      evidence: "Public, money, broker, legal, and external actions remain blocked.",
    },
    {
      id: "ahmad_decision",
      label: "Ahmad final start decision",
      status: "ready_with_notes",
      evidence: "Ahmad must start Local Day One.",
    },
  ];
}
