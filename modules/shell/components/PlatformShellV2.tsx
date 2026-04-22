"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  TIMEFRAMES,
  type PlatformExecutionDuration,
  type PlatformTimeframe,
} from "../../../lib/constants/platform";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import { MARKET_ASSETS } from "../../market/data/assets";
import type {
  AccountMode,
  Asset,
  AuditEvent,
  Decision,
  PlatformChartType,
  Trade,
} from "../types/platform-state";
import type {
  ComplianceDisclosureView,
  ComplianceMetaView,
  WorkstationStatusTone,
} from "./trading-workstation-view-model";

function modeButtonStyle(active: boolean): CSSProperties {
  if (!active) return {};

  return {
    background: "linear-gradient(180deg, var(--tpm-accent), var(--tpm-accent-strong))",
    color: "#041412",
    borderColor: "transparent",
  };
}

function toneClassFromValue(value: string) {
  const normalized = value.trim();

  if (normalized.startsWith("+")) return "positive";
  if (normalized.startsWith("-")) return "negative";

  return "neutral";
}

function parseNumericValue(value: string) {
  const match = value.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : null;
}

function buildPriceScale(currentPrice: string) {
  const parsedPrice = parseNumericValue(currentPrice);
  const decimals = currentPrice.includes(".")
    ? currentPrice.split(".")[1]?.length ?? 2
    : 2;
  const step = decimals >= 4 ? 0.0005 : decimals === 3 ? 0.005 : decimals === 2 ? 0.05 : 0.5;

  if (parsedPrice === null || Number.isNaN(parsedPrice)) {
    return [currentPrice, currentPrice, currentPrice, currentPrice];
  }

  return [1.5, 0.5, -0.5, -1.5].map((offset) =>
    (parsedPrice + step * offset).toFixed(decimals),
  );
}

function buildTimeScale(timeframe: PlatformTimeframe) {
  if (timeframe === "1m") return ["09:20", "09:35", "09:50", "10:05", "10:20"];
  if (timeframe === "5m") return ["08:30", "08:55", "09:20", "09:45", "10:10"];
  if (timeframe === "15m") return ["06:00", "07:15", "08:30", "09:45", "11:00"];
  if (timeframe === "1h") return ["02:00", "04:00", "06:00", "08:00", "10:00"];

  return ["00:00", "06:00", "12:00", "18:00", "24:00"];
}

export const CHART_TYPES: { id: PlatformChartType; label: string }[] = [
  { id: "candlestick", label: "Candles" },
  { id: "area", label: "Area" },
  { id: "line", label: "Line" },
  { id: "bars", label: "Bars" },
];

export const INDICATOR_TOOLS = ["EMA 20", "RSI", "MACD", "VOL"] as const;
export const DRAWING_TOOLS = ["Cursor", "Trend", "Level", "Range", "Note"] as const;

type ChartBar = {
  height: number;
  tone: "up" | "down";
  bodyHeight: number;
  wickHeight: number;
  volumeHeight: number;
};

function buildChartBars(candles: number[]): ChartBar[] {
  return candles.map((height, index) => {
    const previous = candles[index - 1] ?? Math.max(20, height - 6);
    const bodyHeight = Math.max(10, Math.min(82, Math.abs(height - previous) + 18));
    const wickHeight = Math.max(bodyHeight + 14, Math.min(100, height + 12));
    const volumeHeight = 18 + (((height + index * 7) % 48) || 12);

    return {
      height,
      tone: height >= previous ? "up" : "down",
      bodyHeight,
      wickHeight,
      volumeHeight,
    };
  });
}

function buildMovingAveragePoints(
  candles: number[],
  period: number,
  pointStep: number
) {
  if (candles.length === 0) return "";

  return candles
    .map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const slice = candles.slice(start, index + 1);
      const average =
        slice.reduce((sum, item) => sum + item, 0) / Math.max(slice.length, 1);

      return `${(index * pointStep).toFixed(2)},${Math.max(4, 100 - average).toFixed(2)}`;
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
  selectedAssetIndex,
  onSelectAsset,
}: {
  dict: Dictionary;
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
}) {
  return (
    <aside className="tpmv2-card tpmv2-rail">
      <div className="tpmv2-rail-head">
        <div className="tpmv2-section-label">{dict.market.title}</div>
        <span className="tpmv2-rail-count">{MARKET_ASSETS.length}</span>
      </div>

      <div className="tpmv2-search">{dict.market.search}</div>

      <div className="tpmv2-watchlist-head">
        <span>{dict.market.selectedAsset}</span>
        <span>{dict.market.currentPrice}</span>
        <span>{dict.market.change}</span>
      </div>

      <div className="tpmv2-watchlist">
        {MARKET_ASSETS.map((asset, index) => (
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
              <small>{asset.status}</small>
            </div>
            <span className="tpmv2-watch-price">{asset.price}</span>
            <span className={`tpmv2-watch-change ${toneClassFromValue(asset.change)}`}>
              {asset.change}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

export function TradingTopbar({
  dict,
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
}: {
  dict: Dictionary;
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
}) {
  return (
    <header className="tpmv2-card tpmv2-topbar">
      <div className="tpmv2-topbar-brand">
        <div className="tpmv2-topbar-mark">TPM</div>
        <div className="tpmv2-topbar-brand-copy">
          <strong>{dict.shell.title}</strong>
          <span>{dict.shell.subtitle}</span>
        </div>
      </div>

      <div className="tpmv2-topbar-market">
        <div className="tpmv2-topbar-market-main tpmv2-topbar-market-compact">
          <div className="tpmv2-topbar-market-strip">
            <div className="tpmv2-topbar-market-symbol">{selectedAssetSymbol}</div>
            <div className="tpmv2-topbar-market-price">{selectedAssetPrice}</div>
            <div
              className={`tpmv2-topbar-market-change ${toneClassFromValue(
                selectedAssetChange,
              )}`}
            >
              {selectedAssetChange}
            </div>
            <span className="tpmv2-topbar-market-state">{marketStatus}</span>
          </div>
        </div>
      </div>

      <div className="tpmv2-topbar-controls">
        <div className="tpmv2-topbar-links">
          <a className="tpmv2-topbar-link" href={diagnosticsHref}>
            {diagnosticsLabel}
          </a>
          <a className="tpmv2-topbar-link" href={settingsHref}>
            {settingsLabel}
          </a>
        </div>

        <div className="tpmv2-topbar-toggle">
          <StatusTag
            text={`${paperAccessLabel}: ${paperAccessValue}`}
            tone={paperAccessTone}
          />
          <span className="tpmv2-mode-label">{modeLabel}</span>

          <button
            type="button"
            className="tpmv2-badge"
            style={modeButtonStyle(accountMode === "demo")}
            onClick={() => onModeChange("demo")}
          >
            {demoLabel}
          </button>

          <button
            type="button"
            className="tpmv2-badge"
            style={modeButtonStyle(accountMode === "real")}
            onClick={() => onModeChange("real")}
          >
            {realLabel}
          </button>

          <span className="tpmv2-badge tpmv2-topbar-balance">{balance}$</span>
        </div>
      </div>
    </header>
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
          <span className="tpmv2-command-kicker">TPM AI Command</span>
          <strong>{signalLabel}</strong>
        </div>
        <span>{decision.confidence}</span>
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
        <span>{dict.journal.openTradesTitle}</span>
        <strong>{openTradesCount}</strong>
        <small>
          {dict.journal.historyTitle}: {historyCount} / {dict.risk.sessionResult}:{" "}
          {sessionPnLText}
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
  signalLabel,
  chartType,
  onSelectChartType,
  activeIndicators,
  onToggleIndicator,
  activeDrawingTool,
  onSelectDrawingTool,
  chartZoom,
  onSetChartZoom,
  onResetChart,
  workspaceControls,
}: {
  dict: Dictionary;
  selectedAsset: Asset;
  selectedTimeframe: PlatformTimeframe;
  onSelectTimeframe: (timeframe: PlatformTimeframe) => void;
  candles: number[];
  decision: Decision;
  signalLabel: string;
  chartType: PlatformChartType;
  onSelectChartType: (type: PlatformChartType) => void;
  activeIndicators: string[];
  onToggleIndicator: (indicator: string) => void;
  activeDrawingTool: string;
  onSelectDrawingTool: (tool: string) => void;
  chartZoom: number;
  onSetChartZoom: (zoom: number) => void;
  onResetChart: () => void;
  workspaceControls?: ReactNode;
}) {
  const priceScale = buildPriceScale(selectedAsset.price);
  const timeScale = buildTimeScale(selectedTimeframe);
  const chartBars = buildChartBars(candles);
  const pointStep = 100 / Math.max(candles.length - 1, 1);
  const chartPathPoints = candles
    .map(
      (height, index) =>
        `${(index * pointStep).toFixed(2)},${Math.max(4, 100 - height).toFixed(2)}`,
    )
    .join(" ");
  const chartAreaPoints = `0,100 ${chartPathPoints} 100,100`;
  const emaFastPoints = buildMovingAveragePoints(candles, 4, pointStep);
  const emaSlowPoints = buildMovingAveragePoints(candles, 8, pointStep);
  const latestHeight = candles[candles.length - 1] ?? 50;
  const priceMarkerTop = `${Math.max(16, Math.min(82, 100 - latestHeight))}%`;
  const highPrice = priceScale[0] ?? selectedAsset.price;
  const lowPrice = priceScale[priceScale.length - 1] ?? selectedAsset.price;
  const activeIndicatorSummary =
    activeIndicators.length > 0 ? activeIndicators.join(" / ") : "Clean chart";
  const activeChartTypeLabel =
    CHART_TYPES.find((type) => type.id === chartType)?.label ?? "Candles";
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
          {priceScale.map((price) => (
            <span key={price}>{price}</span>
          ))}
        </div>

        <div className="tpmv2-chart-overlay">
          <div className="tpmv2-chart-overlay-meta">
            <span className="tpmv2-chart-overlay-tag">{selectedAsset.status}</span>
            <span className="tpmv2-chart-overlay-tag">{selectedTimeframe}</span>
            <span className="tpmv2-chart-overlay-tag">{dict.common.paper}</span>
            <span className="tpmv2-chart-overlay-tag">{dict.common.local}</span>
          </div>
        </div>

        <div className="tpmv2-chart-session-panel" aria-hidden="true">
          <span>H {highPrice}</span>
          <span>L {lowPrice}</span>
          <span>{activeChartTypeLabel}</span>
          <span>{activeDrawingTool}</span>
          <span>{activeIndicatorSummary}</span>
        </div>

        <div className={`tpmv2-chart-ai-panel ${decision.signal}`}>
          <div className="tpmv2-chart-ai-kicker">TPM AI</div>
          <div className="tpmv2-chart-ai-row">
            <strong>{signalLabel}</strong>
            <span>{decision.confidence}</span>
          </div>
          <p>{decision.reason}</p>
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
          ) : null}

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
          {timeScale.map((label) => (
            <span key={label}>{label}</span>
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
  note,
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
  note: string;
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
}) {
  const disabled = !canExecute || sessionLocked || !canOpenMore;
  const aiActionDisabled = decision.signal === "wait" || disabled;
  const modeValue = accountMode === "demo" ? demoLabel : realLabel;
  const executionRef = usePointerField<HTMLElement>();

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
        <button
          type="button"
          className="tpmv2-core-action tpmv2-core-buy"
          aria-label={dict.trade.openBuy}
          onClick={() => openPaperTrade("buy")}
          disabled={disabled}
        >
          <span>{dict.decision.signals.buy}</span>
          <small>{dict.common.paper}</small>
        </button>

        <button
          type="button"
          className="tpmv2-core-action tpmv2-core-ai"
          aria-label={dict.decision.executeBySignal}
          onClick={openTradeBySignal}
          disabled={aiActionDisabled}
        >
          <span>AI</span>
          <small>{signalLabel}</small>
        </button>

        <button
          type="button"
          className="tpmv2-core-action tpmv2-core-sell"
          aria-label={dict.trade.openSell}
          onClick={() => openPaperTrade("sell")}
          disabled={disabled}
        >
          <span>{dict.decision.signals.sell}</span>
          <small>{dict.common.paper}</small>
        </button>
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="tpmv2-ticket-status">
        <div className="tpmv2-ticket-badges">
          <StatusTag text={accountLifecycleLabel} tone={accountLifecycleTone} />
          <StatusTag text={reviewStatusLabel} tone={reviewStatusTone} />
        </div>

        <div className="tpmv2-ticket-status-grid">
          <div className="tpmv2-ticket-status-row">
            <span>{ticketReadinessLabel}</span>
            <strong className={`tpmv2-ticket-status-value ${ticketReadinessTone}`}>
              {ticketReadinessValue}
            </strong>
          </div>

          <div className="tpmv2-ticket-status-row">
            <span>{ticketGateLabel}</span>
            <strong className={`tpmv2-ticket-status-value ${ticketGateTone}`}>
              {ticketGateValue}
            </strong>
          </div>

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

      <div className="tpmv2-ticket-ops-note">
        <span>{ticketOperationalLabel}</span>
        <strong className={`tpmv2-ticket-status-value ${ticketOperationalTone}`}>
          {ticketOperationalValue}
        </strong>
        <small>{note}</small>
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
        <div className="tpmv2-empty">{dict.journal.noOpenTrades}</div>
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
        <div className="tpmv2-empty">{dict.journal.noHistory}</div>
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
        <div className="tpmv2-empty">{emptyLabel}</div>
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
        <div className="tpmv2-empty">{emptyLabel}</div>
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
  selectedAssetIndex,
  onSelectAsset,
}: {
  dict: Dictionary;
  selectedAssetIndex: number;
  onSelectAsset: (index: number) => void;
}) {
  return (
    <section className="tpmv2-card tpmv2-strip">
      <div className="tpmv2-section-label">{dict.market.title}</div>
      <div className="tpmv2-search">{dict.market.search}</div>

      <div className="tpmv2-strip-assets">
        {MARKET_ASSETS.map((asset, index) => (
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
