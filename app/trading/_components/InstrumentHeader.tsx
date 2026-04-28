import type { MarketInstrument } from "./TradingOperatingFloor";
import styles from "../trading-premium-realism.module.css";

const timeframes = ["1m", "5m", "15m", "1h", "4h", "1D"];

export default function InstrumentHeader({ instrument }: { instrument: MarketInstrument }) {
  return (
    <section
      className={`${styles.instrumentHeader} tpm-living-chart-header`}
      data-instrument-header="true"
      aria-label="Premium Instrument Header"
    >
      <div>
        <span>{instrument.assetClass}</span>
        <h2>{instrument.symbol}</h2>
        <p>{instrument.name}</p>
      </div>
      <div className={styles.instrumentStats}>
        <span>Price <strong>{instrument.price}</strong></span>
        <span>Daily change <strong>{instrument.change}</strong></span>
        <span>Spread <strong>{instrument.spread}</strong></span>
        <span>Volatility <strong>{instrument.volatility}</strong></span>
        <span>Liquidity/readiness <strong>Demo-ready</strong></span>
        <span>Market truth <strong>Demo feed / Read-only</strong></span>
      </div>
      <div className={styles.timeframes} aria-label="Timeframe controls">
        {timeframes.map((timeframe) => (
          <button key={timeframe} type="button" className={timeframe === "15m" ? styles.activeButton : ""}>
            {timeframe}
          </button>
        ))}
      </div>
    </section>
  );
}
