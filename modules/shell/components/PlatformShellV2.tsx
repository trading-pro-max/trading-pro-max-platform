"use client";

import type { CSSProperties } from "react";
import { TIMEFRAMES } from "../../../lib/constants/platform";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import { MARKET_ASSETS } from "../../market/data/assets";
import type { AccountMode, Asset, Decision, Trade } from "../types/platform-state";

function modeButtonStyle(active: boolean): CSSProperties {
  if (!active) return {};
  return {
    background: "linear-gradient(180deg, var(--tpm-accent), var(--tpm-accent-strong))",
    color: "#041412",
    borderColor: "transparent",
  };
}

function AnchorChip({ text }: { text: string }) {
  return (
    <span
      className="tpmv2-badge"
      style={{
        minHeight: 28,
        fontSize: 11,
      }}
    >
      {text}
    </span>
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
      <div className="tpmv2-brand">
        <div className="tpmv2-logo">TPM</div>
        <div>
          <div className="tpmv2-brand-title">{dict.shell.title}</div>
          <div className="tpmv2-brand-subtitle">{dict.shell.subtitle}</div>
        </div>
      </div>

      <div className="tpmv2-section-label">{dict.market.title}</div>
      <div className="tpmv2-search">{dict.market.search}</div>

      <div className="tpmv2-watchlist">
        {MARKET_ASSETS.map((asset, index) => (
          <button
            key={asset.symbol}
            type="button"
            className={index === selectedAssetIndex ? "tpmv2-watchitem active" : "tpmv2-watchitem"}
            onClick={() => onSelectAsset(index)}
          >
            <div className="tpmv2-watch-main">
              <strong>{asset.symbol}</strong>
              <small>{asset.status}</small>
            </div>

            <div className="tpmv2-watch-side">
              <span className="tpmv2-watch-price">{asset.price}</span>
              <span className="tpmv2-watch-change">{asset.change}</span>
            </div>
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
  userName,
  userEmail,
  userRegion,
  userRole,
  verificationLabel,
  accountStatusLabel,
  accountStatusValue,
  jurisdictionChips,
  permissionChips,
  profileLabel,
  settingsLabel,
  signOutLabel,
}: {
  dict: Dictionary;
  balance: string;
  accountMode: AccountMode;
  onModeChange: (mode: AccountMode) => void;
  modeLabel: string;
  demoLabel: string;
  realLabel: string;
  userName: string;
  userEmail: string;
  userRegion: string;
  userRole: string;
  verificationLabel: string;
  accountStatusLabel: string;
  accountStatusValue: string;
  jurisdictionChips: string[];
  permissionChips: string[];
  profileLabel: string;
  settingsLabel: string;
  signOutLabel: string;
}) {
  return (
    <header className="tpmv2-card tpmv2-topbar">
      <div className="tpmv2-topbar-left">
        <div className="tpmv2-badge">{dict.common.paper}</div>
        <div className="tpmv2-badge">{dict.common.liveFeed}</div>
        <div className="tpmv2-badge">{dict.common.stable}</div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 8,
          minWidth: "min(100%, 460px)",
          flex: "1 1 460px",
          justifyItems: "end",
        }}
      >
        <section
          style={{
            width: "min(100%, 520px)",
            display: "grid",
            gap: 8,
            padding: 12,
            borderRadius: 16,
            border: "1px solid var(--tpm-border)",
            background: "var(--tpm-surface-alt)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <strong>{userName}</strong>
            <AnchorChip text={verificationLabel} />
          </div>

          <div className="tpmv2-note">{userEmail}</div>

          <div className="tpmv2-note">
            {userRegion} · {userRole} · {accountStatusLabel}: {accountStatusValue}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {(Array.isArray(jurisdictionChips) ? jurisdictionChips : []).map((item, index) => (
              <AnchorChip key={`${index}-${item}`} text={item} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            {(Array.isArray(permissionChips) ? permissionChips : []).map((item, index) => (
              <AnchorChip key={`${index}-${item}`} text={item} />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span className="tpmv2-badge">{modeLabel}</span>

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

            <span className="tpmv2-badge">{balance}$</span>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button type="button" className="tpmv2-small-button">{profileLabel}</button>
            <button type="button" className="tpmv2-small-button">{settingsLabel}</button>
            <button type="button" className="tpmv2-small-button">{signOutLabel}</button>
          </div>
        </section>
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
      <div className="tpmv2-summary-head">
        <div>
          <h1 className="tpmv2-symbol">{symbol}</h1>
          <div className="tpmv2-subline">
            {dict.market.currentPrice} {price} — {dict.market.change} {change}
          </div>
        </div>

        <div className="tpmv2-signal" style={signalStyle}>
          {signalLabel}
        </div>
      </div>

      <div className="tpmv2-summary-grid">
        <div className="tpmv2-metric">
          <span>{dict.market.marketStatus}</span>
          <strong>{marketStatus}</strong>
        </div>

        <div className="tpmv2-metric">
          <span>{dict.market.currentTimeframe}</span>
          <strong>{timeframe}</strong>
        </div>

        <div className="tpmv2-metric">
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

export function ChartCard({
  dict,
  selectedAsset,
  selectedTimeframe,
  onSelectTimeframe,
  candles,
}: {
  dict: Dictionary;
  selectedAsset: Asset;
  selectedTimeframe: string;
  onSelectTimeframe: (timeframe: any) => void;
  candles: number[];
}) {
  return (
    <section className="tpmv2-card tpmv2-chart">
      <div className="tpmv2-chart-head">
        <div>
          <div className="tpmv2-chart-title">{dict.chart.title}</div>
          <div className="tpmv2-chart-subtitle">{dict.chart.subtitle}</div>
        </div>

        <div className="tpmv2-timeframes">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              type="button"
              className={tf === selectedTimeframe ? "active" : ""}
              onClick={() => onSelectTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="tpmv2-chart-context">
        <div className="tpmv2-context-chip">
          <span>{dict.market.selectedAsset}</span>
          <strong>{selectedAsset.symbol}</strong>
        </div>
        <div className="tpmv2-context-chip">
          <span>{dict.market.currentPrice}</span>
          <strong>{selectedAsset.price}</strong>
        </div>
        <div className="tpmv2-context-chip">
          <span>{dict.market.change}</span>
          <strong>{selectedAsset.change}</strong>
        </div>
        <div className="tpmv2-context-chip">
          <span>{dict.market.marketStatus}</span>
          <strong>{selectedAsset.status}</strong>
        </div>
      </div>

      <div className="tpmv2-chart-surface">
        <div className="tpmv2-chart-grid-bg" />
        <div className="tpmv2-candles">
          {candles.map((height, index) => (
            <div key={index} className="tpmv2-candle-wrap">
              <span
                className={index % 2 === 0 ? "tpmv2-candle up" : "tpmv2-candle down"}
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tpmv2-chart-meta">
        <div className="tpmv2-metric">
          <span>{dict.market.selectedAsset}</span>
          <strong>{selectedAsset.symbol}</strong>
        </div>

        <div className="tpmv2-metric">
          <span>{dict.market.currentTimeframe}</span>
          <strong>{selectedTimeframe}</strong>
        </div>

        <div className="tpmv2-metric">
          <span>{dict.market.marketStatus}</span>
          <strong>{selectedAsset.status}</strong>
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
  riskNote,
  modeFieldLabel,
  demoLabel,
  realLabel,
  realReadinessNote,
  policyPanelLabel,
  verificationLabel,
  permissionChips,
  jurisdictionChips,
  executionFoundationLabel,
  executionRouteLabel,
  executionRouteValue,
  executionIntentLabel,
  executionIntentValue,
  executionGuardrailsLabel,
  executionGuardrailChips,
  riskFoundationLabel,
  riskFoundationChips,
  riskOperatorNote,
  dataStateFoundationLabel,
  dataStateFoundationChips,
  dataStateOperatorNote,
}: {
  dict: Dictionary;
  decision: Decision;
  signalLabel: string;
  selectedAssetSymbol: string;
  selectedTimeframe: string;
  selectedDuration: string;
  durationOptions: readonly string[];
  onSelectDuration: (duration: any) => void;
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
  riskNote: string;
  modeFieldLabel: string;
  demoLabel: string;
  realLabel: string;
  realReadinessNote: string;
  policyPanelLabel: string;
  verificationLabel: string;
  permissionChips: string[];
  jurisdictionChips: string[];
  executionFoundationLabel: string;
  executionRouteLabel: string;
  executionRouteValue: string;
  executionIntentLabel: string;
  executionIntentValue: string;
  executionGuardrailsLabel: string;
  executionGuardrailChips: string[];
  riskFoundationLabel: string;
  riskFoundationChips: string[];
  riskOperatorNote: string;
  dataStateFoundationLabel: string;
  dataStateFoundationChips: string[];
  dataStateOperatorNote: string;
}) {
  const disabled = !canExecute || sessionLocked || !canOpenMore;
  const finalNote = accountMode === "real" ? realReadinessNote : (riskNote || dataStateOperatorNote || riskOperatorNote);

  return (
    <section className="tpmv2-card tpmv2-execution">
      <div>
        <div className="tpmv2-exec-title">{dict.trade.title}</div>
        <div className="tpmv2-exec-subtitle">{dict.trade.subtitle}</div>
      </div>

      <div className="tpmv2-decision">
        <div className="tpmv2-decision-top">
          <strong>{signalLabel}</strong>
          <span>{dict.decision.confidence}: {decision.confidence}</span>
        </div>
        <div className="tpmv2-note">{decision.reason}</div>
      </div>

      <div className="tpmv2-decision">
        <div className="tpmv2-decision-top">
          <strong style={{ fontSize: 16 }}>{policyPanelLabel}</strong>
          <span>{verificationLabel}</span>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Array.isArray(jurisdictionChips) ? jurisdictionChips : []).map((item, index) => (
            <AnchorChip key={`${index}-${item}`} text={item} />
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Array.isArray(permissionChips) ? permissionChips : []).map((item, index) => (
            <AnchorChip key={`${index}-${item}`} text={item} />
          ))}
        </div>
      </div>

      <div className="tpmv2-decision">
        <div className="tpmv2-decision-top">
          <strong style={{ fontSize: 16 }}>{executionFoundationLabel}</strong>
          <span>{executionIntentValue}</span>
        </div>
        <div className="tpmv2-note">{executionRouteLabel}: {executionRouteValue}</div>
        <div className="tpmv2-note">{executionIntentLabel}: {executionIntentValue}</div>
        <div className="tpmv2-note">{executionGuardrailsLabel}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Array.isArray(executionGuardrailChips) ? executionGuardrailChips : []).map((item, index) => (
            <AnchorChip key={`${index}-${item}`} text={item} />
          ))}
        </div>
      </div>

      <div className="tpmv2-decision">
        <div className="tpmv2-decision-top">
          <strong style={{ fontSize: 16 }}>{riskFoundationLabel}</strong>
          <span>{riskOperatorNote}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Array.isArray(riskFoundationChips) ? riskFoundationChips : []).map((item, index) => (
            <AnchorChip key={`${index}-${item}`} text={item} />
          ))}
        </div>
      </div>

      <div className="tpmv2-decision">
        <div className="tpmv2-decision-top">
          <strong style={{ fontSize: 16 }}>{dataStateFoundationLabel}</strong>
          <span>{dataStateOperatorNote}</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Array.isArray(dataStateFoundationChips) ? dataStateFoundationChips : []).map((item, index) => (
            <AnchorChip key={`${index}-${item}`} text={item} />
          ))}
        </div>
      </div>

      <div className="tpmv2-field">
        <label>{modeFieldLabel}</label>
        <div className="tpmv2-input">{accountMode === "demo" ? demoLabel : realLabel}</div>
      </div>

      <div className="tpmv2-field">
        <label>{dict.trade.asset}</label>
        <div className="tpmv2-input">{selectedAssetSymbol}</div>
      </div>

      <div className="tpmv2-field">
        <label>{analysisTimeframeLabel}</label>
        <div className="tpmv2-input">{selectedTimeframe}</div>
      </div>

      <div className="tpmv2-field">
        <label>{durationFieldLabel}</label>
        <div className="tpmv2-timeframes">
          {(Array.isArray(durationOptions) ? durationOptions : []).map((duration) => (
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

      <div className="tpmv2-field">
        <label>{dict.trade.amount}</label>
        <input
          className="tpmv2-real-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <div className="tpmv2-field">
        <label>{dict.trade.mode}</label>
        <div className="tpmv2-input">{dict.trade.paperMode}</div>
      </div>

      <div className="tpmv2-actions">
        <button
          type="button"
          className="tpmv2-buy"
          onClick={openTradeBySignal}
          disabled={decision.signal === "wait" || disabled}
        >
          {dict.decision.executeBySignal}
        </button>

        <button
          type="button"
          className="tpmv2-buy"
          onClick={() => openPaperTrade("buy")}
          disabled={disabled}
        >
          {dict.trade.openBuy}
        </button>

        <button
          type="button"
          className="tpmv2-sell"
          onClick={() => openPaperTrade("sell")}
          disabled={disabled}
        >
          {dict.trade.openSell}
        </button>
      </div>

      <div className="tpmv2-note">{finalNote}</div>
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
      <div className="tpmv2-panel-head">
        <div>
          <div className="tpmv2-panel-title">{dict.journal.openTradesTitle}</div>
          <div className="tpmv2-panel-subtitle">{dict.journal.openTradesSubtitle}</div>
        </div>
      </div>

      {openTrades.length === 0 ? (
        <div className="tpmv2-empty">{dict.journal.noOpenTrades}</div>
      ) : (
        <div className="tpmv2-list">
          {openTrades.map((trade) => (
            <div key={trade.id} className="tpmv2-list-card">
              <div className="tpmv2-list-row">
                <strong>{trade.symbol}</strong>
                <span>{dict.decision.signals[trade.direction]} — {trade.amount}$</span>
              </div>

              <div className="tpmv2-list-meta">
                {trade.timeframe} · {trade.duration} — {dict.journal.openAt}: {trade.openedAt}
              </div>

              <button type="button" className="tpmv2-small-button" onClick={() => closePaperTrade(trade.id)}>
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
      <div className="tpmv2-panel-head">
        <div>
          <div className="tpmv2-panel-title">{dict.journal.historyTitle}</div>
          <div className="tpmv2-panel-subtitle">{dict.journal.historySubtitle}</div>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="tpmv2-empty">{dict.journal.noHistory}</div>
      ) : (
        <div className="tpmv2-list">
          {history.map((trade) => (
            <div key={trade.id} className="tpmv2-list-card">
              <div className="tpmv2-list-row">
                <strong>{trade.symbol}</strong>
                <span>{dict.decision.signals[trade.direction]} — {trade.amount}$</span>
              </div>

              <div className="tpmv2-list-meta">
                {trade.timeframe} · {trade.duration}
              </div>

              <div className="tpmv2-list-meta">{dict.journal.openAt}: {trade.openedAt}</div>
              <div className="tpmv2-list-meta">{dict.journal.closeAt}: {trade.closedAt}</div>

              <div className={`tpmv2-result ${(trade.result || "").startsWith("+") ? "win" : "loss"}`}>
                {dict.journal.result}: {trade.result}
              </div>
            </div>
          ))}
        </div>
      )}
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
            className={index === selectedAssetIndex ? "tpmv2-strip-item active" : "tpmv2-strip-item"}
            onClick={() => onSelectAsset(index)}
          >
            <div className="tpmv2-watch-main">
              <strong>{asset.symbol}</strong>
              <small>{asset.status}</small>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}