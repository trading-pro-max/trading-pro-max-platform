import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getDesktopPrivateDistributionReadiness(): DesktopPackagingReadiness {
  return {
    id: "desktop_private_distribution_readiness",
    label: "Private distribution readiness",
    state: "needs_ahmad_decision",
    status: "Private distribution is the only allowed direction; public distribution is blocked.",
    checks: [
      "Private distribution only.",
      "Public desktop distribution is blocked.",
      "No public release.",
      "Distribution method pending Ahmad decision.",
    ],
    evidence: [
      "Desktop Shell Finalization report.",
      "Product Truth blocks public launch and public Universe exposure.",
    ],
    risk: "Any public desktop distribution would expose a private Ahmad-only client.",
    nextAction: "Define a private-only distribution method later after local auth and signing decisions.",
  };
}
