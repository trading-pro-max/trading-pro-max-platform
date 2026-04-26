import type { NumberOneDestinySnapshot } from "@/lib/server/number-one-destiny";

export default function AlkonNumberOneDestinyPanel({
  snapshot,
}: {
  snapshot: NumberOneDestinySnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-number-one-destiny-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Number One Destiny Alignment"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Number One Destiny Alignment</span>
        <h2>Internal standard, public claim blocked</h2>
        <p>
          Private quality system for making Pro Max worthy of world-class trust,
          clarity, safety, usability, legal readiness, sustainability, and
          Founder vision without making public number-one claims.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public claim</span>
          <strong>{snapshot.publicClaimStatus}</strong>
          <small>No public number-one claim</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Prime World</span>
          <strong>{snapshot.primeWorld}</strong>
          <small>{snapshot.currentStationStatus}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>Founder/private only</small>
        </div>
      </div>
    </section>
  );
}
