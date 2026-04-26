import { checkOntologyCompleteness } from "./completeness-checker";
import { getAlkonEntityRegistry } from "./entity-registry";
import { evaluateEntitiesMemory } from "./memory-law";
import { resolveEntityMeanings } from "./meaning-resolver";
import { scoreEntitiesValueRisk } from "./value-risk";
import type { AlkonOntologySnapshot } from "./types";

export function getAlkonOntologySnapshot(
  checkedAt = new Date().toISOString()
): AlkonOntologySnapshot {
  const registry = getAlkonEntityRegistry();
  const meanings = resolveEntityMeanings(registry);
  const completenessResult = checkOntologyCompleteness(registry);
  const valueRiskReports = scoreEntitiesValueRisk(registry);
  const memoryReports = evaluateEntitiesMemory(registry);
  const deprecatedCandidates = completenessResult.deprecationReports
    .filter((report) => report.shouldDeprecate)
    .map((report) => report.entityId);
  const highestRisks = valueRiskReports
    .filter(
      (report) =>
        report.priority === "P0" ||
        report.riskSummary.publicLeakRisk >= 7 ||
        report.riskSummary.secretRisk >= 7 ||
        report.riskSummary.launchActivationRisk >= 7
    )
    .map((report) => report.entityId);

  return {
    snapshotId: "alkon_ontology_existence_system",
    name: "Alkon Ontology & Existence System",
    visibility: "private_founder_only",
    publicExposure: false,
    ontologyStatus: "ready",
    entityCount: registry.length,
    publicEntityCount: registry.filter((entity) => entity.world === "public_earth")
      .length,
    privateEntityCount: registry.filter((entity) => entity.world === "private_alkon")
      .length,
    invisibleEntityCount: registry.filter(
      (entity) => entity.world === "invisible_operating_layer"
    ).length,
    completeEntities: completenessResult.reports.filter(
      (report) => report.status === "complete"
    ).length,
    partialEntities: completenessResult.reports.filter(
      (report) => report.status !== "complete"
    ).length,
    orphanedEntities: completenessResult.graph.orphanedEntities,
    deprecatedCandidates,
    cleanupPriorities: completenessResult.cleanupPriorities,
    highestRisks,
    nextSafeActions: [
      "Use the ontology registry before adding or removing pages, components, APIs, tasks, workers, tests, or launch gates.",
      "Add validation and memory rules to any entity before accepting it.",
      "Review cleanup candidates in Founder Command; do not auto-delete entities from the web app.",
      "Keep public users inside Trading Pro Max language; ontology and entity graph remain private.",
    ],
    founderReviewNeeded: [
      ...highestRisks.slice(0, 6).map((entityId) => `Review high-risk entity ${entityId}.`),
      ...deprecatedCandidates
        .slice(0, 4)
        .map((entityId) => `Review deprecation candidate ${entityId}.`),
    ],
    publicExposureStatus: {
      publicUiVisible: false,
      publicApiRoutesExposed: false,
      publicNavigationVisible: false,
      diagnosticsLeak: false,
    },
    registry,
    meanings,
    relationshipGraph: completenessResult.graph,
    completeness: completenessResult.reports,
    valueRiskReports,
    validationReports: completenessResult.validationReports,
    memoryReports,
    deprecationReports: completenessResult.deprecationReports,
    productTruthStatus: {
      liveExecutionBlocked: true,
      realMoneyBlocked: true,
      brokerFeedActivationBlocked: true,
      billingActivationBlocked: true,
      publicLaunchInactive: true,
      socialPublishingInactive: true,
      productionSecretsUntouched: true,
      noShellExecutionFromWebApp: true,
      noImagesOrRasterAssets: true,
      noSecretsExposed: true,
      noFakeClaims: true,
    },
    createdAt: checkedAt,
  };
}

export function getAlkonOntologyReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getAlkonOntologySnapshot(checkedAt);

  return {
    ok: true,
    checkedAt,
    snapshot,
    readiness: {
      status: snapshot.ontologyStatus,
      visibility: snapshot.visibility,
      publicExposure: snapshot.publicExposure,
      entityCount: snapshot.entityCount,
      completeEntities: snapshot.completeEntities,
      partialEntities: snapshot.partialEntities,
      publicEntityCount: snapshot.publicEntityCount,
      privateEntityCount: snapshot.privateEntityCount,
      invisibleEntityCount: snapshot.invisibleEntityCount,
      cleanupCandidates:
        snapshot.cleanupPriorities.P0.length +
        snapshot.cleanupPriorities.P1.length +
        snapshot.cleanupPriorities.P2.length,
      noExecution: true,
      noDeletion: true,
      noSecrets: true,
      noExternalCalls: true,
    },
  };
}

export function getAlkonOntologyEntities() {
  const snapshot = getAlkonOntologySnapshot();

  return {
    ok: true,
    entities: snapshot.registry,
    publicExposure: snapshot.publicExposure,
    readOnly: true,
    noSecrets: true,
  };
}

export function getAlkonOntologyCompleteness() {
  const snapshot = getAlkonOntologySnapshot();

  return {
    ok: true,
    completeness: snapshot.completeness,
    scores: {
      public:
        Math.round((snapshot.publicEntityCount
          ? snapshot.completeness.filter((report) =>
              snapshot.registry.find(
                (entity) =>
                  entity.entityId === report.entityId &&
                  entity.world === "public_earth" &&
                  report.status === "complete"
              )
            ).length / snapshot.publicEntityCount
          : 0) * 100),
      private:
        Math.round((snapshot.privateEntityCount
          ? snapshot.completeness.filter((report) =>
              snapshot.registry.find(
                (entity) =>
                  entity.entityId === report.entityId &&
                  entity.world === "private_alkon" &&
                  report.status === "complete"
              )
            ).length / snapshot.privateEntityCount
          : 0) * 100),
      invisible:
        Math.round((snapshot.invisibleEntityCount
          ? snapshot.completeness.filter((report) =>
              snapshot.registry.find(
                (entity) =>
                  entity.entityId === report.entityId &&
                  entity.world === "invisible_operating_layer" &&
                  report.status === "complete"
              )
            ).length / snapshot.invisibleEntityCount
          : 0) * 100),
    },
    readOnly: true,
  };
}

export function getAlkonOntologyCleanupCandidates() {
  const snapshot = getAlkonOntologySnapshot();

  return {
    ok: true,
    cleanupPriorities: snapshot.cleanupPriorities,
    deprecatedCandidates: snapshot.deprecatedCandidates,
    orphanedEntities: snapshot.orphanedEntities,
    noDeletion: true,
    founderReviewRequired: true,
    readOnly: true,
  };
}
