import type { FounderBuildRoomSnapshot } from "../types";

type FounderCodexDraftPanelProps = {
  snapshot: FounderBuildRoomSnapshot;
};

export default function FounderCodexDraftPanel({
  snapshot,
}: FounderCodexDraftPanelProps) {
  return (
    <section className="tpm-founder-local-panel tpm-founder-local-panel-wide">
      <header>
        <span>Codex drafts</span>
        <h3>Manual build commands</h3>
      </header>
      <div className="tpm-founder-local-validation-list">
        {snapshot.codexTaskDrafts.slice(0, 8).map((draft) => (
          <div key={draft.taskId}>
            <span>{draft.title}</span>
            <strong>{draft.autonomyLevel.replaceAll("_", " ")}</strong>
          </div>
        ))}
      </div>
      <p>
        Drafts include scope, likely files, forbidden scope, validation commands,
        final response format, and Product Truth preservation. They are not sent
        to Codex automatically.
      </p>
    </section>
  );
}
