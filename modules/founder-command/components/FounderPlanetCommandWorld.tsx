import { getFounderCommandAppSnapshot } from "@/lib/server/founder-command";
import { getInvisibleOperatingLayerSnapshot } from "@/lib/server/invisible-operating-layer";
import { getLocalLivingDayLoopSnapshot } from "@/lib/server/local-ops";
import LivingEarthBackground from "@/modules/brand/components/LivingEarthBackground";
import ProductLogo from "@/modules/brand/components/ProductLogo";

export default function FounderPlanetCommandWorld({
  checkedAt,
}: {
  checkedAt: string;
}) {
  const app = getFounderCommandAppSnapshot(checkedAt);
  const invisibleLayer = getInvisibleOperatingLayerSnapshot(checkedAt);
  const localLoop = getLocalLivingDayLoopSnapshot(checkedAt);
  const realmExperience = app.insideOutsidePlanet.planRealmFunctionalExperience;

  return (
    <section
      className="tpm-founder-panel tpm-founder-planet-command-world"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-read-only="true"
    >
      <LivingEarthBackground surface="founder_command" plan="founder" state="local_only" />
      <div className="tpm-founder-panel-head">
        <span>Founder Lives Inside The Planet</span>
        <h2>Private command world connected to the public platform world</h2>
        <p>
          This private living room shows public readiness, Founder command
          readiness, invisible operating intelligence, construction governance,
          memory, and the next safe build path without activating anything.
        </p>
      </div>

      <div className="tpm-founder-living-room-grid">
        <div className="tpm-founder-living-room-brand">
          <ProductLogo
            animated
            motionIntensity="command"
            plan="founder"
            state="local_only"
            surface="founder_command"
            subtitle="Private Alkon / الكون Command"
            variant="command"
          />
        </div>
        <div className="tpm-founder-metrics">
          <div className="tpm-founder-metric">
            <span>Public world</span>
            <strong>{app.planetOverview.status}</strong>
            <small>Complete platform surface, no private language</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Private world</span>
            <strong>{app.access.ownerOnly ? "owner-only" : "blocked"}</strong>
            <small>Public navigation visible: {String(app.access.publicNavigationVisible)}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Invisible layer</span>
            <strong>{invisibleLayer.systems.length}</strong>
            <small>{invisibleLayer.hiddenFromPublic.length} hidden from public</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Local loop</span>
            <strong>{localLoop.loop.length}</strong>
            <small>{localLoop.today.nextSafeAction}</small>
          </div>
          <div className="tpm-founder-metric">
            <span>Alkon / الكون</span>
            <strong>{app.insideOutsidePlanet.privateWorld.alkonUniverse.activationState}</strong>
            <small>Private Founder-only command universe; public plan access false</small>
          </div>
        </div>
      </div>

      <div className="tpm-founder-living-room-grid" data-owner-only="true">
        {realmExperience.publicRealms.map((realm) => (
          <article key={realm.realmId} className="tpm-founder-metric">
            <span>{realm.publicPlanName}</span>
            <strong>{realm.activationState}</strong>
            <small>
              {realm.workspaceBehavior} {realm.reportsDepth}
            </small>
          </article>
        ))}
      </div>

      <div className="tpm-founder-briefing-grid" data-owner-only="true">
        <article>
          <h3>Realm gaps</h3>
          <ul>
            {realmExperience.realmGaps.map((gap) => (
              <li key={gap}>{gap}</li>
            ))}
          </ul>
        </article>
        <article>
          <h3>Next safe actions</h3>
          <ul>
            {realmExperience.nextSafeActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
