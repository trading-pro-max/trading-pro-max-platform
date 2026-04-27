import { getAlkonPocketUniverseSnapshot } from "@/lib/server/devices";
import PrivateFounderShell from "@/modules/shell/components/PrivateFounderShell";
import PocketBlockedActionsCard from "@/modules/founder-command/components/PocketBlockedActionsCard";
import PocketDeviceRoleCard from "@/modules/founder-command/components/PocketDeviceRoleCard";
import PocketOneNextActionCard from "@/modules/founder-command/components/PocketOneNextActionCard";
import PocketVisualReviewCard from "@/modules/founder-command/components/PocketVisualReviewCard";
import PocketWakeReportCard from "@/modules/founder-command/components/PocketWakeReportCard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function FounderPocketPage() {
  const snapshot = getAlkonPocketUniverseSnapshot();

  return (
    <PrivateFounderShell checkedAt={snapshot.checkedAt}>
      <main
        className="tpm-founder-command-room alkon-pocket-page"
        data-owner-only="true"
        data-public-route-exposed="false"
        data-read-only="true"
        data-no-shell="true"
        data-no-payments="true"
        aria-label="Alkon Pocket Universe"
      >
        <header className="tpm-founder-hero alkon-pocket-hero">
          <div>
            <span>Alkon Pocket Universe</span>
            <h1>Pocket Decision Center</h1>
            <p>
              Founder-only mobile review for Wake Report, One Next Action, visual acceptance
              intent, focused correction, and blocked-action truth. It is read-only and
              cannot execute shell, Codex, payments, live trading, billing, broker/feed, or real money.
            </p>
          </div>
          <div className="tpm-founder-access-card">
            <span>Local Day One</span>
            <strong>{snapshot.localDayOne}</strong>
            <small>{snapshot.visualAcceptance}</small>
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

