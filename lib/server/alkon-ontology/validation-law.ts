import type {
  AlkonEntity,
  EntityValidationMethod,
  EntityValidationReport,
} from "./types";

function requiredMethodsForEntity(entity: AlkonEntity): EntityValidationMethod[] {
  const required = new Set<EntityValidationMethod>([
    "typescript",
    "eslint",
    "build",
    "regression_test",
    "product_truth_check",
  ]);

  if (entity.publicVisible) {
    required.add("public_private_leak_check");
    required.add("screenshot_proof");
  }

  if (entity.world === "private_alkon") {
    required.add("public_private_leak_check");
  }

  if (entity.type === "api") {
    required.add("api_safety_check");
    required.add("public_private_leak_check");
  }

  if (entity.type === "visual_identity") {
    required.add("screenshot_proof");
    required.add("visual_acceptance");
  }

  if (entity.type === "launch_gate") {
    required.add("launch_gate");
    required.add("founder_review");
  }

  if (entity.type === "assistant_intent") {
    required.add("regression_test");
    required.add("public_private_leak_check");
  }

  if (/security|secret/i.test(entity.name)) {
    required.add("security_review");
  }

  return Array.from(required);
}

export function evaluateEntityValidation(entity: AlkonEntity): EntityValidationReport {
  const requiredMethods = requiredMethodsForEntity(entity);
  const missingMethods = requiredMethods.filter(
    (method) => !entity.validation.methods.includes(method)
  );

  return {
    entityId: entity.entityId,
    status: missingMethods.length > 0 ? "missing_validation" : "valid",
    requiredMethods,
    missingMethods,
    reason:
      missingMethods.length > 0
        ? `Missing validation: ${missingMethods.join(", ")}.`
        : "Entity satisfies ontology validation law.",
  };
}

export function evaluateEntitiesValidation(entities: AlkonEntity[]) {
  return entities.map(evaluateEntityValidation);
}
