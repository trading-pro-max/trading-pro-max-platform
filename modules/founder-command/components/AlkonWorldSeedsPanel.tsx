import type { AlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";

export default function AlkonWorldSeedsPanel({
  snapshot,
}: {
  snapshot: AlkonGenesisSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-world-seeds="true">
      <div className="tpm-founder-panel-head">
        <span>World Seeds</span>
        <h2>Private candidates, not products</h2>
        <p>
          Seeds can be evaluated, delayed, rejected, archived, or kept as
          prototype-readiness. No public page or second project is created.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.worldSeeds.map((seed) => (
          <li key={seed.seedId}>
            <span>{seed.name}</span>
            <strong>{seed.currentStatus}</strong>
            <small>{seed.nextSafeAction}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
