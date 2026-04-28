import type { MarketInstrument } from "./TradingOperatingFloor";
import type { CSSProperties } from "react";
import styles from "../trading-premium-realism.module.css";

const candles = [
  ["up", "52%", "76%"],
  ["up", "47%", "68%"],
  ["down", "58%", "86%"],
  ["up", "42%", "64%"],
  ["up", "36%", "70%"],
  ["down", "49%", "78%"],
  ["up", "31%", "58%"],
  ["up", "28%", "62%"],
  ["down", "44%", "72%"],
  ["up", "26%", "56%"],
  ["up", "22%", "48%"],
  ["down", "38%", "66%"],
  ["up", "19%", "44%"],
  ["up", "16%", "38%"],
  ["down", "30%", "58%"],
  ["up", "14%", "36%"],
] as const;

export default function TradingChartPanel({ instrument }: { instrument: MarketInstrument }) {
  return (
    <section
      className={`${styles.chartShell} tpm-living-chart-surface`}
      data-chart-zone="true"
      data-living-earth-surface="trading_chart_atmosphere"
      data-earth-overlay="none"
      data-chart-body-rebuilt="swiss-zero"
      data-visual-priority="primary"
      aria-label="Premium Chart Zone"
    >
      <div
        className={`${styles.chartSurface} tpmv2-chart-surface tpmv2-chart-surface-swiss`}
        data-chart-obstruction-layer="none"
        data-swiss-precision-chart="true"
      >
        <div className={`${styles.chartToolbar} tpm-living-chart-header`}>
          <div>
            <span>Chart toolbar</span>
            <strong>{instrument.symbol} / 15m</strong>
          </div>
          <div>
            <span>Demo feed</span>
            <span>Read-only</span>
            <span>No real execution</span>
            <span>Evidence-aware</span>
          </div>
        </div>

        <div
          className={`${styles.chartBody} tpmv2-chart-body tpm-living-chart-canvas`}
          data-earth-overlay="none"
          data-old-overlay-artifacts="removed"
        >
          <div className="tpmv2-chart-grid-bg" />
          <div className="tpmv2-chart-crosshair" />
          <div className="tpmv2-chart-price-scale">
            <span>1.0910</span>
            <span>1.0890</span>
            <span>1.0870</span>
            <span>1.0850</span>
            <span>1.0830</span>
          </div>
          <div className="tpmv2-chart-time-scale">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
          </div>
          <div className="tpmv2-chart-price-marker" style={{ top: "39%" }}>
            <span>{instrument.price}</span>
          </div>
          <div className="tpmv2-chart-plot">
            <svg className={styles.marketPath} viewBox="0 0 1200 500" aria-hidden="true">
              <path
                d="M0 340 C90 310 120 350 190 300 C260 250 315 290 390 235 C470 180 520 220 600 174 C700 118 750 174 840 128 C930 82 990 112 1080 70 C1130 48 1160 58 1200 42"
                fill="none"
              />
              <path
                d="M0 340 C90 310 120 350 190 300 C260 250 315 290 390 235 C470 180 520 220 600 174 C700 118 750 174 840 128 C930 82 990 112 1080 70 C1130 48 1160 58 1200 42 L1200 500 L0 500 Z"
                className={styles.marketFill}
              />
            </svg>
            <div className="tpmv2-candles">
              {candles.map(([direction, bodyHeight, wickHeight], index) => (
                <span
                  key={`${direction}-${bodyHeight}-${index}`}
                  className="tpmv2-candle-wrap"
                  style={{ "--tpmv2-wick-height": wickHeight } as CSSProperties}
                >
                  <span className={`tpmv2-candle ${direction}`} style={{ height: bodyHeight }} />
                </span>
              ))}
            </div>
            <div className="tpmv2-chart-volume">
              {candles.map(([direction], index) => (
                <span
                  key={`volume-${index}`}
                  className={direction === "down" ? "down" : undefined}
                  style={{ height: `${28 + ((index * 13) % 45)}%` }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="tpmv2-chart-depth-strip" data-market-depth-demo="true">
          <strong>Market Depth Demo</strong>
          <span>Bid 1.0863 / Ask 1.0865</span>
          <span>Spread 0.8</span>
          <span>Read-only depth simulation</span>
        </div>
      </div>
    </section>
  );
}
