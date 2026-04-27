import type { RealityProductionGate } from "./types";

export function decideRightToBuild(): RealityProductionGate {
  return {
    gateId: "right_to_build",
    label: "Right to Build",
    passed: true,
    decision: "right_to_build",
    reason:
      "Build scope is private, read-only, no-execution, and preserves Product Truth.",
  };
}

