import type { CSSProperties } from "react";
import type { PlatformTimeframe } from "../../../lib/constants/platform";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import type { Asset, Decision, MarketCandle, Trade } from "./platform-state";

export type TopbarProps = {
  paperLabel: string;
  liveFeedLabel: string;
  stableLabel: string;
  balance: string;
};

export type MarketRailProps = {
  brandTitle: string;
  brandSubtitle: string;
  title: string;
  searchPlaceholder: string;
  assets: Asset[];
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
};

export type ChartWorkspaceProps = {
  title: string;
  subtitle: string;
  selectedAssetLabel: string;
  currentTimeframeLabel: string;
  marketStatusLabel: string;
  selectedAsset: Asset;
  selectedTimeframe: PlatformTimeframe;
  timeframes: readonly PlatformTimeframe[];
  onSelectTimeframe: (timeframe: PlatformTimeframe) => void;
  candles: MarketCandle[];
};

export type TradePanelProps = {
  dict: Dictionary;
  signalLabel: string;
  decision: Decision;
  selectedAssetSymbol: string;
  selectedTimeframe: string;
  amount: string;
  setAmount: (value: string) => void;
  sessionLocked: boolean;
  canOpenMore: boolean;
  openTradeBySignal: () => void;
  openPaperTrade: (direction: "buy" | "sell") => void;
  riskNote: string;
};

export type MarketSummaryProps = {
  symbol: string;
  price: string;
  change: string;
  marketStatusLabel: string;
  marketStatusValue: string;
  currentTimeframeLabel: string;
  currentTimeframeValue: string;
  confidenceLabel: string;
  confidenceValue: string;
  currentPriceLabel: string;
  changeLabel: string;
  signalLabel: string;
  signalStyle: CSSProperties;
};

export type RiskStripProps = {
  openTradesLabel: string;
  openTradesValue: string;
  sessionResultLabel: string;
  sessionResultValue: string;
  sessionResultPositive: boolean;
  losingTradesLabel: string;
  losingTradesValue: string;
  sessionStatusLabel: string;
  sessionStatusValue: string;
  sessionLocked: boolean;
};

export type OpenTradesPanelProps = {
  dict: Dictionary;
  openTrades: Trade[];
  closePaperTrade: (id: string) => void;
};

export type HistoryPanelProps = {
  dict: Dictionary;
  history: Trade[];
};
