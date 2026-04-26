import { getAlkonUniverseSnapshot } from "@/lib/server/alkon";
import AlkonConstructionUniversePanel from "./AlkonConstructionUniversePanel";
import AlkonCosmicPhysicsPanel from "./AlkonCosmicPhysicsPanel";
import AlkonCosmicTaskGraphPanel from "./AlkonCosmicTaskGraphPanel";
import AlkonDefenseUniversePanel from "./AlkonDefenseUniversePanel";
import AlkonEarthCommandPanel from "./AlkonEarthCommandPanel";
import AlkonGravityOrbitPanel from "./AlkonGravityOrbitPanel";
import AlkonMemoryUniversePanel from "./AlkonMemoryUniversePanel";
import AlkonMoonCyclePanel from "./AlkonMoonCyclePanel";
import AlkonNextActionsPanel from "./AlkonNextActionsPanel";
import AlkonOrbitCommandPanel from "./AlkonOrbitCommandPanel";
import AlkonPlanetarySystemsPanel from "./AlkonPlanetarySystemsPanel";
import AlkonRiskBeltPanel from "./AlkonRiskBeltPanel";
import AlkonSolarCommandPanel from "./AlkonSolarCommandPanel";
import AlkonUniverseMap from "./AlkonUniverseMap";
import AlkonWorkersStationsPanel from "./AlkonWorkersStationsPanel";
import AlkonWorldInterfacePanel from "./AlkonWorldInterfacePanel";

export default function AlkonCommandUniverse({
  checkedAt,
}: {
  checkedAt?: string;
}) {
  const snapshot = getAlkonUniverseSnapshot(checkedAt);

  return (
    <section
      className="tpm-founder-panel alkon-command-universe"
      data-owner-only="true"
      data-public-route-exposed="false"
      data-user-plan-exposure="false"
      data-read-only="true"
      aria-label="Alkon private command universe"
    >
      <div className="tpm-founder-panel-head alkon-command-head">
        <span>Alkon / الكون</span>
        <h2>Private supreme command universe</h2>
        <p>
          Ahmad commands from Alkon while users remain on Earth inside Trading
          Pro Max. This surface is private, read-only, status-only, and never a
          public plan, public route, public navigation item, or user feature.
        </p>
      </div>

      <div className="tpm-founder-metrics alkon-command-metrics">
        <div className="tpm-founder-metric">
          <span>Visibility</span>
          <strong>{snapshot.visibility}</strong>
          <small>Founder-only command universe</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Public exposure</span>
          <strong>{String(snapshot.publicExposure)}</strong>
          <small>No public Alkon navigation or plan access</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Route decision</span>
          <strong>{String(snapshot.apiExposure.publicAlkonRoutesExposed)}</strong>
          <small>{snapshot.apiExposure.founderReadinessRoute}</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Truth</span>
          <strong>{snapshot.productTruthStatus.overall}</strong>
          <small>No live, money, billing, broker/feed, launch, or publishing</small>
        </div>
      </div>

      <AlkonUniverseMap snapshot={snapshot} />

      <div className="alkon-physics-grid">
        <AlkonCosmicPhysicsPanel snapshot={snapshot} />
        <AlkonGravityOrbitPanel snapshot={snapshot} />
        <AlkonCosmicTaskGraphPanel snapshot={snapshot} />
        <AlkonWorkersStationsPanel snapshot={snapshot} />
        <AlkonRiskBeltPanel snapshot={snapshot} />
      </div>

      <div className="alkon-command-grid">
        <AlkonEarthCommandPanel snapshot={snapshot} />
        <AlkonMoonCyclePanel snapshot={snapshot} />
        <AlkonOrbitCommandPanel snapshot={snapshot} />
        <AlkonSolarCommandPanel snapshot={snapshot} />
        <AlkonPlanetarySystemsPanel snapshot={snapshot} />
        <AlkonDefenseUniversePanel snapshot={snapshot} />
        <AlkonConstructionUniversePanel snapshot={snapshot} />
        <AlkonMemoryUniversePanel snapshot={snapshot} />
        <AlkonWorldInterfacePanel snapshot={snapshot} />
        <article className="tpm-founder-subpanel alkon-invisible-operating-layer">
          <span>{snapshot.invisibleOperatingLayer.name}</span>
          <h3>{snapshot.invisibleOperatingLayer.symbolicRole}</h3>
          <p>{snapshot.invisibleOperatingLayer.readiness}</p>
          <div className="alkon-command-tags">
            {snapshot.invisibleOperatingLayer.linkedSystems.map((system) => (
              <span key={system}>{system}</span>
            ))}
          </div>
          <p className="alkon-next-action">
            {snapshot.invisibleOperatingLayer.nextAction}
          </p>
        </article>
      </div>

      <AlkonNextActionsPanel snapshot={snapshot} />
    </section>
  );
}
