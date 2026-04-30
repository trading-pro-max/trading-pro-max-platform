import "server-only";

import type { LocalPackagedAuthReadiness } from "./types";

export function getSessionTimeoutReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "session_timeout_readiness",
    label: "Session timeout readiness",
    state: "ready_with_notes",
    status: "Session timeout is active for the local browser/device lock.",
    checks: [
      "Session timeout implemented: yes.",
      "Manual lock action implemented: yes.",
      "No sensitive data stored in session.",
      "Timeout policy: 30 minutes.",
    ],
    evidence: [
      "lib/client/al-kawn-local-auth/session.ts.",
      "AlKawnLocalAuthStatus manual lock.",
    ],
    risk: "This is local browser session control, not production-grade packaged auth.",
    nextAction: "Preserve timeout behavior during future native packaging.",
  };
}
