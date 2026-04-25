import TPMEarthMark from "@/modules/brand/components/TPMEarthMark";
import PlanetContinentStatusGrid from "./PlanetContinentStatusGrid";
import PlanetResourceLayerSummary from "./PlanetResourceLayerSummary";

type PlanetMapPreviewProps = {
  audience?: "founder" | "citizen";
};

export default function PlanetMapPreview({ audience = "citizen" }: PlanetMapPreviewProps) {
  const founder = audience === "founder";

  return (
    <section
      className="tpm-planet-map-preview"
      data-audience={audience}
      aria-label={founder ? "Owner command map preview" : "Workspace access map preview"}
    >
      <header>
        <TPMEarthMark variant={founder ? "command" : "compact"} />
        <div>
          <span>{founder ? "Owner command map" : "Workspace access layer"}</span>
          <h2>{founder ? "Internal command visualization" : "Paper-safe workspace view"}</h2>
          <p>
            {founder
              ? "Owner-only readiness view of internal areas, resources, risks, and approvals."
              : "A simplified plan layer showing only user-safe product areas without internal command data."}
          </p>
        </div>
      </header>

      <div className="tpm-planet-map-core" aria-hidden="true">
        <div className="tpm-planet-map-globe">
          <span />
          <span />
          <span />
        </div>
        <div className="tpm-planet-map-orbit" />
      </div>

      <PlanetContinentStatusGrid />
      {founder ? <PlanetResourceLayerSummary /> : null}

      <footer>
        <span>No fake users</span>
        <span>No fake revenue</span>
        <span>No live activity claim</span>
      </footer>
    </section>
  );
}
