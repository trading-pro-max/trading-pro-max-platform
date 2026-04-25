import type { FounderCommandRoomFoundationSnapshot } from "@/lib/server/founder-command";

type FounderPlanetOverviewProps = {
  snapshot: FounderCommandRoomFoundationSnapshot;
};

function OverviewMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail: string;
}) {
  return (
    <div className="tpm-founder-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

export default function FounderPlanetOverview({
  snapshot,
}: FounderPlanetOverviewProps) {
  return (
    <section className="tpm-founder-panel tpm-founder-overview">
      <div className="tpm-founder-panel-head">
        <span>Planet Overview</span>
        <h2>Trading Pro Max from above</h2>
        <p>
          Private owner-only command foundation. Readiness, risk, truth, and
          next-safe-action data only.
        </p>
      </div>

      <div className="tpm-founder-metrics" aria-label="Founder planet structure">
        <OverviewMetric
          label="Planet status"
          value={snapshot.overview.planetStatus}
          detail="Readiness only, not launch state"
        />
        <OverviewMetric
          label="Active continents"
          value={snapshot.overview.activeContinents}
          detail={`${snapshot.overview.plannedOrFoundationContinents} foundation/planned`}
        />
        <OverviewMetric
          label="Ministries"
          value={snapshot.overview.ministryCount}
          detail="Deterministic reports"
        />
        <OverviewMetric
          label="Owner access"
          value="Private"
          detail={snapshot.access.ownerAuthState}
        />
        <OverviewMetric
          label="Coordination"
          value={snapshot.coordination.workflowCount}
          detail="Presidency workflows"
        />
      </div>

      <div className="tpm-founder-command-lists">
        <div>
          <h3>Product Truth</h3>
          <ul>
            {snapshot.overview.productTruthSummary.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>What Not To Do Now</h3>
          <ul>
            {snapshot.overview.whatNotToDoNow.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Next Safe Actions</h3>
          <ul>
            {snapshot.overview.nextSafeActions.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Do Not Approve</h3>
          <ul>
            {snapshot.coordination.whatNotToApprove.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
