import type { JarBuildItem, JarCommandPassportPreview, JarExitPermit } from "./types";

export function buildJarCommandPassportPreview(
  item: JarBuildItem,
  permit: JarExitPermit
): JarCommandPassportPreview {
  return {
    itemId: item.id,
    status: permit.commandPassportAllowed ? "preview_ready" : "blocked_until_exit_permit",
    mission: item.title,
    ownershipLayer:
      item.jarId === "jar_5_private_alkon"
        ? "Private Alkon -0"
        : item.jarId === "jar_2_heart"
        ? "Public Pro Max Trading"
        : item.jarId === "jar_6_cleanup"
        ? "Docs / Reports / Cleanup"
        : "Invisible Operating Layer",
    allowedScope: [
      "read-only analysis",
      "safe code edits inside current mission",
      "tests and reports",
      "public/private boundary preservation",
    ],
    forbiddenScope: item.blockedActions,
    validation: permit.validationRequired,
    evidence: item.evidenceRequired,
    stopConditions: permit.stopConditions,
    previewOnly: true,
    noExecution: true,
  };
}
