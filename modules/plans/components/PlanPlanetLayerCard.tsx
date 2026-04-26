import type { PlanPlanetAccessLayer } from "@/lib/plans/types";
import { getPlanVisualIdentity } from "@/lib/plans/visual-identity";

type PlanPlanetLayerCardProps = {
  compact?: boolean;
  current?: boolean;
  layer: PlanPlanetAccessLayer;
};

function visualKey(layer: PlanPlanetAccessLayer) {
  return layer.visualIdentity === "guest" ? "guest" : layer.visualIdentity;
}

export default function PlanPlanetLayerCard({
  compact = false,
  current = false,
  layer,
}: PlanPlanetLayerCardProps) {
  const identity = getPlanVisualIdentity(visualKey(layer));

  return (
    <article
      className={`tpm-plan-planet-layer ${identity.className}`}
      data-current={current}
      data-plan-realm={layer.realmId}
      data-state={layer.state}
    >
      <header>
        <div>
          <span className={identity.badgeClassName}>{identity.shortLabel}</span>
          <h3>{layer.label}</h3>
        </div>
        <strong>{layer.state.replaceAll("_", " ")}</strong>
      </header>

      <p>{layer.activeLayer}</p>
      <p>{layer.workspaceBehavior}</p>

      <dl>
        <div>
          <dt>Assistant</dt>
          <dd>{layer.companionLevel}</dd>
        </div>
        <div>
          <dt>Journal / Coach</dt>
          <dd>{layer.journalCoachLevel}</dd>
        </div>
        {!compact ? (
          <>
            <div>
              <dt>Academy</dt>
              <dd>{layer.academyLevel}</dd>
            </div>
            <div>
              <dt>Community</dt>
              <dd>{layer.communityAccess}</dd>
            </div>
          </>
        ) : null}
      </dl>

      <div className="tpm-plan-layer-list">
        <span>Visible</span>
        {layer.visibleCities.slice(0, compact ? 3 : 5).map((city) => (
          <small key={city}>{city}</small>
        ))}
      </div>

      <footer>
        <small>{layer.upgradeExplanation}</small>
      </footer>
    </article>
  );
}
