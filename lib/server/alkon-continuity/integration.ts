import type {
  AlkonEntityBirthRequest,
  AlkonEntityFunction,
  AlkonEntityIdentity,
  AlkonEntityIntegration,
} from "./types";

export function reviewAlkonEntityIntegration(
  identity: AlkonEntityIdentity,
  entityFunction: AlkonEntityFunction,
  request: AlkonEntityBirthRequest
): AlkonEntityIntegration {
  const dependencies = [
    "Product Truth",
    "public/private boundary",
    "memory rule",
    "validation rule",
    "Founder Command report target",
  ];
  const connectedSystems = [
    identity.owner,
    identity.world === "public_earth" ? "Earth Reality" : "Alkon private systems",
    identity.category === "treasury_system" ? "Treasury Life" : "",
    identity.category === "media_system" ? "Media Claims Firewall" : "",
    identity.category === "assistant_intent" ? "TPM Assistant" : "",
  ].filter(Boolean);
  const tests = [
    "typescript",
    "eslint",
    "regression",
    "public leak check",
    identity.category === "api" ? "API safety check" : "",
    identity.world === "public_earth" ? "public screenshot proof" : "private no-leak proof",
  ].filter(Boolean);
  const missingDependencies = [
    identity.owner ? "" : "owner",
    request.requestsDeletion && !request.dependentsMigrated ? "dependency migration proof" : "",
    entityFunction.functionStatus === "review_required" ? "clear function" : "",
  ].filter(Boolean);

  return {
    entityId: identity.entityId,
    completeness: missingDependencies.length ? "partial" : "complete",
    ownerSystem: identity.owner,
    connectedSystems,
    dependencies,
    dependentSystems:
      identity.category === "cleanup_candidate"
        ? ["dependent migration review required"]
        : ["Founder Command summary", "Product Memory rule"],
    tests,
    docsRequired: true,
    missingDependencies,
    orphanedRisk: !identity.owner || missingDependencies.includes("clear function"),
    circularRisk: false,
    publicPrivateRisk: identity.world === "private_alkon" && identity.publicVisible,
  };
}
