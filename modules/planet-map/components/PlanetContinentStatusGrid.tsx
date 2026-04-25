import type { PlanetMapContinentView } from "../types";

const defaultContinents: PlanetMapContinentView[] = [
  {
    id: "trading-markets",
    name: "Trading & Markets",
    readiness: "ready",
    publicLayer: true,
    founderOnly: false,
    signal: "paper-safe chart, ticket, feed fallback",
  },
  {
    id: "intelligence-brain",
    name: "Assistant & Intelligence",
    readiness: "planned",
    publicLayer: true,
    founderOnly: false,
    signal: "bounded Assistant context",
  },
  {
    id: "protection-defense",
    name: "Safety & Review",
    readiness: "guarded",
    publicLayer: false,
    founderOnly: true,
    signal: "safety and review blocks",
  },
  {
    id: "economy-treasury",
    name: "Plans & Revenue Readiness",
    readiness: "blocked",
    publicLayer: false,
    founderOnly: true,
    signal: "billing inactive, fee 0%",
  },
  {
    id: "media-growth",
    name: "Media Readiness",
    readiness: "guarded",
    publicLayer: false,
    founderOnly: true,
    signal: "draft review only",
  },
  {
    id: "platforms-devices",
    name: "Platforms & Devices",
    readiness: "planned",
    publicLayer: true,
    founderOnly: false,
    signal: "web active, desktop/mobile planned",
  },
];

type PlanetContinentStatusGridProps = {
  continents?: PlanetMapContinentView[];
};

export default function PlanetContinentStatusGrid({
  continents = defaultContinents,
}: PlanetContinentStatusGridProps) {
  return (
    <div className="tpm-planet-continent-grid" aria-label="Product area readiness">
      {continents.map((continent) => (
        <article key={continent.id} data-readiness={continent.readiness}>
          <span>{continent.founderOnly ? "Owner-only" : "User-safe"}</span>
          <strong>{continent.name}</strong>
          <small>{continent.signal}</small>
        </article>
      ))}
    </div>
  );
}
