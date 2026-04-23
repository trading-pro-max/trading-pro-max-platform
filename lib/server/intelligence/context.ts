import "server-only";
import type { AuthenticatedSession } from "@/lib/auth/service";
import { prisma } from "@/lib/db/client";
import { getAccountComplianceSnapshotForAuthenticatedSession } from "@/lib/server/compliance";
import { getBrokerConnectorSafetySnapshot } from "@/lib/server/connectors/broker";
import { getMarketDataSnapshot } from "@/lib/server/market-data/service";
import { getAlertWorkflowSnapshot } from "@/lib/server/workflows";
import type { DiagnosticsProbe, MarketCandle } from "@/modules/shell/types/platform-state";

export type IntelligenceBackendAvailability = "bounded" | "degraded";

type IntelligenceTrend = "up_bias" | "down_bias" | "balanced";
type IntelligenceAlignment = "aligned" | "mixed" | "unclear";
type IntelligenceConfidence = "low" | "guarded";

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
  multiTimeframe: {
    symbol: string;
    alignment: IntelligenceAlignment;
    boundedConfidence: IntelligenceConfidence;
    windows: Array<{
      timeframe: "1m" | "5m" | "15m";
      trend: IntelligenceTrend;
      momentumPct: number;
      volatilityPct: number;
      feedState: string;
    }>;
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
  journal: {
    coverage: "local_audit_limited";
    periodHours: 168;
    tradeEvents: {
      opened: number;
      closed: number;
    };
    riskEvents: number;
    reviewEvents: number;
    preferenceSyncEvents: number;
    note: string;
  };
  performance: {
    state: "insufficient_data" | "baseline" | "growing";
    disciplineScore: number;
    consistency: "insufficient_data" | "emerging" | "stable";
    highlights: string[];
  };
  coaching: {
    mode: "bounded_guidance";
    priorities: string[];
    cautions: string[];
    actions: string[];
  };
  truth: {
    predictiveScope: "interpretive_only";
    confidenceSemantics: "context_only";
    executionAuthority: "operator_manual";
    predictiveGuarantee: "none";
    winRateClaim: "none";
    liveExecution: "blocked";
    degradedModeExplicit: true;
  };
  summary: string;
};

function deriveAvailability(feedState: string): IntelligenceBackendAvailability {
  if (feedState === "degraded" || feedState === "unavailable" || feedState === "disconnected") {
    return "degraded";
  }

  return "bounded";
}

function toFixedNumber(value: number, decimals = 2) {
  return Number(value.toFixed(decimals));
}

function calculateMomentumPct(candles: MarketCandle[]) {
  if (candles.length < 2) return 0;
  const first = candles[0];
  const last = candles[candles.length - 1];
  if (!first || !last || first.open === 0) return 0;

  return ((last.close - first.open) / first.open) * 100;
}

function calculateVolatilityPct(candles: MarketCandle[]) {
  if (candles.length === 0) return 0;
  const normalizedRanges = candles
    .map((candle) => {
      if (candle.close === 0) return 0;
      return ((candle.high - candle.low) / candle.close) * 100;
    })
    .filter((value) => Number.isFinite(value) && value >= 0);
  if (normalizedRanges.length === 0) return 0;

  const average =
    normalizedRanges.reduce((sum, value) => sum + value, 0) / normalizedRanges.length;
  return average;
}

function resolveTrend(momentumPct: number): IntelligenceTrend {
  if (momentumPct > 0.12) return "up_bias";
  if (momentumPct < -0.12) return "down_bias";
  return "balanced";
}

function buildTimeframeWindow(input: {
  timeframe: "1m" | "5m" | "15m";
  candles: MarketCandle[];
  feedState: string;
}) {
  const momentumPct = calculateMomentumPct(input.candles);
  const volatilityPct = calculateVolatilityPct(input.candles);

  return {
    timeframe: input.timeframe,
    trend: resolveTrend(momentumPct),
    momentumPct: toFixedNumber(momentumPct),
    volatilityPct: toFixedNumber(volatilityPct),
    feedState: input.feedState,
  };
}

function deriveAlignment(
  windows: IntelligenceBackendContextSnapshot["multiTimeframe"]["windows"]
): IntelligenceAlignment {
  const directional = windows.filter((window) => window.trend !== "balanced");
  if (directional.length === 0) return "unclear";
  const firstTrend = directional[0]?.trend;
  if (firstTrend && directional.every((window) => window.trend === firstTrend)) {
    return "aligned";
  }

  return "mixed";
}

function deriveBoundedConfidence(input: {
  availability: IntelligenceBackendAvailability;
  alignment: IntelligenceAlignment;
  feedState: string;
}): IntelligenceConfidence {
  if (input.availability === "degraded") return "low";
  if (input.feedState === "degraded" || input.feedState === "unavailable") return "low";
  if (input.alignment === "aligned") return "guarded";
  return "low";
}

async function getJournalPerformance(input: {
  session?: AuthenticatedSession | null;
}): Promise<{
  journal: IntelligenceBackendContextSnapshot["journal"];
  performance: IntelligenceBackendContextSnapshot["performance"];
}> {
  if (!input.session) {
    return {
      journal: {
        coverage: "local_audit_limited",
        periodHours: 168,
        tradeEvents: { opened: 0, closed: 0 },
        riskEvents: 0,
        reviewEvents: 0,
        preferenceSyncEvents: 0,
        note:
          "No authenticated account context. Journal/performance insight is limited to bounded public semantics.",
      },
      performance: {
        state: "insufficient_data",
        disciplineScore: 0,
        consistency: "insufficient_data",
        highlights: [
          "Sign in to include account-scoped journal and workflow history in coaching context.",
        ],
      },
    };
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const accountId = input.session.account.id;
  const [opened, closed, riskEvents, reviewEvents, preferenceSyncEvents] =
    await Promise.all([
      prisma.auditEvent.count({
        where: {
          accountId,
          kind: "trade_opened",
          createdAt: { gte: since },
        },
      }),
      prisma.auditEvent.count({
        where: {
          accountId,
          kind: "trade_closed",
          createdAt: { gte: since },
        },
      }),
      prisma.auditEvent.count({
        where: {
          accountId,
          kind: "risk_state_changed",
          createdAt: { gte: since },
        },
      }),
      prisma.auditEvent.count({
        where: {
          accountId,
          kind: "review_state_changed",
          createdAt: { gte: since },
        },
      }),
      prisma.auditEvent.count({
        where: {
          accountId,
          kind: "preferences_synced",
          createdAt: { gte: since },
        },
      }),
    ]);
  const tradeEvents = opened + closed;
  const disciplineRaw = Math.max(
    0,
    Math.min(100, 55 + Math.min(preferenceSyncEvents, 20) - riskEvents * 3 + reviewEvents * 2)
  );
  const disciplineScore = Math.round(disciplineRaw);
  const state =
    tradeEvents === 0
      ? "insufficient_data"
      : disciplineScore >= 70
      ? "growing"
      : "baseline";
  const consistency =
    tradeEvents === 0
      ? "insufficient_data"
      : tradeEvents >= 8 && disciplineScore >= 65
      ? "stable"
      : "emerging";

  return {
    journal: {
      coverage: "local_audit_limited",
      periodHours: 168,
      tradeEvents: { opened, closed },
      riskEvents,
      reviewEvents,
      preferenceSyncEvents,
      note:
        "Insights are derived from local account audit history and remain bounded guidance, not predictive guarantees.",
    },
    performance: {
      state,
      disciplineScore,
      consistency,
      highlights: [
        `Trade events in last 7 days: ${tradeEvents}.`,
        `Risk transitions observed: ${riskEvents}.`,
        `Preference/workspace sync events observed: ${preferenceSyncEvents}.`,
      ],
    },
  };
}

function buildCoaching(input: {
  availability: IntelligenceBackendAvailability;
  alignment: IntelligenceAlignment;
  confidence: IntelligenceConfidence;
  paperAccess: "ready" | "guarded";
  enabledRuleCount: number;
  performance: IntelligenceBackendContextSnapshot["performance"];
  marketFeedState: string;
}) {
  const priorities: string[] = [];
  const cautions: string[] = [];
  const actions: string[] = [];

  if (input.paperAccess === "guarded") {
    priorities.push("Clear paper-access gating steps before increasing execution frequency.");
  } else {
    priorities.push("Keep executions inside paper route with explicit preflight checks.");
  }

  if (input.alignment === "aligned" && input.confidence === "guarded") {
    priorities.push("Use alignment as a context filter, not an execution guarantee.");
  } else if (input.alignment === "mixed") {
    cautions.push("Timeframe alignment is mixed; treat signals as exploratory.");
  } else {
    cautions.push("Directional context is unclear; reduce conviction and size.");
  }

  if (input.marketFeedState === "degraded" || input.availability === "degraded") {
    cautions.push("Feed quality is degraded; bias toward risk-first, low-conviction decisions.");
  }

  if (input.enabledRuleCount === 0) {
    actions.push("Enable at least one guarded workflow rule for desk-note discipline.");
  } else {
    actions.push(
      `Maintain ${input.enabledRuleCount} enabled workflow rule(s) as operator prompts only.`
    );
  }

  if (input.performance.state === "insufficient_data") {
    actions.push("Build journal density before trusting performance pattern narratives.");
  } else {
    actions.push(
      `Track discipline score (${input.performance.disciplineScore}) weekly for trend, not certainty.`
    );
  }

  actions.push("No automated/live execution path is available; all actions remain manual.");

  return {
    mode: "bounded_guidance" as const,
    priorities,
    cautions,
    actions,
  };
}

export async function getIntelligenceBackendContext(input: {
  symbol?: string | null;
  timeframe?: string | null;
  session?: AuthenticatedSession | null;
}): Promise<IntelligenceBackendContextSnapshot> {
  const checkedAt = new Date().toISOString();
  const [marketSnapshot, broker, timeframe1m, timeframe5m, timeframe15m] = await Promise.all([
    getMarketDataSnapshot({
      symbol: input.symbol,
      timeframe: input.timeframe,
    }),
    Promise.resolve(getBrokerConnectorSafetySnapshot(checkedAt)),
    getMarketDataSnapshot({ symbol: input.symbol, timeframe: "1m" }),
    getMarketDataSnapshot({ symbol: input.symbol, timeframe: "5m" }),
    getMarketDataSnapshot({ symbol: input.symbol, timeframe: "15m" }),
  ]);
  const availability = deriveAvailability(marketSnapshot.feed.state);
  const authenticated = Boolean(input.session);
  const [workflowSnapshot, compliance, journalPerformance] = await Promise.all([
    input.session ? getAlertWorkflowSnapshot(input.session.account.id) : Promise.resolve(null),
    input.session
      ? getAccountComplianceSnapshotForAuthenticatedSession(input.session)
      : Promise.resolve(null),
    getJournalPerformance({ session: input.session }),
  ]);
  const enabledRuleCount =
    workflowSnapshot?.rules.filter((rule) => rule.state === "enabled").length ?? 0;
  const paperAccess =
    compliance?.activation.executionEnabled && compliance.activation.paperState === "enabled"
      ? "ready"
      : "guarded";
  const windows: IntelligenceBackendContextSnapshot["multiTimeframe"]["windows"] = [
    buildTimeframeWindow({
      timeframe: "1m",
      candles: timeframe1m.candles,
      feedState: timeframe1m.feed.state,
    }),
    buildTimeframeWindow({
      timeframe: "5m",
      candles: timeframe5m.candles,
      feedState: timeframe5m.feed.state,
    }),
    buildTimeframeWindow({
      timeframe: "15m",
      candles: timeframe15m.candles,
      feedState: timeframe15m.feed.state,
    }),
  ];
  const alignment = deriveAlignment(windows);
  const boundedConfidence = deriveBoundedConfidence({
    availability,
    alignment,
    feedState: marketSnapshot.feed.state,
  });
  const coaching = buildCoaching({
    availability,
    alignment,
    confidence: boundedConfidence,
    paperAccess,
    enabledRuleCount,
    performance: journalPerformance.performance,
    marketFeedState: marketSnapshot.feed.state,
  });

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
    multiTimeframe: {
      symbol: marketSnapshot.request.normalizedSymbol,
      alignment,
      boundedConfidence,
      windows,
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
    journal: journalPerformance.journal,
    performance: journalPerformance.performance,
    coaching,
    truth: {
      predictiveScope: "interpretive_only",
      confidenceSemantics: "context_only",
      executionAuthority: "operator_manual",
      predictiveGuarantee: "none",
      winRateClaim: "none",
      liveExecution: "blocked",
      degradedModeExplicit: true,
    },
    summary:
      availability === "degraded"
        ? "Intelligence backend context is available in degraded mode with bounded multi-timeframe and coaching semantics."
        : "Intelligence backend context is available with bounded multi-timeframe, journal, and coaching semantics.",
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

export async function getAiIqBrainDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const snapshot = await getIntelligenceBackendContext({});

  return {
    key: "ai_iq_brain_foundation",
    label: "AI / IQ / Brain foundation",
    status: snapshot.availability === "degraded" ? "degraded" : "ready",
    summary:
      snapshot.availability === "degraded"
        ? "AI/IQ/Brain context is degraded but explicit"
        : "AI/IQ/Brain context expansion is active and bounded",
    detail:
      "Multi-timeframe context, journal/performance insights, and bounded coaching guidance are available with explicit non-predictive semantics, no win-rate guarantees, and no execution authority.",
    checkedAt: snapshot.checkedAt,
  };
}
