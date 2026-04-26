import type { NumberOneEvaluationTarget, WorldlineProtectionResult } from "./types";

export function protectPrimeWorld(
  target: NumberOneEvaluationTarget
): WorldlineProtectionResult {
  if (target.expandsFutureWorld && target.stationStatus !== "station_1_closed") {
    return {
      protected: true,
      riskToPrimeWorld: "high",
      requiredDelay: true,
      allowedAsReadinessOnly: true,
      reason:
        "Future-world work stays seed/readiness-only until Pro Max Trading closes Station 1, Living Market Core, Reality Audit, Safe Cleanup, and Local Day One.",
    };
  }

  if (target.affectsChart && !target.improvesPrimeWorld) {
    return {
      protected: true,
      riskToPrimeWorld: "critical",
      requiredDelay: true,
      allowedAsReadinessOnly: false,
      reason: "Chart-weakening work is blocked because Living Market Core is a Prime World priority.",
    };
  }

  if (target.increasesFounderLoad && !target.improvesPrimeWorld) {
    return {
      protected: true,
      riskToPrimeWorld: "medium",
      requiredDelay: true,
      allowedAsReadinessOnly: true,
      reason: "Nonessential expansion waits so Founder energy stays on the Prime World.",
    };
  }

  return {
    protected: true,
    riskToPrimeWorld: "none",
    requiredDelay: false,
    allowedAsReadinessOnly: false,
    reason: "Pro Max Trading remains protected as Prime World.",
  };
}
