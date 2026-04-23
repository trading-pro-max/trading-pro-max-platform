import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { getAccountComplianceSnapshotForAuthenticatedSession } from "@/lib/server/compliance";
import { getBrokerConnectorSafetySnapshot } from "@/lib/server/connectors/broker";
import { getMarketDataSnapshot } from "@/lib/server/market-data/service";
import { getAlertWorkflowSnapshot } from "@/lib/server/workflows";
import type { DiagnosticsProbe } from "@/modules/shell/types/platform-state";

export type IntelligenceBackendAvailability = "bounded" | "degraded";

export type IntelligenceBackendContextSnapshot = {
  checkedAt: string;
  authenticated: boolean;
  availability: IntelligenceBackendAvailability;
  request: {
    requestedSymbol: string;
    requestedTimeframe: string;
    normalizedSymbol: string;
    normalizedTimeframe: string;
  };
  market: {
    feedState: string;
    sourceLabel: string;
    noticeCodes: string[];
    degradedReason: string | null;
  };
  execution: {
    paperAccess: "ready" | "guarded";
    liveExecution: "blocked";
    brokerState: "unconfigured" | "configured_blocked";
    operatorReview: string;
  };
  workflow: {
    state: "unconfigured" | "configured_local";
    enabledRuleCount: number;
    automation: "inactive";
  };
  truth: {
    predictiveScope: "interpretive_only";
    confidenceSemantics: "context_only";
    executionAuthority: "operator_manual";
    liveExecution: "blocked";
  };
  summary: string;
};

function deriveAvailability(feedState: string): IntelligenceBackendAvailability {
  if (feedState === "degraded" || feedState === "unavailable" || feedState === "disconnected") {
    return "degraded";
  }

  return "bounded";
}

export async function getIntelligenceBackendContext(input: {
  symbol?: string | null;
  timeframe?: string | null;
  session?: AuthenticatedSession | null;
}): Promise<IntelligenceBackendContextSnapshot> {
  const checkedAt = new Date().toISOString();
  const [marketSnapshot, broker] = await Promise.all([
    getMarketDataSnapshot({
      symbol: input.symbol,
      timeframe: input.timeframe,
    }),
    Promise.resolve(getBrokerConnectorSafetySnapshot(checkedAt)),
  ]);
  const availability = deriveAvailability(marketSnapshot.feed.state);
  const authenticated = Boolean(input.session);
  const workflowSnapshot = input.session
    ? await getAlertWorkflowSnapshot(input.session.account.id)
    : null;
  const compliance = input.session
    ? await getAccountComplianceSnapshotForAuthenticatedSession(input.session)
    : null;
  const enabledRuleCount =
    workflowSnapshot?.rules.filter((rule) => rule.state === "enabled").length ?? 0;
  const paperAccess =
    compliance?.activation.executionEnabled && compliance.activation.paperState === "enabled"
      ? "ready"
      : "guarded";

  return {
    checkedAt,
    authenticated,
    availability,
    request: {
      requestedSymbol: marketSnapshot.requestedSymbol,
      requestedTimeframe: marketSnapshot.requestedTimeframe,
      normalizedSymbol: marketSnapshot.request.normalizedSymbol,
      normalizedTimeframe: marketSnapshot.request.normalizedTimeframe,
    },
    market: {
      feedState: marketSnapshot.feed.state,
      sourceLabel: marketSnapshot.feed.sourceLabel,
      noticeCodes: marketSnapshot.feed.notices.map((notice) => notice.code),
      degradedReason: marketSnapshot.feed.degradedReason ?? null,
    },
    execution: {
      paperAccess,
      liveExecution: "blocked",
      brokerState: broker.state,
      operatorReview: broker.operatorReview.state,
    },
    workflow: {
      state: workflowSnapshot ? "configured_local" : "unconfigured",
      enabledRuleCount,
      automation: "inactive",
    },
    truth: {
      predictiveScope: "interpretive_only",
      confidenceSemantics: "context_only",
      executionAuthority: "operator_manual",
      liveExecution: "blocked",
    },
    summary:
      availability === "degraded"
        ? "Intelligence backend context is available in degraded mode with fallback-safe semantics."
        : "Intelligence backend context is available with bounded fallback-safe semantics.",
  };
}

export async function getIntelligenceBackendDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();
  const marketSnapshot = await getMarketDataSnapshot();
  const availability = deriveAvailability(marketSnapshot.feed.state);

  return {
    key: "intelligence_backend",
    label: "Intelligence backend context",
    status: availability === "degraded" ? "degraded" : "ready",
    summary:
      availability === "degraded"
        ? "Intelligence context available in degraded mode"
        : "Intelligence context contracts available",
    detail:
      "Deterministic market/execution/workflow context contracts are available for IQ/Brain surfaces, with interpretive-only semantics and no execution authority.",
    checkedAt,
  };
}
