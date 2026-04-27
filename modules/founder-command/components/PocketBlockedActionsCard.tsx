import type { AlkonPocketUniverseSnapshot } from "@/lib/server/devices";

export default function PocketBlockedActionsCard({
  snapshot,
}: {
  snapshot: AlkonPocketUniverseSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-pocket-card" data-pocket-card="blocked-actions">
      <span>Blocked Actions</span>
      <h3>No dangerous actions exist here</h3>
      <ul className="alkon-device-list">
        {snapshot.whatNotToDo.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="alkon-pocket-block-strip">
        <span>no shell</span>
        <span>no Codex</span>
        <span>no payments</span>
        <span>no secrets</span>
        <span>no live trading</span>
      </div>
    </section>
  );
}

