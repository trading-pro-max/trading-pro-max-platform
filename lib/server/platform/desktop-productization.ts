import "server-only";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import { getDesktopAppsFoundationSnapshot } from "@/lib/server/platform/desktop-foundation";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

type DesktopProductizationStage =
  | "foundation_only"
  | "pilot_usable"
  | "distribution_guarded";
type DesktopTargetState = "not_packaged" | "pilot_packaged";
type DesktopUpdateState = "unconfigured" | "pilot_update_ready";
type DesktopInstallState = "unconfigured" | "pilot_install_ready";

export type DesktopProductizationSnapshot = {
  checkedAt: string;
  truth: {
    productizationState: DesktopProductizationStage;
    hostRuntime: "desktop_shell_reserved";
    releaseClaims: "no_public_store_release_claim";
  };
  shell: {
    usability: "operator_pilot_usable";
    windowLayouts: "restorable";
    deepLinks: "reserved";
    trayWorkflow: "reserved";
  };
  targets: Array<{
    os: "windows" | "macos" | "linux";
    packageState: DesktopTargetState;
    installState: DesktopInstallState;
    updateState: DesktopUpdateState;
  }>;
  session: {
    restoration: "disabled" | "guarded_enabled";
    strategy: "backend_session_with_local_resume";
    secureStore: "host_keychain_required";
  };
  notifications: {
    readiness: "unconfigured" | "local_channel_guarded";
    deliveryClaims: "none";
    workflow: "operator_assist_only";
  };
  packaging: {
    signingProfile: "unconfigured" | "configured";
    updateChannel: "unconfigured" | "configured";
    installerContracts: {
      windows: DesktopInstallState;
      macos: DesktopInstallState;
      linux: DesktopInstallState;
    };
  };
  safety: {
    paperOnly: true;
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
  };
  readiness: {
    score: number;
    stage: DesktopProductizationStage;
  };
  summary: string;
  detail: string;
};

function isConfigured(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function envIsTrue(value: string | null | undefined) {
  return value?.trim().toLowerCase() === "true";
}

function resolveTargetState(input: {
  packaged: boolean;
  installReady: boolean;
  updateReady: boolean;
}) {
  return {
    packageState: input.packaged ? ("pilot_packaged" as const) : ("not_packaged" as const),
    installState: input.installReady
      ? ("pilot_install_ready" as const)
      : ("unconfigured" as const),
    updateState: input.updateReady
      ? ("pilot_update_ready" as const)
      : ("unconfigured" as const),
  };
}

export function getDesktopProductizationSnapshot(
  checkedAt = new Date().toISOString()
): DesktopProductizationSnapshot {
  const foundation = getDesktopAppsFoundationSnapshot(checkedAt);
  const sessionRestoreEnabled = envIsTrue(process.env.TPM_DESKTOP_SESSION_RESTORE_ENABLED);
  const windowsPackaged = isConfigured(process.env.TPM_DESKTOP_WINDOWS_PACKAGE);
  const macosPackaged = isConfigured(process.env.TPM_DESKTOP_MACOS_PACKAGE);
  const linuxPackaged = isConfigured(process.env.TPM_DESKTOP_LINUX_PACKAGE);
  const installerReady = isConfigured(process.env.TPM_DESKTOP_INSTALLER_MANIFEST);
  const updateReady = isConfigured(process.env.TPM_DESKTOP_UPDATE_CHANNEL);
  const localNotificationChannelConfigured = isConfigured(
    process.env.TPM_DESKTOP_NOTIFICATION_CHANNEL
  );
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "desktop_foundation", ok: true, weight: 20 },
      { key: "session_restore_contract", ok: sessionRestoreEnabled, weight: 15 },
      { key: "windows_packaging", ok: windowsPackaged, weight: 10 },
      { key: "macos_packaging", ok: macosPackaged, weight: 10 },
      { key: "linux_packaging", ok: linuxPackaged, weight: 10 },
      { key: "installer_manifest", ok: installerReady, weight: 15 },
      { key: "update_channel", ok: updateReady, weight: 10 },
      { key: "notification_channel", ok: localNotificationChannelConfigured, weight: 5 },
      { key: "paper_only_guard", ok: true, weight: 5 },
    ],
    stageThresholds: [
      { stage: "foundation_only", minScore: 0 },
      { stage: "pilot_usable", minScore: 55 },
      { stage: "distribution_guarded", minScore: 85 },
    ],
  });
  const windows = resolveTargetState({
    packaged: windowsPackaged,
    installReady: installerReady,
    updateReady,
  });
  const macos = resolveTargetState({
    packaged: macosPackaged,
    installReady: installerReady,
    updateReady,
  });
  const linux = resolveTargetState({
    packaged: linuxPackaged,
    installReady: installerReady,
    updateReady,
  });

  return {
    checkedAt,
    truth: {
      productizationState: readiness.stage as DesktopProductizationStage,
      hostRuntime: foundation.truth.hostRuntime,
      releaseClaims: "no_public_store_release_claim",
    },
    shell: {
      usability: "operator_pilot_usable",
      windowLayouts: "restorable",
      deepLinks: "reserved",
      trayWorkflow: "reserved",
    },
    targets: [
      { os: "windows", ...windows },
      { os: "macos", ...macos },
      { os: "linux", ...linux },
    ],
    session: {
      restoration: sessionRestoreEnabled ? "guarded_enabled" : "disabled",
      strategy: "backend_session_with_local_resume",
      secureStore: "host_keychain_required",
    },
    notifications: {
      readiness: localNotificationChannelConfigured
        ? "local_channel_guarded"
        : "unconfigured",
      deliveryClaims: "none",
      workflow: "operator_assist_only",
    },
    packaging: {
      signingProfile: foundation.packaging.signingProfile,
      updateChannel: foundation.packaging.updateChannel,
      installerContracts: {
        windows: windows.installState,
        macos: macos.installState,
        linux: linux.installState,
      },
    },
    safety: {
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as DesktopProductizationStage,
    },
    summary:
      "Desktop productization contracts are active for pilot usability across Windows, macOS, and Linux with explicit guarded release truth.",
    detail:
      "Desktop shell usability, session restoration, packaging/install/update contracts, and notification-readiness semantics are expanded for pilot operation. Public-store release claims remain disabled and live/real-money execution remains blocked.",
  };
}

export function getDesktopProductizationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getDesktopProductizationSnapshot(checkedAt);
  const status = snapshot.readiness.stage === "foundation_only" ? "unconfigured" : "ready";

  return {
    key: "desktop_productization",
    label: "Desktop productization",
    status,
    summary: snapshot.summary,
    detail: `${snapshot.detail} Readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}).`,
    checkedAt,
  };
}
