import "server-only";

export type GrowthReadinessSignal = {
  key: string;
  label: string;
  status: "ready" | "partial" | "planned";
  noRealMetrics: true;
  noDarkPattern: true;
  safeNextAction: string;
};
