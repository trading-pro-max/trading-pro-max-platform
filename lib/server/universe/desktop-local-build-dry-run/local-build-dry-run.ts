import "server-only";

import {
  getLocalBuildArtifactSafety,
  getLocalBuildCapabilityCheck,
  getLocalBuildDryRunResult,
  getLocalBuildNativeShellStatus,
  getLocalBuildPreviousReportCheck,
  getLocalBuildScriptStatus,
  getLocalBuildSecretSafety,
} from "./local-build-checks";
import type {
  DesktopLocalBuildDryRun,
  DesktopLocalBuildDryRunNextAction,
} from "./types";

export function getPrivateDesktopLocalBuildDryRunNextAction(): DesktopLocalBuildDryRunNextAction {
  return {
    next: "Ahmad decision required",
    reason:
      "The repository can run a safe readiness-only dry run, but no native shell, package tool, or real local packaged auth exists for an artifact-producing desktop build.",
    blockedUntil: [
      "Ahmad chooses Electron, Tauri, or another private native shell path.",
      "Ahmad chooses the local packaged auth method.",
      "Real packaged-app auth is implemented and validated.",
      "A private local artifact target is defined.",
      "No secrets enter the desktop bundle.",
      "Production signing and public distribution remain blocked.",
    ],
  };
}

export function getPrivateDesktopLocalBuildDryRun(): DesktopLocalBuildDryRun {
  return {
    id: "private_desktop_local_build_dry_run",
    title: "Private Desktop Local Build Dry Run",
    status: "ready_with_notes",
    summary:
      "A local readiness-only dry run is available and safe; an artifact-producing desktop build remains future-gated because no native shell, packaging tool, or real packaged auth exists.",
    requiredWording: [
      "Private Desktop Local Build Dry Run",
      "Local build dry run is not public release.",
      "Al-Kawn Desktop remains Ahmad-only.",
      "No secrets are stored in the desktop bundle.",
      "Production signing and public distribution remain blocked.",
      "Product Truth overrides local build.",
    ],
    previousReports: getLocalBuildPreviousReportCheck(),
    capability: getLocalBuildCapabilityCheck(),
    scriptStatus: getLocalBuildScriptStatus(),
    nativeShellStatus: getLocalBuildNativeShellStatus(),
    dryRunResult: getLocalBuildDryRunResult(),
    artifactSafety: getLocalBuildArtifactSafety(),
    secretSafety: getLocalBuildSecretSafety(),
    productTruth: [
      "Al-Kawn Desktop remains Ahmad-only.",
      "Local build dry run is not public release.",
      "No secrets are stored in the desktop bundle.",
      "Generated artifacts are local-only.",
      "No public distribution was created.",
      "No production signing was performed.",
      "Public desktop distribution is blocked.",
      "Billing inactive.",
      "Payments inactive.",
      "Receiving money inactive.",
      "Real money disabled.",
      "Broker execution disabled/not connected.",
      "Legal review pending.",
      "Product Truth overrides local build.",
    ],
    blockedActions: [
      "Public desktop distribution.",
      "Public release.",
      "Production signing.",
      "Release upload.",
      "Auto-update activation.",
      "Secrets in Git.",
      "Secrets in desktop bundle.",
      "Billing, payments, receiving money, real money, broker, legal, or public launch activation.",
    ],
    nextAction: getPrivateDesktopLocalBuildDryRunNextAction(),
  };
}
