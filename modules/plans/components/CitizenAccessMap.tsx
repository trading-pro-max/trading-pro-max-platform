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
  return (
    <div className="tpm-citizen-access-map" aria-label="Plan access map">
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
    </div>
  );
}
