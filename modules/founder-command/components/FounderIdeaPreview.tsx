type FounderIdeaPreviewPayload = {
  event: {
    type: string;
    title: string;
    summary: string;
    riskLevel: string;
    severity: string;
    status: string;
    affectedWorld: string;
    affectedSurface: string;
    requiredReviews: string[];
    suggestedNextAction: string;
  };
  ownerRoute: {
    ownerArea: string;
    supportingAreas: string[];
    requiredReviews: string[];
    recommendedQueue: string;
    escalationTarget: string;
    publicVisible: boolean;
  };
  policyEvaluation: {
    overallDecision: string;
    autonomyLevel: string;
    hardBlocks: string[];
  };
  permitPreview: {
    workerLevel: string;
    permitted: boolean;
    permitState: string;
    blockedActions: string[];
  };
  blockedReason: string | null;
  nextSafeAction: string;
};

export default function FounderIdeaPreview({
  preview,
}: {
  preview: FounderIdeaPreviewPayload;
}) {
  return (
    <article className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Classification Preview</span>
        <h3>{preview.event.title}</h3>
        <p>{preview.event.summary}</p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Event</span>
          <strong>{preview.event.type}</strong>
          <small>{preview.event.status}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Risk</span>
          <strong>{preview.event.riskLevel}</strong>
          <small>{preview.event.severity}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Owner</span>
          <strong>{preview.ownerRoute.ownerArea}</strong>
          <small>{preview.ownerRoute.recommendedQueue}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Gate</span>
          <strong>{preview.policyEvaluation.overallDecision}</strong>
          <small>{preview.policyEvaluation.autonomyLevel}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Permit</span>
          <strong>{preview.permitPreview.permitState}</strong>
          <small>{preview.permitPreview.workerLevel}</small>
        </div>
      </div>

      <div className="tpm-founder-briefing-grid">
        <article>
          <h4>Required reviews</h4>
          <ul>
            {preview.ownerRoute.requiredReviews.map((review) => (
              <li key={review}>{review}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Supporting areas</h4>
          <ul>
            {preview.ownerRoute.supportingAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Permit decision</h4>
          <p>
            {preview.permitPreview.permitted
              ? "Permitted for the displayed worker level only."
              : "Not permitted; keep this in Founder review or blocked readiness."}
          </p>
        </article>
        <article>
          <h4>Blocked reason</h4>
          <p>{preview.blockedReason ?? "Not blocked; still review before action."}</p>
        </article>
        <article>
          <h4>Next safe action</h4>
          <p>{preview.nextSafeAction}</p>
        </article>
      </div>
    </article>
  );
}
