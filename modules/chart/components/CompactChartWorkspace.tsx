import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import type { Asset, MarketCandle } from "../../shell/types/platform-state";

export function CompactChartWorkspace({
  dict,
  selectedAsset,
  selectedTimeframe,
  timeframes,
  onSelectTimeframe,
  candles,
}: {
  dict: Dictionary;
  selectedAsset: Asset;
  selectedTimeframe: string;
  timeframes: readonly string[];
  onSelectTimeframe: (timeframe: string) => void;
  candles: MarketCandle[];
}) {
  const low = candles.length > 0 ? Math.min(...candles.map((candle) => candle.low)) : 0;
  const high = candles.length > 0 ? Math.max(...candles.map((candle) => candle.high)) : 1;
  const range = Math.max(high - low, 0.0001);

  return (
    <section className="tpm-compact-chart">
      <div className="tpm-compact-chart-head">
        <div>
          <div className="tpm-panel-title">{dict.chart.title}</div>
          <div className="tpm-compact-text">{dict.chart.subtitle}</div>
        </div>

        <div className="tpm-timeframes">
          {timeframes.map((tf) => (
            <button
              key={tf}
              className={tf === selectedTimeframe ? "active" : ""}
              onClick={() => onSelectTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="tpm-compact-chart-surface">
        <div className="tpm-compact-chart-grid" />
        <div className="tpm-compact-candles">
          {candles.map((candle, index) => (
            <div key={index} className="tpm-compact-candle-wrap">
              <span
                className={
                  candle.close >= candle.open
                    ? "tpm-compact-candle up"
                    : "tpm-compact-candle down"
                }
                style={{
                  height: `${Math.max(
                    12,
                    ((candle.close - low) / range) * 100
                  )}%`,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="tpm-compact-chart-meta">
        <div className="tpm-compact-chart-meta-item">
          <span>{dict.market.selectedAsset}</span>
          <strong>{selectedAsset.symbol}</strong>
        </div>

        <div className="tpm-compact-chart-meta-item">
          <span>{dict.market.currentTimeframe}</span>
          <strong>{selectedTimeframe}</strong>
        </div>

        <div className="tpm-compact-chart-meta-item">
          <span>{dict.market.marketStatus}</span>
          <strong>{selectedAsset.status}</strong>
        </div>
      </div>
    </section>
  );
}
