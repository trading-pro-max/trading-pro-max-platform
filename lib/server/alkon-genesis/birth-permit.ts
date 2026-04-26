import type {
  AlkonGenesisGateResult,
  AlkonWorldBirthPermit,
  AlkonWorldSeed,
  GenesisDecision,
} from "./types";

function permitStatus(
  seed: AlkonWorldSeed,
  gates: AlkonGenesisGateResult[],
  decision: GenesisDecision
): AlkonWorldBirthPermit["status"] {
  if (
    decision === "black_hole" ||
    gates.some((gate) => gate.status === "black_hole")
  ) {
    return "blocked";
  }

  if (decision === "reject_seed" || gates.some((gate) => gate.status === "reject")) {
    return "blocked";
  }

  if (decision === "birth_permitted") {
    return "birth_permitted";
  }

  if (decision === "prototype_allowed") {
    return "prototype_only";
  }

  if (seed.founderApproval !== "approved_birth") {
    return "founder_required";
  }

  if (decision === "proof_required") {
    return "proof_required";
  }

  return "not_permitted";
}

export function createWorldBirthPermit(
  seed: AlkonWorldSeed,
  gates: AlkonGenesisGateResult[],
  decision: GenesisDecision
): AlkonWorldBirthPermit {
  const failedGates = gates.filter((gate) => gate.status !== "pass");
  const passedGates = gates
    .filter((gate) => gate.status === "pass")
    .map((gate) => gate.gateId);

  return {
    permitId: `world_birth_permit_${seed.seedId}`,
    worldName: seed.name,
    category: seed.category,
    purpose: seed.purposeHypothesis,
    relationshipToPrime: seed.relationshipToPrime,
    status: permitStatus(seed, gates, decision),
    passedGates,
    failedGates,
    allowedScope:
      decision === "prototype_allowed"
        ? seed.allowedScopeNow
        : ["seed evaluation", "docs", "read-only readiness"],
    forbiddenScope: seed.forbiddenScopeNow,
    requiredProof: failedGates.flatMap((gate) => gate.evidenceNeeded),
    founderDecision:
      seed.founderApproval === "approved_birth"
        ? "approved"
        : seed.founderApproval === "rejected"
          ? "rejected"
          : seed.founderApproval === "delayed"
            ? "delayed"
            : "required",
    nextSafeAction:
      failedGates[0]?.safeAlternative ??
      "Do not launch; preserve Founder birth permit record only.",
    noExecution: true,
    noProjectCreation: true,
  };
}
