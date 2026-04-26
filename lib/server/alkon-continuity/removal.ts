import type {
  AlkonEntityBirthRequest,
  AlkonEntityDeprecation,
  AlkonEntityIdentity,
  AlkonEntityRemoval,
} from "./types";

export function reviewAlkonEntityRemoval(
  identity: AlkonEntityIdentity,
  deprecation: AlkonEntityDeprecation,
  request: AlkonEntityBirthRequest
): AlkonEntityRemoval {
  if (deprecation.protectedCore && request.requestsDeletion) {
    return {
      entityId: identity.entityId,
      canRemove: false,
      decision: "founder_approval_required",
      reason: "Protected core systems cannot be removed without explicit Founder approval and safe migration.",
      rollbackRequired: true,
      memoryArchiveRequired: true,
    };
  }

  if (!request.requestsDeletion && !deprecation.shouldDeprecate) {
    return {
      entityId: identity.entityId,
      canRemove: false,
      decision: "not_needed",
      reason: "Removal is not needed; entity should be monitored or improved.",
      rollbackRequired: false,
      memoryArchiveRequired: true,
    };
  }

  if (!request.dependentsMigrated) {
    return {
      entityId: identity.entityId,
      canRemove: false,
      decision: "dependency_migration_required",
      reason: "Removal requires dependent migration, Product Truth preservation, tests, rollback, and report generation.",
      rollbackRequired: true,
      memoryArchiveRequired: true,
    };
  }

  return {
    entityId: identity.entityId,
    canRemove: true,
    decision: "ready_to_archive",
    reason: "Entity can only be archived/removed after proof, migration, rollback, and Founder-visible report.",
    rollbackRequired: true,
    memoryArchiveRequired: true,
  };
}
