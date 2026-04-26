import type { InfiniteGrowthSnapshot } from "@/lib/server/infinite-growth";

export default function AlkonSwissLawGravityPanel({
  snapshot,
}: {
  snapshot: InfiniteGrowthSnapshot;
}) {
  const gravityCounts = snapshot.sampleDecisions.reduce<Record<string, number>>(
    (counts, decision) => ({
      ...counts,
      [decision.gravity.gravity]: (counts[decision.gravity.gravity] ?? 0) + 1,
    }),
    {}
  );

  return (
    <section className="tpm-founder-panel" data-private-growth-gravity="true">
      <div className="tpm-founder-panel-head">
        <span>Swiss-Law Gravity</span>
        <h2>Reality sensitivity by domain</h2>
        <p>
          Local creation stays low gravity. Public claims, data, money, media,
          launch, production, and financial activity receive stronger legal,
          privacy, accounting, security, or regulatory pull.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {Object.entries(gravityCounts).map(([gravity, count]) => (
          <li key={gravity}>
            <span>{gravity}</span>
            <strong>{count} sample</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
