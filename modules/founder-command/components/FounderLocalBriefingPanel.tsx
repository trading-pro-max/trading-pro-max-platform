import type { FounderLocalCommandSnapshot } from "../types";

type FounderLocalBriefingPanelProps = {
  snapshot: FounderLocalCommandSnapshot;
};

export default function FounderLocalBriefingPanel({
  snapshot,
}: FounderLocalBriefingPanelProps) {
  const briefingItems = [
    ...snapshot.dailyBriefing.priority.slice(0, 3),
    ...snapshot.dailyBriefing.risks.slice(0, 2),
  ];

  return (
    <section className="tpm-founder-local-panel tpm-founder-local-panel-wide">
      <header>
        <span>Daily briefing</span>
        <h3>Local command status</h3>
      </header>
      <ul>
        {briefingItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="tpm-founder-local-mini-grid">
        <div>
          <span>Mode</span>
          <strong>{snapshot.localCommandStatus.state.replaceAll("_", " ")}</strong>
        </div>
        <div>
          <span>Approval execution</span>
          <strong>
            {snapshot.localCommandStatus.approvalExecutionActive ? "active" : "disabled"}
          </strong>
        </div>
        <div>
          <span>Public route</span>
          <strong>
            {snapshot.localCommandStatus.publicRouteExposed ? "exposed" : "hidden"}
          </strong>
        </div>
      </div>
    </section>
  );
}
