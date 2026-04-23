import "server-only";
import { getOperatorKeyMode } from "@/lib/server/operator/access";
import type {
  ConnectorSafetySnapshot,
  ConnectorOperatorReviewState,
  DiagnosticsProbe,
} from "@/modules/shell/types/platform-state";

function brokerEndpointConfigured() {
  return Boolean(process.env.TPM_BROKER_CONNECTOR_URL?.trim());
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

export function getBrokerConnectorSafetySnapshot(
  checkedAt = new Date().toISOString()
): ConnectorSafetySnapshot {
  const configured = brokerEndpointConfigured();
  const operatorReviewState = getOperatorReviewState();

  return {
    key: "broker",
    label: "Broker connector",
    state: configured ? "configured_blocked" : "unconfigured",
    configured,
    connectionState: configured ? "configured_not_connected" : "unconfigured",
    activationGate: configured ? "policy_blocked" : "configuration_required",
    paperCapability: "local_paper_only",
    realCapability: "blocked",
    liveExecution: "blocked",
    operatorReview: {
      state: operatorReviewState,
      keyMode: getOperatorKeyMode(),
      summary: getOperatorReviewSummary(operatorReviewState),
      detail: getOperatorReviewDetail(operatorReviewState),
    },
    summary: configured
      ? "Broker endpoint configured but blocked"
      : "No broker connector configured",
    detail: configured
      ? "A broker endpoint is present for future integration, but no broker connection is opened and real-money routing remains blocked by policy."
      : "Broker connectivity is not configured. Paper execution stays local-only and real-money routing remains blocked by policy.",
    checkedAt,
  };
}

export function getBrokerConnectorDiagnosticsProbe(
  snapshot: ConnectorSafetySnapshot
): DiagnosticsProbe {
  return {
    key: "broker_connector",
    label: "Connector visibility",
    status: snapshot.configured ? "blocked" : "unconfigured",
    summary: snapshot.summary,
    detail: snapshot.detail,
    checkedAt: snapshot.checkedAt,
  };
}
