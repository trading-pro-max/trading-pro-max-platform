import type { MediaIntelligenceSnapshot } from "@/lib/server/media-intelligence";

export default function AlkonMediaRealityPanel({
  snapshot,
}: {
  snapshot: MediaIntelligenceSnapshot;
}) {
  return (
    <section className="tpm-founder-subpanel alkon-media-reality-panel">
      <span>Media Reality</span>
      <h3>Reality communication and claims firewall</h3>
      <p>
        Media intelligence translates Product Truth into draft/review-only
        communication. Publishing, social tokens, external calls, ad spend, fake
        metrics, and unsafe claims remain inactive.
      </p>
      <div className="alkon-command-facts">
        <div>
          <dt>Publishing</dt>
          <dd>{snapshot.publishingGate}</dd>
        </div>
        <div>
          <dt>Claims firewall</dt>
          <dd>{String(snapshot.claimsFirewall.ready)}</dd>
        </div>
        <div>
          <dt>Social tokens</dt>
          <dd>{String(snapshot.channelReality.tokensPresent)}</dd>
        </div>
        <div>
          <dt>Ad spend</dt>
          <dd>{snapshot.mediaEconomy}</dd>
        </div>
      </div>
    </section>
  );
}
