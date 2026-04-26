import type {
  AlkonEntity,
  EntityDeprecationReport,
  EntityRelationshipGraph,
} from "./types";

const PROTECTED_CORE_IDS = new Set([
  "product_truth",
  "plan_entitlements",
  "surface_boundaries",
  "guardian",
  "legal",
  "trust_governor",
  "launch_readiness_gate",
  "alkon_command_universe",
  "alkon_ontology_existence_system",
  "product_memory",
  "security_sovereignty",
  "secrets_authority",
]);

export function evaluateEntityDeprecation(
  entity: AlkonEntity,
  graph?: EntityRelationshipGraph
): EntityDeprecationReport {
  const protectedCore = PROTECTED_CORE_IDS.has(entity.entityId);
  const dependents =
    graph?.nodes.find((node) => node.entityId === entity.entityId)?.dependents ?? [];
  const unclearPurpose = !entity.purpose || !entity.ownerArea;
  const highMaintenanceLowValue =
    Object.values(entity.valueScore).every((score) => score < 5) &&
    entity.dependencies.length > 3;
  const publicPrivateRisk =
    entity.publicVisible && entity.world !== "public_earth";
  const noValidation = entity.validation.methods.length === 0;
  const ruleMarksDeprecated = /duplicate|replaced|clutter|unclear purpose|failed visual/i.test(
    `${entity.name} ${entity.purpose} ${entity.deprecationRule}`
  );
  const shouldDeprecate =
    !protectedCore &&
    (entity.status === "deprecated" ||
      ruleMarksDeprecated ||
      unclearPurpose ||
      highMaintenanceLowValue ||
      publicPrivateRisk ||
      noValidation);
  const canRemove =
    shouldDeprecate &&
    !protectedCore &&
    dependents.length === 0 &&
    entity.removalRule.length > 0;

  return {
    entityId: entity.entityId,
    shouldDeprecate,
    canRemove,
    protectedCore,
    reason: protectedCore
      ? "Protected core entity requires Founder approval and migration before any removal."
      : shouldDeprecate
        ? "Entity should be reviewed for deprecation because purpose, validation, risk, or value is weak."
        : "Entity has a reason to stay.",
    requiredMigration: canRemove
      ? ["Update tests", "Preserve Product Truth", "Generate removal report"]
      : dependents.map((dependent) => `Migrate dependent ${dependent}`),
  };
}

export function evaluateEntitiesDeprecation(
  entities: AlkonEntity[],
  graph?: EntityRelationshipGraph
) {
  return entities.map((entity) => evaluateEntityDeprecation(entity, graph));
}

export function isProtectedCoreEntity(entityId: string) {
  return PROTECTED_CORE_IDS.has(entityId);
}
