import type { FounderBuildRoomSnapshot } from "../types";

type FounderBuildNextActionsPanelProps = {
  snapshot: FounderBuildRoomSnapshot;
};

export default function FounderBuildNextActionsPanel({
  snapshot,
}: FounderBuildNextActionsPanelProps) {
  return (
    <section className="tpm-founder-local-panel tpm-founder-local-panel-wide">
      <header>
        <span>Next build actions</span>
        <h3>Safe manual construction loop</h3>
      </header>
      <div className="tpm-founder-local-split-list">
        <div>
          <h4>Safe next actions</h4>
          <ul>
            {snapshot.nextSafeBuildActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>What not to do</h4>
          <ul>
            {snapshot.whatNotToDo.slice(0, 8).map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
