import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";
import FounderCommandDesktopShell from "./FounderCommandDesktopShell";
import FounderCommandMobileShell from "./FounderCommandMobileShell";

type FounderCommandAppShellProps = {
  checkedAt?: string;
};

export default function FounderCommandAppShell({
  checkedAt,
}: FounderCommandAppShellProps) {
  const snapshot = getFounderCommandAppSnapshot(checkedAt);

  return (
    <section
      className="tpm-founder-command-app-shell"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      aria-label="Founder King Command App shell foundation"
    >
      <header>
        <span>Founder King App Shell</span>
        <h2>Owner-only desktop and mobile command foundation</h2>
        <p>
          The shell aggregates planet status, ministry readiness, coordination,
          approvals, Guardian, Legal, Treasury, Media, AI Video, Engineering,
          Ops, and next safe actions without executing approvals or exposing a
          public route.
        </p>
      </header>

      <div className="tpm-founder-command-shell-status">
        <div>
          <span>Modules</span>
          <strong>{snapshot.moduleSummary.total}</strong>
          <small>{snapshot.moduleSummary.desktopModules} desktop zones</small>
        </div>
        <div>
          <span>Approvals</span>
          <strong>{snapshot.approvalCenter.items.length}</strong>
          <small>read-only readiness items</small>
        </div>
        <div>
          <span>Safety</span>
          <strong>{snapshot.safety.approvalExecutionActive ? "active" : "inactive"}</strong>
          <small>approval execution remains off</small>
        </div>
        <div>
          <span>Access</span>
          <strong>{snapshot.access.audience.replaceAll("_", " ")}</strong>
          <small>not a user-plan feature</small>
        </div>
      </div>

      <div className="tpm-founder-command-shell-layouts">
        <FounderCommandDesktopShell snapshot={snapshot} />
        <FounderCommandMobileShell snapshot={snapshot} />
      </div>
    </section>
  );
}
