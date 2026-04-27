import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonLocalDayOneGatePanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-local-day-one-gate"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Local Day One Gate"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Command 16</span>
        <h2>{snapshot.localDayOneGate.localDayOneStatus}</h2>
        <p>{snapshot.localDayOneGate.nextAction}</p>
      </div>
      <div className="alkon-domain-list">
        {snapshot.localDayOneGate.requirements.map((requirement) => (
          <div
            key={requirement.requirement}
            data-tone={requirement.passed ? "pass" : "needs_review"}
          >
            <small>{requirement.requirement}</small>
            <strong>{requirement.passed ? "pass" : "waiting"}</strong>
            <p>
              {requirement.passed
                ? "Evidence currently satisfies this gate."
                : "Gate remains pending before Local Day One."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
