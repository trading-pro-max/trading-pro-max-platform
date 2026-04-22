"use client";

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
      <div className="tpmv2-brand">
        <div className="tpmv2-logo">TPM</div>
        <div>
          <div className="tpmv2-brand-title">{dict.shell.title}</div>
          <div className="tpmv2-brand-subtitle">{dict.shell.subtitle}</div>
        </div>
      </div>

      <div className="tpmv2-rail-head">
        <div className="tpmv2-section-label">{dict.market.title}</div>
        <span className="tpmv2-rail-count">{MARKET_ASSETS.length}</span>
      </div>

      <div className="tpmv2-search">{dict.market.search}</div>

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
  selectedAssetSymbol,
  selectedAssetPrice,
  selectedAssetChange,
  marketStatus,
  signalLabel,
  sessionStateLabel,
  accountStatusValue,
  accountLifecycleLabel,
  accountLifecycleTone,
  reviewStatusLabel,
  reviewStatusTone,
  disclosureSummaryLabel,
  disclosureSummaryValue,
  paperAccessLabel,
  paperAccessValue,
  paperAccessTone,
  liveAccessLabel,
  liveAccessValue,
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
  signalLabel: string;
  sessionStateLabel: string;
  accountStatusValue: string;
  accountLifecycleLabel: string;
  accountLifecycleTone: WorkstationStatusTone;
  reviewStatusLabel: string;
  reviewStatusTone: WorkstationStatusTone;
  disclosureSummaryLabel: string;
  disclosureSummaryValue: string;
  paperAccessLabel: string;
  paperAccessValue: string;
  paperAccessTone: WorkstationStatusTone;
  liveAccessLabel: string;
  liveAccessValue: string;
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
        <div className="tpmv2-topbar-market-main">
          <span className="tpmv2-section-label">{dict.market.selectedAsset}</span>
          <div className="tpmv2-topbar-market-strip">
            <div className="tpmv2-topbar-market-symbol">{selectedAssetSymbol}</div>
            <div className="tpmv2-topbar-market-price">{selectedAssetPrice}</div>
            <div className="tpmv2-topbar-market-change">{selectedAssetChange}</div>
          </div>
          <div className="tpmv2-topbar-market-line">
            {dict.market.marketStatus}: {marketStatus} / {dict.risk.sessionStatus}:{" "}
            {sessionStateLabel} / {accountStatusValue}
          </div>
        </div>

        <div className="tpmv2-topbar-signal">{signalLabel}</div>
      </div>

      <div className="tpmv2-topbar-controls">
        <div className="tpmv2-topbar-activation">
          <StatusTag text={accountLifecycleLabel} tone={accountLifecycleTone} />
          <StatusTag text={reviewStatusLabel} tone={reviewStatusTone} />
          <StatusTag
            text={`${paperAccessLabel}: ${paperAccessValue}`}
            tone={paperAccessTone}
          />
        </div>

        <div className="tpmv2-topbar-status-line">
          <span>
            {disclosureSummaryLabel}: {disclosureSummaryValue}
          </span>
          <span>
            {liveAccessLabel}: {liveAccessValue}
          </span>
          <span>{dict.risk.sessionStatus}: {sessionStateLabel}</span>
        </div>

        <div className="tpmv2-topbar-toggle">
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
            <div className="tpmv2-summary-change">{change}</div>
          </div>
          <div className="tpmv2-subline">{dict.market.change}</div>
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

export function ChartCard({
  dict,
  selectedAsset,
  selectedTimeframe,
  onSelectTimeframe,
  candles,
}: {
  dict: Dictionary;
  selectedAsset: Asset;
  selectedTimeframe: PlatformTimeframe;
  onSelectTimeframe: (timeframe: PlatformTimeframe) => void;
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

        <div className="tpmv2-chart-overlay">
          <div>
            <div className="tpmv2-chart-overlay-title">{selectedAsset.symbol}</div>
            <div className="tpmv2-chart-overlay-line">
              {selectedAsset.price} / {selectedAsset.change}
            </div>
          </div>
          <div className="tpmv2-chart-overlay-meta">
            <span className="tpmv2-chart-overlay-tag">{selectedAsset.status}</span>
            <span className="tpmv2-chart-overlay-tag">{selectedTimeframe}</span>
          </div>
        </div>

        <div className="tpmv2-candles">
          {candles.map((height, index) => (
            <div key={index} className="tpmv2-candle-wrap">
              <span
                className={
                  index % 2 === 0 ? "tpmv2-candle up" : "tpmv2-candle down"
                }
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tpmv2-chart-meta">
        <div className="tpmv2-chart-meta-item">
          <span>{dict.market.selectedAsset}</span>
          <strong>{selectedAsset.symbol}</strong>
        </div>

        <div className="tpmv2-chart-meta-item">
          <span>{dict.market.currentTimeframe}</span>
          <strong>{selectedTimeframe}</strong>
        </div>

        <div className="tpmv2-chart-meta-item">
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
  const modeValue = accountMode === "demo" ? demoLabel : realLabel;

  return (
    <section className="tpmv2-card tpmv2-execution">
      <div className="tpmv2-ticket-head">
        <div>
          <div className="tpmv2-exec-title">{dict.trade.title}</div>
          <div className="tpmv2-exec-subtitle">{dict.trade.subtitle}</div>
        </div>

        <AnchorChip text={modeValue} />
      </div>

      <div className="tpmv2-ticket-signal">
        <div className="tpmv2-decision-top">
          <strong>{signalLabel}</strong>
          <span className="tpmv2-ticket-confidence">
            {dict.decision.confidence}: {decision.confidence}
          </span>
        </div>
        <div className="tpmv2-ticket-reason">{decision.reason}</div>
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

      <div className="tpmv2-ticket-actions">
        <button
          type="button"
          className="tpmv2-small-button tpmv2-ticket-smart"
          onClick={openTradeBySignal}
          disabled={decision.signal === "wait" || disabled}
        >
          {dict.decision.executeBySignal}
        </button>

        <div className="tpmv2-ticket-primary-actions">
          <button
            type="button"
            className="tpmv2-buy tpmv2-buy-secondary"
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
      </div>

      <div className="tpmv2-note tpmv2-ticket-note">{note}</div>
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
          </button>
        ))}
      </div>
    </section>
  );
}
