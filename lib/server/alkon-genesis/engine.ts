import { createWorldBirthPermit } from "./birth-permit";
import { evaluateFounderGate } from "./founder-gate";
import { evaluateHumanNeedGate } from "./human-need-gate";
import { evaluateLawGate } from "./law-gate";
import { evaluateMarketGate } from "./market-gate";
import { evaluateMeaningGate } from "./meaning-gate";
import { genesisMemoryForSeed } from "./memory";
import { evaluatePrimeWorldProtectionGate } from "./prime-world-protection-gate";
import { buildWorldProof, evaluateProofGate } from "./proof-gate";
import { evaluatePrototypeGate } from "./prototype-gate";
import { evaluateSecurityGate } from "./security-gate";
import { ALKON_SHARED_WORLD_SERVICES } from "./shared-services";
import { evaluateTreasuryGate } from "./treasury-gate";
import { createWorldLifeCycle } from "./world-lifecycle";
import { ALKON_WORLD_SEEDS } from "./world-seeds";
import type {
  AlkonGenesisGateResult,
  AlkonGenesisReport,
  AlkonWorldCandidate,
  AlkonWorldRelationship,
  AlkonWorldRisk,
  AlkonWorldRuntime,
  AlkonWorldSeed,
  GenesisDecision,
} from "./types";

function decideGenesis(
  seed: AlkonWorldSeed,
  gates: AlkonGenesisGateResult[]
): GenesisDecision {
  if (gates.some((gate) => gate.status === "black_hole")) {
    return "black_hole";
  }

  if (gates.some((gate) => gate.status === "reject")) {
    return "reject_seed";
  }

  if (
    gates.some(
      (gate) =>
        gate.gateId === "prime_world_protection_gate" && gate.status === "delay"
    )
  ) {
    return "delay_until_prime_world_ready";
  }

  if (
    gates.some((gate) => gate.gateId === "law_gate" && gate.status === "blocked")
  ) {
    return "delay_until_prime_world_ready";
  }

  if (seed.founderApproval === "approved_birth" && gates.every((gate) => gate.status === "pass")) {
    return "birth_permitted";
  }

  if (
    seed.founderApproval === "approved_prototype" &&
    gates
      .filter((gate) => gate.gateId !== "proof_gate")
      .every((gate) => gate.status === "pass")
  ) {
    return "prototype_allowed";
  }

  if (gates.some((gate) => gate.gateId === "founder_gate" && gate.status !== "pass")) {
    return "founder_approval_required";
  }

  if (gates.some((gate) => gate.gateId === "proof_gate" && gate.status !== "pass")) {
    return "proof_required";
  }

  if (gates.some((gate) => gate.status === "needs_review")) {
    return "evaluate_more";
  }

  return "prototype_allowed";
}

function createCandidate(seed: AlkonWorldSeed): AlkonWorldCandidate {
  return {
    ...seed,
    candidateStatus: "candidate_only",
    noProjectCreated: true,
    noPublicPageCreated: true,
  };
}

function createRelationship(seed: AlkonWorldSeed): AlkonWorldRelationship {
  return {
    relationshipToPrime: seed.relationshipToPrime,
    reason:
      seed.relationshipToPrime === "supports_prime_world" ||
      seed.relationshipToPrime === "extends_prime_world"
        ? "The seed can support or extend Pro Max Trading only after gates pass."
        : "The seed must remain delayed until it proves no harm to Pro Max Trading.",
    primeWorldProtected:
      seed.relationshipToPrime !== "weakens_prime_world" &&
      seed.relationshipToPrime !== "forbidden",
    sharedServicesRequired: ALKON_SHARED_WORLD_SERVICES,
  };
}

function createRisk(seed: AlkonWorldSeed, gates: AlkonGenesisGateResult[]): AlkonWorldRisk {
  const blocked = gates.filter((gate) =>
    ["blocked", "black_hole", "reject"].includes(gate.status)
  );
  const delay = gates.filter((gate) => gate.status === "delay");

  return {
    riskLevel:
      blocked.length > 0
        ? blocked.some((gate) => gate.status === "black_hole")
          ? "black_hole"
          : "critical"
        : delay.length > 0 || seed.requiresRegulatoryReview
          ? "high"
          : seed.requiresUserData || seed.requiresMediaClaims || seed.requiresExternalSpend
            ? "medium"
            : "low",
    risks: [
      seed.possibleRisk,
      ...gates
        .filter((gate) => gate.status !== "pass")
        .map((gate) => gate.reason),
    ],
    blockedReasons: blocked.map((gate) => gate.reason),
    primeWorldImpact:
      seed.relationshipToPrime === "supports_prime_world" ||
      seed.relationshipToPrime === "extends_prime_world"
        ? "Potentially supportive, but still gated."
        : "Must be delayed or rejected until Prime World protection is proven.",
  };
}

function createRuntime(): AlkonWorldRuntime {
  return {
    runtimeMode: "readiness_only",
    noLaunch: true,
    noProduction: true,
    noBilling: true,
    noBrokerFeed: true,
    noLiveExecution: true,
    noRealMoney: true,
    noSocialPublishing: true,
    noProjectCreation: true,
  };
}

export function evaluateWorldSeed(seed: AlkonWorldSeed): AlkonGenesisReport {
  const gates = [
    evaluateMeaningGate(seed),
    evaluateHumanNeedGate(seed),
    evaluateMarketGate(seed),
    evaluateLawGate(seed),
    evaluateTreasuryGate(seed),
    evaluateSecurityGate(seed),
    evaluatePrototypeGate(seed),
    evaluateProofGate(seed),
    evaluatePrimeWorldProtectionGate(seed),
    evaluateFounderGate(seed),
  ];
  const decision = decideGenesis(seed, gates);
  const birthGate: AlkonGenesisGateResult = {
    gateId: "birth_gate",
    status: decision === "birth_permitted" ? "pass" : "delay",
    reason:
      decision === "birth_permitted"
        ? "All Genesis gates and Founder birth approval are present."
        : "World birth is not allowed in this pass.",
    evidenceNeeded: ["all gates passed", "Founder birth approval", "Prime World protected"],
    requiredReview: ["Founder review"],
    safeAlternative: "Keep seed, evaluation, or prototype-readiness only.",
  };
  const allGates = [...gates, birthGate];

  return {
    reportId: `alkon_genesis_${seed.seedId}`,
    seed,
    candidate: createCandidate(seed),
    gates: allGates,
    decision,
    birthPermit: createWorldBirthPermit(seed, allGates, decision),
    lifecycle: createWorldLifeCycle(decision),
    relationship: createRelationship(seed),
    risk: createRisk(seed, allGates),
    proof: buildWorldProof(seed),
    runtime: createRuntime(),
    memoryLesson: genesisMemoryForSeed(seed.seedId),
    nextSafeAction:
      allGates.find((gate) => gate.status !== "pass")?.safeAlternative ??
      "Keep birth permit private; do not launch.",
  };
}

export function evaluateAllWorldSeeds(): AlkonGenesisReport[] {
  return ALKON_WORLD_SEEDS.map(evaluateWorldSeed);
}
