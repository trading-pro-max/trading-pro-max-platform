import "server-only";

import type { LocalPackagedAuthReadiness } from "./types";

export function getLocalAuthReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "local_auth_readiness",
    label: "Local auth readiness",
    state: "ready_with_notes",
    status: "Local PIN/passphrase access lock is implemented for /desktop/kawn with Web Crypto when available.",
    checks: [
      "Local auth implemented: yes, as a local private access lock.",
      "PIN/passphrase implemented: yes.",
      "Device-lock awareness implemented: no.",
      "Session timeout implemented: yes, local browser session.",
      "Production-grade auth is a future gate unless implemented.",
    ],
    evidence: [
      "lib/client/al-kawn-local-auth.",
      "app/desktop/kawn/_components/AlKawnLocalAuthGate.tsx.",
      "Private Desktop Packaging Gate marks auth as a future gate.",
    ],
    risk: "Calling this production-grade or external identity auth would be a false security claim.",
    nextAction: "Use this as a local private lock while production-grade packaged auth remains future-gated.",
  };
}
