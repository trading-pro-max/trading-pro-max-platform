import type { RealityProductionSignal } from "./types";

export function interpretRealitySignal(signal: RealityProductionSignal) {
  return {
    signalId: signal.signalId,
    meaning: signal.meaning,
    publicAllowed: signal.publicVisible && !signal.sensitive,
    needsPrivateGate: signal.sensitive || !signal.publicVisible,
  };
}

