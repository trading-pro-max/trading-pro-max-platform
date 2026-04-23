import "server-only";

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
