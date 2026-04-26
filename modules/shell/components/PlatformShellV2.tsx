"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  TIMEFRAMES,
  type PlatformExecutionDuration,
  type PlatformTimeframe,
} from "../../../lib/constants/platform";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import { WhyBlockedHint } from "../../state-explanations/components";
import type { StateExplanationView } from "../../state-explanations/types";
import type {
  AccountMode,
  Asset,
  AuditEvent,
  Decision,
  MarketCandle,
  PlatformChartType,
  Trade,
  WorkspaceFocusMode,
  WatchlistDensityMode,
} from "../types/platform-state";
import type {
  ComplianceDisclosureView,
  ComplianceMetaView,
  WorkstationStatusTone,
} from "./trading-workstation-view-model";
import TradingTerminalShell from "./TradingTerminalShell";
import { ProductStateNotice } from "./UiStates";

function toneClassFromValue(value: string) {
  const normalized = value.trim();

  if (normalized.startsWith("+")) return "positive";
  if (normalized.startsWith("-")) return "negative";

  return "neutral";
}

function parseNumericValue(value: string) {
  const normalized = value.replaceAll(",", "");
  const match = normalized.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function formatPriceNumber(value: number, decimals: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function humanizeToken(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("/", " / ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (match) => match.toUpperCase());
}

function assetClassLabel(assetClass: Asset["assetClass"]) {
  if (assetClass === "fx") return "FX";
  if (assetClass === "crypto") return "Crypto";
  return "Commodity";
}

function focusModeLabel(mode: WorkspaceFocusMode) {
  if (mode === "chart_focus") return "Chart focus";
  if (mode === "execution_focus") return "Execution focus";
  return "Balanced";
}

function densityLabel(mode: WatchlistDensityMode) {
  return mode === "dense" ? "Dense" : "Standard";
}

type SurfaceDetailItem = {
  label: string;
  value: string;
  tone?: WorkstationStatusTone;
  note?: string;
};

function getChartPriceRange(candles: MarketCandle[], fallbackPrice: string) {
  if (candles.length === 0) {
    const parsed = parseNumericValue(fallbackPrice) ?? 100;
    return {
      low: parsed * 0.985,
      high: parsed * 1.015,
    };
  }

  return {
    low: Math.min(...candles.map((candle) => candle.low)),
    high: Math.max(...candles.map((candle) => candle.high)),
  };
}

function buildPriceScale(
  candles: MarketCandle[],
  fallbackPrice: string,
  decimals: number
) {
  const { low, high } = getChartPriceRange(candles, fallbackPrice);
  const step = (high - low) / 3 || Math.max(low * 0.002, 0.0001);

  return [high, high - step, low + step, low].map((price) =>
    formatPriceNumber(price, decimals)
  );
}

function buildTimeScale(
  candles: MarketCandle[],
  timeframe: PlatformTimeframe
) {
  if (candles.length === 0) {
    if (timeframe === "1m") return ["09:20", "09:35", "09:50", "10:05", "10:20"];
    if (timeframe === "5m") return ["08:30", "08:55", "09:20", "09:45", "10:10"];
    if (timeframe === "15m") return ["06:00", "07:15", "08:30", "09:45", "11:00"];
    if (timeframe === "1h") return ["02:00", "04:00", "06:00", "08:00", "10:00"];
  }

  const desiredMarkers = 5;
  const step = Math.max(1, Math.floor(candles.length / desiredMarkers));
  const labels = candles
    .filter((_, index) => index % step === 0)
    .map((candle) => candle.label);

  return labels.slice(-desiredMarkers);
}

export const CHART_TYPES: { id: PlatformChartType; label: string }[] = [
  { id: "candlestick", label: "Candles" },
  { id: "area", label: "Area" },
  { id: "line", label: "Line" },
  { id: "bars", label: "Bars" },
];

export const INDICATOR_TOOLS = ["EMA 20", "RSI", "MACD", "VOL"] as const;
export const DRAWING_TOOLS = ["Cursor", "Trend", "Level", "Range", "Note"] as const;

const EXECUTION_BLOCKED_EXPLANATION: StateExplanationView = {
  key: "execution_blocked",
  title: "Execution remains guarded",
  shortMessage: "Execution blocked",
  reason:
    "Live execution and real-money routing are blocked by product truth; this ticket is paper-only.",
  safeNextStep:
    "Use paper rehearsal or review settings/diagnostics for the current safety state.",
  severity: "blocked",
  resolvedBy: "founder",
  userCopy: "Execution remains guarded. Use paper rehearsal only.",
};

type ChartBar = {
  height: number;
  tone: "up" | "down";
  bodyHeight: number;
  wickHeight: number;
  volumeHeight: number;
};

function buildChartBars(candles: MarketCandle[], fallbackPrice: string): ChartBar[] {
  const { low, high } = getChartPriceRange(candles, fallbackPrice);
  const range = Math.max(high - low, 0.0001);

  return candles.map((candle) => {
    const closeHeight = ((candle.close - low) / range) * 100;
    const bodyHeight =
      (Math.abs(candle.close - candle.open) / range) * 100;
    const wickHeight = ((candle.high - candle.low) / range) * 100;
    const volumeHeight = Math.min(
      68,
      16 + (candle.volume / Math.max(candles[0]?.volume ?? candle.volume, 1)) * 34
    );

    return {
      height: Math.max(8, Math.min(96, closeHeight)),
      tone: candle.close >= candle.open ? "up" : "down",
      bodyHeight: Math.max(10, Math.min(82, bodyHeight + 10)),
      wickHeight: Math.max(18, Math.min(94, wickHeight + 8)),
      volumeHeight,
    };
  });
}

function buildMovingAveragePoints(
  candles: MarketCandle[],
  period: number,
  pointStep: number,
  fallbackPrice: string
) {
  if (candles.length === 0) return "";

  const { low, high } = getChartPriceRange(candles, fallbackPrice);
  const range = Math.max(high - low, 0.0001);

  return candles
    .map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const slice = candles.slice(start, index + 1);
      const average =
        slice.reduce((sum, item) => sum + item.close, 0) /
        Math.max(slice.length, 1);
      const y = 100 - ((average - low) / range) * 100;

      return `${(index * pointStep).toFixed(2)},${Math.max(4, Math.min(96, y)).toFixed(2)}`;
    })
    .join(" ");
}

function clampPointerValue(value: number, max: number) {
  return Math.min(max, Math.max(0, value));
}

function writePointerField(target: HTMLElement, rect: DOMRect, clientX: number, clientY: number) {
  const xPx = clampPointerValue(clientX - rect.left, rect.width);
  const yPx = clampPointerValue(clientY - rect.top, rect.height);
  const xPercent = (xPx / Math.max(rect.width, 1)) * 100;
  const yPercent = (yPx / Math.max(rect.height, 1)) * 100;

  target.style.setProperty("--tpmv2-cursor-x", `${xPercent.toFixed(2)}%`);
  target.style.setProperty("--tpmv2-cursor-y", `${yPercent.toFixed(2)}%`);
  target.style.setProperty("--tpmv2-cursor-x-px", `${xPx.toFixed(1)}px`);
  target.style.setProperty("--tpmv2-cursor-y-px", `${yPx.toFixed(1)}px`);
}

function clearPointerField(target: HTMLElement) {
  target.style.removeProperty("--tpmv2-cursor-x");
  target.style.removeProperty("--tpmv2-cursor-y");
  target.style.removeProperty("--tpmv2-cursor-x-px");
  target.style.removeProperty("--tpmv2-cursor-y-px");
}

function usePointerField<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let rect = node.getBoundingClientRect();
    const refreshRect = () => {
      rect = node.getBoundingClientRect();
    };

    const syncPointer = (event: PointerEvent) => {
      writePointerField(node, rect, event.clientX, event.clientY);
    };

    const syncPointerFromEnter = (event: PointerEvent) => {
      refreshRect();
      writePointerField(node, rect, event.clientX, event.clientY);
    };

    const clearPointer = () => {
      clearPointerField(node);
    };

    const moveEventName = "onpointerrawupdate" in window ? "pointerrawupdate" : "pointermove";

    node.addEventListener("pointerenter", syncPointerFromEnter, { passive: true });
    node.addEventListener(moveEventName, syncPointer as EventListener, { passive: true });
    node.addEventListener("pointerleave", clearPointer, { passive: true });
    window.addEventListener("resize", refreshRect, { passive: true });
    window.addEventListener("scroll", refreshRect, { capture: true, passive: true });

    return () => {
      node.removeEventListener("pointerenter", syncPointerFromEnter);
      node.removeEventListener(moveEventName, syncPointer as EventListener);
      node.removeEventListener("pointerleave", clearPointer);
      window.removeEventListener("resize", refreshRect);
      window.removeEventListener("scroll", refreshRect, { capture: true });
    };
  }, []);

  return ref;
}

function AnchorChip({ text }: { text: string }) {
  return <span className="tpmv2-badge tpmv2-chip">{text}</span>;
}

function StatusTag({
  text,
  tone,
}: {
  text: string;
  tone: WorkstationStatusTone;
}) {
  return <span className={`tpmv2-status-tag ${tone}`}>{text}</span>;
}

function MetaRows({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={className ? `tpmv2-meta-rows ${className}` : "tpmv2-meta-rows"}>
      {items.map((item, index) => (
        <div key={`${index}-${item}`} className="tpmv2-meta-row">
          {item}
        </div>
      ))}
    </div>
  );
}

function DetailGrid({
  items,
}: {
  items: ComplianceMetaView[];
}) {
  return (
    <div className="tpmv2-detail-grid">
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} className="tpmv2-detail-card">
          <span>{item.label}</span>
          <strong className={item.tone ? `tpmv2-detail-value ${item.tone}` : "tpmv2-detail-value"}>
            {item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

function EmptyPanelState({
  title,
  text,
}: {
  text: string;
  title: string;
}) {
  return <ProductStateNotice compact kind="empty" title={title} text={text} />;
}

function PanelHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
}) {
  return (
    <div className="tpmv2-panel-head">
      <div>
        <div className="tpmv2-panel-title">{title}</div>
        {subtitle ? <div className="tpmv2-panel-subtitle">{subtitle}</div> : null}
      </div>
      {badge}
    </div>
  );
}

export function DesktopRail({
  dict,
  assets,
  selectedAssetIndex,
  onSelectAsset,
  selectedAsset,
  watchlistDensity,
  focusMode,
  feedState,
  lastUpdatedAt,
}: {
  dict: Dictionary;
  assets: Asset[];
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
  selectedAsset: Asset;
  watchlistDensity: WatchlistDensityMode;
  focusMode: WorkspaceFocusMode;
  feedState: string;
  lastUpdatedAt: string;
}) {
  return (
    <aside
      className={
        watchlistDensity === "dense"
          ? "tpmv2-card tpmv2-rail tpmv2-rail-dense"
          : "tpmv2-card tpmv2-rail"
      }
    >
      <div className="tpmv2-rail-head">
        <div className="tpmv2-section-label">{dict.market.title}</div>
        <span className="tpmv2-rail-count">{assets.length}</span>
      </div>

      <div className="tpmv2-rail-summary-card">
        <div className="tpmv2-rail-summary-head">
          <div>
            <strong>{selectedAsset.symbol}</strong>
            <small>{selectedAsset.name}</small>
          </div>
          <span className="tpmv2-status-tag pending">{humanizeToken(feedState)}</span>
        </div>

        <div className="tpmv2-rail-summary-meta">
          <span>{assetClassLabel(selectedAsset.assetClass)}</span>
          <span>{densityLabel(watchlistDensity)}</span>
          <span>{focusModeLabel(focusMode)}</span>
        </div>

        <div className="tpmv2-rail-summary-grid">
          <div>
            <span>{dict.market.currentPrice}</span>
            <strong>{selectedAsset.price}</strong>
          </div>
          <div>
            <span>{dict.market.change}</span>
            <strong className={toneClassFromValue(selectedAsset.change)}>
              {selectedAsset.change}
            </strong>
          </div>
          <div>
            <span>Source</span>
            <strong>{selectedAsset.sourceLabel ?? dict.common.local}</strong>
          </div>
          <div>
            <span>Updated</span>
            <strong>{lastUpdatedAt}</strong>
          </div>
        </div>
      </div>

      <div className="tpmv2-search">{dict.market.search}</div>

      <div className="tpmv2-watchlist-head">
        <span>{dict.market.selectedAsset}</span>
        <span>{dict.market.currentPrice}</span>
        <span>{dict.market.change}</span>
      </div>

      <div className="tpmv2-watchlist">
        {assets.map((asset, index) => (
          <button
            key={asset.symbol}
            type="button"
            className={
              index === selectedAssetIndex
                ? "tpmv2-watchitem active"
                : "tpmv2-watchitem"
            }
            onClick={() => onSelectAsset(index)}
          >
            <div className="tpmv2-watch-main">
              <strong>{asset.symbol}</strong>
              <small>
                {assetClassLabel(asset.assetClass)} / {asset.status}
              </small>
            </div>
            <span className="tpmv2-watch-price">{asset.price}</span>
            <div className="tpmv2-watch-side">
              <span
                className={`tpmv2-watch-change ${toneClassFromValue(asset.change)}`}
              >
                {asset.change}
              </span>
              <small>{watchlistDensity === "dense" ? assetClassLabel(asset.assetClass) : asset.name}</small>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function TradingTopbar({
  balance,
  accountMode,
  onModeChange,
  modeLabel,
  demoLabel,
  realLabel,
  selectedAssetSymbol,
  selectedAssetPrice,
  selectedAssetChange,
  marketStatus,
  paperAccessLabel,
  paperAccessValue,
  paperAccessTone,
  diagnosticsHref,
  diagnosticsLabel,
  settingsHref,
  settingsLabel,
  locale,
}: {
  balance: string;
  accountMode: AccountMode;
  onModeChange: (mode: AccountMode) => void;
  modeLabel: string;
  demoLabel: string;
  realLabel: string;
  selectedAssetSymbol: string;
  selectedAssetPrice: string;
  selectedAssetChange: string;
  marketStatus: string;
  paperAccessLabel: string;
  paperAccessValue: string;
  paperAccessTone: WorkstationStatusTone;
  diagnosticsHref: string;
  diagnosticsLabel: string;
  settingsHref: string;
  settingsLabel: string;
  locale: string;
}) {
  return (
    <TradingTerminalShell
      accountMode={accountMode}
      balance={balance}
      demoLabel={demoLabel}
      diagnosticsHref={diagnosticsHref}
      diagnosticsLabel={diagnosticsLabel}
      locale={locale}
      marketStatus={marketStatus}
      modeLabel={modeLabel}
      onModeChange={onModeChange}
      paperAccessLabel={paperAccessLabel}
      paperAccessTone={paperAccessTone}
      paperAccessValue={paperAccessValue}
      realLabel={realLabel}
      selectedAssetChange={selectedAssetChange}
      selectedAssetPrice={selectedAssetPrice}
      selectedAssetSymbol={selectedAssetSymbol}
      settingsHref={settingsHref}
      settingsLabel={settingsLabel}
    />
  );
}

export function SummaryCard({
  dict,
  symbol,
  price,
  change,
  signalLabel,
  signalStyle,
  marketStatus,
  timeframe,
  confidence,
}: {
  dict: Dictionary;
  symbol: string;
  price: string;
  change: string;
  signalLabel: string;
  signalStyle: CSSProperties;
  marketStatus: string;
  timeframe: string;
  confidence: string;
}) {
  return (
    <section className="tpmv2-card tpmv2-summary">
      <div className="tpmv2-summary-main">
        <div className="tpmv2-summary-primary">
          <span className="tpmv2-section-label">{dict.market.selectedAsset}</span>
          <div className="tpmv2-summary-hero">
            <h1 className="tpmv2-symbol">{symbol}</h1>
            <div className="tpmv2-summary-price">{price}</div>
            <div className={`tpmv2-summary-change ${toneClassFromValue(change)}`}>
              {change}
            </div>
          </div>
          <div className="tpmv2-subline">{dict.market.marketStatus}</div>
        </div>

        <div className="tpmv2-summary-signal" style={signalStyle}>
          <span>{signalLabel}</span>
          <strong>{confidence}</strong>
        </div>
      </div>

      <div className="tpmv2-summary-grid">
        <div className="tpmv2-summary-stat">
          <span>{dict.market.marketStatus}</span>
          <strong>{marketStatus}</strong>
        </div>

        <div className="tpmv2-summary-stat">
          <span>{dict.market.currentTimeframe}</span>
          <strong>{timeframe}</strong>
        </div>

        <div className="tpmv2-summary-stat">
          <span>{dict.decision.confidence}</span>
          <strong>{confidence}</strong>
        </div>
      </div>
    </section>
  );
}

export function RiskCardGrid({
  dict,
  openTradesText,
  sessionPnLText,
  sessionPnLPositive,
  lossCount,
  sessionStateLabel,
  sessionLocked,
}: {
  dict: Dictionary;
  openTradesText: string;
  sessionPnLText: string;
  sessionPnLPositive: boolean;
  lossCount: number;
  sessionStateLabel: string;
  sessionLocked: boolean;
}) {
  return (
    <section className="tpmv2-risk-grid">
      <div className="tpmv2-card tpmv2-metric">
        <span>{dict.risk.openTrades}</span>
        <strong>{openTradesText}</strong>
      </div>

      <div className="tpmv2-card tpmv2-metric">
        <span>{dict.risk.sessionResult}</span>
        <strong style={{ color: sessionPnLPositive ? "#2dd4bf" : "#fda4af" }}>
          {sessionPnLText}
        </strong>
      </div>

      <div className="tpmv2-card tpmv2-metric">
        <span>{dict.risk.losingTrades}</span>
        <strong>{lossCount}</strong>
      </div>

      <div className="tpmv2-card tpmv2-metric">
        <span>{dict.risk.sessionStatus}</span>
        <strong style={{ color: sessionLocked ? "#fda4af" : "#2dd4bf" }}>
          {sessionStateLabel}
        </strong>
      </div>
    </section>
  );
}

export function WorkstationCommandCenter({
  dict,
  selectedAssetSymbol,
  selectedTimeframe,
  signalLabel,
  decision,
  openTradesCount,
  historyCount,
  sessionPnLText,
  ticketReadinessLabel,
  ticketReadinessValue,
  ticketReadinessTone,
  paperAccessLabel,
  paperAccessValue,
  paperAccessTone,
}: {
  dict: Dictionary;
  selectedAssetSymbol: string;
  selectedTimeframe: PlatformTimeframe;
  signalLabel: string;
  decision: Decision;
  openTradesCount: number;
  historyCount: number;
  sessionPnLText: string;
  ticketReadinessLabel: string;
  ticketReadinessValue: string;
  ticketReadinessTone: WorkstationStatusTone;
  paperAccessLabel: string;
  paperAccessValue: string;
  paperAccessTone: WorkstationStatusTone;
}) {
  const commandCenterRef = usePointerField<HTMLElement>();

  return (
    <section
      ref={commandCenterRef}
      className="tpmv2-card tpmv2-command-center"
      aria-label={dict.shell.title}
    >
      <div className={`tpmv2-command-primary ${decision.signal}`}>
        <div>
          <span className="tpmv2-command-kicker">{dict.decision.title}</span>
          <strong>{signalLabel}</strong>
        </div>
        <StatusTag text={decision.confidence} tone="pending" />
      </div>

      <div className="tpmv2-command-cell">
        <span>{dict.market.selectedAsset}</span>
        <strong>{selectedAssetSymbol}</strong>
        <small>{dict.market.currentTimeframe}: {selectedTimeframe}</small>
      </div>

      <div className="tpmv2-command-cell">
        <span>{paperAccessLabel}</span>
        <StatusTag text={paperAccessValue} tone={paperAccessTone} />
        <small>{dict.common.paper} / {dict.common.local}</small>
      </div>

      <div className="tpmv2-command-cell">
        <span>{ticketReadinessLabel}</span>
        <strong className={`tpmv2-ticket-status-value ${ticketReadinessTone}`}>
          {ticketReadinessValue}
        </strong>
        <small>{dict.decision.confidence}: {decision.confidence}</small>
      </div>

      <div className="tpmv2-command-cell tpmv2-command-cell-metrics">
        <span>{dict.risk.sessionResult}</span>
        <strong>{sessionPnLText}</strong>
        <small>
          {dict.journal.openTradesTitle}: {openTradesCount} / {dict.journal.historyTitle}:{" "}
          {historyCount}
        </small>
      </div>
    </section>
  );
}

export function ChartCard({
  dict,
  selectedAsset,
  selectedTimeframe,
  onSelectTimeframe,
  candles,
  decision,
  chartType,
  onSelectChartType,
  activeIndicators,
  onToggleIndicator,
  activeDrawingTool,
  onSelectDrawingTool,
  chartZoom,
  onSetChartZoom,
  onResetChart,
  intelligenceKicker,
  intelligenceHeadline,
  intelligenceSummary,
  intelligenceNote,
  marketDepthItems,
  marketDepthNote,
  focusMode,
  workspaceControls,
}: {
  dict: Dictionary;
  selectedAsset: Asset;
  selectedTimeframe: PlatformTimeframe;
  onSelectTimeframe: (timeframe: PlatformTimeframe) => void;
  candles: MarketCandle[];
  decision: Decision;
  chartType: PlatformChartType;
  onSelectChartType: (type: PlatformChartType) => void;
  activeIndicators: string[];
  onToggleIndicator: (indicator: string) => void;
  activeDrawingTool: string;
  onSelectDrawingTool: (tool: string) => void;
  chartZoom: number;
  onSetChartZoom: (zoom: number) => void;
  onResetChart: () => void;
  intelligenceKicker: string;
  intelligenceHeadline: string;
  intelligenceSummary: string;
  intelligenceNote: string;
  marketDepthItems: SurfaceDetailItem[];
  marketDepthNote: string;
  focusMode: WorkspaceFocusMode;
  workspaceControls?: ReactNode;
}) {
  const priceScale = buildPriceScale(
    candles,
    selectedAsset.price,
    selectedAsset.priceDecimals
  );
  const timeScale = buildTimeScale(candles, selectedTimeframe);
  const chartBars = buildChartBars(candles, selectedAsset.price);
  const { low, high } = getChartPriceRange(candles, selectedAsset.price);
  const range = Math.max(high - low, 0.0001);
  const pointStep = 100 / Math.max(candles.length - 1, 1);
  const chartPathPoints = candles
    .map(
      (candle, index) =>
        `${(index * pointStep).toFixed(2)},${Math.max(
          4,
          Math.min(96, 100 - ((candle.close - low) / range) * 100)
        ).toFixed(2)}`,
    )
    .join(" ");
  const chartAreaPoints = `0,100 ${chartPathPoints} 100,100`;
  const emaFastPoints = buildMovingAveragePoints(
    candles,
    4,
    pointStep,
    selectedAsset.price
  );
  const emaSlowPoints = buildMovingAveragePoints(
    candles,
    8,
    pointStep,
    selectedAsset.price
  );
  const latestHeight = chartBars[chartBars.length - 1]?.height ?? 50;
  const priceMarkerTop = `${Math.max(16, Math.min(82, 100 - latestHeight))}%`;
  const showEmaOverlay = activeIndicators.includes("EMA 20");
  const showMacdOverlay = activeIndicators.includes("MACD");
  const showRsiOverlay = activeIndicators.includes("RSI");
  const showVolumeOverlay = activeIndicators.includes("VOL") || chartType === "bars";
  const chartSurfaceRef = usePointerField<HTMLDivElement>();

  return (
    <section
      className={`tpmv2-card tpmv2-chart tpmv2-chart-${chartType}`}
      aria-label={dict.chart.title}
    >
      <div ref={chartSurfaceRef} className="tpmv2-chart-surface">
        <div className="tpmv2-chart-grid-bg" />
        <div className="tpmv2-chart-crosshair">
          <span className="tpmv2-chart-crosshair-v" />
          <span className="tpmv2-chart-crosshair-h" />
        </div>
        <div className="tpmv2-chart-market-structure" aria-hidden="true">
          <span className="tpmv2-chart-session-zone" />
          <span className="tpmv2-chart-vwap-line" />
          <span className="tpmv2-chart-liquidity-zone tpmv2-chart-liquidity-zone-high" />
          <span className="tpmv2-chart-liquidity-zone tpmv2-chart-liquidity-zone-low" />
        </div>

        <div className="tpmv2-chart-floating-bar">
          <div className="tpmv2-chart-market-head">
            <div className="tpmv2-chart-market-symbol">{selectedAsset.symbol}</div>
            <div className="tpmv2-chart-market-line">
              <span className="tpmv2-chart-market-price">{selectedAsset.price}</span>
              <span
                className={`tpmv2-chart-market-change ${toneClassFromValue(
                  selectedAsset.change,
                )}`}
              >
                {selectedAsset.change}
              </span>
              <span className="tpmv2-chart-market-status">{selectedAsset.status}</span>
            </div>
          </div>

          <div className="tpmv2-chart-toolbar">
            <div className="tpmv2-tool-group" role="toolbar" aria-label="Chart type">
              <span>Type</span>
              <div className="tpmv2-tool-buttons">
                {CHART_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    className={type.id === chartType ? "active" : ""}
                    aria-pressed={type.id === chartType}
                    onClick={() => onSelectChartType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div
              className="tpmv2-tool-group tpmv2-tool-group-time"
              role="toolbar"
              aria-label={dict.trade.timeframe}
            >
              <span>{dict.trade.timeframe}</span>
              <div className="tpmv2-timeframes">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={tf === selectedTimeframe ? "active" : ""}
                    aria-pressed={tf === selectedTimeframe}
                    onClick={() => onSelectTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {workspaceControls}
          </div>
        </div>

        <div className="tpmv2-chart-tool-rail" role="toolbar" aria-label="Drawing tools">
          {DRAWING_TOOLS.map((tool) => (
            <button
              key={tool}
              type="button"
              className={tool === activeDrawingTool ? "active" : ""}
              aria-pressed={tool === activeDrawingTool}
              onClick={() => onSelectDrawingTool(tool)}
            >
              {tool}
            </button>
          ))}
        </div>

        <div className="tpmv2-chart-indicator-dock" role="toolbar" aria-label="Indicators">
          <span>Indicators</span>
          {INDICATOR_TOOLS.map((indicator) => (
            <button
              key={indicator}
              type="button"
              className={activeIndicators.includes(indicator) ? "active" : ""}
              aria-pressed={activeIndicators.includes(indicator)}
              onClick={() => onToggleIndicator(indicator)}
            >
              {indicator}
            </button>
          ))}
        </div>

        <div className="tpmv2-chart-zoom-controls" role="toolbar" aria-label="Chart zoom">
          <button
            type="button"
            onClick={() => onSetChartZoom(Math.max(80, chartZoom - 10))}
          >
            -
          </button>
          <span>{chartZoom}%</span>
          <button
            type="button"
            onClick={() => onSetChartZoom(Math.min(130, chartZoom + 10))}
          >
            +
          </button>
          <button type="button" onClick={onResetChart}>
            Reset
          </button>
        </div>

        <div className="tpmv2-chart-price-scale" aria-hidden="true">
          {priceScale.map((price, index) => (
            <span key={`${price}-${index}`}>{price}</span>
          ))}
        </div>

        <div className={`tpmv2-chart-ai-panel ${decision.signal}`}>
          <div className="tpmv2-chart-ai-kicker">{intelligenceKicker}</div>
          <div className="tpmv2-chart-ai-row">
            <strong>{intelligenceHeadline}</strong>
            <span>{decision.confidence}</span>
          </div>
          <div className="tpmv2-chart-ai-note">
            {intelligenceSummary} {intelligenceNote}
          </div>
        </div>

        <div className="tpmv2-chart-depth-panel">
          <div className="tpmv2-chart-depth-head">
            <span>Market depth</span>
            <strong>{focusModeLabel(focusMode)}</strong>
          </div>

          <div className="tpmv2-chart-depth-grid">
            {marketDepthItems.map((item) => (
              <div key={`${item.label}-${item.value}`} className="tpmv2-chart-depth-card">
                <span>{item.label}</span>
                <strong className={item.tone ? item.tone : undefined}>{item.value}</strong>
                {item.note ? <small>{item.note}</small> : null}
              </div>
            ))}
          </div>

          <div className="tpmv2-chart-depth-note">{marketDepthNote}</div>
        </div>

        <div className="tpmv2-chart-price-marker" style={{ top: priceMarkerTop }}>
          <span>{selectedAsset.price}</span>
        </div>

        <div
          className="tpmv2-chart-plot"
          style={{ transform: `scaleX(${chartZoom / 100})` }}
        >
          {chartType === "area" || chartType === "line" ? (
            <svg
              className="tpmv2-chart-path"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {chartType === "area" ? (
                <polygon className="tpmv2-chart-area-fill" points={chartAreaPoints} />
              ) : null}
              <polyline className="tpmv2-chart-line-stroke" points={chartPathPoints} />
            </svg>
          ) : (
            <svg
              className="tpmv2-chart-path tpmv2-chart-path-context"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon className="tpmv2-chart-area-fill" points={chartAreaPoints} />
              <polyline className="tpmv2-chart-line-stroke" points={chartPathPoints} />
            </svg>
          )}

          {showEmaOverlay || showMacdOverlay ? (
            <svg
              className="tpmv2-chart-indicator-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {showEmaOverlay ? (
                <polyline className="tpmv2-chart-ema-fast" points={emaFastPoints} />
              ) : null}
              {showMacdOverlay ? (
                <polyline className="tpmv2-chart-ema-slow" points={emaSlowPoints} />
              ) : null}
            </svg>
          ) : null}

          {showRsiOverlay ? (
            <div className="tpmv2-chart-rsi-track" aria-hidden="true">
              <span style={{ width: `${Math.max(28, Math.min(78, latestHeight))}%` }} />
            </div>
          ) : null}

          {showVolumeOverlay ? (
            <div className="tpmv2-chart-volume" aria-hidden="true">
              {chartBars.map((bar, index) => (
                <span
                  key={`${index}-${bar.volumeHeight}`}
                  className={bar.tone}
                  style={{ height: `${bar.volumeHeight}%` }}
                />
              ))}
            </div>
          ) : null}

          <div
            className={
              chartType === "bars"
                ? "tpmv2-candles tpmv2-candles-bars"
                : chartType === "candlestick"
                ? "tpmv2-candles"
                : "tpmv2-candles tpmv2-candles-ghost"
            }
          >
            {chartBars.map((bar, index) => {
              return (
                <div
                  key={index}
                  className={`tpmv2-candle-wrap ${bar.tone}`}
                  style={
                    {
                      height: `${Math.max(18, Math.min(100, bar.height))}%`,
                      "--tpmv2-candle-height": `${bar.bodyHeight}%`,
                      "--tpmv2-wick-height": `${bar.wickHeight}%`,
                    } as CSSProperties
                  }
                >
                  <span
                    className={`tpmv2-candle ${bar.tone}`}
                    style={{ height: `${bar.bodyHeight}%` }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="tpmv2-chart-time-scale" aria-hidden="true">
          {timeScale.map((label, index) => (
            <span key={`${label}-${index}`}>{label}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ExecutionCard({
  dict,
  decision,
  signalLabel,
  selectedAssetSymbol,
  selectedTimeframe,
  selectedDuration,
  durationOptions,
  onSelectDuration,
  analysisTimeframeLabel,
  durationFieldLabel,
  amount,
  setAmount,
  sessionLocked,
  canOpenMore,
  canExecute,
  accountMode,
  openTradeBySignal,
  openPaperTrade,
  demoLabel,
  realLabel,
  accountLifecycleLabel,
  accountLifecycleTone,
  reviewStatusLabel,
  reviewStatusTone,
  ticketReadinessLabel,
  ticketReadinessValue,
  ticketReadinessTone,
  ticketGateLabel,
  ticketGateValue,
  ticketGateTone,
  ticketNextStepLabel,
  ticketNextStepValue,
  ticketOperationalLabel,
  ticketOperationalValue,
  ticketOperationalTone,
  preflightItems,
  amountPresets,
  onApplyAmountPreset,
  recentActivityLabel,
  recentActivityValue,
  recentActivityNote,
}: {
  dict: Dictionary;
  decision: Decision;
  signalLabel: string;
  selectedAssetSymbol: string;
  selectedTimeframe: PlatformTimeframe;
  selectedDuration: PlatformExecutionDuration;
  durationOptions: readonly PlatformExecutionDuration[];
  onSelectDuration: (duration: PlatformExecutionDuration) => void;
  analysisTimeframeLabel: string;
  durationFieldLabel: string;
  amount: string;
  setAmount: (value: string) => void;
  sessionLocked: boolean;
  canOpenMore: boolean;
  canExecute: boolean;
  accountMode: AccountMode;
  openTradeBySignal: () => void;
  openPaperTrade: (direction: "buy" | "sell") => void;
  demoLabel: string;
  realLabel: string;
  accountLifecycleLabel: string;
  accountLifecycleTone: WorkstationStatusTone;
  reviewStatusLabel: string;
  reviewStatusTone: WorkstationStatusTone;
  ticketReadinessLabel: string;
  ticketReadinessValue: string;
  ticketReadinessTone: WorkstationStatusTone;
  ticketGateLabel: string;
  ticketGateValue: string;
  ticketGateTone: WorkstationStatusTone;
  ticketNextStepLabel: string;
  ticketNextStepValue: string;
  ticketOperationalLabel: string;
  ticketOperationalValue: string;
  ticketOperationalTone: WorkstationStatusTone;
  preflightItems: SurfaceDetailItem[];
  amountPresets: readonly string[];
  onApplyAmountPreset: (value: string) => void;
  recentActivityLabel: string;
  recentActivityValue: string;
  recentActivityNote: string;
}) {
  const [controlsMounted, setControlsMounted] = useState(false);
  const normalizedAmount = amount.trim();
  const amountNumber = Number(normalizedAmount);
  const amountInvalid =
    normalizedAmount.length === 0 ||
    !Number.isFinite(amountNumber) ||
    amountNumber <= 0 ||
    amountNumber > 100000;
  const disabled =
    !controlsMounted || !canExecute || sessionLocked || !canOpenMore || amountInvalid;
  const aiActionDisabled = decision.signal === "wait" || disabled;
  const modeValue = accountMode === "demo" ? demoLabel : realLabel;
  const executionRef = usePointerField<HTMLElement>();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setControlsMounted(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  function renderCoreAction({
    className,
    ariaLabel,
    label,
    meta,
    actionDisabled,
    onClick,
  }: {
    className: string;
    ariaLabel: string;
    label: string;
    meta: string;
    actionDisabled: boolean;
    onClick: () => void;
  }) {
    if (!controlsMounted) {
      return (
        <span
          role="button"
          aria-disabled="true"
          aria-label={ariaLabel}
          className={className}
          data-disabled="true"
          tabIndex={-1}
        >
          <span>{label}</span>
          <small>{meta}</small>
        </span>
      );
    }

    return (
      <button
        type="button"
        className={className}
        aria-disabled={actionDisabled}
        aria-label={ariaLabel}
        onClick={onClick}
        disabled={actionDisabled}
      >
        <span>{label}</span>
        <small>{meta}</small>
      </button>
    );
  }

  return (
    <section
      ref={executionRef}
      className="tpmv2-card tpmv2-execution"
    >
      <div className="tpmv2-ticket-head">
        <div>
          <div className="tpmv2-exec-title">{dict.trade.title}</div>
          <div className="tpmv2-exec-subtitle">{dict.trade.subtitle}</div>
        </div>

        <div className="tpmv2-chip-list">
          <AnchorChip text={selectedAssetSymbol} />
          <AnchorChip text={modeValue} />
        </div>
      </div>

      <div className="tpmv2-core-actions" aria-label={dict.decision.title}>
        {renderCoreAction({
          className: "tpmv2-core-action tpmv2-core-buy",
          ariaLabel: dict.trade.openBuy,
          label: dict.decision.signals.buy,
          meta: dict.common.paper,
          actionDisabled: disabled,
          onClick: () => openPaperTrade("buy"),
        })}

        {renderCoreAction({
          className: "tpmv2-core-action tpmv2-core-ai",
          ariaLabel: dict.decision.executeBySignal,
          label: "AI",
          meta: signalLabel,
          actionDisabled: aiActionDisabled,
          onClick: openTradeBySignal,
        })}

        {renderCoreAction({
          className: "tpmv2-core-action tpmv2-core-sell",
          ariaLabel: dict.trade.openSell,
          label: dict.decision.signals.sell,
          meta: dict.common.paper,
          actionDisabled: disabled,
          onClick: () => openPaperTrade("sell"),
        })}
      </div>

      <div className={`tpmv2-ticket-signal ${decision.signal}`}>
        <div className="tpmv2-decision-top">
          <strong>{signalLabel}</strong>
          <span className="tpmv2-ticket-confidence">
            {dict.decision.confidence}: {decision.confidence}
          </span>
        </div>
        <div className="tpmv2-ticket-reason">{decision.reason}</div>
      </div>

      <div className="tpmv2-ticket-exec-strip" aria-label={ticketReadinessLabel}>
        <div>
          <span>{ticketReadinessLabel}</span>
          <strong className={ticketReadinessTone}>{ticketReadinessValue}</strong>
        </div>

        <div>
          <span>{dict.decision.confidence}</span>
          <strong>{decision.confidence}</strong>
        </div>

        <div>
          <span>{ticketGateLabel}</span>
          <strong className={ticketGateTone}>{ticketGateValue}</strong>
        </div>
      </div>

      <div className="tpmv2-ticket-preflight" aria-label="Execution preflight">
        {preflightItems.map((item) => (
          <div key={`${item.label}-${item.value}`} className="tpmv2-ticket-preflight-card">
            <span>{item.label}</span>
            <strong className={item.tone ? item.tone : undefined}>{item.value}</strong>
            {item.note ? <small>{item.note}</small> : null}
          </div>
        ))}
      </div>

      <WhyBlockedHint
        explanation={EXECUTION_BLOCKED_EXPLANATION}
        label="Why live is blocked"
      />

      <div className="tpmv2-ticket-grid">
        <div className="tpmv2-field">
          <label>{dict.trade.asset}</label>
          <div className="tpmv2-input">{selectedAssetSymbol}</div>
        </div>

        <div className="tpmv2-field">
          <label>{analysisTimeframeLabel}</label>
          <div className="tpmv2-input">{selectedTimeframe}</div>
        </div>
      </div>

      <div className="tpmv2-field">
        <label>{durationFieldLabel}</label>
        <div className="tpmv2-timeframes">
          {durationOptions.map((duration) => (
            <button
              key={duration}
              type="button"
              className={duration === selectedDuration ? "active" : ""}
              onClick={() => onSelectDuration(duration)}
            >
              {duration}
            </button>
          ))}
        </div>
      </div>

      <div className="tpmv2-field tpmv2-field-amount">
        <label>{dict.trade.amount}</label>
        <div className="tpmv2-ticket-amount">
          <span className="tpmv2-ticket-currency">$</span>
          <input
            className="tpmv2-real-input"
            aria-invalid={amountInvalid}
            aria-describedby={amountInvalid ? "tpm-ticket-amount-state" : undefined}
            data-state={amountInvalid ? "invalid_input" : undefined}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
          />
        </div>
        {amountInvalid ? (
          <ProductStateNotice
            compact
            id="tpm-ticket-amount-state"
            kind="invalid_input"
            title="Paper amount needs review"
            text="Enter a positive paper amount up to 100,000 before the ticket can be rehearsed."
            detail="This guards the local paper workflow only; it does not enable live execution."
            className="tpm-ticket-amount-state"
          />
        ) : null}
      </div>

      <div className="tpmv2-ticket-presets" role="toolbar" aria-label="Paper amount presets">
        {amountPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            className={amount === preset ? "active" : ""}
            onClick={() => onApplyAmountPreset(preset)}
          >
            ${preset}
          </button>
        ))}
      </div>

      <div className="tpmv2-ticket-status">
        <div className="tpmv2-ticket-badges">
          <StatusTag text={accountLifecycleLabel} tone={accountLifecycleTone} />
          <StatusTag text={reviewStatusLabel} tone={reviewStatusTone} />
        </div>

        <div className="tpmv2-ticket-status-grid">
          <div className="tpmv2-ticket-status-row">
            <span>{ticketNextStepLabel}</span>
            <strong className="tpmv2-ticket-status-value">
              {ticketNextStepValue}
            </strong>
          </div>

          <div className="tpmv2-ticket-status-row">
            <span>{ticketOperationalLabel}</span>
            <strong className={`tpmv2-ticket-status-value ${ticketOperationalTone}`}>
              {ticketOperationalValue}
            </strong>
          </div>
        </div>
      </div>

      <div className="tpmv2-ticket-activity">
        <span>{recentActivityLabel}</span>
        <strong>{recentActivityValue}</strong>
        <small>{recentActivityNote}</small>
      </div>
    </section>
  );
}

export function ComplianceActivationPanel({
  title,
  subtitle,
  badge,
  badgeTone,
  accountLifecycleLabel,
  accountLifecycleDescription,
  accountLifecycleTone,
  reviewStatusLabel,
  reviewStatusDescription,
  reviewStatusTone,
  disclosureRows,
  activationRows,
  acceptDisclosuresLabel,
  submitReviewLabel,
  canAcceptDisclosures,
  canSubmitReview,
  onAcceptDisclosures,
  onSubmitReview,
}: {
  title: string;
  subtitle: string;
  badge: string;
  badgeTone: WorkstationStatusTone;
  accountLifecycleLabel: string;
  accountLifecycleDescription: string;
  accountLifecycleTone: WorkstationStatusTone;
  reviewStatusLabel: string;
  reviewStatusDescription: string;
  reviewStatusTone: WorkstationStatusTone;
  disclosureRows: ComplianceDisclosureView[];
  activationRows: ComplianceMetaView[];
  acceptDisclosuresLabel: string;
  submitReviewLabel: string;
  canAcceptDisclosures: boolean;
  canSubmitReview: boolean;
  onAcceptDisclosures: () => void;
  onSubmitReview: () => void;
}) {
  return (
    <section className="tpmv2-card tpmv2-panel tpmv2-panel-compliance">
      <PanelHeader
        title={title}
        subtitle={subtitle}
        badge={<StatusTag text={badge} tone={badgeTone} />}
      />

      <div className="tpmv2-compliance-hero">
        <div className="tpmv2-compliance-copy">
          <div className="tpmv2-compliance-badges">
            <StatusTag text={accountLifecycleLabel} tone={accountLifecycleTone} />
            <StatusTag text={reviewStatusLabel} tone={reviewStatusTone} />
          </div>
          <div className="tpmv2-note">{accountLifecycleDescription}</div>
          <div className="tpmv2-note">{reviewStatusDescription}</div>
        </div>
      </div>

      <div className="tpmv2-disclosure-list">
        {disclosureRows.map((row, index) => (
          <div key={`${row.label}-${index}`} className="tpmv2-disclosure-row">
            <div className="tpmv2-disclosure-copy">
              <strong>{row.label}</strong>
              <div className="tpmv2-note">{row.meta}</div>
            </div>
            <StatusTag text={row.status} tone={row.tone} />
          </div>
        ))}
      </div>

      <DetailGrid items={activationRows} />

      {canAcceptDisclosures || canSubmitReview ? (
        <div className="tpmv2-compliance-actions">
          {canAcceptDisclosures ? (
            <button
              type="button"
              className="tpmv2-small-button tpmv2-compliance-primary"
              onClick={onAcceptDisclosures}
            >
              {acceptDisclosuresLabel}
            </button>
          ) : null}

          {canSubmitReview ? (
            <button
              type="button"
              className="tpmv2-small-button"
              onClick={onSubmitReview}
            >
              {submitReviewLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

export function SecondarySurfacePanel({
  title,
  subtitle,
  badge,
  chips,
  note,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  chips: string[];
  note?: string;
}) {
  return (
    <section className="tpmv2-card tpmv2-panel">
      <PanelHeader
        title={title}
        subtitle={subtitle}
        badge={badge ? <AnchorChip text={badge} /> : undefined}
      />

      {chips.length > 0 ? <MetaRows items={chips} /> : null}

      {note ? <div className="tpmv2-note">{note}</div> : null}
    </section>
  );
}

export function ActivityOpenTradesPanel({
  dict,
  openTrades,
  closePaperTrade,
}: {
  dict: Dictionary;
  openTrades: Trade[];
  closePaperTrade: (id: string) => void;
}) {
  return (
    <section className="tpmv2-card tpmv2-panel">
      <PanelHeader
        title={dict.journal.openTradesTitle}
        subtitle={dict.journal.openTradesSubtitle}
      />

      {openTrades.length === 0 ? (
        <EmptyPanelState
          title={dict.journal.noOpenTrades}
          text="Paper positions will appear here after a guarded manual action."
        />
      ) : (
        <div className="tpmv2-list">
          {openTrades.map((trade) => (
            <div key={trade.id} className="tpmv2-list-card">
              <div className="tpmv2-list-row">
                <strong>{trade.symbol}</strong>
                <span>
                  {dict.decision.signals[trade.direction]} / {trade.amount}$
                </span>
              </div>

              <div className="tpmv2-list-meta">
                {trade.timeframe} / {trade.duration} / {dict.journal.openAt}:{" "}
                {trade.openedAt}
              </div>

              <button
                type="button"
                className="tpmv2-small-button"
                onClick={() => closePaperTrade(trade.id)}
              >
                {dict.journal.closeTrade}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ActivityHistoryPanel({
  dict,
  history,
}: {
  dict: Dictionary;
  history: Trade[];
}) {
  return (
    <section className="tpmv2-card tpmv2-panel">
      <PanelHeader
        title={dict.journal.historyTitle}
        subtitle={dict.journal.historySubtitle}
      />

      {history.length === 0 ? (
        <EmptyPanelState
          title={dict.journal.noHistory}
          text="Closed paper trades will appear here after an operator closes a rehearsal position."
        />
      ) : (
        <div className="tpmv2-list">
          {history.map((trade) => (
            <div key={trade.id} className="tpmv2-list-card">
              <div className="tpmv2-list-row">
                <strong>{trade.symbol}</strong>
                <span>
                  {dict.decision.signals[trade.direction]} / {trade.amount}$
                </span>
              </div>

              <div className="tpmv2-list-meta">
                {trade.timeframe} / {trade.duration}
              </div>

              <div className="tpmv2-list-meta">
                {dict.journal.openAt}: {trade.openedAt}
              </div>
              <div className="tpmv2-list-meta">
                {dict.journal.closeAt}: {trade.closedAt}
              </div>

              <div
                className={`tpmv2-result ${
                  (trade.result || "").startsWith("+") ? "win" : "loss"
                }`}
              >
                {dict.journal.result}: {trade.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ActivityLogPanel({
  title,
  subtitle,
  events,
  emptyLabel,
}: {
  title: string;
  subtitle: string;
  events: AuditEvent[];
  emptyLabel: string;
}) {
  return (
    <section className="tpmv2-card tpmv2-panel tpmv2-activity-log">
      <PanelHeader title={title} subtitle={subtitle} />

      {events.length === 0 ? (
        <EmptyPanelState
          title={emptyLabel}
          text="Audit events will appear here after protected, preference, or paper workflow actions."
        />
      ) : (
        <div className="tpmv2-list tpmv2-activity-list">
          {events.slice(0, 6).map((event) => (
            <div key={event.id} className="tpmv2-list-card tpmv2-activity-card">
              <div className="tpmv2-list-row">
                <strong>{event.kind}</strong>
                <span>{event.createdAt}</span>
              </div>
              <div className="tpmv2-list-meta">{event.message}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function AuditTracePanel({
  title,
  subtitle,
  actorLabel,
  actorValue,
  accountModeLabel,
  accountModeValue,
  visibilityLabel,
  visibilityValue,
  traceLabel,
  traceValue,
  lastEventLabel,
  lastEventValue,
  events,
  emptyLabel,
}: {
  title: string;
  subtitle: string;
  actorLabel: string;
  actorValue: string;
  accountModeLabel: string;
  accountModeValue: string;
  visibilityLabel: string;
  visibilityValue: string;
  traceLabel: string;
  traceValue: string;
  lastEventLabel: string;
  lastEventValue: string;
  events: AuditEvent[];
  emptyLabel: string;
}) {
  return (
    <section className="tpmv2-card tpmv2-panel">
      <PanelHeader title={title} subtitle={subtitle} />

      <MetaRows
        items={[
          `${actorLabel}: ${actorValue}`,
          `${accountModeLabel}: ${accountModeValue}`,
          `${visibilityLabel}: ${visibilityValue}`,
          `${traceLabel}: ${traceValue}`,
          `${lastEventLabel}: ${lastEventValue}`,
        ]}
        className="tpmv2-meta-rows-compact"
      />

      {events.length === 0 ? (
        <EmptyPanelState
          title={emptyLabel}
          text="No protected audit trail is available for this panel yet."
        />
      ) : (
        <div className="tpmv2-list">
          {events.map((event) => (
            <div key={event.id} className="tpmv2-list-card">
              <div className="tpmv2-list-row">
                <strong>{event.kind}</strong>
                <span>{event.scope}</span>
              </div>

              <div className="tpmv2-list-meta">{event.message}</div>

              <div className="tpmv2-list-meta">
                {event.createdAt} / {event.accountMode}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function SecurityFoundationPanel({
  title,
  subtitle,
  routeLabel,
  routeValue,
  accessLabel,
  accessValue,
  executionLabel,
  executionValue,
  dataProtectionLabel,
  dataProtectionValue,
  secretsLabel,
  secretsValue,
  sessionLabel,
  sessionValue,
  recoveryLabel,
  recoveryValue,
  alertLabel,
  alertValue,
  accountModeLabel,
  accountModeValue,
  reviewedAtLabel,
  reviewedAtValue,
}: {
  title: string;
  subtitle: string;
  routeLabel: string;
  routeValue: string;
  accessLabel: string;
  accessValue: string;
  executionLabel: string;
  executionValue: string;
  dataProtectionLabel: string;
  dataProtectionValue: string;
  secretsLabel: string;
  secretsValue: string;
  sessionLabel: string;
  sessionValue: string;
  recoveryLabel: string;
  recoveryValue: string;
  alertLabel: string;
  alertValue: string;
  accountModeLabel: string;
  accountModeValue: string;
  reviewedAtLabel: string;
  reviewedAtValue: string;
}) {
  return (
    <section className="tpmv2-card tpmv2-panel">
      <PanelHeader title={title} subtitle={subtitle} />

      <MetaRows
        items={[
          `${routeLabel}: ${routeValue}`,
          `${accessLabel}: ${accessValue}`,
          `${executionLabel}: ${executionValue}`,
          `${dataProtectionLabel}: ${dataProtectionValue}`,
          `${secretsLabel}: ${secretsValue}`,
          `${sessionLabel}: ${sessionValue}`,
          `${recoveryLabel}: ${recoveryValue}`,
          `${alertLabel}: ${alertValue}`,
          `${accountModeLabel}: ${accountModeValue}`,
          `${reviewedAtLabel}: ${reviewedAtValue}`,
        ]}
      />
    </section>
  );
}

export function NarrowStrip({
  dict,
  assets,
  selectedAssetIndex,
  onSelectAsset,
}: {
  dict: Dictionary;
  assets: Asset[];
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
}) {
  return (
    <section className="tpmv2-card tpmv2-strip">
      <div className="tpmv2-section-label">{dict.market.title}</div>
      <div className="tpmv2-search">{dict.market.search}</div>

      <div className="tpmv2-strip-assets">
        {assets.map((asset, index) => (
          <button
            key={asset.symbol}
            type="button"
            className={
              index === selectedAssetIndex
                ? "tpmv2-strip-item active"
                : "tpmv2-strip-item"
            }
            onClick={() => onSelectAsset(index)}
          >
            <div className="tpmv2-watch-main">
              <strong>{asset.symbol}</strong>
              <small>{asset.status}</small>
            </div>
            <span className="tpmv2-watch-price">{asset.price}</span>
            <span className={`tpmv2-watch-change ${toneClassFromValue(asset.change)}`}>
              {asset.change}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
