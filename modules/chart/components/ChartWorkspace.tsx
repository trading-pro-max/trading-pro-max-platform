"use client";

import type { ChartWorkspaceProps } from "../../shell/types/view-props";

export function ChartWorkspace({
  title,
  subtitle,
  selectedAssetLabel,
  currentTimeframeLabel,
  marketStatusLabel,
  selectedAsset,
  selectedTimeframe,
  timeframes,
  onSelectTimeframe,
  candles,
}: ChartWorkspaceProps) {
  const low = candles.length > 0 ? Math.min(...candles.map((candle) => candle.low)) : 0;
  const high = candles.length > 0 ? Math.max(...candles.map((candle) => candle.high)) : 1;
  const range = Math.max(high - low, 0.0001);

  return (
    <section className="tpm-chart-card">
      <div className="tpm-section-head">
        <div>
          <div className="tpm-panel-title">{title}</div>
          <p className="tpm-section-subtitle">{subtitle}</p>
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

      <div className="tpm-chart">
        <div className="tpm-chart-grid" />
        <div className="tpm-candles">
          {candles.map((candle, index) => (
            <div key={index} className="tpm-candle-wrap">
              <span
                className={
                  candle.close >= candle.open ? "tpm-candle up" : "tpm-candle down"
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

      <div className="tpm-chart-footer">
        <div className="tpm-stat">
          <span>{selectedAssetLabel}</span>
          <strong>{selectedAsset.symbol}</strong>
        </div>
        <div className="tpm-stat">
          <span>{currentTimeframeLabel}</span>
          <strong>{selectedTimeframe}</strong>
        </div>
        <div className="tpm-stat">
          <span>{marketStatusLabel}</span>
          <strong>{selectedAsset.status}</strong>
        </div>
      </div>
    </section>
  );
}
