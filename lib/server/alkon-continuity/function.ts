import type {
  AlkonEntityBirthCandidate,
  AlkonEntityFunction,
  AlkonEntityIdentity,
} from "./types";

export function assignAlkonEntityFunction(
  candidate: AlkonEntityBirthCandidate,
  identity: AlkonEntityIdentity
): AlkonEntityFunction {
  const name = candidate.proposedName.toLowerCase();
  const unclear = name.includes("vanity") || name.includes("hype") || name.includes("random");
  const categories: AlkonEntityFunction["categories"] = [];

  if (identity.world === "public_earth") categories.push("guide", "improve_trust", "guard_truth");
  if (identity.world === "private_alkon") categories.push("report", "protect", "reduce_risk");
  if (identity.world === "invisible_operating_layer") categories.push("preserve_memory", "validate", "guard_truth");
  if (identity.category === "cleanup_candidate") categories.push("reduce_clutter");
  if (identity.category === "assistant_intent") categories.push("route_intent");
  if (identity.category === "launch_gate") categories.push("prepare_launch");

  return {
    entityId: identity.entityId,
    functionStatus: unclear ? "review_required" : candidate.sensitiveFlags.length ? "deprecate_or_block" : "clear",
    categories: [...new Set(categories)],
    summary: unclear
      ? "Function is unclear and must be reviewed before the entity can live."
      : `${identity.name} exists to serve ${candidate.serves.join(", ")} without bypassing Product Truth.`,
    value: {
      user: identity.world === "public_earth" ? 8 : 3,
      founder: identity.world === "private_alkon" ? 9 : 6,
      safety: identity.risk === "safe" ? 7 : 9,
      trust: identity.world === "public_earth" ? 8 : 7,
      business: identity.category === "treasury_system" || identity.category === "media_system" ? 8 : 5,
      technical: identity.category === "api" || identity.category === "test" ? 8 : 6,
    },
    expectedOutput: "A reviewed, integrated, validated, monitored, and memory-backed entity proposal.",
  };
}
