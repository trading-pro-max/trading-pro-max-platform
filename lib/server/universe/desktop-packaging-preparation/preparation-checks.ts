import "server-only";

import type { DesktopPackagingPreparationCheck } from "./types";

export function getPreviousGateDependencyCheck(): DesktopPackagingPreparationCheck {
  return {
    id: "previous_gate_dependency_check",
    label: "Previous gate dependency",
    state: "ready_with_notes",
    status: "Private Desktop Packaging Gate and Local Packaged Auth Gate reports exist.",
    checks: [
      "reports/al-kawn-private-desktop-packaging-gate.md exists.",
      "reports/al-kawn-local-packaged-auth-gate.md exists.",
      "Private Desktop Packaging Gate remains future-gated for native package work.",
      "Local Packaged Auth Gate remains future-gated for real auth implementation.",
    ],
    evidence: [
      "reports/al-kawn-private-desktop-packaging-gate.md",
      "reports/al-kawn-local-packaged-auth-gate.md",
    ],
    risk: "Preparation can be documented, but packaging cannot proceed until native shell and real local auth are implemented.",
    nextAction: "Use previous gates as blockers, not as approval to release.",
  };
}

export function getPackagingCapabilityCheck(): DesktopPackagingPreparationCheck {
  return {
    id: "packaging_capability_check",
    label: "Packaging capability",
    state: "future_gate",
    status: "Packaging is not supported now because no native shell or packaging tool exists.",
    checks: [
      "Packaging supported now: no.",
      "Native shell exists: no.",
      "Packaging tool exists: no.",
      "Safe package-check script can be added: yes.",
      "Secrets risk: controlled by no-bundle/no-Git rules.",
    ],
    evidence: [
      "package.json has no Electron or Tauri dependency.",
      "desktop:package:check is a readiness check only.",
      "/desktop/kawn remains the private route.",
    ],
    risk: "Adding packaging dependencies now would be a new native architecture decision.",
    nextAction: "Keep packaging as future gate until Ahmad chooses the native shell path.",
  };
}

export function getNativeShellPreparationStatus(): DesktopPackagingPreparationCheck {
  return {
    id: "native_shell_preparation_status",
    label: "Native shell status",
    state: "future_gate",
    status: "No Electron/Tauri/native shell exists.",
    checks: [
      "Electron presence: no.",
      "Tauri presence: no.",
      "desktop/main.* presence: no.",
      "desktop/preload.* presence: no.",
      "Native default route configured: no.",
    ],
    evidence: [
      "package.json dependencies.",
      "desktop:check result.",
      "desktop:package:check result.",
    ],
    risk: "A native shell must not be created casually or duplicated.",
    nextAction: "Ahmad decision required for Electron, Tauri, or another private native shell path.",
  };
}

export function getPackageScriptPreparationStatus(): DesktopPackagingPreparationCheck {
  return {
    id: "package_script_preparation_status",
    label: "Package script status",
    state: "ready_with_notes",
    status: "Only a safe package readiness check is added; no release script exists.",
    checks: [
      "desktop:package:check exists.",
      "desktop:package:dry-run exists: no.",
      "desktop:package:local exists: no.",
      "desktop:release exists: no.",
      "Signing/upload/publish scripts exist: no.",
    ],
    evidence: [
      "package.json",
      "scripts/al-kawn-desktop-package-check.mjs",
    ],
    risk: "Future package scripts must remain local-only and must not sign, publish, upload, or distribute publicly.",
    nextAction: "Do not add dry-run/local package scripts until native shell and auth gates close.",
  };
}

export function getAuthDependencyPreparationStatus(): DesktopPackagingPreparationCheck {
  return {
    id: "auth_dependency_preparation_status",
    label: "Auth gate status",
    state: "future_gate",
    status: "Local packaged auth gate exists, but real packaged-app auth is not implemented.",
    checks: [
      "Local Packaged Auth Gate exists.",
      "PIN/passphrase implemented: no.",
      "Device-lock awareness implemented: no.",
      "Session timeout implemented: no.",
      "Production-grade auth claim: no.",
    ],
    evidence: [
      "lib/server/universe/local-packaged-auth-gate",
      "reports/al-kawn-local-packaged-auth-gate.md",
    ],
    risk: "A private package must not expose /desktop/kawn without a real local auth method.",
    nextAction: "Ahmad decision required for the local auth method.",
  };
}

export function getPackagingSecretSafetyCheck(): DesktopPackagingPreparationCheck {
  return {
    id: "packaging_secret_safety_check",
    label: "Secret safety",
    state: "ready_with_notes",
    status: "No secrets are stored in the desktop bundle.",
    checks: [
      "No .env secrets copied into app bundle.",
      "No API keys hardcoded.",
      "Private documents are not packaged.",
      "No credentials in desktop shell.",
      "No external account connection.",
      "No broker/payment keys.",
    ],
    evidence: [
      "Private Desktop Packaging Gate.",
      "Local Packaged Auth Gate.",
      "desktop:package:check.",
    ],
    risk: "No bundle is produced in this mission, so secret safety remains a gate rather than a completed package audit.",
    nextAction: "Keep all secrets out of source and future bundles.",
  };
}
