import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import type { Decision } from "../../shell/types/platform-state";

export function CompactTradePanel({
  dict,
  decision,
  signalLabel,
  selectedAssetSymbol,
  selectedTimeframe,
  amount,
  setAmount,
  sessionLocked,
  canOpenMore,
  openTradeBySignal,
  openPaperTrade,
  riskNote,
}: {
  dict: Dictionary;
  decision: Decision;
  signalLabel: string;
  selectedAssetSymbol: string;
  selectedTimeframe: string;
  amount: string;
  setAmount: (value: string) => void;
  sessionLocked: boolean;
  canOpenMore: boolean;
  openTradeBySignal: () => void;
  openPaperTrade: (direction: "buy" | "sell") => void;
  riskNote: string;
}) {
  return (
    <section className="tpm-compact-trade">
      <div className="tpm-section-head">
        <div>
          <div className="tpm-panel-title">{dict.trade.title}</div>
          <div className="tpm-compact-text">{dict.trade.subtitle}</div>
        </div>
      </div>

      <div className="tpm-decision-card">
        <div className="tpm-decision-top">
          <strong>{signalLabel}</strong>
          <span>{dict.decision.confidence}: {decision.confidence}</span>
        </div>
        <div className="tpm-compact-text">{decision.reason}</div>
      </div>

      <div className="tpm-compact-mini-grid">
        <div className="tpm-compact-field">
          <label>{dict.trade.asset}</label>
          <div className="tpm-input">{selectedAssetSymbol}</div>
        </div>

        <div className="tpm-compact-field">
          <label>{dict.trade.timeframe}</label>
          <div className="tpm-input">{selectedTimeframe}</div>
        </div>
      </div>

      <div className="tpm-compact-field">
        <label>{dict.trade.amount}</label>
        <input
          className="tpm-real-input"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          inputMode="numeric"
        />
      </div>

      <div className="tpm-compact-actions">
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
      </div>

      <div className="tpm-compact-text">{riskNote}</div>
    </section>
  );
}