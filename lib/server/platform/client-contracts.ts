import "server-only";
import { getDesktopAppsFoundationSnapshot } from "@/lib/server/platform/desktop-foundation";
import { getDesktopProductizationSnapshot } from "@/lib/server/platform/desktop-productization";
import { getMobileAppsFoundationSnapshot } from "@/lib/server/platform/mobile-foundation";

export type ClientExpansionSnapshot = {
  checkedAt: string;
  shared: {
    apiContract: "http_json_v1";
    authContract: "session_or_bearer";
    executionSafety: "paper_only_live_blocked";
  };
  web: {
    state: "active";
    routeSurface: "app_router";
  };
  desktop: {
    state: "future_ready";
    shell: "electron_or_tauri";
    localPersistence: "contract_ready";
    notificationDelivery: "unconfigured";
    foundation: {
      runtimeBridge: "ipc_json_v1";
      targets: Array<"windows" | "macos" | "linux">;
      packaging: "contract_ready";
      distributionState: "contract_only" | "packaging_ready";
      sessionStrategy: "http_session_bridge";
    };
    productization: {
      stage: "foundation_only" | "pilot_usable" | "distribution_guarded";
      sessionRestore: "disabled" | "guarded_enabled";
      updateState: "unconfigured" | "pilot_update_ready";
      releaseClaims: "no_public_store_release_claim";
    };
  };
  mobile: {
    state: "future_ready";
    shell: "react_native_or_native_wrapper";
    authFlow: "session_or_token_bridge";
    notificationDelivery: "unconfigured";
    foundation: {
      runtimeBridge: "bridge_json_v1";
      targets: Array<"android" | "ios">;
      pushDelivery: "unconfigured";
      distributionState: "contract_only" | "packaging_ready";
      sessionStrategy: "session_or_token_bridge";
    };
  };
  summary: string;
};

export function getClientExpansionSnapshot(
  checkedAt = new Date().toISOString()
): ClientExpansionSnapshot {
  const desktop = getDesktopAppsFoundationSnapshot(checkedAt);
  const desktopProductization = getDesktopProductizationSnapshot(checkedAt);
  const mobile = getMobileAppsFoundationSnapshot(checkedAt);

  return {
    checkedAt,
    shared: {
      apiContract: "http_json_v1",
      authContract: "session_or_bearer",
      executionSafety: "paper_only_live_blocked",
    },
    web: {
      state: "active",
      routeSurface: "app_router",
    },
    desktop: {
      state: "future_ready",
      shell: "electron_or_tauri",
      localPersistence: "contract_ready",
      notificationDelivery: "unconfigured",
      foundation: {
        runtimeBridge: desktop.bridge.protocol,
        targets: desktop.targets.map((target) => target.os),
        packaging: desktop.packaging.buildScripts,
        distributionState: desktop.targets[0]?.distributionState ?? "contract_only",
        sessionStrategy: desktop.authSession.sessionStrategy,
      },
      productization: {
        stage: desktopProductization.readiness.stage,
        sessionRestore: desktopProductization.session.restoration,
        updateState: desktopProductization.targets[0]?.updateState ?? "unconfigured",
        releaseClaims: desktopProductization.truth.releaseClaims,
      },
    },
    mobile: {
      state: "future_ready",
      shell: "react_native_or_native_wrapper",
      authFlow: "session_or_token_bridge",
      notificationDelivery: "unconfigured",
      foundation: {
        runtimeBridge: mobile.bridge.protocol,
        targets: mobile.targets.map((target) => target.platform),
        pushDelivery: mobile.workflow.pushDelivery,
        distributionState: mobile.targets[0]?.distributionState ?? "contract_only",
        sessionStrategy: mobile.authSession.sessionStrategy,
      },
    },
    summary:
      "Web runtime is active. Desktop and mobile client shells are future-ready through shared API/auth contracts, with notification delivery intentionally unconfigured.",
  };
}
