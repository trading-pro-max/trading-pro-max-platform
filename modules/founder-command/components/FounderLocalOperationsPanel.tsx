import type { FounderLocalCommandSnapshot } from "../types";

type FounderLocalOperationsPanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderLocalOperationsPanel({
  snapshot,
}: FounderLocalOperationsPanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Local day cycle</span>
        <h3>Closed local operation</h3>
      </header>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Readiness</span>
          <strong>{snapshot.localOperations.readinessLaw.state}</strong>
        </div>
        <div>
          <span>Stages</span>
          <strong>{snapshot.localOperations.dayCycle.totalStages}</strong>
        </div>
        <div>
          <span>Completed</span>
          <strong>{snapshot.localOperations.report.completedStages.length}</strong>
        </div>
      </div>
      <p>{snapshot.localOperations.launchForbiddenReminder}</p>
      <ul>
        {snapshot.localOperations.nextSafeLocalActions.slice(0, 3).map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </section>
  );
}
