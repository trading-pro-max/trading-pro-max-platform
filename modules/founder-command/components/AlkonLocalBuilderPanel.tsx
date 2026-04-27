import type { getLocalBuilderReadinessSnapshot } from "@/lib/server/local-builder";

type LocalBuilderSnapshot = ReturnType<typeof getLocalBuilderReadinessSnapshot>;

export default function AlkonLocalBuilderPanel({
  snapshot,
}: {
  snapshot: LocalBuilderSnapshot;
}) {
  return (
    <section
      className="tpm-founder-panel alkon-local-builder-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      data-web-shell-execution="false"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Local Builder</span>
        <h2>Terminal-only fallback for Codex quota exhaustion</h2>
        <p>{snapshot.nextSafeAction}</p>
      </div>
      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Status</span>
          <strong>{snapshot.status}</strong>
          <small>read-only default</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Scripts</span>
          <strong>{snapshot.scripts.length}</strong>
          <small>{snapshot.scripts.slice(0, 3).join(" / ")}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Web shell</span>
          <strong>{String(snapshot.webAppCanExecuteShell)}</strong>
          <small>No web execution</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Codex</span>
          <strong>{String(snapshot.webAppCanRunCodex)}</strong>
          <small>Manual only outside app</small>
        </div>
      </div>
      <ul className="alkon-device-list">
        {snapshot.blocked.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

