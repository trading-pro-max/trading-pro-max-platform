import "server-only";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type DesktopTargetOs = "windows" | "macos" | "linux";

export type DesktopAppsFoundationSnapshot = {
  checkedAt: string;
  truth: {
    foundationState: "contract_ready";
    hostRuntime: "desktop_shell_reserved";
    nativeClaims: "none";
  };
  targets: Array<{
    os: DesktopTargetOs;
    runtimeHost: "electron_or_tauri";
    distributionState: "contract_only" | "packaging_ready";
    notificationDelivery: "unconfigured";
  }>;
  bridge: {
    protocol: "ipc_json_v1";
    transport: "local_host_bridge";
    capabilities: {
      windowState: "contract_ready";
      deepLinking: "reserved";
      systemTray: "reserved";
      notifications: "unconfigured";
      backgroundWorkflows: "reserved";
    };
  };
  authSession: {
    sessionStrategy: "http_session_bridge";
    tokenStrategy: "bearer_bridge_supported";
    secureStore: "host_keychain_required";
  };
  persistence: {
    workspacePreferences: "backend_or_local_fallback";
    localDatabase: "reserved";
    encryptionAtRest: "host_keychain_required";
  };
  packaging: {
    buildScripts: "contract_ready";
    targets: DesktopTargetOs[];
    signingProfile: "unconfigured" | "configured";
    updateChannel: "unconfigured" | "configured";
  };
  workflow: {
    notifications: "unconfigured";
    automationHooks: "reserved";
  };
  safety: {
    paperOnly: true;
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    brokerActivation: "blocked_until_configured";
  };
  readiness: {
    score: number;
    stage: "contract_ready" | "packaging_ready" | "distribution_guarded";
  };
  summary: string;
  detail: string;
};

function isConfigured(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function getDesktopReadiness() {
  const signingConfigured = isConfigured(process.env.TPM_DESKTOP_SIGNING_PROFILE);
  const updateChannelConfigured = isConfigured(process.env.TPM_DESKTOP_UPDATE_CHANNEL);
  const notificationConfigured = isConfigured(
    process.env.TPM_DESKTOP_NOTIFICATION_CHANNEL
  );
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "runtime_bridge_contract", ok: true, weight: 30 },
      { key: "session_strategy_contract", ok: true, weight: 20 },
      { key: "signing_profile", ok: signingConfigured, weight: 20 },
      { key: "update_channel", ok: updateChannelConfigured, weight: 10 },
      { key: "notification_channel", ok: notificationConfigured, weight: 10 },
      { key: "live_policy_block", ok: true, weight: 10 },
    ],
    stageThresholds: [
      { stage: "contract_ready", minScore: 0 },
      { stage: "packaging_ready", minScore: 70 },
      { stage: "distribution_guarded", minScore: 90 },
    ],
  });

  return {
    signingProfile: signingConfigured ? ("configured" as const) : ("unconfigured" as const),
    updateChannel: updateChannelConfigured
      ? ("configured" as const)
      : ("unconfigured" as const),
    readiness: {
      score: readiness.score,
      stage: readiness.stage as
        | "contract_ready"
        | "packaging_ready"
        | "distribution_guarded",
    },
  };
}

function buildDesktopTargets(
  distributionState: "contract_only" | "packaging_ready"
): DesktopAppsFoundationSnapshot["targets"] {
  return (["windows", "macos", "linux"] as const).map((os) => ({
    os,
    runtimeHost: "electron_or_tauri",
    distributionState,
    notificationDelivery: "unconfigured" as const,
  }));
}

export function getDesktopAppsFoundationSnapshot(
  checkedAt = new Date().toISOString()
): DesktopAppsFoundationSnapshot {
  const desktopReadiness = getDesktopReadiness();
  const distributionState =
    desktopReadiness.readiness.stage === "contract_ready"
      ? ("contract_only" as const)
      : ("packaging_ready" as const);

  return {
    checkedAt,
    truth: {
      foundationState: "contract_ready",
      hostRuntime: "desktop_shell_reserved",
      nativeClaims: "none",
    },
    targets: buildDesktopTargets(distributionState),
    bridge: {
      protocol: "ipc_json_v1",
      transport: "local_host_bridge",
      capabilities: {
        windowState: "contract_ready",
        deepLinking: "reserved",
        systemTray: "reserved",
        notifications: "unconfigured",
        backgroundWorkflows: "reserved",
      },
    },
    authSession: {
      sessionStrategy: "http_session_bridge",
      tokenStrategy: "bearer_bridge_supported",
      secureStore: "host_keychain_required",
    },
    persistence: {
      workspacePreferences: "backend_or_local_fallback",
      localDatabase: "reserved",
      encryptionAtRest: "host_keychain_required",
    },
    packaging: {
      buildScripts: "contract_ready",
      targets: ["windows", "macos", "linux"],
      signingProfile: desktopReadiness.signingProfile,
      updateChannel: desktopReadiness.updateChannel,
    },
    workflow: {
      notifications: "unconfigured",
      automationHooks: "reserved",
    },
    safety: {
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked_until_configured",
    },
    readiness: desktopReadiness.readiness,
    summary:
      "Desktop foundation contracts are active for Windows, macOS, and Linux with explicit paper-only safeguards.",
    detail:
      "Desktop runtime, bridge, auth/session, persistence, and packaging contracts are defined. Notification delivery and distribution channels remain unconfigured, and live routing stays blocked by policy.",
  };
}

export function getDesktopAppsDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getDesktopAppsFoundationSnapshot(checkedAt);

  return {
    key: "desktop_apps_foundation",
    label: "Desktop apps foundation",
    status: "ready",
    summary: snapshot.summary,
    detail: `${snapshot.detail} Readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}).`,
    checkedAt,
  };
}
