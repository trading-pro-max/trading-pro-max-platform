import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import {
  getAccountComplianceSnapshotForAuthenticatedSession,
} from "@/lib/server/compliance";
import { getBrokerConnectorSafetySnapshot } from "@/lib/server/connectors/broker";
import { getMarketFeedArchitectureSnapshot } from "@/lib/server/market-data/service";
import { getWorkspacePreferenceSnapshot } from "@/lib/server/preferences/state";
import { getWorkspaceDepthStateSnapshot } from "@/lib/server/workspace";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type ProductBackendReadinessState =
  | "paper_ready"
  | "paper_guarded"
  | "paper_gated";

export type ProductBackendStateSnapshot = {
  checkedAt: string;
  account: {
    id: string;
    mode: "demo";
    lifecycleState: string;
    region: string;
  };
  readiness: {
    state: ProductBackendReadinessState;
    reason: string;
    nextStep: string;
  };
  capabilities: {
    paperExecution: "enabled" | "guarded" | "blocked";
    liveExecution: "blocked";
    marketData: "fallback_first";
    broker: "unconfigured" | "configured_blocked";
    workspacePersistence: "backend_ready";
    alertsWorkflow: "configured_local" | "unconfigured";
    intelligenceContext: "bounded";
  };
  persistence: {
    preferences: "stored" | "defaults";
    workspaceDepth: "backend_audit" | "defaults";
  };
  commercial: {
    packaging: "contract_ready";
    billing: "inactive";
    subscriptions: "unconfigured";
    supportWorkflow: "operator_review_guarded";
  };
  trust: {
    paperOnly: true;
    liveExecution: "blocked";
    brokerConnectivity: "unconfigured" | "configured_blocked";
    marketFeed: "fallback_first";
    operatorReview: string;
  };
};

function deriveReadinessState(input: {
  executionEnabled: boolean;
  activationReason: string;
  activationNextStep: string;
}): ProductBackendStateSnapshot["readiness"] {
  if (input.executionEnabled) {
    return {
      state: "paper_ready",
      reason: input.activationReason,
      nextStep: input.activationNextStep,
    };
  }

  if (input.activationReason === "review_pending") {
    return {
      state: "paper_guarded",
      reason: input.activationReason,
      nextStep: input.activationNextStep,
    };
  }

  return {
    state: "paper_gated",
    reason: input.activationReason,
    nextStep: input.activationNextStep,
  };
}

function derivePaperExecutionCapability(
  readiness: ProductBackendStateSnapshot["readiness"]
): ProductBackendStateSnapshot["capabilities"]["paperExecution"] {
  if (readiness.state === "paper_ready") return "enabled";
  if (readiness.state === "paper_guarded") return "guarded";
  return "blocked";
}

export async function getProductBackendStateForAuthenticatedSession(
  session: AuthenticatedSession
): Promise<ProductBackendStateSnapshot> {
  const checkedAt = new Date().toISOString();
  const [compliance, broker, feedArchitecture, preferences, workspaceDepth] =
    await Promise.all([
      getAccountComplianceSnapshotForAuthenticatedSession(session),
      Promise.resolve(getBrokerConnectorSafetySnapshot(checkedAt)),
      Promise.resolve(getMarketFeedArchitectureSnapshot(checkedAt)),
      getWorkspacePreferenceSnapshot(session.account.id),
      getWorkspaceDepthStateSnapshot(session.account.id),
    ]);
  const activationReason = compliance?.activation.reason ?? "review_pending";
  const activationNextStep = compliance?.activation.nextStep ?? "await_review";
  const executionEnabled = Boolean(compliance?.activation.executionEnabled);
  const lifecycleState =
    compliance?.account.lifecycleState ?? session.account.lifecycleState;
  const region = compliance?.account.region ?? session.account.region;

  const readiness = deriveReadinessState({
    executionEnabled,
    activationReason,
    activationNextStep,
  });

  return {
    checkedAt,
    account: {
      id: session.account.id,
      mode: "demo",
      lifecycleState,
      region,
    },
    readiness,
    capabilities: {
      paperExecution: derivePaperExecutionCapability(readiness),
      liveExecution: "blocked",
      marketData: "fallback_first",
      broker: broker.state,
      workspacePersistence: "backend_ready",
      alertsWorkflow: "unconfigured",
      intelligenceContext: "bounded",
    },
    persistence: {
      preferences: preferences ? "stored" : "defaults",
      workspaceDepth: workspaceDepth.source,
    },
    commercial: {
      packaging: "contract_ready",
      billing: "inactive",
      subscriptions: "unconfigured",
      supportWorkflow: "operator_review_guarded",
    },
    trust: {
      paperOnly: true,
      liveExecution: "blocked",
      brokerConnectivity: broker.state,
      marketFeed: feedArchitecture.policyMode,
      operatorReview: broker.operatorReview.state,
    },
  };
}

export async function getProductBackendDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  return {
    key: "product_backend_state",
    label: "Product backend state",
    status: "ready",
    summary: "Commercial backend state contracts are available",
    detail:
      "Account readiness, capability truth, persistence anchors, and commercial packaging state are served from backend contracts without enabling billing or live execution.",
    checkedAt,
  };
}
