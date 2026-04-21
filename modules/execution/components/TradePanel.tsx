"use client";

import type { TradePanelProps } from "../../shell/types/view-props";

export function TradePanel({
  dict,
  signalLabel,
  decision,
  selectedAssetSymbol,
  selectedTimeframe,
  amount,
  setAmount,
  sessionLocked,
  canOpenMore,
  openTradeBySignal,
  openPaperTrade,
  riskNote,
}: TradePanelProps) {
  return (
    <aside className="tpm-trade-card">
      <div className="tpm-section-head">
        <div>
          <div className="tpm-panel-title">{dict.trade.title}</div>
          <p className="tpm-section-subtitle">{dict.trade.subtitle}</p>
        </div>
      </div>

      <div className="tpm-decision-card">
        <div className="tpm-decision-top">
          <strong>{signalLabel}</strong>
          <span>
            {dict.decision.confidence}: {decision.confidence}
          </span>
        </div>
        <div className="tpm-decision-reason">{decision.reason}</div>
      </div>

      <div className="tpm-field">
        <label>{dict.trade.asset}</label>
        <div className="tpm-input">{selectedAssetSymbol}</div>
      </div>

      <div className="tpm-field">
        <label>{dict.trade.timeframe}</label>
        <div className="tpm-input">{selectedTimeframe}</div>
      </div>

      <div className="tpm-field">
        <label>{dict.trade.amount}</label>
        <input
          className="tpm-real-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <div className="tpm-field">
        <label>{dict.trade.mode}</label>
        <div className="tpm-input">{dict.trade.paperMode}</div>
      </div>

      <button
        className="tpm-buy"
        onClick={openTradeBySignal}
        disabled={decision.signal === "wait" || sessionLocked || !canOpenMore}
      >
        {dict.decision.executeBySignal}
      </button>

      <button
        className="tpm-buy"
        onClick={() => openPaperTrade("buy")}
        disabled={sessionLocked || !canOpenMore}
      >
        {dict.trade.openBuy}
      </button>

      <button
        className="tpm-sell"
        onClick={() => openPaperTrade("sell")}
        disabled={sessionLocked || !canOpenMore}
      >
        {dict.trade.openSell}
      </button>

      <div className="tpm-note">{riskNote}</div>
    </aside>
  );
}