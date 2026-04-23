import "server-only";
import type { PlatformTimeframe } from "@/lib/constants/platform";
import type { MarketInstrumentDefinition } from "@/lib/market/catalog";
import type { MarketCandle } from "@/modules/shell/types/platform-state";

export type DeterministicQuote = {
  mid: number;
  bid: number;
  ask: number;
  spread: number;
  volume: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function round(value: number, decimals: number) {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function createInstrumentSeed(symbol: string) {
  return [...symbol].reduce((hash, char, index) => {
    return (hash + char.charCodeAt(0) * (index + 17)) % 7919;
  }, 37);
}

function timeframeIntervalMs(timeframe: PlatformTimeframe) {
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

function bucketTimestamp(timeMs: number, intervalMs: number) {
  return Math.floor(timeMs / intervalMs) * intervalMs;
}

function computePriceOffset(definition: MarketInstrumentDefinition, timeMs: number) {
  const seed = createInstrumentSeed(definition.symbol);
  const minutes = timeMs / 60_000;
  const slowWave =
    Math.sin(minutes / 180 + seed * 0.017) * (definition.dailyDrift * 100 * 0.36);
  const mediumWave =
    Math.cos(minutes / 38 + seed * 0.043) *
    (definition.intradayVolatility * 100 * 0.22);
  const fastWave =
    Math.sin(minutes / 5.6 + seed * 0.11) *
    (definition.intradayVolatility * 100 * 0.08);

  return slowWave + mediumWave + fastWave;
}

function computeMidPrice(definition: MarketInstrumentDefinition, timeMs: number) {
  return definition.baselinePrice * (1 + computePriceOffset(definition, timeMs) / 100);
}

function computeSpread(definition: MarketInstrumentDefinition, timeMs: number) {
  const seed = createInstrumentSeed(definition.symbol);
  const pulse = 1 + Math.abs(Math.sin(timeMs / 900_000 + seed * 0.031)) * 0.8;
  const minimumTick = 1 / 10 ** definition.priceDecimals;
  const baselineSpread =
    definition.assetClass === "crypto"
      ? minimumTick * 12
      : definition.assetClass === "commodity"
      ? minimumTick * 6
      : minimumTick * 2;

  return Math.max(baselineSpread * pulse, minimumTick);
}

export function buildDeterministicQuote(
  definition: MarketInstrumentDefinition,
  timeMs = Date.now()
): DeterministicQuote {
  const timestamp = bucketTimestamp(timeMs, 1000);
  const mid = computeMidPrice(definition, timestamp);
  const spread = computeSpread(definition, timestamp);
  const bid = mid - spread / 2;
  const ask = mid + spread / 2;
  const seed = createInstrumentSeed(definition.symbol);
  const volumeBase =
    definition.assetClass === "crypto"
      ? 24_000
      : definition.assetClass === "commodity"
      ? 7600
      : 6200;
  const volume =
    volumeBase +
    Math.round(Math.abs(Math.sin(timestamp / 1_800_000 + seed * 0.07)) * volumeBase * 0.42);

  return {
    mid: round(mid, definition.priceDecimals),
    bid: round(bid, definition.priceDecimals),
    ask: round(ask, definition.priceDecimals),
    spread: round(Math.abs(ask - bid), Math.max(definition.priceDecimals, 4)),
    volume,
  };
}

function buildDeterministicCandle(
  definition: MarketInstrumentDefinition,
  barTimeMs: number,
  intervalMs: number
) {
  const open = computeMidPrice(definition, barTimeMs);
  const close = computeMidPrice(definition, barTimeMs + intervalMs * 0.82);
  const mid = computeMidPrice(definition, barTimeMs + intervalMs * 0.41);
  const spread = computeSpread(definition, barTimeMs);
  const excursion = Math.max(1 / 10 ** definition.priceDecimals, spread * 1.5);
  const high = Math.max(open, close, mid) + excursion * 0.75;
  const low = Math.min(open, close, mid) - excursion * 0.72;
  const seed = createInstrumentSeed(definition.symbol);
  const volumeBase =
    definition.assetClass === "crypto"
      ? 620
      : definition.assetClass === "commodity"
      ? 740
      : 920;
  const volume =
    volumeBase +
    Math.round(Math.abs(Math.cos(barTimeMs / 1_800_000 + seed * 0.09)) * volumeBase * 0.56);

  return {
    time: new Date(barTimeMs).toISOString(),
    open: round(open, definition.priceDecimals),
    high: round(high, definition.priceDecimals),
    low: round(low, definition.priceDecimals),
    close: round(close, definition.priceDecimals),
    volume,
  };
}

export function buildDeterministicCandles(input: {
  definition: MarketInstrumentDefinition;
  timeframe: PlatformTimeframe;
  count: number;
  nowMs?: number;
}): MarketCandle[] {
  const intervalMs = timeframeIntervalMs(input.timeframe);
  const nowMs = input.nowMs ?? Date.now();
  const safeCount = clamp(input.count, 8, 180);
  const latestBarTime = bucketTimestamp(nowMs, intervalMs);
  const candles: MarketCandle[] = [];

  for (let index = safeCount - 1; index >= 0; index -= 1) {
    const barTime = latestBarTime - intervalMs * index;
    const candle = buildDeterministicCandle(input.definition, barTime, intervalMs);
    candles.push({
      ...candle,
      label: new Date(barTime).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    });
  }

  return candles;
}
