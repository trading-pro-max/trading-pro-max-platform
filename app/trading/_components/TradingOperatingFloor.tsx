import { ProMaxDeviceTimeRealityBarStatic } from "@/app/_components/ProMaxDeviceTimeRealityBarStatic";
import { ProMaxLivingEarthStatic } from "@/app/_components/ProMaxLivingEarthStatic";
import { ProMaxLivingUniverseBackgroundStatic } from "@/app/_components/ProMaxLivingUniverseBackgroundStatic";
import { ProMaxRealitySourceBar } from "@/app/_components/ProMaxRealitySourceBar";
import type { ProjectUniverseTruthSnapshot } from "@/lib/server/project-universe-truth";
import AlkonTradingTruthPanel from "./AlkonTradingTruthPanel";
import ExecutionRiskPanel from "./ExecutionRiskPanel";
import InstrumentHeader from "./InstrumentHeader";
import MarketWatchPanel from "./MarketWatchPanel";
import PositionsActivityDock from "./PositionsActivityDock";
import ProductTruthStrip from "./ProductTruthStrip";
import TradingChartPanel from "./TradingChartPanel";
import TradingCommandBar from "./TradingCommandBar";
import styles from "../trading-premium-realism.module.css";

export type MarketInstrument = {
  symbol: string;
  name: string;
  assetClass: string;
  price: string;
  change: string;
  spread: string;
  volatility: string;
  session: string;
};

export const instruments: MarketInstrument[] = [
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    assetClass: "Forex",
    price: "1.0864",
    change: "+0.18%",
    spread: "0.8",
    volatility: "Calm",
    session: "London / New York overlap",
  },
  {
    symbol: "BTC/USD",
    name: "Bitcoin / US Dollar",
    assetClass: "Crypto",
    price: "68,420.50",
    change: "-0.42%",
    spread: "14.2",
    volatility: "Elevated",
    session: "24h demo tape",
  },
  {
    symbol: "S&P 500",
    name: "US 500 Index",
    assetClass: "Indices",
    price: "5,118.24",
    change: "+0.31%",
    spread: "1.1",
    volatility: "Measured",
    session: "US cash preview",
  },
  {
    symbol: "XAU/USD",
    name: "Gold / US Dollar",
    assetClass: "Commodities",
    price: "2,338.70",
    change: "+0.12%",
    spread: "1.6",
    volatility: "Steady",
    session: "Global metals",
  },
];

export default function TradingOperatingFloor({
  truth,
}: {
  truth: ProjectUniverseTruthSnapshot;
}) {
  const selectedInstrument = instruments[0];

  return (
    <main
      className={`${styles.floor} tpm-app-shell tpm-workspace-shell tpm-foundation-frame tpmv2-page`}
      data-shell-mode="workspace"
      data-clean-zero-rebuild="true"
      data-unified-project-universe="true"
      data-trading-operating-floor="true"
      data-swiss-inspired-precision="true"
      data-visual-origin="pro-max-earth-financial"
      dir="ltr"
      lang="en"
    >
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if('scrollRestoration'in history){history.scrollRestoration='manual'}window.scrollTo(0,0)}catch(error){}",
        }}
      />
      <ProMaxLivingUniverseBackgroundStatic surface="trading" />
      <div className={styles.cosmicField} aria-hidden="true" />
      <div
        className={`${styles.workspaceEarth} tpm-living-earth-background`}
        data-earth-surface="workstation"
        data-living-earth-surface="trading_workspace"
        data-living-earth-chart-safe="true"
        aria-hidden="true"
      />

      <TradingCommandBar truth={truth} />
      <ProMaxDeviceTimeRealityBarStatic variant="compact" />

      <section className={styles.body}>
        <MarketWatchPanel instruments={instruments} selectedSymbol={selectedInstrument.symbol} />

        <section
          className={`${styles.operatingCore} tpm-living-market-core tpmv2-desktop-master tpmv2-desktop-master-focus-chart`}
          data-trading-platform-depth="operating-core"
          data-visual-hierarchy="chart-execution-truth-assistant-journal-atmosphere-brand"
        >
          <section className={`${styles.marketSummary} tpm-workspace-market-summary`}>
            <div>
              <span className={styles.kicker}>Pro Max Trading</span>
              <h1>Trading Workspace</h1>
              <p>Trading Ground on Pro Max Earth. Managed by Universe. {truth.identityLine}</p>
            </div>
            <ProductTruthStrip truth={truth} />
          </section>

          <ProMaxRealitySourceBar variant="compact" />

          <InstrumentHeader instrument={selectedInstrument} />

          <section className={`${styles.coreGrid} tpm-living-market-core-grid`}>
            <section className={`${styles.primary} tpmv2-primary tpm-living-primary`}>
              <TradingChartPanel instrument={selectedInstrument} />
            </section>
            <ExecutionRiskPanel />
          </section>

          <section className={styles.secondaryGrid}>
            <AlkonTradingTruthPanel truth={truth} />
            <section
              className={`${styles.assistantDock} tpm-workspace-assistant-dock`}
              data-assistant-collapsed-by-default="true"
            >
              <details className="tpm-workspace-assistant-details">
                <summary>
                  <span>Pro Max Assistant</span>
                  <strong>Collapsed by default</strong>
                </summary>
                <div className={styles.assistantBody}>
                  <p>
                    Comfort layer only. It explains blocks, Product Truth, and paper-safe
                    next steps without signals, profit promises, or live execution.
                  </p>
                  <div className={styles.chipRow}>
                    {["Start", "Why blocked?", "Bigger chart", "Calmer", "Plans", "Journal", "Support"].map(
                      (chip) => (
                        <span key={chip}>{chip}</span>
                      )
                    )}
                  </div>
                </div>
              </details>
            </section>
            <section className={`${styles.journalDock} tpm-workspace-journal-coach-dock`}>
              <span>Journal / Coach</span>
              <strong>Quiet reflection layer</strong>
              <p>
                Secondary review only. No financial advice, no pressure, no trading signal.
              </p>
            </section>
          </section>

          <PositionsActivityDock />
        </section>

        <aside className={styles.identityColumn} aria-label="Earth identity status">
          <ProMaxLivingEarthStatic size="hero" surface="trading" showText />
          <p>{truth.identityLine}</p>
          <span>Pro Max Earth context</span>
          <span>Trading Ground on Pro Max Earth</span>
          <span>Swiss-inspired visual identity only</span>
          <span>No government endorsement</span>
        </aside>
      </section>
    </main>
  );
}
