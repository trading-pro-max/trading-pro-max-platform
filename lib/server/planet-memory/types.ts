import "server-only";

export type PlanetMemoryNodeType =
  | "feature"
  | "file"
  | "screen"
  | "test"
  | "doc"
  | "risk"
  | "plan"
  | "ministry"
  | "decision"
  | "founder_preference"
  | "visual_acceptance_note"
  | "blocked_state"
  | "sensitive_area";

export type PlanetMemoryNode = {
  id: string;
  type: PlanetMemoryNodeType;
  label: string;
  summary: string;
  privateDataStored: false;
  secretsStored: false;
};

export type PlanetMemoryEdge = {
  from: string;
  to: string;
  relation: string;
};

export type PlanetMemoryGraphSnapshot = {
  checkedAt: string;
  mode: "planet_memory_graph_readiness";
  nodes: PlanetMemoryNode[];
  edges: PlanetMemoryEdge[];
  truth: {
    privateUserDataStored: false;
    secretsStored: false;
    surveillance: "not_enabled";
    readinessOnly: true;
  };
};
