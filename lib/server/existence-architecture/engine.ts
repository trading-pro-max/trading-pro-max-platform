import "server-only";

import { getApiExistenceEntities } from "./api-classifier";
import { getCodebaseExistenceEntities } from "./codebase-classifier";
import { getComponentExistenceEntities } from "./component-classifier";
import { getCssExistenceEntities } from "./css-classifier";
import { getDesktopExistenceEntities } from "./desktop-classifier";
import { decideExistenceGate } from "./existence-gate";
import { reviewExistenceEntity } from "./existence-questions";
import { mapExistenceEntityToJar } from "./jar-map";
import { getRouteExistenceEntities } from "./route-classifier";
import {
  getBlockedExistenceEntities,
  getCleanupCandidateExistenceEntities,
  getExistenceEntityInventory,
  getProtectedExistenceEntities,
  getUnknownExistenceEntities,
} from "./state";
import type { ExistenceEntity, ExistenceSnapshot } from "./types";

function gateEntity(entity: ExistenceEntity) {
  const review = reviewExistenceEntity(entity);
  return decideExistenceGate(entity, review.missingAnswers, review.jarId);
}

export function getExistenceArchitectureSnapshot(
  checkedAt = new Date().toISOString()
): ExistenceSnapshot {
  const desktopEntities = getDesktopExistenceEntities();
  const codebaseEntities = getCodebaseExistenceEntities();
  const routeEntities = getRouteExistenceEntities();
  const apiEntities = getApiExistenceEntities();
  const componentEntities = getComponentExistenceEntities();
  const cssEntities = getCssExistenceEntities();
  const entities = getExistenceEntityInventory();
  const reviews = entities.map((entity) => reviewExistenceEntity(entity));
  const gates = entities.map((entity) => gateEntity(entity));
  const unknownEntities = getUnknownExistenceEntities(entities);
  const blockedEntities = getBlockedExistenceEntities(entities);
  const cleanupCandidates = getCleanupCandidateExistenceEntities(entities);
  const protectedEntities = getProtectedExistenceEntities(entities);

  return {
    checkedAt,
    status: "active_with_notes",
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noPublicExposure: true,
    totalEntitiesReviewed: entities.length,
    unknownEntities,
    blockedEntities,
    cleanupCandidates,
    protectedEntities,
    jarMappedItems: reviews.filter(
      (review) =>
        review.decision !== "allowed" ||
        review.jarId === "jar_6_cleanup" ||
        review.jarId === "jar_7_evidence"
    ),
    routeHealth: "canonical_with_compatibility",
    apiBoundaryHealth: "founder_private_read_only_with_notes",
    componentHealth: "connected_with_cleanup_candidates",
    cssHealth: "owned_with_cleanup_candidates",
    oneNextStructuralAction:
      "Review unknown and cleanup-candidate entities through Jar before any new build or deletion.",
    whatNotToDo: [
      "Do not let files, folders, routes, APIs, components, CSS, reports, tests, tools, assets, or ideas enter code without owner, purpose, boundary, evidence, lifecycle, and next fate.",
      "Do not expose Permission-to-Exist, Jar internals, Alkon -0, Founder Command, Kernel, Zero Truth, Reality Trial, or internal governance publicly.",
      "Do not start Local Day One, billing, live trading, real money, broker/feed, production, shell execution, Codex execution, or payment execution.",
      "Do not delete uncertain files; classify them into Jar, Inbox, cleanup_candidate, protected, or needs_ahmad_decision.",
    ],
    desktopEntities,
    codebaseEntities,
    routeEntities,
    apiEntities,
    componentEntities,
    cssEntities,
    reviews,
    gates,
  };
}

export function getExistenceArchitectureReadiness(
  checkedAt = new Date().toISOString()
) {
  const snapshot = getExistenceArchitectureSnapshot(checkedAt);

  return {
    checkedAt,
    status: "ready_with_notes" as const,
    founderOnly: true,
    readOnly: true,
    noExecution: true,
    noPublicExposure: true,
    totalEntitiesReviewed: snapshot.totalEntitiesReviewed,
    unknownCount: snapshot.unknownEntities.length,
    blockedPatternCount: snapshot.blockedEntities.length,
    cleanupCandidateCount: snapshot.cleanupCandidates.length,
    protectedCount: snapshot.protectedEntities.length,
    oneNextStructuralAction: snapshot.oneNextStructuralAction,
  };
}

export function classifyUnknownEntityToJar(entity: ExistenceEntity) {
  const review = reviewExistenceEntity(entity);

  return {
    entityId: entity.id,
    jarId: mapExistenceEntityToJar(entity, review.missingAnswers),
    decision: review.decision,
    reason: review.reason,
  };
}
