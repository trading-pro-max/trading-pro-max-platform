import type { AlkonDailyOperationSnapshot } from "@/lib/server/alkon-daily-operation";

function boolLabel(value: boolean) {
  return value ? "Yes" : "No";
}

export default function AlkonTodayOperatingPanel({
  snapshot,
}: {
  snapshot: AlkonDailyOperationSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-today-operating-panel"
      data-founder-private="true"
      data-daily-operation="active"
      data-brand-gate-delayed={String(snapshot.jar.brandGateDelayed)}
      data-local-day-one={snapshot.localDayOne.status}
      data-no-execution={String(snapshot.noExecution)}
      aria-label="Alkon Today Operating Status"
    >
      <div className="tpm-founder-panel-head">
        <span>Today Status</span>
        <h2>ALKON is operating from one current truth</h2>
        <p>{snapshot.currentTruth}</p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric" data-proof-section="daily-loop-status">
          <span>Daily Loop</span>
          <strong>Operating with notes</strong>
          <small>Read-only, evidence-aware, no execution</small>
        </div>
        <div className="tpm-founder-metric" data-proof-section="one-next-action">
          <span>One Next Action</span>
          <strong>Ahmad visual decision</strong>
          <small>{snapshot.oneNextAction.action}</small>
        </div>
        <div className="tpm-founder-metric" data-proof-section="jar-priority">
          <span>Jar Priority</span>
          <strong>Heart before brand</strong>
          <small>{snapshot.jar.priority}</small>
        </div>
        <div className="tpm-founder-metric" data-proof-section="local-day-one-gate">
          <span>Local Day One Gate</span>
          <strong>Not started</strong>
          <small>{snapshot.localDayOne.reason}</small>
        </div>
      </div>

      <div className="alkon-command-grid alkon-today-operating-grid">
        <article className="tpm-founder-card">
          <span>What changed</span>
          <ul>
            {snapshot.whatChanged.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="tpm-founder-card">
          <span>Product Truth</span>
          <dl className="alkon-command-facts">
            <div>
              <dt>Live execution</dt>
              <dd>Blocked</dd>
            </div>
            <div>
              <dt>Real money</dt>
              <dd>Blocked</dd>
            </div>
            <div>
              <dt>Broker/feed</dt>
              <dd>Inactive</dd>
            </div>
            <div>
              <dt>Billing</dt>
              <dd>Inactive</dd>
            </div>
          </dl>
        </article>

        <article className="tpm-founder-card">
          <span>What Not To Do</span>
          <ul>
            {snapshot.whatNotToDo.slice(0, 7).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="tpm-founder-card">
          <span>Private Boundary</span>
          <dl className="alkon-command-facts">
            <div>
              <dt>Public safe</dt>
              <dd>{boolLabel(snapshot.publicPrivateBoundary.publicSafe)}</dd>
            </div>
            <div>
              <dt>Alkon private</dt>
              <dd>{boolLabel(snapshot.publicPrivateBoundary.alkonPrivate)}</dd>
            </div>
            <div>
              <dt>Founder routes hidden</dt>
              <dd>{boolLabel(snapshot.publicPrivateBoundary.founderRoutesHiddenFromPublic)}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
