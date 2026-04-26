import type { InfiniteGrowthSnapshot } from "@/lib/server/infinite-growth";

export default function AlkonGrowthPermitPanel({
  snapshot,
}: {
  snapshot: InfiniteGrowthSnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-growth-permits="true">
      <div className="tpm-founder-panel-head">
        <span>Growth Permits</span>
        <h2>Permits describe scope; they do not execute</h2>
        <p>
          Growth permits allow safe creation, local build, readiness-only work,
          public-safe polish, review packets, Founder approvals, delays,
          blocks, or black holes. They never move money, publish, launch,
          trade, connect brokers/feeds, expose secrets, or execute code.
        </p>
      </div>
      <ul className="tpm-founder-list">
        {snapshot.sampleDecisions.map((decision) => (
          <li key={decision.reportId}>
            <span>{decision.idea.title}</span>
            <strong>{decision.permit.outcome}</strong>
            <small>{decision.permit.nextSafeAction}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}
