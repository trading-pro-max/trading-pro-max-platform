import type { ExistenceSnapshot } from "@/lib/server/existence-architecture";

export default function AlkonEntityOwnershipPanel({
  snapshot,
}: {
  snapshot: ExistenceSnapshot;
}) {
  const owners: Array<[string, number]> = [
    ["Private Alkon -0", snapshot.desktopEntities.filter((item) => item.owner === "private_alkon_minus_zero").length + snapshot.componentEntities.filter((item) => item.owner === "private_alkon_minus_zero").length],
    ["Public Pro Max", snapshot.routeEntities.filter((item) => item.owner === "public_pro_max").length + snapshot.componentEntities.filter((item) => item.owner === "public_pro_max").length],
    ["Invisible Layer", snapshot.codebaseEntities.filter((item) => item.owner === "invisible_operating_layer").length + snapshot.apiEntities.filter((item) => item.owner === "invisible_operating_layer").length],
    ["Tests / Evidence", snapshot.codebaseEntities.filter((item) => item.owner === "tests_evidence").length],
  ];

  return (
    <section
      className="tpm-founder-panel alkon-entity-ownership-panel"
      data-founder-private="true"
      aria-label="Alkon entity ownership map"
    >
      <div className="tpm-founder-panel-head">
        <span>Entity Ownership</span>
        <h2>No entity without owner</h2>
        <p>
          Public Pro Max, Private Alkon -0, Invisible Operating Layer, Tools,
          Evidence, Docs/Reports, and Assets stay separated by permission and boundary.
        </p>
      </div>

      <div className="alkon-command-grid">
        {owners.map(([label, count]) => (
          <article className="tpm-founder-card" key={label}>
            <span>{label}</span>
            <h3>{count}</h3>
            <small>Primary ownership count in current snapshot</small>
          </article>
        ))}
      </div>
    </section>
  );
}
