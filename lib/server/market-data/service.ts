import "server-only";
import {
  TIMEFRAMES,
  type PlatformTimeframe,
} from "@/lib/constants/platform";
import {
  DEFAULT_MARKET_SYMBOL,
  MARKET_INSTRUMENTS,
  getMarketInstrument,
  hasMarketInstrument,
  type MarketInstrumentDefinition,
} from "@/lib/market/catalog";
import {
  buildDeterministicCandles,
  buildDeterministicQuote,
} from "@/lib/server/market-data/deterministic";
import {
  classifyChartFreshness,
  classifyQuoteFreshness,
} from "@/lib/server/market-data/freshness";
import { buildReadinessSnapshot } from "@/lib/server/diagnostics/readiness-score";
import type {
  Asset,
  DiagnosticsProbe,
  MarketDataSnapshot,
  MarketFeedSummary,
  MarketFeedNotice,
  MarketRequestResolution,
} from "@/modules/shell/types/platform-state";

const DEFAULT_CANDLE_COUNT = 36;
const MARKET_PROVIDER = "Trading Pro Max Fallback Feed";
const FALLBACK_SOURCE_LABEL = "Fallback market adapter";
const CONFIGURED_EXTERNAL_FEED = Boolean(
  process.env.TPM_MARKET_FEED_URL?.trim()
);
const EXTERNAL_FEED_POLICY_FLAG = "true";
const EXTERNAL_FEED_POLICY_MODE = "fallback_first";

type ExternalFeedState =
  | "unconfigured"
  | "configured_inactive"
  | "configured_blocked";

export type MarketFeedArchitectureSnapshot = {
  checkedAt: string;
  policyMode: typeof EXTERNAL_FEED_POLICY_MODE;
  readiness: {
    score: number;
    stage:
      | "fallback_active"
      | "fallback_with_external_reserved"
      | "fallback_policy_guarded";
  };
  fallbackDriver: {
    key: "fallback_simulated";
    state: "active";
    sourceLabel: string;
  };
  externalDriver: {
    key: "external_reserved";
    endpointConfigured: boolean;
    endpoint: string | null;
    activationRequested: boolean;
    state: ExternalFeedState;
  };
  contract: {
    requestNormalization: "strict";
    responseShape: "stable";
    deterministicFallback: true;
    streaming: "inactive";
  };
  summary: string;
  detail: string;
};

function getExternalFeedEndpoint() {
  const endpoint = process.env.TPM_MARKET_FEED_URL?.trim();
  return endpoint ? endpoint.slice(0, 1024) : null;
}

function externalFeedActivationRequested() {
  return process.env.TPM_MARKET_FEED_ENABLE_EXTERNAL === EXTERNAL_FEED_POLICY_FLAG;
}

function resolveExternalFeedState() {
  const endpoint = getExternalFeedEndpoint();

  if (!endpoint) {
    return {
      endpoint,
      endpointConfigured: false,
      activationRequested: false,
      state: "unconfigured" as const,
    };
  }

  const activationRequested = externalFeedActivationRequested();

  return {
    endpoint,
    endpointConfigured: true,
    activationRequested,
    state: activationRequested
      ? ("configured_blocked" as const)
      : ("configured_inactive" as const),
  };
}

export function getMarketFeedArchitectureSnapshot(
  checkedAt = new Date().toISOString()
): MarketFeedArchitectureSnapshot {
  const externalDriver = resolveExternalFeedState();
  const readiness = buildReadinessSnapshot({
    components: [
      { key: "fallback_driver", ok: true, weight: 50 },
      {
        key: "external_endpoint_reserved",
        ok: externalDriver.endpointConfigured,
        weight: 20,
      },
      {
        key: "fallback_policy_guard",
        ok: !externalDriver.activationRequested,
        weight: 30,
      },
    ],
    stageThresholds: [
      { stage: "fallback_active", minScore: 0 },
      { stage: "fallback_with_external_reserved", minScore: 70 },
      { stage: "fallback_policy_guarded", minScore: 100 },
    ],
  });

  return {
    checkedAt,
    policyMode: EXTERNAL_FEED_POLICY_MODE,
    readiness: {
      score: readiness.score,
      stage: readiness.stage as
        | "fallback_active"
        | "fallback_with_external_reserved"
        | "fallback_policy_guarded",
    },
    fallbackDriver: {
      key: "fallback_simulated",
      state: "active",
      sourceLabel: FALLBACK_SOURCE_LABEL,
    },
    externalDriver: {
      key: "external_reserved",
      endpointConfigured: externalDriver.endpointConfigured,
      endpoint: externalDriver.endpoint,
      activationRequested: externalDriver.activationRequested,
      state: externalDriver.state,
    },
    contract: {
      requestNormalization: "strict",
      responseShape: "stable",
      deterministicFallback: true,
      streaming: "inactive",
    },
    summary: externalDriver.endpointConfigured
      ? "Fallback feed active with external driver reserved"
      : "Fallback feed active with no external driver configured",
    detail: externalDriver.endpointConfigured
      ? externalDriver.activationRequested
        ? "External feed activation was requested, but fallback-first policy keeps the reserved external driver blocked and the fallback adapter remains authoritative."
        : "External feed endpoint is configured but inactive; fallback adapter remains authoritative until explicit activation policy changes."
      : "No external feed endpoint is configured; fallback adapter is the serving market feed.",
  };
}

function isPlatformTimeframe(value?: string | null): value is PlatformTimeframe {
  return TIMEFRAMES.includes(value as PlatformTimeframe);
}

function normalizeMarketInput(value: string | null | undefined, maxLength = 32) {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function normalizeSymbolInput(value: string | null | undefined) {
  const normalized = normalizeMarketInput(value, 32);
  return normalized ? normalized.toUpperCase().replace(/\s+/g, "") : null;
}

function normalizeTimeframeInput(value: string | null | undefined) {
  const normalized = normalizeMarketInput(value, 8);
  return normalized ? normalized.toLowerCase() : null;
}

function getRecommendedCadenceMs(timeframe: PlatformTimeframe) {
  switch (timeframe) {
    case "1m":
      return 15_000;
    case "5m":
      return 30_000;
    case "15m":
      return 60_000;
    case "1h":
      return 120_000;
  }
}

function formatPrice(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatPercentChange(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function getMarketStatus(
  definition: MarketInstrumentDefinition,
  nowMs: number
) {
  if (definition.assetClass === "crypto") return "Active";

  const utcDay = new Date(nowMs).getUTCDay();

  if (utcDay === 0 || utcDay === 6) return "Closed";

  return "Open";
}

function buildAssetSnapshot(
  definition: MarketInstrumentDefinition,
  feed: MarketFeedSummary
): Asset {
  const candles = buildDeterministicCandles({
    definition,
    timeframe: "5m",
    count: 3,
  });
  const latest = candles[candles.length - 1] ?? candles[0];
  const previous = candles[candles.length - 2] ?? latest;
  const quote = buildDeterministicQuote(definition);
  const quoteAgeSeconds = Math.max(
    0,
    Math.round((Date.now() - Date.parse(feed.lastUpdatedAt)) / 1000)
  );
  const quoteFreshness = classifyQuoteFreshness({
    assetClass: definition.assetClass,
    ageSeconds: quoteAgeSeconds,
    providerSymbol: definition.providerSymbol,
  });
  const changePct =
    previous.close === 0 ? 0 : ((latest.close - previous.close) / previous.close) * 100;

  return {
    id: definition.id,
    symbol: definition.symbol,
    name: definition.name,
    assetClass: definition.assetClass,
    priceDecimals: definition.priceDecimals,
    status: getMarketStatus(definition, Date.now()),
    price: formatPrice(quote.mid, definition.priceDecimals),
    change: formatPercentChange(changePct),
    sourceLabel: feed.sourceLabel,
    lastUpdatedAt: feed.lastUpdatedAt,
    bid: formatPrice(quote.bid, definition.priceDecimals),
    ask: formatPrice(quote.ask, definition.priceDecimals),
    spread: formatPrice(quote.spread, Math.max(definition.priceDecimals, 4)),
    freshness: quoteFreshness.freshness,
  };
}

function buildFeedSummary(input: {
  timeframe: PlatformTimeframe;
  instrument: MarketInstrumentDefinition;
  candlesLastUpdatedAt: string | null;
  notices: MarketFeedNotice[];
  state?: MarketFeedSummary["state"];
  degradedReason?: string;
}): MarketFeedSummary {
  const architecture = getMarketFeedArchitectureSnapshot();
  const chartFreshness = classifyChartFreshness({
    assetClass: input.instrument.assetClass,
    timeframe: input.timeframe,
    lastTimestamp: input.candlesLastUpdatedAt,
  });

  return {
    provider: MARKET_PROVIDER,
    adapter: "fallback_simulated",
    state: input.state ?? "fallback_ready",
    sourceLabel: FALLBACK_SOURCE_LABEL,
    updateCadenceMs: getRecommendedCadenceMs(input.timeframe),
    supportsStreaming: false,
    configured: false,
    externalFeedConfigured: architecture.externalDriver.endpointConfigured,
    externalFeedActive: false,
    policyMode: architecture.policyMode,
    externalFeedState: architecture.externalDriver.state,
    degradedReason: input.degradedReason ?? chartFreshness.degradedReason ?? undefined,
    readinessScore: architecture.readiness.score,
    freshness: {
      chart: chartFreshness.freshness,
      health: chartFreshness.feedHealth,
    },
    notices: input.notices,
    lastUpdatedAt: new Date().toISOString(),
  };
}

function buildMarketFeedNotices(input: {
  resolution: MarketRequestResolution;
  degradedReason?: string;
}): MarketFeedNotice[] {
  const notices: MarketFeedNotice[] = [
    {
      code: "fallback_adapter_active",
      severity: "info",
      message:
        "The fallback market adapter is active and no external live feed is being used.",
    },
  ];

  if (CONFIGURED_EXTERNAL_FEED) {
    notices.push({
      code: "external_feed_reserved",
      severity: "info",
      message:
        "External feed configuration is present but reserved; fallback remains the serving adapter.",
    });
  }

  if (input.resolution.symbolFallbackApplied) {
    notices.push({
      code: "symbol_fallback_applied",
      severity: "warning",
      message: `Requested symbol was not supported and was normalized to ${input.resolution.normalizedSymbol}.`,
    });
  }

  if (input.resolution.timeframeFallbackApplied) {
    notices.push({
      code: "timeframe_fallback_applied",
      severity: "warning",
      message: `Requested timeframe was not supported and was normalized to ${input.resolution.normalizedTimeframe}.`,
    });
  }

  if (input.degradedReason) {
    notices.push({
      code: "fallback_adapter_degraded",
      severity: "warning",
      message: input.degradedReason,
    });
  }

  return notices;
}

export function resolveMarketRequest(input: {
  symbol?: string | null;
  timeframe?: string | null;
}) {
  const requestedTimeframe = normalizeTimeframeInput(input.timeframe);
  const requestedSymbol = normalizeSymbolInput(input.symbol);
  const timeframe = isPlatformTimeframe(requestedTimeframe)
    ? requestedTimeframe
    : ("1m" satisfies PlatformTimeframe);
  const requestedSymbolSupported = hasMarketInstrument(requestedSymbol);
  const instrument = getMarketInstrument(
    requestedSymbolSupported ? requestedSymbol : DEFAULT_MARKET_SYMBOL
  );
  const request: MarketRequestResolution = {
    inputSymbol: normalizeMarketInput(input.symbol, 32),
    inputTimeframe: normalizeMarketInput(input.timeframe, 8),
    normalizedSymbol: instrument.symbol,
    normalizedTimeframe: timeframe,
    symbolFallbackApplied: Boolean(requestedSymbol) && !requestedSymbolSupported,
    timeframeFallbackApplied:
      Boolean(requestedTimeframe) && !isPlatformTimeframe(requestedTimeframe),
  };

  return {
    instrument,
    timeframe,
    request,
  };
}

export async function getMarketDataSnapshot(input: {
  symbol?: string | null;
  timeframe?: string | null;
  degradedReason?: string;
} = {}): Promise<MarketDataSnapshot> {
  const { instrument, timeframe, request } = resolveMarketRequest(input);
  const candles = buildDeterministicCandles({
    definition: instrument,
    timeframe,
    count: DEFAULT_CANDLE_COUNT,
  });
  const candlesLastUpdatedAt = candles[candles.length - 1]?.time ?? null;
  const chartFreshness = classifyChartFreshness({
    assetClass: instrument.assetClass,
    timeframe,
    lastTimestamp: candlesLastUpdatedAt,
  });
  const marketDegradedReason =
    input.degradedReason ??
    (chartFreshness.feedHealth === "Delayed" || chartFreshness.feedHealth === "Degraded"
      ? chartFreshness.degradedReason ?? undefined
      : undefined);
  const notices = buildMarketFeedNotices({
    resolution: request,
    degradedReason: marketDegradedReason,
  });
  const feed = buildFeedSummary({
    instrument,
    candlesLastUpdatedAt,
    timeframe,
    notices,
    state: marketDegradedReason ? "degraded" : "fallback_ready",
    degradedReason: marketDegradedReason,
  });

  return {
    requestedSymbol: instrument.symbol,
    requestedTimeframe: timeframe,
    request,
    feed,
    assets: MARKET_INSTRUMENTS.map((definition) => buildAssetSnapshot(definition, feed)),
    candles,
  };
}

export function classifyMarketDataError(error: unknown) {
  if (error instanceof Error) {
    return `Fallback adapter recovered after market data error: ${error.message}`;
  }

  return "Fallback adapter recovered after an unknown market data error.";
}

export async function getMarketDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();
  const architecture = getMarketFeedArchitectureSnapshot(checkedAt);

  return {
    key: "market_data",
    label: "Market data layer",
    status: "fallback",
    summary: architecture.summary,
    detail: `${architecture.detail} Readiness ${architecture.readiness.score}/100 (${architecture.readiness.stage}).`,
    checkedAt,
  };
}
