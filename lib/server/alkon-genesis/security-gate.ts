import type { AlkonGenesisGateResult, AlkonWorldSeed } from "./types";

export function evaluateSecurityGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  if (seed.publicVisible || seed.relationshipToPrime === "forbidden") {
    return {
      gateId: "security_gate",
      status: "black_hole",
      reason: "World seeds and Alkon Genesis must never be public.",
      evidenceNeeded: ["public leak test"],
      requiredReview: ["security review", "Founder review"],
      safeAlternative: "Keep the seed private or reject it.",
    };
  }

  if (seed.requiresAlkonAccess && !seed.hasSecurityProof) {
    return {
      gateId: "security_gate",
      status: "delay",
      reason: "A seed touching private Alkon requires owner-only access, device trust, audit, and boundary proof.",
      evidenceNeeded: ["owner-only proof", "device trust readiness", "public/private boundary proof"],
      requiredReview: ["security review", "Founder review"],
      safeAlternative: "Allow mock/read-only design only; no public route or secrets.",
    };
  }

  return {
    gateId: "security_gate",
    status: "pass",
    reason: "The seed remains private, read-only, secret-free, and non-executing.",
    evidenceNeeded: ["secret-free scan", "public leak check"],
    requiredReview: [],
    safeAlternative: "Keep secrets, shell execution, and direct Codex execution blocked.",
  };
}
