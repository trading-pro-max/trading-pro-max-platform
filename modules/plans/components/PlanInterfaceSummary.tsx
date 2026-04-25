import {
  getPlanInterfaceLayer,
  getUserFacingPlanInterfaceLayers,
} from "@/lib/plans/interface-architecture";
import { getPlanVisualIdentity } from "@/lib/plans/visual-identity";

type PlanInterfaceSummaryProps = {
  compact?: boolean;
  currentLayer?: "demo_free" | "pro" | "vip" | "enterprise";
};

export default function PlanInterfaceSummary({
  compact = false,
  currentLayer = "demo_free",
}: PlanInterfaceSummaryProps) {
  const founderLayer = getPlanInterfaceLayer("founder_king");
  const layers = getUserFacingPlanInterfaceLayers();

  return (
    <div className="tpm-plan-interface-summary" aria-label="Plan-based interface architecture">
      <div className="tpm-plan-interface-grid">
        {layers.map((layer) => {
          const identity = getPlanVisualIdentity(layer.visualIdentity);
          const active = layer.id === currentLayer;

          return (
            <article
              key={layer.id}
              className={`tpm-plan-interface-card ${identity.className}`}
              data-current={active}
              data-status={layer.status}
            >
              <header>
                <span className={identity.badgeClassName}>{identity.shortLabel}</span>
                <strong>{layer.label}</strong>
                <em>{layer.status.replaceAll("_", " ")}</em>
              </header>
              <h3>{layer.headline}</h3>
              <p>{layer.experience}</p>
              {!compact ? (
                <div className="tpm-plan-interface-list">
                  {layer.primarySurfaces.slice(0, 4).map((surface) => (
                    <small key={surface}>{surface}</small>
                  ))}
                </div>
              ) : null}
              <footer>{layer.safeCopy}</footer>
            </article>
          );
        })}
      </div>

      <aside className="tpm-plan-interface-founder-boundary">
        <strong>{founderLayer.headline}</strong>
        <p>
          Restricted controls stay separate from user plans. They are not a Pro, VIP,
          Institutional, or upgrade surface, and they stay hidden from public navigation.
        </p>
      </aside>
    </div>
  );
}
