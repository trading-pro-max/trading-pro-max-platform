export const TIMEFRAMES = ["1m", "5m", "15m", "1h"] as const;
export type PlatformTimeframe = (typeof TIMEFRAMES)[number];

export const EXECUTION_DURATIONS = ["5s", "10s", "15s", "30s", "1m", "3m", "5m", "15m"] as const;
export type PlatformExecutionDuration = (typeof EXECUTION_DURATIONS)[number];

export const ACCOUNT_MODES = ["demo", "real"] as const;
export type PlatformAccountMode = (typeof ACCOUNT_MODES)[number];

export const PLATFORM_LIMITS = {
  maxOpenTrades: 3,
  sessionLossLimit: -150,
} as const;