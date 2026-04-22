import {
  EXECUTION_DURATIONS,
  TIMEFRAMES,
  type PlatformExecutionDuration,
  type PlatformTimeframe,
} from "@/lib/constants/platform";
import { DEFAULT_MARKET_SYMBOL } from "@/lib/market/catalog";
import type {
  PlatformChartType,
  PlatformPreferenceSnapshot,
} from "@/modules/shell/types/platform-state";

export const DEFAULT_PLATFORM_PREFERENCES: PlatformPreferenceSnapshot = {
  chartType: "candlestick",
  activeIndicators: ["EMA 20", "RSI"],
  activeDrawingTool: "Cursor",
  chartZoom: 100,
  watchlistVisible: false,
  ticketVisible: true,
  blotterExpanded: false,
  timeframe: "1m",
  duration: "5s",
  selectedAssetSymbol: DEFAULT_MARKET_SYMBOL,
};

const VALID_CHART_TYPES: readonly PlatformChartType[] = [
  "candlestick",
  "area",
  "line",
  "bars",
];

export function isChartType(value: string): value is PlatformChartType {
  return VALID_CHART_TYPES.includes(value as PlatformChartType);
}

export function isPlatformTimeframe(value: string): value is PlatformTimeframe {
  return TIMEFRAMES.includes(value as PlatformTimeframe);
}

export function isPlatformDuration(
  value: string
): value is PlatformExecutionDuration {
  return EXECUTION_DURATIONS.includes(value as PlatformExecutionDuration);
}

export function sanitizePlatformPreferenceSnapshot(
  input: Partial<PlatformPreferenceSnapshot> | null | undefined,
  fallback: PlatformPreferenceSnapshot = DEFAULT_PLATFORM_PREFERENCES
): PlatformPreferenceSnapshot {
  return {
    chartType:
      typeof input?.chartType === "string" && isChartType(input.chartType)
        ? input.chartType
        : fallback.chartType,
    activeIndicators: Array.isArray(input?.activeIndicators)
      ? input.activeIndicators.filter(
          (item): item is string => typeof item === "string" && item.trim().length > 0
        )
      : fallback.activeIndicators,
    activeDrawingTool:
      typeof input?.activeDrawingTool === "string" && input.activeDrawingTool.trim()
        ? input.activeDrawingTool.trim().slice(0, 32)
        : fallback.activeDrawingTool,
    chartZoom:
      typeof input?.chartZoom === "number" && Number.isFinite(input.chartZoom)
        ? Math.max(80, Math.min(130, Math.round(input.chartZoom)))
        : fallback.chartZoom,
    watchlistVisible:
      typeof input?.watchlistVisible === "boolean"
        ? input.watchlistVisible
        : fallback.watchlistVisible,
    ticketVisible:
      typeof input?.ticketVisible === "boolean"
        ? input.ticketVisible
        : fallback.ticketVisible,
    blotterExpanded:
      typeof input?.blotterExpanded === "boolean"
        ? input.blotterExpanded
        : fallback.blotterExpanded,
    timeframe:
      typeof input?.timeframe === "string" && isPlatformTimeframe(input.timeframe)
        ? input.timeframe
        : fallback.timeframe,
    duration:
      typeof input?.duration === "string" && isPlatformDuration(input.duration)
        ? input.duration
        : fallback.duration,
    selectedAssetSymbol:
      typeof input?.selectedAssetSymbol === "string" && input.selectedAssetSymbol.trim()
        ? input.selectedAssetSymbol.trim().slice(0, 24)
        : fallback.selectedAssetSymbol,
  };
}
