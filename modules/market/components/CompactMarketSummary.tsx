import type { CSSProperties } from "react";
import type { Dictionary } from "../../../lib/i18n/get-dictionary";

export function CompactMarketSummary({
  dict,
  symbol,
  price,
  change,
  marketStatusValue,
  currentTimeframeValue,
  confidenceValue,
  signalLabel,
  signalStyle,
}: {
  dict: Dictionary;
  symbol: string;
  price: string;
  change: string;
  marketStatusValue: string;
  currentTimeframeValue: string;
  confidenceValue: string;
  signalLabel: string;
  signalStyle: CSSProperties;
}) {
  return (
    <section className="tpm-compact-summary">
      <div className="tpm-compact-summary-head">
        <div>
          <div className="tpm-compact-symbol">{symbol}</div>
          <div className="tpm-compact-text">
            {dict.market.currentPrice} {price} — {dict.market.change} {change}
          </div>
        </div>

        <div className="tpm-signal-chip" style={signalStyle}>
          {signalLabel}
        </div>
      </div>

      <div className="tpm-compact-summary-grid">
        <div className="tpm-compact-summary-item">
          <span>{dict.market.marketStatus}</span>
          <strong>{marketStatusValue}</strong>
        </div>

        <div className="tpm-compact-summary-item">
          <span>{dict.market.currentTimeframe}</span>
          <strong>{currentTimeframeValue}</strong>
        </div>

        <div className="tpm-compact-summary-item">
          <span>{dict.decision.confidence}</span>
          <strong>{confidenceValue}</strong>
        </div>
      </div>
    </section>
  );
}