import "server-only";

import {
  getAuthDependencyPreparationStatus,
  getNativeShellPreparationStatus,
  getPackageScriptPreparationStatus,
  getPackagingCapabilityCheck,
  getPackagingSecretSafetyCheck,
  getPreviousGateDependencyCheck,
} from "./preparation-checks";
import type {
  DesktopPackagingPreparation,
  DesktopPackagingPreparationNextAction,
} from "./types";

export function getPrivateDesktopPackagingPreparationNextAction(): DesktopPackagingPreparationNextAction {
  return {
    next: "Private Desktop Local Build Dry Run",
    reason:
      "Packaging preparation now preserves Local PIN / Passphrase Auth and can proceed to a readiness-only local build dry run without creating artifacts.",
    blockedUntil: [
      "Ahmad chooses the native desktop shell path.",
      "Native packaged-app hardening is reviewed later.",
      "A real artifact-producing local build is explicitly approved.",
      "No secrets enter the bundle.",
      "Signing and public distribution remain blocked.",
    ],
  };
}

export function getPrivateDesktopPackagingPreparation(): DesktopPackagingPreparation {
  return {
    id: "private_desktop_packaging_preparation",
    title: "Private Desktop Packaging Preparation",
    status: "ready_with_notes",
    summary:
      "Packaging preparation is defined as a local readiness path only; no native package, signing, release, upload, or public distribution is created.",
    requiredWording: [
      "Private Desktop Packaging Preparation",
      "Packaging preparation is not public release.",
      "Al-Kawn Desktop remains Ahmad-only.",
      "No secrets are stored in the desktop bundle.",
      "Signing and public distribution remain blocked.",
      "Product Truth overrides packaging.",
      "Local PIN / Passphrase Auth is preserved.",
    ],
    previousGates: getPreviousGateDependencyCheck(),
    packagingCapability: getPackagingCapabilityCheck(),
    nativeShellStatus: getNativeShellPreparationStatus(),
    packageScriptStatus: getPackageScriptPreparationStatus(),
    authGateStatus: getAuthDependencyPreparationStatus(),
    secretSafety: getPackagingSecretSafetyCheck(),
    productTruth: [
      "Al-Kawn Desktop remains Ahmad-only.",
      "Packaging preparation is not public release.",
      "Public desktop distribution is blocked.",
      "Signing and public distribution remain blocked.",
      "No secrets are stored in the desktop bundle.",
      "Local PIN / Passphrase Auth is preserved.",
      "No plaintext passphrase is stored.",
      "Local auth secrets are not exposed.",
      "Private documents are not packaged.",
      "External accounts require Ahmad approval.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "Product Truth overrides packaging.",
    ],
    blockedActions: [
      "Public desktop distribution.",
      "Production signing.",
      "Installer publishing.",
      "Release upload.",
      "Auto-update distribution.",
      "Secrets in Git.",
      "Secrets in desktop bundle.",
      "Plaintext passphrase storage.",
      "Local auth secret exposure.",
      "External auth without Ahmad approval.",
      "Billing, payments, money, broker, legal, or public launch activation.",
    ],
    nextAction: getPrivateDesktopPackagingPreparationNextAction(),
  };
}
