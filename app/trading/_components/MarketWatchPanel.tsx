import type { MarketInstrument } from "./TradingOperatingFloor";
import styles from "../trading-premium-realism.module.css";

export default function MarketWatchPanel({
  instruments,
  selectedSymbol,
}: {
  instruments: MarketInstrument[];
  selectedSymbol: string;
}) {
  const groups = ["Forex", "Crypto", "Indices", "Commodities"];

  return (
    <aside
      className={styles.marketWatch}
      data-market-watch-panel="true"
      data-market-board="true"
      data-trading-platform-depth="market-board"
      aria-label="Premium Market Watch Panel"
    >
      <div className={styles.panelHead}>
        <span>Market Watch</span>
        <strong>Demo/read-only tape</strong>
      </div>
      <div className={styles.marketGroups}>
        {groups.map((group) => (
          <section key={group}>
            <h2>{group}</h2>
            {instruments
              .filter((instrument) => instrument.assetClass === group)
              .map((instrument) => (
                <article
                  key={instrument.symbol}
                  className={instrument.symbol === selectedSymbol ? styles.activeInstrument : ""}
                >
                  <div>
                    <strong>{instrument.symbol}</strong>
                    <small>{instrument.name}</small>
                  </div>
                  <div>
                    <span>{instrument.price}</span>
                    <small>{instrument.change}</small>
                  </div>
                  <div>
                    <span>Spread {instrument.spread}</span>
                    <small>{instrument.volatility}</small>
                  </div>
                  <em>{instrument.session}</em>
                  <b>Demo/read-only</b>
                </article>
              ))}
          </section>
        ))}
      </div>
    </aside>
  );
}
