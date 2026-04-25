import type { CitizenClassId, PlanPlanetAccessLayer } from "@/lib/plans/types";
import PlanPlanetLayerCard from "./PlanPlanetLayerCard";

type CitizenAccessMapProps = {
  currentClass: CitizenClassId;
  layers: PlanPlanetAccessLayer[];
};

export default function CitizenAccessMap({
  currentClass,
  layers,
}: CitizenAccessMapProps) {
  const userFacingLayers = layers.filter(
    (layer) => layer.citizenClass !== "staff_operator" && layer.citizenClass !== "founder_king"
  );
  const founderLayer = layers.find((layer) => layer.citizenClass === "founder_king");

  return (
    <div className="tpm-citizen-access-map" aria-label="Citizen planet access map">
      <div className="tpm-citizen-access-grid">
        {userFacingLayers.map((layer) => (
          <PlanPlanetLayerCard
            key={layer.citizenClass}
            compact
            current={layer.citizenClass === currentClass}
            layer={layer}
          />
        ))}
      </div>

      {founderLayer ? (
        <aside className="tpm-founder-access-boundary">
          <strong>{founderLayer.label}</strong>
          <p>
            Founder Command sees the full planet privately. It is owner-only,
            read-only by default, and never part of Free, Pro, VIP, or Enterprise plans.
          </p>
        </aside>
      ) : null}
    </div>
  );
}
