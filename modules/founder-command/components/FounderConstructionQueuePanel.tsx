import type { FounderLocalCommandSnapshot } from "../types";

type FounderConstructionQueuePanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderConstructionQueuePanel({
  snapshot,
}: FounderConstructionQueuePanelProps) {
  return (
    <section className="tpm-founder-local-panel">
      <header>
        <span>Construction queue</span>
        <h3>Drafts, review, and blocks</h3>
      </header>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Total</span>
          <strong>{snapshot.constructionQueue.summary.total}</strong>
        </div>
        <div>
          <span>Review</span>
          <strong>{snapshot.constructionQueue.summary.waitingReview}</strong>
        </div>
        <div>
          <span>Blocked</span>
          <strong>{snapshot.constructionQueue.summary.blocked}</strong>
        </div>
      </div>
      <ul>
        {snapshot.constructionQueue.items.slice(0, 4).map((item) => (
          <li key={item.taskId}>
            {item.title} - {item.status.replaceAll("_", " ")}
          </li>
        ))}
      </ul>
      <small>No automatic Codex sending or uncontrolled execution.</small>
    </section>
  );
}
