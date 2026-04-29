import "server-only";

import type { LocalPackagedAuthReadiness } from "./types";

export function getSessionTimeoutReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "session_timeout_readiness",
    label: "Session timeout readiness",
    state: "future_gate",
    status: "Packaged-app session timeout is not implemented yet.",
    checks: [
      "Session timeout implemented: no.",
      "Idle lock implemented: no.",
      "Manual lock action implemented: no.",
      "Timeout policy requires Ahmad approval.",
    ],
    evidence: [
      "No packaged desktop runtime is active.",
      "No local auth session store is active.",
    ],
    risk: "Session timeout rules must be real before they are described as active protection.",
    nextAction: "Define timeout duration, manual lock behavior, and local-only session storage later.",
  };
}
