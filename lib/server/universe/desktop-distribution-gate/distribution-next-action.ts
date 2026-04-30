import "server-only";

import type { DesktopDistributionNextAction } from "./types";

export function getDesktopDistributionNextAction(): DesktopDistributionNextAction {
  return {
    next: "Ahmad decision required",
    reason:
      "Private distribution cannot proceed until Ahmad chooses a private transfer method after native shell, local auth, artifact audit, and signing decisions are ready.",
    blockedUntil: [
      "Ahmad chooses a private desktop distribution method.",
      "A native shell exists.",
      "Real packaged-app auth exists.",
      "A local artifact is generated and audited.",
      "No secrets are stored in artifacts.",
      "Production signing remains blocked until a future approved gate.",
      "Public desktop distribution remains blocked.",
    ],
  };
}
