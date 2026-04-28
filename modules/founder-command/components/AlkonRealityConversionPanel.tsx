import type { RealityConversionSnapshot } from "@/lib/server/reality-conversion";

export default function AlkonRealityConversionPanel({
  snapshot,
}: {
  snapshot: RealityConversionSnapshot;
}) {
  const firstPassport = snapshot.passports[0];
  const blockedResourceCount = snapshot.resources.filter((resource) => !resource.allowed).length;

  return (
    <section
      className="tpm-founder-panel alkon-reality-conversion-panel"
      data-founder-private="true"
      data-reality-conversion-system="active"
      data-no-execution={String(snapshot.noExecution)}
      data-public-route-exposed="false"
      aria-label="Alkon Reality Conversion System"
    >
      <div className="tpm-founder-panel-head">
        <span>Reality Conversion</span>
        <h2>Ideas become Reality Passports before action</h2>
        <p>
          Every valuable idea, rejection, bug, future world, or user reality signal
          must pass Jar, Reality Trial, evidence, and Ahmad gates before it can
          become a Command Passport or product change.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>Active with notes</strong>
          <small>Private, read-only, preview-only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Passports</span>
          <strong>{snapshot.passports.length}</strong>
          <small>Idea-to-reality previews</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Blocked resources</span>
          <strong>{blockedResourceCount}</strong>
          <small>No live, billing, real money, or public Alkon</small>
        </div>
        <div className="tpm-founder-metric">
          <span>One Next Reality Action</span>
          <strong>Ahmad review</strong>
          <small>{snapshot.oneNextRealityAction}</small>
        </div>
      </div>

      <div className="alkon-command-grid alkon-reality-conversion-grid">
        <article
          className="tpm-founder-card alkon-reality-passport-panel"
          data-reality-passport-preview="true"
        >
          <span>Reality Passport Preview</span>
          <h3>{firstPassport.title}</h3>
          <p>{firstPassport.purpose}</p>
          <small>
            Status: {firstPassport.status.replaceAll("_", " ")} / Jar:{" "}
            {firstPassport.jarId.replaceAll("_", " ")}
          </small>
        </article>

        <article className="tpm-founder-card">
          <span>First Reality Step</span>
          <h3>{snapshot.firstRealityStep}</h3>
          <p>{firstPassport.firstStep}</p>
        </article>

        <article className="tpm-founder-card">
          <span>Forbidden Conversion</span>
          <ul>
            {snapshot.blockedActions.slice(0, 6).map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
