export type PlanetMapReadinessTone = "ready" | "planned" | "blocked" | "guarded";

export type PlanetMapContinentView = {
  id: string;
  name: string;
  readiness: PlanetMapReadinessTone;
  publicLayer: boolean;
  founderOnly: boolean;
  signal: string;
};

export type PlanetResourceLayerView = {
  label: string;
  category: "hidden" | "visible" | "living" | "strategic";
  value: string;
  protection: string;
};
