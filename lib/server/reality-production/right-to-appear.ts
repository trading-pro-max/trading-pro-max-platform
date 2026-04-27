import type { RealityProductionGate } from "./types";

export function decideRightToAppear(): RealityProductionGate {
  return {
    gateId: "right_to_appear",
    label: "Right to Appear",
    passed: false,
    decision: "needs_ahmad",
    reason:
      "Ahmad visual acceptance is required before any Local Day One or final closure appearance.",
  };
}

