import "server-only";

import type { LocalDesktopAuthPolicy } from "./types";

export const LOCAL_DESKTOP_AUTH_SESSION_TIMEOUT_MINUTES = 30;

export function getLocalDesktopAuthPolicy(): LocalDesktopAuthPolicy {
  return {
    id: "local_pin_passphrase_auth_policy",
    title: "Local PIN / Passphrase Auth",
    status: "ready_with_notes",
    summary:
      "Al-Kawn Desktop uses a local private access lock for Ahmad-only desktop access. It is not public authentication, SaaS login, customer auth, or production-grade identity verification.",
    sessionTimeoutMinutes: LOCAL_DESKTOP_AUTH_SESSION_TIMEOUT_MINUTES,
    requiredWording: [
      "Local PIN / Passphrase Auth",
      "Al-Kawn Desktop requires Ahmad-only local access.",
      "This is a local private access lock, not public authentication.",
      "No plaintext passphrase is stored.",
      "External auth providers require Ahmad approval.",
      "Production-grade auth remains a future gate unless implemented.",
      "Product Truth overrides auth claims.",
    ],
    policy: [
      "Ahmad-only local access.",
      "No public user accounts.",
      "No customer login.",
      "No external auth providers.",
      "No plaintext PIN or passphrase storage.",
      "No secrets in Git.",
      "No secrets in app bundle.",
      "Session timeout target: 30 minutes.",
      "Resetting local lock clears local access settings and does not recover secrets.",
      "OS keychain/device-lock integration remains a future gate.",
    ],
    limitations: [
      "The current implementation is a browser/device-local private access lock.",
      "It does not replace operating-system account security.",
      "It does not prove legal or financial identity.",
      "It is not claimed as production-grade auth.",
    ],
  };
}
