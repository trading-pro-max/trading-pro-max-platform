import "server-only";

import type { DesktopPackagingReadiness } from "./types";

export function getDesktopAuthReadiness(): DesktopPackagingReadiness {
  return {
    id: "desktop_auth_readiness",
    label: "Local packaged-app auth readiness",
    state: "future_gate",
    status: "Local Packaged Auth Gate is defined; packaged-app authentication is not implemented yet.",
    checks: [
      "Local Packaged Auth Gate exists: yes.",
      "Packaged-app local auth exists: no.",
      "Production-grade packaged auth claim: no.",
      "External account auth: not connected.",
      "Local packaged-app auth remains a future gate.",
    ],
    evidence: [
      "Local Packaged Auth Gate documents the requirements.",
      "Desktop shell status lists local packaged-app auth as not done.",
      "Absolute Founder Boundary blocks external account connection without Ahmad approval.",
    ],
    risk: "A packaged private app must not open sensitive command surfaces without a local auth gate.",
    nextAction: "Ahmad must choose the local auth method before private packaging preparation.",
  };
}
