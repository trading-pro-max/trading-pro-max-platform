import "server-only";

import {
  getTotalExistenceEntityRegistry,
  type TotalExistenceEntity,
} from "../total-existence";

export type LivingEntity = TotalExistenceEntity & {
  memoryPath: string;
  livingState: "awake" | "protected" | "controlled_internal" | "ready_not_started";
  capability: string;
};

function toLivingEntity(entity: TotalExistenceEntity): LivingEntity {
  const livingState =
    entity.status === "ready_not_started"
      ? "ready_not_started"
      : entity.status === "protected"
        ? "protected"
        : entity.ownerLayer === "automation_surface"
          ? "controlled_internal"
          : "awake";

  return {
    ...entity,
    livingState,
    memoryPath: entity.reportPath,
    capability: entity.executionVerdict,
  };
}

const LIVING_ENTITIES = getTotalExistenceEntityRegistry().map(toLivingEntity);

export function getLivingEntities() {
  return LIVING_ENTITIES;
}

export function getLivingEntityById(entityId: string) {
  return LIVING_ENTITIES.find((entity) => entity.id === entityId) ?? null;
}

export function getLivingCapabilities() {
  return LIVING_ENTITIES.map((entity) => ({
    id: entity.id,
    capability: entity.capability,
    verdict: entity.executionVerdict,
  }));
}

export function getLivingDetails() {
  return LIVING_ENTITIES.map((entity) => ({
    id: entity.id,
    why: entity.reasonForExistence,
    layer: entity.ownerLayer,
    source: entity.sourceTruth,
  }));
}

export function getLivingActions() {
  return LIVING_ENTITIES.map((entity) => ({
    id: entity.id,
    verdict: entity.executionVerdict,
    nextAction: entity.nextAction,
  }));
}

export function getLivingMemory() {
  return LIVING_ENTITIES.map((entity) => ({
    id: entity.id,
    memoryPath: entity.memoryPath,
    noSecrets: true,
  }));
}

export function getLivingTruth() {
  return [
    "الكون هو كيان إلكتروني حي داخل لابتوب أحمد.",
    "كل طبقة داخل الكون لها وجود ومعنى وحالة وقدرة.",
    "كل شيء داخل الكون يمكن تفسيره من ∞ إلى 0.",
    "كل شيء حقيقي له مصدر، وكل محاكاة موسومة.",
  ];
}

export function getLivingProtection() {
  return LIVING_ENTITIES.map((entity) => ({
    id: entity.id,
    protectionStatus: entity.protectionStatus,
    productTruthImpact: entity.productTruthImpact,
  }));
}

export function getLivingVerdict(entityId: string) {
  const entity = getLivingEntityById(entityId);
  return entity
    ? {
        entityId,
        verdict: entity.executionVerdict,
        protection: entity.protectionStatus,
      }
    : {
        entityId,
        verdict: "blocked until entity is registered inside الكون",
        protection: "unknown entity blocked",
      };
}

export function explainEntityFromInfinityToZero(entityId: string) {
  return (
    getLivingEntityById(entityId)?.infinityToZeroExplanation ??
    "∞ unknown entity -> missing registry evidence -> Product Truth block -> 0 no execution."
  );
}

export function getLivingOntologyNextAction() {
  return "Keep every living entity mapped to layer, truth source, protection, capability, memory, verdict, and ∞ to 0 explanation.";
}

export function getAlKawnLivingOntology() {
  return {
    title: "Living Ontology Core",
    status: "closed_living_private_ontology",
    requiredWording: getLivingTruth(),
    entities: getLivingEntities(),
    capabilities: getLivingCapabilities(),
    details: getLivingDetails(),
    actions: getLivingActions(),
    memory: getLivingMemory(),
    truth: getLivingTruth(),
    protection: getLivingProtection(),
    nextAction: getLivingOntologyNextAction(),
  };
}
