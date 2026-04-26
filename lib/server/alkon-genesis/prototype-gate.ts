import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluatePrototypeGate(
  seed: AlkonWorldSeed
): AlkonGenesisGateResult {
  if (seed.requiresRegulatoryReview) {
    return {
      gateId: "prototype_gate",
      status: "delay",
      reason: "Regulated seeds are docs/readiness-only until law and regulatory gates clear.",
      evidenceNeeded: ["regulatory readiness", "legal review"],
      requiredReview: ["legal/regulatory review", "Founder review"],
      safeAlternative: "Use docs only; no functional prototype.",
    };
  }

  return {
    gateId: "prototype_gate",
    status: "pass",
    reason: "Safe prototype scope may include docs, mock UI, and read-only readiness only.",
    evidenceNeeded: ["prototype scope proof"],
    requiredReview: [],
    safeAlternative:
      "Prototype must not call external services, collect real user data, execute payments, launch, publish, or use secrets.",
  };
}
