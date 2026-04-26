import type { AlkonConsciousnessSnapshot } from "@/lib/server/alkon-consciousness";

export default function AlkonActionJudgmentPanel({
  snapshot,
}: {
  snapshot: AlkonConsciousnessSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-consciousness-action">
      <span>Act / Judge</span>
      <h3>Safe preparation and tribunal review</h3>
      <p>
        Action prepares reports, passports, Codex draft previews, review
        requests, quarantine, or blocks. Judge accepts nothing without
        validation, scope, Product Truth, leak, secret, fake-claim, and visual
        checks when required.
      </p>
      <div className="tpm-founder-mini-list">
        {snapshot.preparedActions.slice(0, 4).map((action) => (
          <div key={action.signalId}>
            <span>{action.actionType}</span>
            <strong>{action.nextSafeAction}</strong>
            <small>
              Passport {String(action.taskPassportNeeded)} / Codex draft{" "}
              {String(action.codexDraftNeeded)}
            </small>
          </div>
        ))}
      </div>
      <ul>
        {snapshot.judgments.map((judgment) => (
          <li key={judgment.signalId}>
            {judgment.outcome}: {judgment.nextAction}
          </li>
        ))}
      </ul>
    </section>
  );
}
