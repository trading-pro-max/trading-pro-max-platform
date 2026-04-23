import "server-only";
import type { PlatformTimeframe } from "@/lib/constants/platform";
import type { AssetClass } from "@/modules/shell/types/platform-state";

export type MarketFreshness =
  | "Fresh"
  | "Warm"
  | "Session Closed"
  | "Delayed"
  | "Stale"
  | "Pending";

export type MarketFreshnessSummary = {
  freshness: MarketFreshness;
  feedHealth: "Healthy" | "Stable" | "Delayed" | "Degraded" | "Session Closed";
  degradedReason: string | null;
};

function isWeekendSession(assetClass: AssetClass) {
  if (assetClass === "crypto") return false;
  const day = new Date().getUTCDay();
  return day === 0 || day === 6;
}

function quoteFreshnessThresholds(assetClass: AssetClass) {
  if (assetClass === "crypto") {
    return { fresh: 2 * 60, warm: 12 * 60, delayed: 90 * 60, sessionClosed: 0 };
  }

  return { fresh: 5 * 60, warm: 45 * 60, delayed: 12 * 60 * 60, sessionClosed: 60 * 60 * 60 };
}

function candleFreshnessThresholds(timeframe: PlatformTimeframe) {
  if (timeframe === "1m") {
    return { freshMs: 3 * 60 * 1000, warmMs: 8 * 60 * 1000, delayedMs: 20 * 60 * 1000 };
  }
  if (timeframe === "5m") {
    return { freshMs: 12 * 60 * 1000, warmMs: 26 * 60 * 1000, delayedMs: 50 * 60 * 1000 };
  }
  if (timeframe === "1h") {
    return {
      freshMs: 2.5 * 60 * 60 * 1000,
      warmMs: 5.5 * 60 * 60 * 1000,
      delayedMs: 12 * 60 * 60 * 1000,
    };
  }

  return { freshMs: 35 * 60 * 1000, warmMs: 75 * 60 * 1000, delayedMs: 150 * 60 * 1000 };
}

export function classifyQuoteFreshness(input: {
  assetClass: AssetClass;
  ageSeconds: number;
  providerSymbol: string;
}): MarketFreshnessSummary {
  const thresholds = quoteFreshnessThresholds(input.assetClass);
  const sessionClosed =
    thresholds.sessionClosed > 0 &&
    isWeekendSession(input.assetClass) &&
    input.ageSeconds <= thresholds.sessionClosed;

  if (sessionClosed) {
    return {
      freshness: "Session Closed",
      feedHealth: "Session Closed",
      degradedReason: null,
    };
  }

  if (input.ageSeconds <= thresholds.fresh) {
    return {
      freshness: "Fresh",
      feedHealth: "Healthy",
      degradedReason: null,
    };
  }
  if (input.ageSeconds <= thresholds.warm) {
    return {
      freshness: "Warm",
      feedHealth: "Stable",
      degradedReason: null,
    };
  }
  if (input.ageSeconds <= thresholds.delayed) {
    return {
      freshness: "Delayed",
      feedHealth: "Delayed",
      degradedReason: `${input.providerSymbol} quote updates are delayed for the active runtime window.`,
    };
  }

  return {
    freshness: "Stale",
    feedHealth: "Degraded",
    degradedReason: `${input.providerSymbol} quote updates are older than the expected runtime window.`,
  };
}

export function classifyChartFreshness(input: {
  assetClass: AssetClass;
  timeframe: PlatformTimeframe;
  lastTimestamp: string | null;
}): MarketFreshnessSummary {
  if (!input.lastTimestamp) {
    return {
      freshness: "Pending",
      feedHealth: "Delayed",
      degradedReason: "No candles were returned for the active timeframe.",
    };
  }

  const thresholds = candleFreshnessThresholds(input.timeframe);
  const ageMs = Math.max(0, Date.now() - Date.parse(input.lastTimestamp));
  const sessionClosedWindowMs =
    input.assetClass === "crypto"
      ? 0
      : Math.max(thresholds.delayedMs, 72 * 60 * 60 * 1000);

  if (ageMs <= thresholds.freshMs) {
    return {
      freshness: "Fresh",
      feedHealth: "Healthy",
      degradedReason: null,
    };
  }
  if (ageMs <= thresholds.warmMs) {
    return {
      freshness: "Warm",
      feedHealth: "Stable",
      degradedReason: null,
    };
  }
  if (
    sessionClosedWindowMs > 0 &&
    isWeekendSession(input.assetClass) &&
    ageMs <= sessionClosedWindowMs
  ) {
    return {
      freshness: "Session Closed",
      feedHealth: "Session Closed",
      degradedReason: null,
    };
  }
  if (ageMs <= thresholds.delayedMs) {
    return {
      freshness: "Delayed",
      feedHealth: "Delayed",
      degradedReason:
        "Candle updates are delayed relative to the active timeframe window.",
    };
  }

  return {
    freshness: "Stale",
    feedHealth: "Degraded",
    degradedReason:
      "Candle updates are older than expected for the active timeframe window.",
  };
}
