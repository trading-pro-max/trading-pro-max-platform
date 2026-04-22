import "server-only";
import {
  TIMEFRAMES,
  type PlatformTimeframe,
} from "@/lib/constants/platform";
import {
  DEFAULT_MARKET_SYMBOL,
  MARKET_INSTRUMENTS,
  getMarketInstrument,
  type MarketInstrumentDefinition,
} from "@/lib/market/catalog";
import type {
  Asset,
  DiagnosticsProbe,
  MarketCandle,
  MarketDataSnapshot,
  MarketFeedSummary,
} from "@/modules/shell/types/platform-state";

const DEFAULT_CANDLE_COUNT = 36;
const MARKET_PROVIDER = "Trading Pro Max Feed Foundation";
const FALLBACK_SOURCE_LABEL = "Fallback market adapter";
const CONFIGURED_EXTERNAL_FEED = Boolean(
  process.env.TPM_MARKET_FEED_URL?.trim()
);

function isPlatformTimeframe(value?: string | null): value is PlatformTimeframe {
  return TIMEFRAMES.includes(value as PlatformTimeframe);
}

function getTimeframeIntervalMs(timeframe: PlatformTimeframe) {
  switch (timeframe) {
    case "1m":
      return 60_000;
    case "5m":
      return 300_000;
    case "15m":
      return 900_000;
    case "1h":
      return 3_600_000;
  }
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

function roundPrice(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
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

function getSpreadSize(definition: MarketInstrumentDefinition) {
  const minimumTick = 1 / 10 ** definition.priceDecimals;

  if (definition.assetClass === "crypto") return minimumTick * 12;
  if (definition.assetClass === "commodity") return minimumTick * 6;
  return minimumTick * 2;
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

function buildAnchorPrice(
  definition: MarketInstrumentDefinition,
  bucketIndex: number
) {
  const sessionTrend =
    Math.sin((bucketIndex + definition.id.length * 17) / 34) *
    definition.dailyDrift;
  const intradayWave =
    Math.cos((bucketIndex + definition.id.length * 9) / 9) *
    definition.intradayVolatility;
  const microWave =
    Math.sin((bucketIndex + definition.id.length * 5) / 3.5) *
    definition.intradayVolatility *
    0.42;

  return definition.baselinePrice * (1 + sessionTrend + intradayWave + microWave);
}

function buildMarketCandles(
  definition: MarketInstrumentDefinition,
  timeframe: PlatformTimeframe,
  count = DEFAULT_CANDLE_COUNT
) {
  const intervalMs = getTimeframeIntervalMs(timeframe);
  const nowMs = Date.now();
  const currentBucketMs = nowMs - (nowMs % intervalMs);
  const candles: MarketCandle[] = [];
  let previousClose = definition.baselinePrice;

  for (let index = count - 1; index >= 0; index -= 1) {
    const bucketMs = currentBucketMs - index * intervalMs;
    const bucketIndex = Math.floor(bucketMs / intervalMs);
    const anchorPrice = buildAnchorPrice(definition, bucketIndex);
    const open = previousClose;
    const close = open + (anchorPrice - open) * 0.58;
    const wickSpan =
      definition.baselinePrice *
        definition.intradayVolatility *
        (0.24 + Math.abs(Math.sin(bucketIndex / 4.7))) +
      getSpreadSize(definition) * 2;
    const high = Math.max(open, close) + wickSpan;
    const low = Math.min(open, close) - wickSpan;
    const displacement = Math.abs(close - open) / Math.max(open, 1);
    const volume = Math.round(
      definition.volumeBase *
        (1 + displacement * 120 + Math.abs(Math.cos(bucketIndex / 7.1)) * 0.35)
    );
    const time = new Date(bucketMs).toISOString();
    const label = new Date(bucketMs).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    candles.push({
      time,
      label,
      open: roundPrice(open, definition.priceDecimals),
      high: roundPrice(high, definition.priceDecimals),
      low: roundPrice(low, definition.priceDecimals),
      close: roundPrice(close, definition.priceDecimals),
      volume,
    });

    previousClose = close;
  }

  return candles;
}

function buildAssetSnapshot(
  definition: MarketInstrumentDefinition,
  feed: MarketFeedSummary
): Asset {
  const candles = buildMarketCandles(definition, "5m", 3);
  const latest = candles[candles.length - 1] ?? candles[0];
  const previous = candles[candles.length - 2] ?? latest;
  const spread = getSpreadSize(definition);
  const changePct =
    previous.close === 0 ? 0 : ((latest.close - previous.close) / previous.close) * 100;
  const bid = latest.close - spread / 2;
  const ask = latest.close + spread / 2;

  return {
    id: definition.id,
    symbol: definition.symbol,
    name: definition.name,
    assetClass: definition.assetClass,
    priceDecimals: definition.priceDecimals,
    status: getMarketStatus(definition, Date.now()),
    price: formatPrice(latest.close, definition.priceDecimals),
    change: formatPercentChange(changePct),
    sourceLabel: feed.sourceLabel,
    lastUpdatedAt: feed.lastUpdatedAt,
    bid: formatPrice(bid, definition.priceDecimals),
    ask: formatPrice(ask, definition.priceDecimals),
    spread: formatPrice(spread, definition.priceDecimals),
  };
}

function buildFeedSummary(timeframe: PlatformTimeframe): MarketFeedSummary {
  return {
    provider: MARKET_PROVIDER,
    adapter: "fallback_simulated",
    state: "fallback_ready",
    sourceLabel: CONFIGURED_EXTERNAL_FEED
      ? `${FALLBACK_SOURCE_LABEL} (external feed reserved)`
      : FALLBACK_SOURCE_LABEL,
    updateCadenceMs: getRecommendedCadenceMs(timeframe),
    supportsStreaming: false,
    configured: CONFIGURED_EXTERNAL_FEED,
    lastUpdatedAt: new Date().toISOString(),
  };
}

export function resolveMarketRequest(input: {
  symbol?: string | null;
  timeframe?: string | null;
}) {
  const timeframe = isPlatformTimeframe(input.timeframe)
    ? input.timeframe
    : ("1m" satisfies PlatformTimeframe);
  const instrument = getMarketInstrument(input.symbol ?? DEFAULT_MARKET_SYMBOL);

  return {
    instrument,
    timeframe,
  };
}

export async function getMarketDataSnapshot(input: {
  symbol?: string | null;
  timeframe?: string | null;
} = {}): Promise<MarketDataSnapshot> {
  const { instrument, timeframe } = resolveMarketRequest(input);
  const feed = buildFeedSummary(timeframe);

  return {
    requestedSymbol: instrument.symbol,
    requestedTimeframe: timeframe,
    feed,
    assets: MARKET_INSTRUMENTS.map((definition) => buildAssetSnapshot(definition, feed)),
    candles: buildMarketCandles(instrument, timeframe),
  };
}

export async function getMarketDiagnosticsProbe(): Promise<DiagnosticsProbe> {
  const checkedAt = new Date().toISOString();

  return {
    key: "market_data",
    label: "Market data layer",
    status: "fallback",
    summary: CONFIGURED_EXTERNAL_FEED
      ? "Fallback adapter active"
      : "Fallback adapter ready",
    detail: CONFIGURED_EXTERNAL_FEED
      ? "External feed configuration is reserved, but the paper-safe fallback adapter remains active."
      : "No external feed is configured. The paper-safe fallback adapter is serving normalized market data.",
    checkedAt,
  };
}
