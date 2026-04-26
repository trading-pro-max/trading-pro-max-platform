import type {
  AlkonEntity,
  EntityLifecycle,
  EntityLifecycleDecision,
} from "./types";

const ALLOWED_TRANSITIONS: Record<EntityLifecycle, EntityLifecycle[]> = {
  idea: ["planned"],
  planned: ["drafted"],
  drafted: ["built", "planned"],
  built: ["tested", "drafted"],
  tested: ["accepted", "built"],
  accepted: ["monitored", "improved", "deprecated"],
  monitored: ["improved", "deprecated"],
  improved: ["tested", "accepted", "deprecated"],
  deprecated: ["archived", "removed"],
  removed: ["archived"],
  archived: [],
};

function hasValidation(entity: AlkonEntity) {
  return entity.validation.methods.length > 0 && entity.validation.productTruthCheck;
}

export function evaluateLifecycleTransition(
  entity: AlkonEntity,
  to: EntityLifecycle
): EntityLifecycleDecision {
  const allowedByChain = (ALLOWED_TRANSITIONS[entity.lifecycle] ?? []).includes(to);

  if (!allowedByChain) {
    return {
      entityId: entity.entityId,
      from: entity.lifecycle,
      to,
      allowed: false,
      reason: `${entity.lifecycle} cannot transition directly to ${to}.`,
    };
  }

  if (to === "accepted" && !hasValidation(entity)) {
    return {
      entityId: entity.entityId,
      from: entity.lifecycle,
      to,
      allowed: false,
      reason: "No accepted entity without validation and Product Truth check.",
    };
  }

  if (
    to === "accepted" &&
    entity.publicVisible &&
    !entity.validation.publicPrivateLeakCheck
  ) {
    return {
      entityId: entity.entityId,
      from: entity.lifecycle,
      to,
      allowed: false,
      reason: "Public entity cannot be accepted without public/private leak check.",
    };
  }

  if (
    to === "accepted" &&
    entity.riskLevel === "founder_approval_required" &&
    !entity.validation.methods.includes("founder_review")
  ) {
    return {
      entityId: entity.entityId,
      from: entity.lifecycle,
      to,
      allowed: false,
      reason: "Sensitive entity requires Founder review before acceptance.",
    };
  }

  if (
    to === "accepted" &&
    entity.type === "visual_identity" &&
    !entity.validation.methods.includes("visual_acceptance")
  ) {
    return {
      entityId: entity.entityId,
      from: entity.lifecycle,
      to,
      allowed: false,
      reason: "Visual entity requires visual proof or human review.",
    };
  }

  if (to === "accepted" && entity.type === "launch_gate") {
    return {
      entityId: entity.entityId,
      from: entity.lifecycle,
      to,
      allowed: entity.validation.methods.includes("launch_gate"),
      reason: entity.validation.methods.includes("launch_gate")
        ? "Launch gate validation exists."
        : "Launch entity cannot be accepted without launch gate validation.",
    };
  }

  return {
    entityId: entity.entityId,
    from: entity.lifecycle,
    to,
    allowed: true,
    reason: "Transition is allowed under ontology lifecycle law.",
  };
}

export function getLifecycleChain() {
  return [
    "idea",
    "planned",
    "drafted",
    "built",
    "tested",
    "accepted",
    "monitored",
    "improved",
    "deprecated",
    "archived",
  ] as const;
}
