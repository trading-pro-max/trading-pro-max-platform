import type { MarketSummaryProps } from "../../shell/types/view-props";

export function MarketSummary({
  symbol,
  price,
  change,
  marketStatusLabel,
  marketStatusValue,
  currentTimeframeLabel,
  currentTimeframeValue,
  confidenceLabel,
  confidenceValue,
  currentPriceLabel,
  changeLabel,
  signalLabel,
  signalStyle,
}: MarketSummaryProps) {
  return (
    <section className="tpm-market-summary">
      <div className="tpm-market-summary-head">
        <div>
          <h2>{symbol}</h2>
          <p>
            {currentPriceLabel} {price} — {changeLabel} {change}
          </p>
        </div>

        <div className="tpm-signal-chip" style={signalStyle}>
          {signalLabel}
        </div>
      </div>

      <div className="tpm-market-summary-grid">
        <div className="tpm-market-summary-item">
          <span>{marketStatusLabel}</span>
          <strong>{marketStatusValue}</strong>
        </div>

        <div className="tpm-market-summary-item">
          <span>{currentTimeframeLabel}</span>
          <strong>{currentTimeframeValue}</strong>
        </div>

        <div className="tpm-market-summary-item">
          <span>{confidenceLabel}</span>
          <strong>{confidenceValue}</strong>
        </div>
      </div>
    </section>
  );
}