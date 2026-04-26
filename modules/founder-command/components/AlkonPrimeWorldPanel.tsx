import type { AlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";

export default function AlkonPrimeWorldPanel({
  snapshot,
}: {
  snapshot: AlkonGenesisSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-prime-world="true">
      <div className="tpm-founder-panel-head">
        <span>Prime World</span>
        <h2>{snapshot.primeWorld.name} remains protected</h2>
        <p>
          No future world may move beyond seed or prototype-readiness if it
          weakens Pro Max Trading, delays Local Day One, or distracts from the
          Living Market Core and acceptance work.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.primeWorld.protectedPriorities.slice(0, 6).map((priority) => (
          <li key={priority}>
            <span>{priority}</span>
            <strong>protected</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
