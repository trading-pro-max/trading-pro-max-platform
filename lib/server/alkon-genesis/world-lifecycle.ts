import type { AlkonWorldLifeCycle, GenesisDecision } from "./types";

export const WORLD_LIFECYCLE_STAGES: AlkonWorldLifeCycle["stages"] = [
  "seed",
  "evaluate",
  "prototype",
  "prove",
  "birth",
  "local_life",
  "public_readiness",
  "beta",
  "revenue_readiness",
  "growth",
  "pause",
  "retire",
  "archive",
];

export function createWorldLifeCycle(
  decision: GenesisDecision
): AlkonWorldLifeCycle {
  return {
    stages: WORLD_LIFECYCLE_STAGES,
    currentStage:
      decision === "prototype_allowed"
        ? "prototype"
        : decision === "proof_required"
          ? "prove"
          : "evaluate",
    canSkipStages: false,
    publicRequiresPublicSafeGate: true,
    paidRequiresLegalAccountingSupportGate: true,
    regulatedRequiresReview: true,
    retirementRequiresMemory: true,
  };
}

export function canTransitionWorldLifecycle(
  from: AlkonWorldLifeCycle["stages"][number],
  to: AlkonWorldLifeCycle["stages"][number]
): boolean {
  const fromIndex = WORLD_LIFECYCLE_STAGES.indexOf(from);
  const toIndex = WORLD_LIFECYCLE_STAGES.indexOf(to);

  return toIndex === fromIndex + 1 || (from === "growth" && to === "pause");
}
