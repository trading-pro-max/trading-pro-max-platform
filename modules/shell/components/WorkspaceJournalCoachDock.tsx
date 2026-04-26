type WorkspaceJournalCoachDockProps = {
  auditCount: number;
  historyCount: number;
  openTradesCount: number;
  sessionPnLText: string;
};

const COACH_PROMPTS = [
  "What did you observe?",
  "Why did the system wait?",
  "Decision note",
  "Session review readiness",
] as const;

export function WorkspaceJournalCoachDock({
  auditCount,
  historyCount,
  openTradesCount,
  sessionPnLText,
}: WorkspaceJournalCoachDockProps) {
  return (
    <section
      className="tpmv2-card tpm-workspace-journal-coach-dock"
      aria-label="Journal and Coach dock"
      data-journal-coach-priority="secondary"
    >
      <div className="tpm-workspace-journal-head">
        <div>
          <span>Journal / Coach</span>
          <strong>Secondary helper</strong>
        </div>
        <small>Paper practice reflection only</small>
      </div>

      <div className="tpm-workspace-journal-grid" aria-label="Session reflection">
        <div>
          <span>Open paper trades</span>
          <strong>{openTradesCount}</strong>
        </div>
        <div>
          <span>History</span>
          <strong>{historyCount}</strong>
        </div>
        <div>
          <span>Audit</span>
          <strong>{auditCount}</strong>
        </div>
        <div>
          <span>Session</span>
          <strong>{sessionPnLText}</strong>
        </div>
      </div>

      <div className="tpm-workspace-coach-prompts" aria-label="Coach prompts">
        {COACH_PROMPTS.map((prompt) => (
          <span key={prompt}>{prompt}</span>
        ))}
      </div>
    </section>
  );
}
