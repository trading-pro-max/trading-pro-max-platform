import "server-only";

import type { LocalAuthNextAction } from "./types";

export function getLocalAuthNextAction(): LocalAuthNextAction {
  return {
    next: "Private Desktop Packaging Preparation",
    reason:
      "Local PIN/passphrase access is implemented as a local private lock for /desktop/kawn, while production-grade auth, OS keychain, and native packaged-app auth remain future gates.",
    blockedUntil: [
      "Production-grade auth remains future-gated.",
      "OS keychain/device-lock integration remains future-gated.",
      "No secrets are stored in Git or the app bundle.",
      "External auth providers remain disconnected unless Ahmad approves.",
    ],
  };
}
