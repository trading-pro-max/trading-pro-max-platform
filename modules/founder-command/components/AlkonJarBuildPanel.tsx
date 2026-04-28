import type { JarBuildSnapshot } from "@/lib/server/jar-build";

export default function AlkonJarBuildPanel({
  snapshot,
}: {
  snapshot: JarBuildSnapshot;
}) {
  const topJars = snapshot.registry.slice(0, 10);

  return (
    <section
      className="tpm-founder-panel alkon-jar-build-panel"
      data-founder-private="true"
      data-jar-build-system="zero-ground"
      data-no-execution={String(snapshot.noExecution)}
      aria-label="Alkon Jar Build System"
    >
      <div className="tpm-founder-panel-head">
        <span>Jar Build System</span>
        <h2>Every future action enters the Jar before execution</h2>
        <p>
          Jar filters ideas, bugs, rejections, cleanup candidates, future worlds,
          Codex results, desktop sorting issues, and Founder instructions before
          Reality Trial, exit permit, and Command Passport drafting.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>Active with notes</strong>
          <small>Private, read-only, preview-only</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Jars</span>
          <strong>{snapshot.registry.length}</strong>
          <small>Jar 0 through Jar 9</small>
        </div>
        <div className="tpm-founder-metric">
          <span>One Next Jar Action</span>
          <strong>{snapshot.oneNextAction.decision.replaceAll("_", " ")}</strong>
          <small>{snapshot.oneNextAction.title}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Exit Permit</span>
          <strong>{snapshot.commandPassportPreview.status.replaceAll("_", " ")}</strong>
          <small>Required before Command Passport</small>
        </div>
      </div>

      <div className="alkon-command-grid alkon-jar-grid">
        <article className="tpm-founder-card">
          <span>Jar Registry</span>
          <ul>
            {topJars.map((jar) => (
              <li key={jar.id}>
                <strong>{jar.name}</strong>
                <small>{jar.purpose}</small>
              </li>
            ))}
          </ul>
        </article>

        <article className="tpm-founder-card">
          <span>Priorities</span>
          <ul>
            {snapshot.priorities.slice(0, 5).map((item) => (
              <li key={item.id}>
                <strong>{item.title}</strong>
                <small>{item.reason}</small>
              </li>
            ))}
          </ul>
        </article>

        <article
          className="tpm-founder-card alkon-jar-command-passport-panel"
          data-jar-command-passport-preview="true"
        >
          <span>Command Passport Bridge</span>
          <h3>{snapshot.commandPassportPreview.mission}</h3>
          <p>
            Status: {snapshot.commandPassportPreview.status.replaceAll("_", " ")}.
            This is a preview only and cannot execute.
          </p>
          <small>{snapshot.commandPassportPreview.ownershipLayer}</small>
        </article>
      </div>
    </section>
  );
}
