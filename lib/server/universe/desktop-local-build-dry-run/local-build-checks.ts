import "server-only";

import type { DesktopLocalBuildDryRunCheck } from "./types";

export function getLocalBuildPreviousReportCheck(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_previous_report_check",
    label: "Previous desktop gate reports",
    state: "ready_with_notes",
    status: "Packaging Gate, Local Packaged Auth Gate, and Packaging Preparation reports exist.",
    checks: [
      "reports/al-kawn-private-desktop-packaging-gate.md exists.",
      "reports/al-kawn-local-packaged-auth-gate.md exists.",
      "reports/al-kawn-private-desktop-packaging-preparation.md exists.",
      "Previous gates do not approve public release.",
      "Previous gates keep native packaging and auth future-gated.",
    ],
    evidence: [
      "reports/al-kawn-private-desktop-packaging-gate.md",
      "reports/al-kawn-local-packaged-auth-gate.md",
      "reports/al-kawn-private-desktop-packaging-preparation.md",
    ],
    risk: "Reports support a dry-run readiness check, not a real package build.",
    result: "Dependency reports available.",
    nextAction: "Use the reports as constraints before any local package build.",
  };
}

export function getLocalBuildCapabilityCheck(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_capability_check",
    label: "Local build capability",
    state: "future_gate",
    status: "A real private desktop package dry run is not supported because no native shell or packaging tool exists.",
    checks: [
      "Local dry run supported: no.",
      "Native shell available: no.",
      "Package tool available: no.",
      "Secrets risk: no active bundle risk because no desktop bundle is produced.",
      "Public release risk: blocked by missing release/signing/publish scripts.",
    ],
    evidence: [
      "package.json has no Electron dependency.",
      "package.json has no Tauri dependency.",
      "/desktop/kawn remains the private desktop route.",
      "desktop:package:dry-run is a local readiness check only.",
    ],
    risk: "Forcing packaging now would create a new native shell decision before auth is ready.",
    result: "Readiness-only dry run.",
    nextAction: "Keep real local build dry run future-gated until Ahmad chooses native shell and auth.",
  };
}

export function getLocalBuildScriptStatus(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_script_status",
    label: "Local dry-run script status",
    state: "ready_with_notes",
    status: "A safe local readiness script exists; it produces no artifacts.",
    checks: [
      "desktop:check exists.",
      "desktop:package:check exists.",
      "desktop:package:dry-run exists.",
      "desktop:package:dry-run does not sign, publish, upload, or release.",
      "No desktop:release script exists.",
    ],
    evidence: [
      "package.json",
      "scripts/al-kawn-desktop-local-build-dry-run.mjs",
      "scripts/al-kawn-desktop-package-check.mjs",
    ],
    risk: "The script must remain a readiness check until native shell and auth gates close.",
    result: "Safe script available and run locally.",
    nextAction: "Do not add artifact-producing scripts until the next gate approves them.",
  };
}

export function getLocalBuildNativeShellStatus(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_native_shell_status",
    label: "Native shell status",
    state: "future_gate",
    status: "No Electron/Tauri/native shell exists.",
    checks: [
      "Electron: no.",
      "Tauri: no.",
      "desktop/main.*: no.",
      "desktop/preload.*: no.",
      "Native default route configured: no.",
    ],
    evidence: [
      "package.json dependencies.",
      "desktop:check.",
      "desktop:package:check.",
      "desktop:package:dry-run.",
    ],
    risk: "A native shell should be selected intentionally before packaging.",
    result: "Native package build not executed.",
    nextAction: "Ahmad decision required for the private native shell path.",
  };
}

export function getLocalBuildDryRunResult(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_dry_run_result",
    label: "Dry run result",
    state: "ready_with_notes",
    status: "The dry run executed as readiness-only because real packaging is not supported yet.",
    checks: [
      "Local build dry run is not public release.",
      "No package artifact was created.",
      "No public distribution was created.",
      "No production signing was performed.",
      "Product Truth overrides local build.",
    ],
    evidence: [
      "npm run desktop:package:dry-run.",
      "scripts/al-kawn-desktop-local-build-dry-run.mjs.",
    ],
    risk: "The result must not be represented as a packaged app release.",
    result: "Readiness-only dry run passed.",
    nextAction: "Choose native shell and auth before artifact-producing dry runs.",
  };
}

export function getLocalBuildArtifactSafety(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_artifact_safety",
    label: "Artifact safety",
    state: "ready_with_notes",
    status: "Generated artifacts are local-only; this mission generates no desktop package artifacts.",
    checks: [
      "Generated artifacts are local-only.",
      "No desktop release artifact was created.",
      "No installer was published.",
      "No artifact was uploaded.",
      "No auto-update channel was enabled.",
    ],
    evidence: [
      "desktop:package:dry-run output.",
      "No release/dist-electron/desktop-dist/app-bundle output required.",
    ],
    risk: "Future local artifacts must be audited before any private distribution decision.",
    result: "No artifact output.",
    nextAction: "Keep artifacts local-only if a future native dry run is approved.",
  };
}

export function getLocalBuildSecretSafety(): DesktopLocalBuildDryRunCheck {
  return {
    id: "local_build_secret_safety",
    label: "Secret safety",
    state: "ready_with_notes",
    status: "No secrets are stored in the desktop bundle.",
    checks: [
      "No .env secrets copied into bundle.",
      "No API keys hardcoded.",
      "No private documents included.",
      "No sensitive reports included in a desktop bundle.",
      "No external account connection.",
      "No broker/payment keys.",
    ],
    evidence: [
      "No desktop bundle is produced.",
      "desktop:package:dry-run.",
      "Product Truth panels.",
    ],
    risk: "Secret safety remains a future package audit until a real bundle exists.",
    result: "No bundle, no packaged secrets.",
    nextAction: "Keep secrets out of source and future bundles.",
  };
}
