import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateTreasuryGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  if (seed.requiresExternalSpend && !seed.hasTreasuryEstimate) {
    return {
      gateId: "treasury_gate",
      status: "delay",
      reason: "Unknown external spend is not allowed for a new world seed.",
      evidenceNeeded: ["cost estimate", "monthly burn", "budget cap", "tax reserve impact"],
      requiredReview: ["Founder review", "accounting review"],
      safeAlternative: "Keep budget as readiness-only; no payments, bank/card data, or autopay.",
    };
  }

  return {
    gateId: "treasury_gate",
    status: seed.hasTreasuryEstimate || !seed.requiresExternalSpend ? "pass" : "needs_review",
    reason: "No payment execution is allowed; treasury remains readiness-only.",
    evidenceNeeded: ["treasury estimate before birth"],
    requiredReview: seed.requiresExternalSpend ? ["Founder review"] : [],
    safeAlternative: "Use cost notes only; do not execute spending.",
  };
}
