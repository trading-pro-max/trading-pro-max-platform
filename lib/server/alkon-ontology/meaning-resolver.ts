import type { AlkonEntity, EntityMeaningResolution } from "./types";

const PUBLIC_PURPOSE_WORDS = /clarity|access|learn|support|trust|workspace|paper|truth|guide|explain/i;
const PRIVATE_PURPOSE_WORDS = /Founder|Ahmad|command|construction|safety|memory|report|review|govern|tribunal/i;
const INVISIBLE_PURPOSE_WORDS = /truth|safety|mapping|entitlement|context|protect|guard|boundary|privacy/i;

function missingFields(entity: AlkonEntity) {
  const missing: string[] = [];

  if (!entity.purpose) missing.push("purpose");
  if (!entity.ownerArea || !entity.ownerWorker) missing.push("owner");
  if (!entity.validation.methods.length) missing.push("validation");
  if (!entity.memoryRule) missing.push("memoryRule");
  if (!entity.reportTarget) missing.push("reportTarget");
  if (!entity.deprecationRule || !entity.removalRule) missing.push("stay/remove rule");

  return missing;
}

export function resolveEntityMeaning(entity: AlkonEntity): EntityMeaningResolution {
  const missing = missingFields(entity);
  const purposeText = `${entity.purpose} ${entity.serves.join(" ")} ${entity.outputs.join(" ")}`;
  const matchesWorldPurpose =
    (entity.world === "public_earth" && PUBLIC_PURPOSE_WORDS.test(purposeText)) ||
    (entity.world === "private_alkon" && PRIVATE_PURPOSE_WORDS.test(purposeText)) ||
    (entity.world === "invisible_operating_layer" &&
      INVISIBLE_PURPOSE_WORDS.test(purposeText));
  const hasValue = Object.values(entity.valueScore).some((score) => score >= 6);
  const orphaned =
    entity.dependencies.length === 0 &&
    entity.relatedSystems.length === 0 &&
    entity.world !== "invisible_operating_layer";

  let meaningStatus: EntityMeaningResolution["meaningStatus"] = "meaningful";
  let recommendedAction: EntityMeaningResolution["recommendedAction"] = "keep";

  if (missing.length > 0) {
    meaningStatus = "partial_meaning";
    recommendedAction = "improve";
  } else if (orphaned) {
    meaningStatus = "orphaned";
    recommendedAction = "review";
  } else if (!matchesWorldPurpose || !hasValue) {
    meaningStatus = "unclear";
    recommendedAction = "review";
  } else if (entity.status === "deprecated") {
    meaningStatus = "should_deprecate";
    recommendedAction = "deprecate";
  } else if (entity.status === "archived") {
    meaningStatus = "should_remove";
    recommendedAction = "remove";
  }

  return {
    entityId: entity.entityId,
    meaningStatus,
    reasonToExist: entity.purpose,
    valueSummary: `${entity.name} serves ${entity.serves.join(", ")} through ${entity.outputs.join(", ")}.`,
    removalImpact:
      entity.dependencies.length > 0 || entity.publicVisible
        ? "Removal would affect connected public or internal readiness and requires migration."
        : "Removal impact is limited if report targets, memory, and tests are updated.",
    recommendedAction,
    missingFields: missing,
  };
}

export function resolveEntityMeanings(entities: AlkonEntity[]) {
  return entities.map(resolveEntityMeaning);
}
