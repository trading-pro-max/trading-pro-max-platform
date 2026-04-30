import "server-only";

import type { LocalDesktopAuthStatus } from "./types";

export function getLocalDesktopAuthStatus(): LocalDesktopAuthStatus {
  return {
    id: "local_desktop_auth_status",
    label: "Local PIN / Passphrase Auth status",
    state: "ready_with_notes",
    status: "Local setup, unlock, manual lock, reset warning, and 30-minute session timeout are implemented.",
    checks: [
      "Local lock: implemented.",
      "Manual lock: implemented.",
      "Session timeout: active.",
      "Reset warning: implemented.",
      "No sensitive data stored in session.",
    ],
    evidence: [
      "AlKawnLocalAuthGate",
      "AlKawnLocalAuthSetup",
      "AlKawnLocalAuthUnlock",
      "AlKawnLocalAuthStatus",
      "lib/client/al-kawn-local-auth/session.ts",
    ],
    limitation:
      "Session state is local to this browser/device and should not be described as production-grade packaged auth.",
    nextAction: "Use this as a local private access layer while OS keychain/device-lock remains future-gated.",
    localLock: "implemented",
    manualLock: "implemented",
    sessionTimeout: "active",
    resetPath: "implemented_with_warning",
  };
}
