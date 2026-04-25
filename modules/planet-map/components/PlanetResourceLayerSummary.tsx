import type { PlanetResourceLayerView } from "../types";

const resources: PlanetResourceLayerView[] = [
  {
    label: "Product truth",
    category: "hidden",
    value: "trust",
    protection: "safety, review, private command",
  },
  {
    label: "Chart and UI",
    category: "visible",
    value: "user confidence",
    protection: "Quality and visual acceptance",
  },
  {
    label: "Assistant and journal",
    category: "living",
    value: "learning and retention",
    protection: "Safety boundaries, no advice claims",
  },
  {
    label: "Swiss precision",
    category: "strategic",
    value: "premium identity",
    protection: "Rights and brand protection",
  },
];

export default function PlanetResourceLayerSummary() {
  return (
    <div className="tpm-planet-resource-summary" aria-label="Resources to value map">
      {resources.map((resource) => (
        <article key={resource.label} data-category={resource.category}>
          <span>{resource.category}</span>
          <strong>{resource.label}</strong>
          <small>
            {resource.value} / {resource.protection}
          </small>
        </article>
      ))}
    </div>
  );
}
