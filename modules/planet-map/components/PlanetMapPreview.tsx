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
      aria-label={founder ? "Restricted controls map preview" : "Workspace access map preview"}
    >
      <header>
        <TPMEarthMark
          motionIntensity={founder ? "medium" : "none"}
          state={founder ? "local_only" : "paper_safe"}
          surface={founder ? "founder_command" : "settings"}
          variant={founder ? "command" : "compact"}
        />
        <div>
          <span>{founder ? "Restricted controls map" : "Workspace access layer"}</span>
          <h2>{founder ? "Restricted readiness visualization" : "Paper-safe workspace view"}</h2>
          <p>
            {founder
              ? "Restricted readiness view of protected areas, resources, risks, and approvals."
              : "A simplified plan layer showing only user-safe product areas without restricted control data."}
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

      <PlanetContinentStatusGrid showInternal={founder} />
      {founder ? <PlanetResourceLayerSummary /> : null}

      <footer>
        <span>No fake users</span>
        <span>No fake revenue</span>
        <span>No live activity claim</span>
      </footer>
    </section>
  );
}
