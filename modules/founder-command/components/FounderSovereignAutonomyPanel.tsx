import { getFounderSovereignAutonomyRoomSnapshot } from "@/lib/server/sovereign-autonomy";

export default function FounderSovereignAutonomyPanel({
  checkedAt,
}: {
  checkedAt?: string;
}) {
  const room = getFounderSovereignAutonomyRoomSnapshot(checkedAt);

  return (
    <section
      className="tpm-founder-panel"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Sovereign Autonomy operating room"
    >
      <div className="tpm-founder-panel-head">
        <span>Sovereign Autonomy</span>
        <h2>Operating civilization readiness</h2>
        <p>
          Founder-only intake, policy gates, task passports, Codex licenses,
          result tribunal, memory law, and next safe actions. This panel drafts
          and reports only; it does not execute approvals, Codex, shell commands,
          launch, billing, broker/feed, live trading, real money, or publishing.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Ideas</span>
          <strong>{room.incomingFounderIdeas.length}</strong>
          <small>Founder input converted into governed events</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Events</span>
          <strong>{room.eventQueueSummary.total}</strong>
          <small>
            {room.eventQueueSummary.blocked} blocked /{" "}
            {room.eventQueueSummary.waitingReview} waiting review
          </small>
        </div>
        <div className="tpm-founder-metric">
          <span>Passports</span>
          <strong>{room.taskPassportsReady.length}</strong>
          <small>{room.codexDraftsReady.length} draft modes ready</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Permits</span>
          <strong>{room.permitDecisions.filter((permit) => permit.permitted).length}</strong>
          <small>Manual/readiness only, no web app execution</small>
        </div>
      </div>

      <div className="tpm-founder-briefing-grid">
        <article>
          <h3>Incoming ideas</h3>
          <ul>
            {room.incomingFounderIdeas.slice(0, 4).map((idea) => (
              <li key={idea.ideaId}>{idea.title}: {idea.suspectedCategory}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Blocked events</h3>
          <ul>
            {room.blockedEvents.slice(0, 4).map((event) => (
              <li key={event.eventId}>{event.type}: {event.suggestedNextAction}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Waiting review</h3>
          <ul>
            {room.tasksWaitingReview.slice(0, 4).map((event) => (
              <li key={event.eventId}>{event.title}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Founder approval</h3>
          <ul>
            {room.tasksWaitingFounderApproval.slice(0, 4).map((event) => (
              <li key={event.eventId}>{event.title}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Tribunal</h3>
          <ul>
            {room.resultTribunalOutcomes.slice(0, 4).map((report) => (
              <li key={`${report.taskId}-${report.decision}`}>{report.decision}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Memory lessons</h3>
          <ul>
            {room.memoryLessons.slice(0, 4).map((lesson) => (
              <li key={lesson.lessonId}>{lesson.title}</li>
            ))}
          </ul>
        </article>
      </div>

      <div className="tpm-founder-access-card">
        <span>Next safe action</span>
        <strong>{room.nextSafeAction}</strong>
        <small>{room.publicPrivateBoundaryStatus}</small>
      </div>
    </section>
  );
}
