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
    next: "Ahmad decision required",
    reason:
      "No native shell or real local packaged auth exists, so private packaging preparation stops at readiness checks.",
    blockedUntil: [
      "Ahmad chooses the native desktop shell path.",
      "Ahmad chooses the local packaged auth method.",
      "Real local auth is implemented and validated.",
      "A local-only package dry run is explicitly approved.",
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
      "External auth without Ahmad approval.",
      "Billing, payments, money, broker, legal, or public launch activation.",
    ],
    nextAction: getPrivateDesktopPackagingPreparationNextAction(),
  };
}
