import { getAlkonPocketUniverseSnapshot } from "@/lib/server/devices";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";
import PocketBlockedActionsCard from "@/modules/founder-command/components/PocketBlockedActionsCard";
import PocketDeviceRoleCard from "@/modules/founder-command/components/PocketDeviceRoleCard";
import PocketOneNextActionCard from "@/modules/founder-command/components/PocketOneNextActionCard";
import PocketVisualReviewCard from "@/modules/founder-command/components/PocketVisualReviewCard";
import PocketWakeReportCard from "@/modules/founder-command/components/PocketWakeReportCard";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function FounderPocketPage() {
  const snapshot = getAlkonPocketUniverseSnapshot();

  return (
    <PrivateFounderShell checkedAt={snapshot.checkedAt}>
      <main
        className="tpm-founder-command-room alkon-private-route alkon-pocket-page"
        data-owner-only="true"
        data-public-route-exposed="false"
        data-read-only="true"
        data-no-shell="true"
        data-no-payments="true"
        aria-label="Alkon Pocket"
      >
        <header className="tpm-founder-hero alkon-pocket-hero">
          <div>
            <span>Alkon Pocket</span>
            <h1>Ahmad Pocket Decision</h1>
            <p>
              Private Founder-only bridge into Alkon / الكون for Wake Report,
              One Next Action, Visual Review, Local Day One Gate, and focused
              correction intent. This is not public Pro Max, not marketing, and
              not an execution surface.
            </p>
            <div className="alkon-pocket-command-strip" aria-label="Private Alkon pocket prompts">
              <span>Status</span>
              <span>One Next Action</span>
              <span>Wake Report</span>
              <span>Visual Review</span>
              <span>What not to do</span>
              <span>Ask Alkon</span>
            </div>
            <Link className="alkon-private-entry-link" href="/founder/alkon">
              Open Ask Alkon
            </Link>
          </div>
          <div className="tpm-founder-access-card">
            <span>Private Founder-only</span>
            <strong>Not started</strong>
            <small>Local Day One Gate: Ahmad visual acceptance needed</small>
          </div>
        </header>

        <section className="alkon-pocket-grid" data-pocket-section="core">
          <PocketWakeReportCard snapshot={snapshot} />
          <PocketOneNextActionCard snapshot={snapshot} />
          <PocketVisualReviewCard snapshot={snapshot} />
          <PocketBlockedActionsCard snapshot={snapshot} />
        </section>

        <section className="tpm-founder-panel alkon-pocket-devices" data-pocket-section="devices">
          <div className="tpm-founder-panel-head">
            <span>Device Constellation</span>
            <h2>Windows builds; phones review only</h2>
            <p>
              Windows is the local command and build center. iPhone and Samsung are pocket
              and Android reality review centers. Phones cannot execute shell, Codex, secrets,
              payments, launch, live trading, billing, broker/feed, or real money.
            </p>
          </div>
          <div className="alkon-pocket-grid alkon-pocket-device-grid">
            {snapshot.deviceRoles.map((device) => (
              <PocketDeviceRoleCard key={device.deviceId} device={device} />
            ))}
          </div>
        </section>
      </main>
    </PrivateFounderShell>
  );
}
