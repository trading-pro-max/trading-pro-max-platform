import type {
  AlkonEntityFunction,
  AlkonEntityIdentity,
  AlkonEntityIntegration,
  AlkonEntityLifeState,
  AlkonEntityProof,
} from "./types";

export function monitorAlkonEntityLife(
  identity: AlkonEntityIdentity,
  entityFunction: AlkonEntityFunction,
  integration: AlkonEntityIntegration,
  proof: AlkonEntityProof
): AlkonEntityLifeState {
  const reasons: string[] = [];
  let health: AlkonEntityLifeState["health"] = "healthy";

  if (proof.cannotBeAccepted) {
    health = "risky";
    reasons.push("Entity cannot be accepted until proof and law approval exist.");
  } else if (integration.orphanedRisk) {
    health = "cleanup_candidate";
    reasons.push("Entity has orphaned or unclear integration risk.");
  } else if (entityFunction.functionStatus === "review_required") {
    health = "needs_improvement";
    reasons.push("Function requires clearer purpose before the entity can keep living.");
  } else if (identity.category === "cleanup_candidate") {
    health = "deprecation_candidate";
    reasons.push("Cleanup candidate requires deprecation/removal review.");
  } else {
    reasons.push("Entity remains useful, owned, tested, truthful, and boundary-safe.");
  }

  return {
    entityId: identity.entityId,
    health,
    reasons,
    monitoredSignals: [
      "usefulness",
      "owner",
      "validation",
      "Product Truth",
      "public/private leak",
      "clutter",
      "Founder preferences",
    ],
    nextReview: "Review during the next Founder Command continuity pass.",
  };
}
