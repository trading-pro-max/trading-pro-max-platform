import type { InfiniteGrowthSnapshot } from "@/lib/server/infinite-growth";

export default function AlkonGrowthGatesPanel({
  snapshot,
}: {
  snapshot: InfiniteGrowthSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-growth-gates="true">
      <div className="tpm-founder-panel-head">
        <span>Growth Gates</span>
        <h2>Every reality step has a blocker or proof path</h2>
        <p>
          Product Truth, privacy, tax/accounting, treasury, claims, media,
          launch, production, security/secrets, financial services, and Founder
          authority gates keep infinity inside safe creation.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {Object.entries(snapshot.layerStatuses)
          .filter(([layer]) => layer.endsWith("_gate"))
          .map(([layer, status]) => (
            <li key={layer}>
              <span>{layer}</span>
              <strong>{status}</strong>
            </li>
          ))}
      </ul>
    </section>
  );
}
