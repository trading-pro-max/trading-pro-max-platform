import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getDesktopAuthReadiness(): DesktopPackagingReadiness {
  return {
    id: "desktop_auth_readiness",
    label: "Local packaged-app auth readiness",
    state: "future_gate",
    status: "Packaged-app local authentication is not implemented yet.",
    checks: [
      "Packaged-app local auth exists: no.",
      "Production-grade packaged auth claim: no.",
      "External account auth: not connected.",
      "Local packaged-app auth remains a future gate.",
    ],
    evidence: [
      "Desktop shell status lists local packaged-app auth as not done.",
      "Absolute Founder Boundary blocks external account connection without Ahmad approval.",
    ],
    risk: "A packaged private app must not open sensitive command surfaces without a local auth gate.",
    nextAction: "Close Local Packaged Auth Gate before private packaging preparation.",
  };
}
