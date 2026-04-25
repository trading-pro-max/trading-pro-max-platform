import type { FounderCommandRoomFoundationSnapshot } from "@/lib/server/founder-command";
import { toneFromCommandState } from "../types";

type FounderMinistryGridProps = {
  ministries: FounderCommandRoomFoundationSnapshot["ministries"];
};

export default function FounderMinistryGrid({ ministries }: FounderMinistryGridProps) {
  return (
    <section className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Ministry Reporting</span>
        <h2>40 ministry reports</h2>
        <p>
          Compact command cards for state, risk, blockers, automation level,
          Founder decision needs, and Presidency coordination readiness.
        </p>
      </div>

      <div className="tpm-founder-ministry-grid">
        {ministries.map((ministry) => {
          const tone = toneFromCommandState(
            ministry.automationLevel,
            ministry.riskLevel
          );

          return (
            <article
              className="tpm-founder-ministry-card"
              data-tone={tone}
              key={ministry.ministryId}
            >
              <div className="tpm-founder-ministry-card-head">
                <div>
                  <span>{ministry.leaderTitle}</span>
                  <h3>{ministry.ministryName}</h3>
                </div>
                <strong>{ministry.status}</strong>
              </div>

              <dl>
                <div>
                  <dt>Risk</dt>
                  <dd>{ministry.riskLevel}</dd>
                </div>
                <div>
                  <dt>Automation</dt>
                  <dd>{ministry.automationLevel}</dd>
                </div>
                <div>
                  <dt>Blockers</dt>
                  <dd>{ministry.blockerCount}</dd>
                </div>
                <div>
                  <dt>Founder</dt>
                  <dd>{ministry.founderDecisionNeeded ? "decision" : "observe"}</dd>
                </div>
                <div>
                  <dt>Coordination</dt>
                  <dd>{ministry.coordinationLoad}</dd>
                </div>
                <div>
                  <dt>Reviews</dt>
                  <dd>{ministry.pendingReviewBlueprintCount}</dd>
                </div>
              </dl>

              <p>{ministry.compactNextAction}</p>
              <p>{ministry.nextCoordinationAction}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
