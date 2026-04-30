import "server-only";

import { getInfinityCyclePlan } from "./infinity-cycle-plan";
import type { InfinityCycleState } from "./types";

export function getInfinityCycleState(): InfinityCycleState {
  return {
    id: "infinity_cycle_state",
    status: "closed_controlled_internal_active",
    label: "Infinity Mode is active only for private internal cycles.",
    mode: "private_internal_cycles_only",
    cycleStages: getInfinityCyclePlan(),
    stopRule: "No uncontrolled infinite loop. No background daemon.",
    triggerRule:
      "Each controlled cycle must start from Ahmad, an approved manual trigger, or a future approved safe scheduler, then stop.",
  };
}
