import "server-only";

import type { LocalPackagedAuthReadiness } from "./types";

export function getLocalAuthReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "local_auth_readiness",
    label: "Local auth readiness",
    state: "future_gate",
    status: "Local packaged-app authentication is defined as a gate but not implemented.",
    checks: [
      "Local auth implemented: no.",
      "PIN/passphrase implemented: no.",
      "Device-lock awareness implemented: no.",
      "Session timeout implemented: no.",
      "Production-grade auth is a future gate unless implemented.",
    ],
    evidence: [
      "No native packaged shell exists yet.",
      "No local packaged auth implementation exists yet.",
      "Private Desktop Packaging Gate marks auth as a future gate.",
    ],
    risk: "Calling this production-grade auth before implementation would be a false security claim.",
    nextAction: "Choose and implement a real local auth method in a future approved mission.",
  };
}
