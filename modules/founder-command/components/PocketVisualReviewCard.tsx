import type { AlkonPocketUniverseSnapshot } from "@/lib/server/devices";

export default function PocketVisualReviewCard({
  snapshot,
}: {
  snapshot: AlkonPocketUniverseSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-pocket-card" data-pocket-card="visual-review">
      <span>Visual Review</span>
      <h3>{snapshot.visualAcceptance}</h3>
      <div className="tpm-founder-metrics alkon-pocket-status-grid">
        <div className="tpm-founder-metric">
          <span>Station</span>
          <strong>{snapshot.station}</strong>
          <small>{snapshot.localDayOne}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Heart</span>
          <strong>Preserved</strong>
          <small>{snapshot.heartStatus}</small>
        </div>
      </div>
    </section>
  );
}

