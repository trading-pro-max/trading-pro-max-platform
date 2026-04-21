import type { OpenTradesPanelProps } from "../../shell/types/view-props";

export function OpenTradesPanel({
  dict,
  openTrades,
  closePaperTrade,
}: OpenTradesPanelProps) {
  return (
    <section className="tpm-bottom-card">
      <div className="tpm-section-head">
        <div>
          <div className="tpm-panel-title">{dict.journal.openTradesTitle}</div>
          <p className="tpm-section-subtitle">{dict.journal.openTradesSubtitle}</p>
        </div>
      </div>

      {openTrades.length === 0 ? (
        <div className="tpm-empty">{dict.journal.noOpenTrades}</div>
      ) : (
        <div className="tpm-list">
          {openTrades.map((trade) => (
            <div key={trade.id} className="tpm-list-card">
              <div className="tpm-list-row">
                <strong>{trade.symbol}</strong>
                <span>
                  {dict.decision.signals[trade.direction]} — {trade.amount}$
                </span>
              </div>

              <div className="tpm-list-meta">
                {trade.timeframe} — {dict.journal.openAt}: {trade.openedAt}
              </div>

              <button
                className="tpm-sell tpm-small-action"
                onClick={() => closePaperTrade(trade.id)}
              >
                {dict.journal.closeTrade}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}