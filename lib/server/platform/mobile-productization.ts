import "server-only";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import { getMobileAppsFoundationSnapshot } from "@/lib/server/platform/mobile-foundation";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

type MobileProductizationStage =
  | "foundation_only"
  | "pilot_usable"
  | "distribution_guarded";
type MobileTargetState = "not_packaged" | "pilot_packaged";
type MobileDistributionState = "unconfigured" | "pilot_distribution_ready";

export type MobileProductizationSnapshot = {
  checkedAt: string;
  truth: {
    productizationState: MobileProductizationStage;
    runtime: "mobile_shell_reserved";
    pushClaims: "none";
    releaseClaims: "no_store_release_claim";
  };
  clientFlow: {
    navigationModel: "workstation_compact_tabs";
    routeScope: "operator_assist";
    deepLinking: "reserved";
  };
  targets: Array<{
    platform: "android" | "ios";
    packageState: MobileTargetState;
    distributionState: MobileDistributionState;
    signingState: "unconfigured" | "configured";
  }>;
  session: {
    restoration: "disabled" | "guarded_enabled";
    strategy: "session_or_token_bridge";
    secureStore: "device_keystore_required";
  };
  continuity: {
    workspaceState: "backend_workspace_depth_linked";
    preferenceState: "hybrid_preference_sync";
    sessionBridge: "guarded_cross_client";
    notificationSemantics: "shared_guarded_readiness";
  };
  persistence: {
    workspacePreferences: "backend_or_local_fallback";
    offlineCache: "reserved";
    syncMode: "guarded_sync";
  };
  push: {
    readiness: "unconfigured" | "configured_guarded";
    provider: "unconfigured" | "configured";
    deliveryClaims: "none";
  };
  safety: {
    paperOnly: true;
    liveExecution: "blocked";
    realMoneyRouting: "blocked";
    autoTrading: "blocked";
  };
  readiness: {
    score: number;
    stage: MobileProductizationStage;
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

export function getMobileProductizationSnapshot(
  checkedAt = new Date().toISOString()
): MobileProductizationSnapshot {
  const foundation = getMobileAppsFoundationSnapshot(checkedAt);
  const sessionRestoreEnabled = envIsTrue(process.env.TPM_MOBILE_SESSION_RESTORE_ENABLED);
  const androidPackaged = isConfigured(process.env.TPM_MOBILE_ANDROID_PACKAGE);
  const iosPackaged = isConfigured(process.env.TPM_MOBILE_IOS_PACKAGE);
  const distributionReady = isConfigured(process.env.TPM_MOBILE_DISTRIBUTION_PROFILE);
  const pushProviderConfigured = isConfigured(process.env.TPM_MOBILE_PUSH_PROVIDER);
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "mobile_foundation", ok: true, weight: 20 },
      { key: "session_restore_contract", ok: sessionRestoreEnabled, weight: 15 },
      { key: "android_package", ok: androidPackaged, weight: 10 },
      { key: "ios_package", ok: iosPackaged, weight: 10 },
      { key: "distribution_profile", ok: distributionReady, weight: 15 },
      { key: "push_provider_contract", ok: pushProviderConfigured, weight: 10 },
      { key: "paper_only_guard", ok: true, weight: 10 },
      { key: "auto_trading_block", ok: true, weight: 10 },
    ],
    stageThresholds: [
      { stage: "foundation_only", minScore: 0 },
      { stage: "pilot_usable", minScore: 55 },
      { stage: "distribution_guarded", minScore: 85 },
    ],
  });

  return {
    checkedAt,
    truth: {
      productizationState: readiness.stage as MobileProductizationStage,
      runtime: foundation.truth.runtime,
      pushClaims: "none",
      releaseClaims: "no_store_release_claim",
    },
    clientFlow: {
      navigationModel: "workstation_compact_tabs",
      routeScope: "operator_assist",
      deepLinking: "reserved",
    },
    targets: [
      {
        platform: "android",
        packageState: androidPackaged ? "pilot_packaged" : "not_packaged",
        distributionState: distributionReady
          ? "pilot_distribution_ready"
          : "unconfigured",
        signingState: foundation.client.signingProfiles.android,
      },
      {
        platform: "ios",
        packageState: iosPackaged ? "pilot_packaged" : "not_packaged",
        distributionState: distributionReady
          ? "pilot_distribution_ready"
          : "unconfigured",
        signingState: foundation.client.signingProfiles.ios,
      },
    ],
    session: {
      restoration: sessionRestoreEnabled ? "guarded_enabled" : "disabled",
      strategy: foundation.authSession.sessionStrategy,
      secureStore: foundation.authSession.secureStore,
    },
    continuity: {
      workspaceState: "backend_workspace_depth_linked",
      preferenceState: "hybrid_preference_sync",
      sessionBridge: "guarded_cross_client",
      notificationSemantics: "shared_guarded_readiness",
    },
    persistence: {
      workspacePreferences: "backend_or_local_fallback",
      offlineCache: foundation.persistence.offlineCache,
      syncMode: "guarded_sync",
    },
    push: {
      readiness: pushProviderConfigured ? "configured_guarded" : "unconfigured",
      provider: pushProviderConfigured ? "configured" : "unconfigured",
      deliveryClaims: "none",
    },
    safety: {
      paperOnly: true,
      liveExecution: "blocked",
      realMoneyRouting: "blocked",
      autoTrading: "blocked",
    },
    readiness: {
      score: readiness.score,
      stage: readiness.stage as MobileProductizationStage,
    },
    summary:
      "Mobile productization contracts are active for Android and iOS with guarded session/persistence, explicit push-delivery truth, and cross-client continuity semantics.",
    detail:
      "Mobile client flow, session restoration, persistence behavior, and distribution contracts are expanded for pilot usability. Workspace depth and preference continuity stay aligned with web/desktop contracts. Push delivery remains non-claiming, and live/real-money/auto-trading paths remain blocked.",
  };
}

export function getMobileProductizationDiagnosticsProbe(
  checkedAt = new Date().toISOString()
): DiagnosticsProbe {
  const snapshot = getMobileProductizationSnapshot(checkedAt);
  const status = snapshot.readiness.stage === "foundation_only" ? "unconfigured" : "ready";

  return {
    key: "mobile_productization",
    label: "Mobile productization",
    status,
    summary: snapshot.summary,
    detail: `${snapshot.detail} Readiness ${snapshot.readiness.score}/100 (${snapshot.readiness.stage}).`,
    checkedAt,
  };
}
