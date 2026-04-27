import type { AlkonKernelSnapshot } from "@/lib/server/alkon-kernel";

export default function AlkonFounderSourcePanel({
  snapshot,
}: {
  snapshot: AlkonKernelSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-founder-source"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Alkon Founder Source"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Rule -1</span>
        <h2>{snapshot.founderSource.role}</h2>
        <p>
          Ahmad is the real Founder Source. Alkon operates under Ahmad final
          sensitive authority and stores only safe operating preferences.
        </p>
      </div>
      <dl className="alkon-command-facts">
        <div>
          <dt>Name</dt>
          <dd>{snapshot.founderSource.name}</dd>
        </div>
        <div>
          <dt>Owns</dt>
          <dd>{snapshot.founderSource.owns}</dd>
        </div>
        <div>
          <dt>Public exposure</dt>
          <dd>{String(snapshot.founderSource.publicExposure)}</dd>
        </div>
        <div>
          <dt>Sensitive data in code</dt>
          <dd>{String(snapshot.digitalTwin.sensitiveDataStoredInCode)}</dd>
        </div>
      </dl>
    </section>
  );
}
