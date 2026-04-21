export type PlatformState = {
  selectedAsset: string;
  selectedTimeframe: string;
  openTradesCount: number;
  historyCount: number;
  sessionLocked: boolean;
};

export const initialPlatformState: PlatformState = {
  selectedAsset: "EUR/USD",
  selectedTimeframe: "1m",
  openTradesCount: 0,
  historyCount: 0,
  sessionLocked: false,
};