import type { AlkonSovereignCommandInterfaceSnapshot } from "@/lib/server/alkon-chat";
import { getLivingEarthRuntimeState } from "@/lib/brand/living-earth";
import { getAlkonTodayOperationSnapshot } from "@/lib/server/alkon-daily-operation";
import { getRealityConversionSnapshot } from "@/lib/server/reality-conversion";
import type { JarBuildSnapshot } from "@/lib/server/jar-build";
import AlkonChatPanel from "./AlkonChatPanel";
import AlkonCommandPassportDraftPanel from "./AlkonCommandPassportDraftPanel";
import AlkonEvidenceRail from "./AlkonEvidenceRail";
import AlkonJarBuildPanel from "./AlkonJarBuildPanel";
import AlkonKernelStatusRail from "./AlkonKernelStatusRail";
import AlkonLivingEarthRuntimePanel from "./AlkonLivingEarthRuntimePanel";
import AlkonRealityConversionPanel from "./AlkonRealityConversionPanel";
import AlkonTodayOperatingPanel from "./AlkonTodayOperatingPanel";
import AlkonWhatNotToDoPanel from "./AlkonWhatNotToDoPanel";

export default function AlkonSovereignChatInterface({
  jarSnapshot,
  snapshot,
}: {
  jarSnapshot?: JarBuildSnapshot;
  snapshot: AlkonSovereignCommandInterfaceSnapshot;
}) {
  const passport = snapshot.commandPassportResponse.commandPassportDraft;
  const livingEarthRuntime = getLivingEarthRuntimeState(snapshot.context.checkedAt);
  const realityConversion = getRealityConversionSnapshot(snapshot.context.checkedAt);
  const todayOperation = getAlkonTodayOperationSnapshot(snapshot.context.checkedAt);

  return (
    <main
      className="tpm-founder-command-room alkon-private-route alkon-sovereign-command-interface"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
      data-no-public-nav="true"
      data-local-day-one={snapshot.context.localDayOneStatus}
      aria-label="Alkon private command interface"
    >
      <header className="alkon-sovereign-command-hero">
        <div className="alkon-command-identity">
          <span className="alkon-private-hero-mark" aria-hidden="true">
            A
          </span>
          <div>
            <span>Alkon / الكون</span>
            <h1>Alkon -0 Private Origin Command Universe</h1>
            <p>
              Private Operating Universe for Ahmad: Kernel 0-16, Zero Truth,
              Reality Trial, Evidence Chain, Memory, Jar Build System, Daily
              Operating Loop, Wake Report, One Next Action, and Local Day One gates.
            </p>
          </div>
        </div>
        <div className="alkon-command-gate-strip" data-proof-section="local-day-one-not-started">
          <div>
            <span>Alkon Operating Mode</span>
            <strong>{snapshot.context.currentStatusLabel}</strong>
          </div>
          <div>
            <span>Founder-only</span>
            <strong>Ahmad final authority</strong>
          </div>
          <div>
            <span>Local Day One Gate</span>
            <strong>{snapshot.context.localDayOneStatusLabel}</strong>
          </div>
          <div>
            <span>Visual Gate</span>
            <strong>{snapshot.context.visualAcceptanceLabel}</strong>
          </div>
        </div>
      </header>

      <section className="alkon-command-layout">
        <AlkonKernelStatusRail context={snapshot.context} />
        <AlkonChatPanel snapshot={snapshot} />
        <div className="alkon-command-right-rail">
          <AlkonEvidenceRail context={snapshot.context} />
          <AlkonWhatNotToDoPanel context={snapshot.context} />
        </div>
      </section>

      <section className="alkon-command-lower-panel" aria-label="Builder and device readiness">
        <AlkonTodayOperatingPanel snapshot={todayOperation} />
        {passport ? <AlkonCommandPassportDraftPanel draft={passport} /> : null}
        {jarSnapshot ? <AlkonJarBuildPanel snapshot={jarSnapshot} /> : null}
        <AlkonRealityConversionPanel snapshot={realityConversion} />
        <AlkonLivingEarthRuntimePanel state={livingEarthRuntime} />
        <section className="alkon-builder-device-panel" aria-label="Builder and device constellation">
          <div className="alkon-rail-head">
            <span>Builder Selection / Device Constellation</span>
            <h2>Codex builds only from governed passports</h2>
            <p>
              Windows remains Command + Build Center. iPhone and Samsung stay review-only
              reality centers with no shell, Codex, payment, live, billing, broker/feed, or
              real-money capability.
            </p>
          </div>
          <dl className="alkon-command-facts">
            <div>
              <dt>Windows</dt>
              <dd>{snapshot.context.deviceSummary.windows}</dd>
            </div>
            <div>
              <dt>iPhone</dt>
              <dd>{snapshot.context.deviceSummary.iphone}</dd>
            </div>
            <div>
              <dt>Samsung</dt>
              <dd>{snapshot.context.deviceSummary.samsung}</dd>
            </div>
            <div>
              <dt>Builder law</dt>
              <dd>Codex is a builder, not the leader.</dd>
            </div>
          </dl>
        </section>
      </section>
    </main>
  );
}
