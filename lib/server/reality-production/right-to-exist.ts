import type { RealityProductionGate, RealityProductionSignal } from "./types";

export function decideRightToExist(
  signal: RealityProductionSignal
): RealityProductionGate {
  const passed = signal.meaning.length > 0 && !signal.publicVisible;

  return {
    gateId: "right_to_exist",
    label: "Right to Exist",
    passed,
    decision: passed ? "right_to_exist" : "needs_evidence",
    reason: passed
      ? "Private signal has meaning and belongs inside Alkon readiness."
      : "Signal needs meaning and private placement before it can exist.",
  };
}

