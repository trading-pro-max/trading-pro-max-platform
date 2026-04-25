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
      aria-label="TPM Planet map preview"
    >
      <header>
        <TPMEarthMark variant={founder ? "command" : "compact"} />
        <div>
          <span>{founder ? "Founder planet map" : "Citizen planet layer"}</span>
          <h2>{founder ? "Earth command visualization" : "Paper-safe planet view"}</h2>
          <p>
            {founder
              ? "Founder-only readiness view of continents, ministries, resources, risks, and approvals."
              : "A simplified plan layer showing only user-safe planet areas without internal command data."}
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
