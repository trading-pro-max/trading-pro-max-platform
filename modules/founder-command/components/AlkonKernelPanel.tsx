import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonKernelPanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-kernel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Sovereign Kernel"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Sovereign Kernel</span>
        <h2>Founder Source to Local Day One gate</h2>
        <p>
          Private creator-runtime foundation for creation, judgment, evidence,
          memory, authority, public trust, and one correct next action.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Commands</span>
          <strong>{snapshot.commandStatuses.length}</strong>
          <small>Command 0 through 16</small>
        </div>
        <div className="tpm-founder-metric">
          <span>One next action</span>
          <strong>{snapshot.oneNextAction.founderDecisionNeeded ? "Ahmad" : "Kernel"}</strong>
          <small>{snapshot.oneNextAction.oneNextAction}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Local Day One</span>
          <strong>{snapshot.localDayOneGate.localDayOneStatus}</strong>
          <small>Visual acceptance required</small>
        </div>
      </div>
    </section>
  );
}
