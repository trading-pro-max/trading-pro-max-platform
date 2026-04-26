import type { AlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";

export default function AlkonWorldBirthPermitPanel({
  snapshot,
}: {
  snapshot: AlkonGenesisSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-birth-permits="true">
      <div className="tpm-founder-panel-head">
        <span>World Birth Permits</span>
        <h2>Permits are private readiness records only</h2>
        <p>
          A permit cannot create a product. It records passed gates, failed
          gates, forbidden scope, proof still needed, Founder decision state,
          and next safe action.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.birthPermits.map((permit) => (
          <li key={permit.permitId}>
            <span>{permit.worldName}</span>
            <strong>{permit.status}</strong>
            <small>{permit.nextSafeAction}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
