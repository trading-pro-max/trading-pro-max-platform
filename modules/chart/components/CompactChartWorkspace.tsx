import type { Dictionary } from "../../../lib/i18n/get-dictionary";
import type { Asset } from "../../shell/types/platform-state";

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
  onSelectTimeframe: (timeframe: any) => void;
  candles: number[];
}) {
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
          {candles.map((height, index) => (
            <div key={index} className="tpm-compact-candle-wrap">
              <span
                className={index % 2 === 0 ? "tpm-compact-candle up" : "tpm-compact-candle down"}
                style={{ height: `${height}%` }}
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