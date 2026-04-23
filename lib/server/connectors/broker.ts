import "server-only";
import { getOperatorKeyMode } from "@/lib/server/operator/access";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import { normalizeConnectorReadinessState } from "@/lib/server/connectors/readiness";
import type {
  ConnectorSafetySnapshot,
  ConnectorOperatorReviewState,
  DiagnosticsProbe,
} from "@/modules/shell/types/platform-state";

const BROKER_PROVIDER_UNCONFIGURED = "unconfigured";
const BROKER_PROVIDER_HTTP = "http_connector";
const BROKER_PROVIDER_DEFAULT_LABEL = "Reserved broker connector";
const BROKER_POLICY_MODE = "paper_safe_blocked_live";

type BrokerProviderKey =
  | typeof BROKER_PROVIDER_UNCONFIGURED
  | typeof BROKER_PROVIDER_HTTP;

type BrokerConnectivityState =
  | "unconfigured"
  | "configured_inactive"
  | "configured_blocked";

type BrokerIntegrationState = "unconfigured" | "configured_blocked";

export type BrokerIntegrationContracts = {
  orders: {
    paperSubmit: "local_router";
    realSubmit: "blocked";
    cancel: "paper_only";
  };
  account: {
    paperBalances: "local_ledger";
    brokerBalances: "unavailable";
    positions: "paper_only";
  };
  connectivity: {
    healthPing: "reserved";
    websocket: "inactive";
    credentialHandshake: "required";
  };
};

export type BrokerIntegrationSnapshot = {
  checkedAt: string;
  policyMode: typeof BROKER_POLICY_MODE;
  readiness: {
    score: number;
    stage: "unconfigured" | "configured_guarded" | "policy_blocked";
  };
  provider: {
    key: BrokerProviderKey;
    label: string;
    configured: boolean;
    endpoint: string | null;
    connectivity: BrokerConnectivityState;
  };
  integration: {
    state: BrokerIntegrationState;
    paperRouting: "local_paper_only";
    realRouting: "blocked";
    activationGate: "configuration_required" | "policy_blocked";
  };
  contracts: BrokerIntegrationContracts;
  operatorReview: {
    state: ConnectorOperatorReviewState;
    keyMode: ReturnType<typeof getOperatorKeyMode>;
    summary: string;
    detail: string;
  };
  summary: string;
  detail: string;
};

function normalizeBrokerProviderKey(value: string | null | undefined): BrokerProviderKey {
  if (!value?.trim()) return BROKER_PROVIDER_HTTP;
  const normalized = value.trim().toLowerCase();

  if (normalized === "http_connector") return BROKER_PROVIDER_HTTP;

  return BROKER_PROVIDER_HTTP;
}

function getBrokerEndpoint() {
  const endpoint = process.env.TPM_BROKER_CONNECTOR_URL?.trim();
  return endpoint ? endpoint.slice(0, 1024) : null;
}

function resolveBrokerProviderState() {
  const endpoint = getBrokerEndpoint();

  if (!endpoint) {
    return {
      key: BROKER_PROVIDER_UNCONFIGURED as BrokerProviderKey,
      label: "Broker connector unconfigured",
      configured: false,
      endpoint: null,
      connectivity: "unconfigured" as const,
    };
  }

  const configuredProvider = normalizeBrokerProviderKey(
    process.env.TPM_BROKER_PROVIDER
  );

  return {
    key: configuredProvider,
    label: BROKER_PROVIDER_DEFAULT_LABEL,
    configured: true,
    endpoint,
    connectivity: "configured_blocked" as const,
  };
}

function getBrokerIntegrationContracts(): BrokerIntegrationContracts {
  return {
    orders: {
      paperSubmit: "local_router",
      realSubmit: "blocked",
      cancel: "paper_only",
    },
    account: {
      paperBalances: "local_ledger",
      brokerBalances: "unavailable",
      positions: "paper_only",
    },
    connectivity: {
      healthPing: "reserved",
      websocket: "inactive",
      credentialHandshake: "required",
    },
  };
}

function getOperatorReviewState(): ConnectorOperatorReviewState {
  const keyMode = getOperatorKeyMode();

  if (keyMode === "configured") return "configured_guarded";
  if (keyMode === "local_explicit") return "local_explicit_guarded";

  return "unconfigured";
}

function getOperatorReviewSummary(state: ConnectorOperatorReviewState) {
  if (state === "configured_guarded") return "Operator review guarded";
  if (state === "local_explicit_guarded") return "Local operator review guarded";

  return "Operator review unconfigured";
}

function getOperatorReviewDetail(state: ConnectorOperatorReviewState) {
  if (state === "configured_guarded") {
    return "Operator review has an explicit secret configured, but still requires an authenticated operator account and matching operator key.";
  }

  if (state === "local_explicit_guarded") {
    return "Local operator review was explicitly enabled outside production and still requires an operator account plus the local operator key.";
  }

  return "No operator review secret is configured, so operator review is unavailable.";
}

export function getBrokerIntegrationSnapshot(
  checkedAt = new Date().toISOString()
): BrokerIntegrationSnapshot {
  const provider = resolveBrokerProviderState();
  const operatorReviewState = getOperatorReviewState();
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "provider_endpoint", ok: provider.configured, weight: 35 },
      {
        key: "operator_review_guard",
        ok: operatorReviewState !== "unconfigured",
        weight: 20,
      },
      { key: "paper_router_active", ok: true, weight: 25 },
      {
        key: "live_policy_guard",
        ok: provider.configured,
        weight: 20,
      },
    ],
    stageThresholds: [
      { stage: "unconfigured", minScore: 0 },
      { stage: "configured_guarded", minScore: 55 },
      { stage: "policy_blocked", minScore: 80 },
    ],
  });

  return {
    checkedAt,
    policyMode: BROKER_POLICY_MODE,
    readiness: {
      score: readiness.score,
      stage: readiness.stage as "unconfigured" | "configured_guarded" | "policy_blocked",
    },
    provider,
    integration: {
      state: provider.configured ? "configured_blocked" : "unconfigured",
      paperRouting: "local_paper_only",
      realRouting: "blocked",
      activationGate: provider.configured
        ? "policy_blocked"
        : "configuration_required",
    },
    contracts: getBrokerIntegrationContracts(),
    operatorReview: {
      state: operatorReviewState,
      keyMode: getOperatorKeyMode(),
      summary: getOperatorReviewSummary(operatorReviewState),
      detail: getOperatorReviewDetail(operatorReviewState),
    },
    summary: provider.configured
      ? "Broker provider configured but live routing blocked"
      : "No broker provider configured",
    detail: provider.configured
      ? "A broker endpoint is configured for future integration contracts, but connector activation is policy blocked and real-money execution remains unavailable."
      : "No broker endpoint is configured. Paper execution stays local-only and real-money routing remains blocked.",
  };
}

export function getBrokerConnectorSafetySnapshot(
  checkedAt = new Date().toISOString()
): ConnectorSafetySnapshot {
  const broker = getBrokerIntegrationSnapshot(checkedAt);
  const configured = broker.provider.configured;

  return {
    key: "broker",
    label: "Broker connector",
    state: configured ? "configured_blocked" : "unconfigured",
    configured,
    connectionState:
      broker.provider.connectivity === "unconfigured"
        ? "unconfigured"
        : "configured_not_connected",
    activationGate: configured ? "policy_blocked" : "configuration_required",
    paperCapability: "local_paper_only",
    realCapability: "blocked",
    liveExecution: "blocked",
    operatorReview: broker.operatorReview,
    summary: broker.summary,
    detail: broker.detail,
    checkedAt,
  };
}

export function getBrokerConnectorDiagnosticsProbe(
  snapshot: ConnectorSafetySnapshot
): DiagnosticsProbe {
  const connectorReadiness = normalizeConnectorReadinessState(
    snapshot.configured ? "blocked" : "not_configured"
  );

  return {
    key: "broker_connector",
    label: "Connector visibility",
    status: snapshot.configured ? "blocked" : "unconfigured",
    summary: snapshot.summary,
    detail: `${snapshot.detail} Broker contracts are explicit for paper order routing, real-order blocking, and reserved connectivity checks. Connector readiness state: ${connectorReadiness}.`,
    checkedAt: snapshot.checkedAt,
  };
}
