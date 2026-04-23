import "server-only";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type MobileTargetPlatform = "android" | "ios";

export type MobileAppsFoundationSnapshot = {
  checkedAt: string;
  truth: {
    foundationState: "contract_ready";
    runtime: "mobile_shell_reserved";
    pushClaims: "none";
  };
  targets: Array<{
    platform: MobileTargetPlatform;
    runtimeHost: "react_native_or_native_wrapper";
    distributionState: "contract_only" | "packaging_ready";
    pushDelivery: "unconfigured";
  }>;
  bridge: {
    protocol: "bridge_json_v1";
    transport: "native_web_runtime_bridge";
    capabilities: {
      deepLinking: "reserved";
      pushNotifications: "unconfigured";
      backgroundSync: "reserved";
      secureStorage: "required";
    };
  };
  authSession: {
    sessionStrategy: "session_or_token_bridge";
    secureStore: "device_keystore_required";
    refreshPolicy: "operator_guarded";
  };
  persistence: {
    workspacePreferences: "backend_or_local_fallback";
    offlineCache: "reserved";
    encryptionAtRest: "device_keystore_required";
  };
  client: {
    androidBuild: "contract_ready";
    iosBuild: "contract_ready";
    signingProfiles: {
      android: "unconfigured" | "configured";
      ios: "unconfigured" | "configured";
    };
  };
  workflow: {
    pushDelivery: "unconfigured";
    inAppWorkflowHooks: "reserved";
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

function getMobileReadiness() {
  const androidSigning = isConfigured(process.env.TPM_MOBILE_ANDROID_SIGNING_PROFILE);
  const iosSigning = isConfigured(process.env.TPM_MOBILE_IOS_SIGNING_PROFILE);
  const pushProvider = isConfigured(process.env.TPM_MOBILE_PUSH_PROVIDER);
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "mobile_bridge_contract", ok: true, weight: 30 },
      { key: "session_bridge_contract", ok: true, weight: 20 },
      { key: "android_signing", ok: androidSigning, weight: 15 },
      { key: "ios_signing", ok: iosSigning, weight: 15 },
      { key: "push_provider", ok: pushProvider, weight: 10 },
      { key: "live_policy_block", ok: true, weight: 10 },
    ],
    stageThresholds: [
      { stage: "contract_ready", minScore: 0 },
      { stage: "packaging_ready", minScore: 70 },
      { stage: "distribution_guarded", minScore: 90 },
    ],
  });

  return {
    readiness: {
      score: readiness.score,
      stage: readiness.stage as
        | "contract_ready"
        | "packaging_ready"
        | "distribution_guarded",
    },
    signingProfiles: {
      android: androidSigning ? ("configured" as const) : ("unconfigured" as const),
      ios: iosSigning ? ("configured" as const) : ("unconfigured" as const),
    },
  };
}

function buildMobileTargets(
  distributionState: "contract_only" | "packaging_ready"
): MobileAppsFoundationSnapshot["targets"] {
  return (["android", "ios"] as const).map((platform) => ({
    platform,
    runtimeHost: "react_native_or_native_wrapper",
    distributionState,
    pushDelivery: "unconfigured" as const,
  }));
}

export function getMobileAppsFoundationSnapshot(
  checkedAt = new Date().toISOString()
): MobileAppsFoundationSnapshot {
  const mobileReadiness = getMobileReadiness();
  const distributionState =
    mobileReadiness.readiness.stage === "contract_ready"
      ? ("contract_only" as const)
      : ("packaging_ready" as const);

  return {
    checkedAt,
    truth: {
      foundationState: "contract_ready",
      runtime: "mobile_shell_reserved",
      pushClaims: "none",
    },
    targets: buildMobileTargets(distributionState),
    bridge: {
      protocol: "bridge_json_v1",
      transport: "native_web_runtime_bridge",
      capabilities: {
        deepLinking: "reserved",
        pushNotifications: "unconfigured",
        backgroundSync: "reserved",
        secureStorage: "required",
      },
    },
    authSession: {
      sessionStrategy: "session_or_token_bridge",
      secureStore: "device_keystore_required",
      refreshPolicy: "operator_guarded",
    },
    persistence: {
      workspacePreferences: "backend_or_local_fallback",
      offlineCache: "reserved",
      encryptionAtRest: "device_keystore_required",
    },
    client: {
      androidBuild: "contract_ready",
      iosBuild: "contract_ready",
      signingProfiles: mobileReadiness.signingProfiles,
    },
    workflow: {
      pushDelivery: "unconfigured",
      inAppWorkflowHooks: "reserved",
    },
    safety: {
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      brokerActivation: "blocked_until_configured",
    },
    readiness: mobileReadiness.readiness,
    summary:
      "Mobile foundation contracts are active for Android and iOS with explicit paper-only safeguards.",
    detail:
      "Mobile shell, runtime bridge, session strategy, and persistence contracts are defined. Push delivery remains unconfigured, and live routing remains blocked by policy.",
  };
}

export function getMobileAppsDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getMobileAppsFoundationSnapshot(checkedAt);

  return {
    key: "mobile_apps_foundation",
    label: "Mobile apps foundation",
    status: "ready",
    summary: snapshot.summary,
    detail: `${snapshot.detail} Readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}).`,
    checkedAt,
  };
}
