import type { SelfCorrectionSignal } from "./types";

export function detectHeartDrift(signals: SelfCorrectionSignal[]) {
  return signals.some((signal) => signal.type === "heart_drift" && signal.detected);
}

