import type { AlkonGenesisSnapshot } from "@/lib/server/alkon-genesis";

export default function AlkonGenesisPanel({
  snapshot,
}: {
  snapshot: AlkonGenesisSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-genesis-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Sovereign Genesis readiness"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / Sovereign Genesis</span>
        <h2>Future worlds stay seeds until every gate is proven</h2>
        <p>
          Private governance for evaluating possible future product worlds.
          Pro Max Trading remains the Prime World under the Pro Max mother brand. Genesis can evaluate,
          delay, reject, or permit prototype-readiness only; it does not create
          a new product, public page, launch, billing, broker/feed, live
          execution, real-money path, or social publishing.
        </p>
      </div>
      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.readiness}</strong>
          <small>{snapshot.visibility}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>World seeds</span>
          <strong>{snapshot.worldSeedCount}</strong>
          <small>private candidates only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Founder decisions</span>
          <strong>{snapshot.founderApprovalNeeded.length}</strong>
          <small>birth requires Ahmad</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>no public future worlds</small>
        </div>
      </div>
    </section>
  );
}
