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
    name: "Intelligence & Brain",
    readiness: "planned",
    publicLayer: true,
    founderOnly: false,
    signal: "bounded Companion and Brain context",
  },
  {
    id: "protection-defense",
    name: "Protection & Defense",
    readiness: "guarded",
    publicLayer: false,
    founderOnly: true,
    signal: "Guardian and Legal blocks",
  },
  {
    id: "economy-treasury",
    name: "Economy & Treasury",
    readiness: "blocked",
    publicLayer: false,
    founderOnly: true,
    signal: "billing inactive, fee 0%",
  },
  {
    id: "media-growth",
    name: "Media & Growth",
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
    <div className="tpm-planet-continent-grid" aria-label="Planet continent readiness">
      {continents.map((continent) => (
        <article key={continent.id} data-readiness={continent.readiness}>
          <span>{continent.founderOnly ? "Founder" : "User-safe"}</span>
          <strong>{continent.name}</strong>
          <small>{continent.signal}</small>
        </article>
      ))}
    </div>
  );
}
