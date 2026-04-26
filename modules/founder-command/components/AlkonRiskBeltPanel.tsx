import type { AlkonUniverseSnapshot } from "@/lib/server/alkon";

export default function AlkonRiskBeltPanel({
  snapshot,
}: {
  snapshot: AlkonUniverseSnapshot;
}) {
  const blockedGraph = snapshot.cosmicPhysics.sampleTaskGraphs.find(
    (graph) => graph.status === "black_holed"
  );

  return (
    <section className="tpm-founder-subpanel alkon-risk-belt">
      <span>Risk Belt / Black Hole Zone</span>
      <h3>Hard-forbidden work cannot enter execution</h3>
      <p>
        Live execution, real money, broker/feed activation, billing activation,
        production secrets, social publishing, external offensive actions, fake
        metrics, and guaranteed outcomes are blocked before worker assignment.
      </p>

      {blockedGraph ? (
        <div className="alkon-command-facts">
          <div>
            <dt>Blocked event</dt>
            <dd>{blockedGraph.event.title}</dd>
          </div>
          <div>
            <dt>Gravity</dt>
            <dd>{blockedGraph.gravity.priority}</dd>
          </div>
          <div>
            <dt>Tribunal</dt>
            <dd>{blockedGraph.tribunal.decision}</dd>
          </div>
          <div>
            <dt>Codex license</dt>
            <dd>{String(blockedGraph.codexLicense.permitted)}</dd>
          </div>
        </div>
      ) : null}

      <ul className="alkon-physics-block-list">
        {snapshot.cosmicPhysics.whatNotToAutomate.slice(0, 6).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
