import type { AlkonChatContext } from "@/lib/server/alkon-chat";

export default function AlkonEvidenceRail({
  context,
}: {
  context: AlkonChatContext;
}) {
  return (
    <aside
      className="alkon-evidence-rail"
      data-proof-section="alkon-wake-evidence"
      aria-label="Wake Report and evidence"
    >
      <div className="alkon-rail-head">
        <span>Wake Report</span>
        <h2>Evidence decides closure</h2>
        <p>{context.latestWakeReportSummary}</p>
      </div>
      <div className="alkon-evidence-callout" data-proof-section="alkon-one-next-action">
        <span>One Next Action</span>
        <strong>{context.oneNextAction.action}</strong>
        <p>{context.oneNextAction.whyNow}</p>
      </div>
      <div className="alkon-evidence-callout">
        <span>Evidence Chain</span>
        <strong>{context.evidenceSummary}</strong>
        <p>{context.realityTrial.nextAction}</p>
      </div>
    </aside>
  );
}
