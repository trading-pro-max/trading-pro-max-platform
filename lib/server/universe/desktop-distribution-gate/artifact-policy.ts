import "server-only";

import type { DesktopDistributionGateCheck } from "./types";

export function getDesktopArtifactPolicy(): DesktopDistributionGateCheck {
  return {
    id: "desktop_artifact_policy",
    label: "Desktop artifact policy",
    state: "ready_with_notes",
    status: "Artifacts are local-only and no installers are uploaded or published.",
    checks: [
      "Artifacts local-only.",
      "Artifacts not uploaded.",
      "Artifacts not public.",
      "Artifacts must not include secrets.",
      "Generated artifacts must be ignored or documented if applicable.",
    ],
    evidence: [
      "desktop:package:dry-run creates no artifact.",
      "No installers are uploaded or published.",
      "No secrets are stored in the desktop bundle.",
    ],
    risk: "Future artifacts must be audited before any private transfer decision.",
    nextAction: "Document and inspect any future artifact before it leaves Ahmad control.",
  };
}

export function getDesktopDistributionSecretSafety(): DesktopDistributionGateCheck {
  return {
    id: "desktop_distribution_secret_safety",
    label: "Secret safety",
    state: "ready_with_notes",
    status: "No secrets are stored in the desktop bundle.",
    checks: [
      "No secrets in Git.",
      "No secrets in desktop bundle.",
      "No API keys in desktop shell.",
      "No private documents in public assets.",
      "No external account auto-connect.",
    ],
    evidence: [
      "Local Packaged Auth Gate.",
      "Private Desktop Packaging Preparation.",
      "Private Desktop Local Build Dry Run.",
    ],
    risk: "Secret safety remains an artifact audit requirement until a real package exists.",
    nextAction: "Keep secrets out of source, artifacts, and any future transfer path.",
  };
}
