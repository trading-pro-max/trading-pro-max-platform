import type { AlkonEntity, EntityRelationshipGraph } from "./types";

function findCircularRisks(entities: AlkonEntity[]) {
  const ids = new Set(entities.map((entity) => entity.entityId));
  const graph = new Map(
    entities.map((entity) => [
      entity.entityId,
      entity.dependencies.filter((dependency) => ids.has(dependency)),
    ])
  );
  const circular = new Set<string>();

  function visit(id: string, stack: string[]) {
    if (stack.includes(id)) {
      circular.add([...stack.slice(stack.indexOf(id)), id].join(" -> "));
      return;
    }

    for (const dependency of graph.get(id) ?? []) {
      visit(dependency, [...stack, id]);
    }
  }

  for (const entity of entities) {
    visit(entity.entityId, []);
  }

  return Array.from(circular);
}

export function buildEntityRelationshipGraph(
  entities: AlkonEntity[]
): EntityRelationshipGraph {
  const entityIds = new Set(entities.map((entity) => entity.entityId));
  const dependents = new Map<string, string[]>();

  for (const entity of entities) {
    for (const dependency of entity.dependencies) {
      const list = dependents.get(dependency) ?? [];
      list.push(entity.entityId);
      dependents.set(dependency, list);
    }
  }

  const missingDependencies = entities.flatMap((entity) =>
    entity.dependencies
      .filter((dependency) => !entityIds.has(dependency))
      .map((dependency) => `${entity.entityId}:${dependency}`)
  );
  const ownerlessEntities = entities
    .filter((entity) => !entity.ownerArea || !entity.ownerWorker)
    .map((entity) => entity.entityId);
  const untestedEntities = entities
    .filter((entity) => entity.validation.methods.length === 0)
    .map((entity) => entity.entityId);
  const memorylessEntities = entities
    .filter((entity) => !entity.memoryRule)
    .map((entity) => entity.entityId);
  const orphanedEntities = entities
    .filter(
      (entity) =>
        entity.dependencies.length === 0 &&
        (dependents.get(entity.entityId) ?? []).length === 0 &&
        entity.world !== "invisible_operating_layer"
    )
    .map((entity) => entity.entityId);
  const publicPrivateBoundaryRisks = entities
    .filter((entity) => entity.publicVisible)
    .flatMap((entity) => {
      const hasMapper = entity.dependencies.includes("public_private_output_mapper");
      const risks: string[] = [];

      for (const dependencyId of entity.dependencies) {
        const dependency = entities.find(
          (candidate) => candidate.entityId === dependencyId
        );

        if (dependency && dependency.world === "private_alkon" && !hasMapper) {
          risks.push(`${entity.entityId}->${dependency.entityId}`);
        }
      }

      return risks;
    });

  return {
    nodes: entities.map((entity) => ({
      entityId: entity.entityId,
      dependencies: entity.dependencies,
      dependents: dependents.get(entity.entityId) ?? [],
      owner: `${entity.ownerArea} / ${entity.ownerWorker}`,
      reportsTo: entity.reportTarget,
      memoryRule: entity.memoryRule,
      validationMethods: entity.validation.methods,
      riskLevel: entity.riskLevel,
      boundary: entity.world,
    })),
    orphanedEntities,
    circularRisks: findCircularRisks(entities),
    missingDependencies,
    publicPrivateBoundaryRisks,
    ownerlessEntities,
    untestedEntities,
    memorylessEntities,
  };
}
