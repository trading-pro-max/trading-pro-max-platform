import type { NumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";

export default function AlkonNorthStarPanel({
  snapshot,
}: {
  snapshot: NumberOneDestinySnapshot;
}) {
  return (
    <section className="tpm-founder-panel" data-private-north-star="true">
      <div className="tpm-founder-panel-head">
        <span>North Star</span>
        <h2>Private mission, not marketing</h2>
        <p>{snapshot.northStar.reason}</p>
      </div>
      <ul className="tpm-founder-list">
        <li>
          <span>Internal mission</span>
          <strong>{snapshot.northStar.northStar}</strong>
          <small>Public claim forbidden: {String(snapshot.northStar.publicClaimForbidden)}</small>
        </li>
        <li>
          <span>Alignment</span>
          <strong>{snapshot.northStar.northStarAlignment}</strong>
          <small>{snapshot.northStar.nextSafeAction}</small>
        </li>
      </ul>
    </section>
  );
}
