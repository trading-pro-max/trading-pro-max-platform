import type { HistoryPanelProps } from "../../shell/types/view-props";

export function HistoryPanel({
  dict,
  history,
}: HistoryPanelProps) {
  return (
    <section className="tpm-bottom-card">
      <div className="tpm-section-head">
        <div>
          <div className="tpm-panel-title">{dict.journal.historyTitle}</div>
          <p className="tpm-section-subtitle">{dict.journal.historySubtitle}</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="tpm-empty">{dict.journal.noHistory}</div>
      ) : (
        <div className="tpm-list">
          {history.map((trade) => (
            <div key={trade.id} className="tpm-list-card">
              <div className="tpm-list-row">
                <strong>{trade.symbol}</strong>
                <span>
                  {dict.decision.signals[trade.direction]} — {trade.amount}$
                </span>
              </div>

              <div className="tpm-list-meta">
                {dict.journal.openAt}: {trade.openedAt}
              </div>

              <div className="tpm-list-meta">
                {dict.journal.closeAt}: {trade.closedAt}
              </div>

              <div
                className={`tpm-result ${
                  (trade.result || "").startsWith("+") ? "win" : "loss"
                }`}
              >
                {dict.journal.result}: {trade.result}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}