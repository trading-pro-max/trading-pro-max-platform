import type { FounderCommandRoomFoundationSnapshot } from "@/lib/server/founder-command";
import { toneFromCommandState } from "../types";

type FounderApprovalQueueProps = {
  approvalQueue: FounderCommandRoomFoundationSnapshot["approvalQueue"];
};

export default function FounderApprovalQueue({
  approvalQueue,
}: FounderApprovalQueueProps) {
  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Founder Approval Queue</span>
        <h2>Read-only approval foundation</h2>
        <p>
          Categories and lifecycle states are prepared, but no approval
          execution, publishing, launch, billing, or integration action exists.
        </p>
      </div>

      <div className="tpm-founder-queue-layout">
        <div className="tpm-founder-queue-states">
          <h3>Lifecycle</h3>
          <div>
            {approvalQueue.states.map((state) => (
              <span key={state}>{state}</span>
            ))}
          </div>
        </div>

        <div className="tpm-founder-queue-states">
          <h3>Categories</h3>
          <div>
            {approvalQueue.categories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="tpm-founder-approval-list">
        {approvalQueue.items.map((item) => (
          <article
            className="tpm-founder-approval-item"
            data-tone={toneFromCommandState(item.actionState, item.riskLevel)}
            key={item.id}
          >
            <div>
              <span>{item.lifecycle}</span>
              <h3>{item.title}</h3>
            </div>
            <strong>{item.riskLevel}</strong>
            <p>{item.safeNextStep}</p>
            <small>{item.requiredReviews.join(" + ")} review required</small>
          </article>
        ))}
      </div>

      <p className="tpm-founder-boundary">
        Blocked actions: {approvalQueue.blockedActions.join(", ")}.
      </p>
    </section>
  );
}
