import type {
  AlkonEntityDeprecation,
  AlkonEntityIdentity,
  AlkonEntityIntegration,
  AlkonEntityLifeState,
} from "./types";

const PROTECTED_CORE = [
  "product truth",
  "security",
  "secrets",
  "plan entitlements",
  "public/private boundary",
  "alkon core",
  "product memory",
  "launch gate",
  "treasury",
  "tax",
  "legal",
  "guardian",
  "codex",
  "result tribunal",
];

export function reviewAlkonEntityDeprecation(
  identity: AlkonEntityIdentity,
  integration: AlkonEntityIntegration,
  life: AlkonEntityLifeState
): AlkonEntityDeprecation {
  const protectedCore = PROTECTED_CORE.some((term) =>
    identity.name.toLowerCase().includes(term) ||
    (term !== "alkon core" && identity.owner.toLowerCase() === term)
  );
  const shouldDeprecate =
    !protectedCore &&
    (identity.category === "cleanup_candidate" ||
      life.health === "deprecation_candidate" ||
      life.health === "cleanup_candidate" ||
      integration.orphanedRisk ||
      integration.publicPrivateRisk);

  return {
    entityId: identity.entityId,
    shouldDeprecate,
    protectedCore,
    reason: protectedCore
      ? "Core truth, security, memory, launch, legal, treasury, or Alkon systems cannot be auto-deprecated."
      : shouldDeprecate
        ? "Entity is duplicated, unclear, risky, orphaned, or a cleanup candidate."
        : "Entity still has reason to stay.",
    requiredMigration: shouldDeprecate
      ? ["dependent systems migrated", "Product Truth preserved", "tests updated", "rollback ready", "memory archived"]
      : [],
  };
}
