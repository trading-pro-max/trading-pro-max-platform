import "server-only";

import { getDesktopAccessModel } from "./access-model";
import { getLocalAuthNextAction } from "./auth-next-action";
import { getLocalAuthReadiness } from "./auth-readiness";
import { getAuthSecretSafety } from "./auth-secret-safety";
import { getPackagedAppLockReadiness } from "./lock-readiness";
import { getSessionTimeoutReadiness } from "./session-readiness";
import type { LocalPackagedAuthGate, LocalPackagedAuthReadiness } from "./types";

export function getExternalAuthReadiness(): LocalPackagedAuthReadiness {
  return {
    id: "external_auth_readiness",
    label: "External auth status",
    state: "blocked",
    status: "External auth providers are not connected.",
    checks: [
      "External auth provider connected: no.",
      "External auth providers require Ahmad approval.",
      "No Google auth by default.",
      "No Apple auth by default.",
      "No Microsoft auth by default.",
    ],
    evidence: [
      "Absolute Founder Boundary blocks external account connection without Ahmad approval.",
      "This mission adds no external auth provider dependency.",
    ],
    risk: "External auth would connect private desktop access to outside accounts.",
    nextAction: "Keep external auth disconnected unless Ahmad explicitly approves a future integration.",
  };
}

export function getLocalPackagedAuthGate(): LocalPackagedAuthGate {
  return {
    id: "local_packaged_auth_gate",
    title: "Local Packaged Auth Gate",
    status: "ready_with_notes",
    summary:
      "The Ahmad-only local access law is defined, while packaged-app lock, PIN/passphrase, device-lock awareness, and session timeout remain future gates.",
    requiredWording: [
      "Local Packaged Auth Gate",
      "Al-Kawn Desktop requires Ahmad-only local access.",
      "Packaged-app authentication is private and local-first.",
      "No secrets are stored in the app bundle.",
      "External auth providers require Ahmad approval.",
      "Production-grade auth is a future gate unless implemented.",
      "Product Truth overrides local auth claims.",
    ],
    privateAccessModel: getDesktopAccessModel(),
    localAuthReadiness: getLocalAuthReadiness(),
    packagedAppLockReadiness: getPackagedAppLockReadiness(),
    sessionTimeoutReadiness: getSessionTimeoutReadiness(),
    authSecretSafety: getAuthSecretSafety(),
    externalAuthStatus: getExternalAuthReadiness(),
    productTruth: [
      "Al-Kawn Desktop requires Ahmad-only local access.",
      "Packaged-app authentication is private and local-first.",
      "Public desktop distribution is blocked.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "الكون private to Ahmad devices.",
      "ALKON private/background.",
      "Product Truth overrides local auth claims.",
    ],
    blockedClaims: [
      "Production-grade auth claim before implementation.",
      "External auth connection claim without Ahmad approval.",
      "Public auth claim.",
      "Secrets in Git.",
      "Secrets in the app bundle.",
      "Public desktop distribution.",
      "Money, broker, legal, or public launch activation.",
    ],
    nextAction: getLocalAuthNextAction(),
  };
}
