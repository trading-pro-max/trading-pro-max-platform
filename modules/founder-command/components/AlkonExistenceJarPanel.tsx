import type { ExistenceSnapshot } from "@/lib/server/existence-architecture";

export default function AlkonExistenceJarPanel({
  snapshot,
}: {
  snapshot: ExistenceSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-existence-jar-panel"
      data-founder-private="true"
      data-existence-jar-map="true"
      aria-label="Alkon existence to Jar map"
    >
      <div className="tpm-founder-panel-head">
        <span>Existence to Jar</span>
        <h2>Anything weak enters Jar before execution</h2>
        <p>
          Unknowns, cleanup candidates, missing evidence, future ideas, private
          Alkon work, public trust work, and blocked unsafe patterns are routed to
          the correct Jar lane before any Command Passport.
        </p>
      </div>

      <div className="alkon-command-grid">
        {snapshot.jarMappedItems.slice(0, 6).map((item) => (
          <article className="tpm-founder-card" key={item.entityId}>
            <span>{item.jarId.replaceAll("_", " ")}</span>
            <h3>{item.decision.replaceAll("_", " ")}</h3>
            <small>{item.reason}</small>
          </article>
        ))}
      </div>
    </section>
  );
}
