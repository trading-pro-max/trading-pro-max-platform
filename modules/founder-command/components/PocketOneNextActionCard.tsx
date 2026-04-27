import type { AlkonPocketUniverseSnapshot } from "@/lib/server/devices";
import { formatAlkonStatusLabel } from "@/lib/server/alkon-chat";

export default function PocketOneNextActionCard({
  snapshot,
}: {
  snapshot: AlkonPocketUniverseSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-pocket-card" data-pocket-card="one-next-action">
      <span>One Next Action</span>
      <h3>{snapshot.oneNextAction}</h3>
      <p>{snapshot.wakeReport.next}</p>
      <div className="alkon-pocket-decision-options" aria-label="Safe decision options">
        {snapshot.decisionOptions.map((option) => (
          <span key={option}>{formatAlkonStatusLabel(option)}</span>
        ))}
      </div>
    </section>
  );
}
