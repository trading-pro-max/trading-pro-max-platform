import type { AlkonPocketUniverseSnapshot } from "@/lib/server/devices";

export default function PocketWakeReportCard({
  snapshot,
}: {
  snapshot: AlkonPocketUniverseSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-pocket-card" data-pocket-card="wake-report">
      <span>Wake Report</span>
      <h3>{snapshot.wakeReport.status}</h3>
      <dl className="alkon-command-facts">
        <div>
          <dt>Mission</dt>
          <dd>{snapshot.wakeReport.mission}</dd>
        </div>
        <div>
          <dt>Done</dt>
          <dd>{snapshot.wakeReport.done}</dd>
        </div>
        <div>
          <dt>Not done</dt>
          <dd>{snapshot.wakeReport.notDone}</dd>
        </div>
      </dl>
    </section>
  );
}

