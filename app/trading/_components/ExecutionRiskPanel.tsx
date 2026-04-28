import styles from "../trading-premium-realism.module.css";

export default function ExecutionRiskPanel() {
  return (
    <aside
      className={`${styles.executionRail} tpm-living-execution-rail`}
      data-execution-risk-panel="true"
      data-paper-order-ticket="true"
      data-execution-attached-to-chart="true"
      data-visual-priority="secondary"
      aria-label="Premium Execution / Risk Panel"
    >
      <section className={`${styles.executionPanel} tpmv2-execution`}>
        <div className={styles.panelHead}>
          <span>Execution Panel</span>
          <strong>Paper order ticket</strong>
        </div>
        <div className={styles.ticketGrid}>
          <label>
            Amount
            <input className="tpmv2-real-input" defaultValue="100" inputMode="decimal" />
          </label>
          <label>
            Quantity
            <input defaultValue="0.10 lot" readOnly />
          </label>
          <label>
            Order type
            <select defaultValue="market" aria-label="Order type">
              <option value="market">Market demo</option>
              <option value="limit">Limit demo</option>
              <option value="stop">Stop demo</option>
            </select>
          </label>
          <label>
            Timeframe
            <select defaultValue="15m" aria-label="Duration timeframe">
              <option value="15m">15m rehearsal</option>
              <option value="1h">1h rehearsal</option>
              <option value="1d">1D rehearsal</option>
            </select>
          </label>
          <label>
            Stop loss
            <input defaultValue="Review only" readOnly />
          </label>
          <label>
            Take profit
            <input defaultValue="Review only" readOnly />
          </label>
        </div>

        <div className={styles.tradeButtons}>
          <button type="button" className="tpmv2-core-buy" disabled>
            Buy Paper
          </button>
          <button type="button" className="tpmv2-core-ai" disabled>
            AI Wait
          </button>
          <button type="button" className="tpmv2-core-sell" disabled>
            Sell Paper
          </button>
        </div>

        <div className={`${styles.riskStack} tpmv2-ticket-preflight`}>
          <span>Risk status: guarded</span>
          <span>Session lock: private review</span>
          <span>Max exposure: demo only</span>
          <span>Broker state: not connected / disabled</span>
          <span className="tpm-ticket-amount-state">Paper amount needs review at 0</span>
          <span className="tpm-why-blocked-hint">
            Why blocked: real-money execution disabled, broker execution disabled, paper/demo only.
          </span>
        </div>
      </section>
    </aside>
  );
}
