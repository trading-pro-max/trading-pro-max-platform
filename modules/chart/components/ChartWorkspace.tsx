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
          {candles.map((height, index) => (
            <div key={index} className="tpm-candle-wrap">
              <span
                className={index % 2 === 0 ? "tpm-candle up" : "tpm-candle down"}
                style={{ height: `${height}%` }}
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