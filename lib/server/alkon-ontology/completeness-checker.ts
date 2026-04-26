import { evaluateEntitiesDeprecation } from "./deprecation";
import { buildEntityRelationshipGraph } from "./relationship-graph";
import { evaluateEntitiesValidation } from "./validation-law";
import type {
  AlkonEntity,
  OntologyCompletenessReport,
  OntologyCompletenessStatus,
} from "./types";

function missingFields(entity: AlkonEntity) {
  const missing: string[] = [];

  if (!entity.purpose) missing.push("purpose");
  if (!entity.ownerArea || !entity.ownerWorker) missing.push("owner");
  if (!entity.visibility) missing.push("visibility");
  if (!entity.lifecycle) missing.push("lifecycle");
  if (!entity.dependencies && !entity.relatedSystems) missing.push("relationships");
  if (!entity.validation.methods.length) missing.push("validation");
  if (!entity.memoryRule) missing.push("memory rule");
  if (!entity.riskLevel) missing.push("risk");
  if (!entity.reportTarget) missing.push("report target");
  if (!entity.deprecationRule || !entity.removalRule) missing.push("stay/remove rule");

  return missing;
}

function statusForEntity(
  entity: AlkonEntity,
  missing: string[],
  validationMissing: boolean,
  orphaned: boolean
): OntologyCompletenessStatus {
  if (!entity.ownerArea || !entity.ownerWorker) return "missing_owner";
  if (validationMissing) return "missing_validation";
  if (!entity.memoryRule) return "missing_memory";
  if (orphaned) return "orphaned";
  if (missing.length > 0) return "partial";
  if (entity.riskLevel === "black_hole" || entity.riskLevel === "blocked") return "blocked";
  return "complete";
}

function priorityForStatus(
  status: OntologyCompletenessStatus,
  entity: AlkonEntity
): OntologyCompletenessReport["cleanupPriority"] {
  if (status === "missing_owner" || status === "orphaned") return "P0";
  if (status === "missing_validation" || entity.riskLevel === "founder_approval_required") {
    return "P1";
  }
  if (status !== "complete") return "P2";

  return "none";
}

export function checkOntologyCompleteness(entities: AlkonEntity[]) {
  const graph = buildEntityRelationshipGraph(entities);
  const validationReports = evaluateEntitiesValidation(entities);
  const deprecationReports = evaluateEntitiesDeprecation(entities, graph);
  const reports: OntologyCompletenessReport[] = entities.map((entity) => {
    const missing = missingFields(entity);
    const validationReport = validationReports.find(
      (report) => report.entityId === entity.entityId
    );
    const validationMissing = validationReport?.status === "missing_validation";
    const orphaned = graph.orphanedEntities.includes(entity.entityId);
    const status = statusForEntity(entity, missing, validationMissing, orphaned);
    const cleanupPriority = priorityForStatus(status, entity);

    return {
      entityId: entity.entityId,
      status,
      missingFields: validationMissing
        ? [...missing, ...(validationReport?.missingMethods ?? [])]
        : missing,
      cleanupPriority,
      recommendedAction:
        cleanupPriority === "P0"
          ? "Review immediately before more work depends on it."
          : cleanupPriority === "P1"
            ? "Add validation or Founder review before acceptance."
            : cleanupPriority === "P2"
              ? "Improve documentation, memory, or relationship details."
              : "Keep and monitor.",
    };
  });
  const scoreByWorld = (world: AlkonEntity["world"]) => {
    const scoped = reports.filter((report) =>
      entities.find(
        (entity) => entity.entityId === report.entityId && entity.world === world
      )
    );
    const complete = scoped.filter((report) => report.status === "complete").length;

    return scoped.length === 0
      ? 0
      : Math.round((complete / scoped.length) * 100);
  };

  return {
    reports,
    graph,
    validationReports,
    deprecationReports,
    publicCompletenessScore: scoreByWorld("public_earth"),
    privateAlkonCompletenessScore: scoreByWorld("private_alkon"),
    invisibleLayerCompletenessScore: scoreByWorld("invisible_operating_layer"),
    cleanupCandidates: reports.filter(
      (report) => report.cleanupPriority !== "none"
    ),
    cleanupPriorities: {
      P0: reports
        .filter((report) => report.cleanupPriority === "P0")
        .map((report) => report.entityId),
      P1: reports
        .filter((report) => report.cleanupPriority === "P1")
        .map((report) => report.entityId),
      P2: reports
        .filter((report) => report.cleanupPriority === "P2")
        .map((report) => report.entityId),
    },
  };
}
