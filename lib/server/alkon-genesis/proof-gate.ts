import type { AlkonGenesisGateResult, AlkonWorldProof, AlkonWorldSeed } from "./types";

export function buildWorldProof(seed: AlkonWorldSeed): AlkonWorldProof {
  return {
    purposeProof: seed.purposeHypothesis.trim().length >= 24,
    marketHypothesisProof: Boolean(seed.hasMarketProof),
    legalReadinessProof: Boolean(seed.hasLegalProof),
    treasuryEstimateProof:
      !seed.requiresExternalSpend || Boolean(seed.hasTreasuryEstimate),
    securityProof: !seed.requiresAlkonAccess || Boolean(seed.hasSecurityProof),
    prototypeProof: Boolean(seed.hasPrototypeProof),
    tests: false,
    founderReview: seed.founderApproval === "approved_birth",
    noHarmToPrimeWorld:
      seed.relationshipToPrime !== "weakens_prime_world" &&
      seed.relationshipToPrime !== "distracts_from_prime_world" &&
      seed.relationshipToPrime !== "forbidden",
  };
}

export function evaluateProofGate(seed: AlkonWorldSeed): AlkonGenesisGateResult {
  const proof = buildWorldProof(seed);
  const missing = Object.entries(proof)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    return {
      gateId: "proof_gate",
      status: "needs_review",
      reason: "No world birth is possible without complete proof.",
      evidenceNeeded: missing,
      requiredReview: ["Founder review"],
      safeAlternative: "Keep seed evaluation or prototype-readiness only.",
    };
  }

  return {
    gateId: "proof_gate",
    status: "pass",
    reason: "All required proof markers exist for private readiness review.",
    evidenceNeeded: ["final Founder review"],
    requiredReview: ["Founder review"],
    safeAlternative: "Proceed only to Founder birth decision, not public launch.",
  };
}
