import "server-only";
import { getDesktopAppsFoundationSnapshot } from "@/lib/server/platform/desktop-foundation";

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
  };
  mobile: {
    state: "future_ready";
    shell: "react_native_or_native_wrapper";
    authFlow: "session_or_token_bridge";
    notificationDelivery: "unconfigured";
  };
  summary: string;
};

export function getClientExpansionSnapshot(
  checkedAt = new Date().toISOString()
): ClientExpansionSnapshot {
  const desktop = getDesktopAppsFoundationSnapshot(checkedAt);

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
    },
    mobile: {
      state: "future_ready",
      shell: "react_native_or_native_wrapper",
      authFlow: "session_or_token_bridge",
      notificationDelivery: "unconfigured",
    },
    summary:
      "Web runtime is active. Desktop and mobile client shells are future-ready through shared API/auth contracts, with notification delivery intentionally unconfigured.",
  };
}
