import "server-only";

import type { LocalDesktopAuthNextAction } from "./types";

export function getLocalDesktopAuthNextAction(): LocalDesktopAuthNextAction {
  return {
    next: "Private Desktop Packaging Preparation",
    reason:
      "Local PIN/passphrase access is now implemented as a local private lock with honest limitations, so packaging preparation may reassess readiness without claiming public or production-grade auth.",
    blockedUntil: [
      "Production-grade auth remains future-gated.",
      "OS keychain/device-lock integration remains future-gated.",
      "External auth providers remain disconnected unless Ahmad approves.",
      "Public desktop distribution remains blocked.",
      "Product Truth continues to override auth and packaging claims.",
    ],
  };
}
