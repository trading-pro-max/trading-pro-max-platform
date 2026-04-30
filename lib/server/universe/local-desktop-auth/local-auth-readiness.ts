import "server-only";

import type { LocalDesktopAuthReadiness } from "./types";

export function getLocalDesktopAuthReadiness(): LocalDesktopAuthReadiness {
  return {
    id: "local_desktop_auth_readiness",
    label: "Local auth readiness",
    state: "ready_with_notes",
    status: "Local PIN/passphrase lock is implemented for /desktop/kawn with Web Crypto when available.",
    checks: [
      "PIN/passphrase setup: implemented.",
      "Web Crypto PBKDF2 verifier: implemented when available.",
      "Plaintext PIN/passphrase storage: blocked.",
      "External auth providers: blocked.",
      "Production-grade auth remains a future gate unless implemented.",
    ],
    evidence: [
      "lib/client/al-kawn-local-auth",
      "app/desktop/kawn/_components/AlKawnLocalAuthGate.tsx",
      "tests/regression/al-kawn-local-pin-passphrase-auth.spec.ts",
    ],
    limitation:
      "This is a local private browser/device lock for the desktop route, not enterprise identity or external auth.",
    nextAction: "Keep auth claims honest and choose OS keychain/device-lock later if Ahmad approves.",
    pinPassphrase: "implemented_local_browser_lock",
    webCrypto: "required_when_available",
    productionGradeAuth: "future_gate",
  };
}
