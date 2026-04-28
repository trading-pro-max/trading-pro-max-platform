import { getApiExistenceEntities } from "./api-classifier";
import { getCodebaseExistenceEntities } from "./codebase-classifier";
import { getComponentExistenceEntities } from "./component-classifier";
import { getCssExistenceEntities } from "./css-classifier";
import { getDesktopExistenceEntities } from "./desktop-classifier";
import { getRouteExistenceEntities } from "./route-classifier";
import type { ExistenceEntity } from "./types";

export function getExistenceEntityInventory(): ExistenceEntity[] {
  return [
    ...getDesktopExistenceEntities(),
    ...getCodebaseExistenceEntities(),
    ...getRouteExistenceEntities(),
    ...getApiExistenceEntities(),
    ...getComponentExistenceEntities(),
    ...getCssExistenceEntities(),
  ];
}

export function getUnknownExistenceEntities(entities = getExistenceEntityInventory()) {
  return entities.filter(
    (entity) =>
      entity.owner === "unknown_needs_ahmad" ||
      entity.visibility === "unknown" ||
      entity.evidence.status === "missing"
  );
}

export function getBlockedExistenceEntities(entities = getExistenceEntityInventory()) {
  return entities.filter(
    (entity) =>
      entity.lifecycle === "blocked" ||
      entity.nextFate === "block" ||
      entity.nextFate === "black_hole" ||
      entity.risk.level === "p0"
  );
}

export function getCleanupCandidateExistenceEntities(
  entities = getExistenceEntityInventory()
) {
  return entities.filter(
    (entity) =>
      entity.lifecycle === "cleanup_candidate" ||
      entity.nextFate === "delete_later_after_review" ||
      entity.owner === "inbox_needs_sorting"
  );
}

export function getProtectedExistenceEntities(entities = getExistenceEntityInventory()) {
  return entities.filter(
    (entity) => entity.lifecycle === "protected" || entity.nextFate === "protect"
  );
}
