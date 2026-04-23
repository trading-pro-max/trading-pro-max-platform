import "server-only";

export type ReadinessComponent = {
  key: string;
  ok: boolean;
  weight: number;
};

export type ReadinessSnapshot = {
  score: number;
  stage: string;
  components: Array<ReadinessComponent & { contribution: number }>;
};

export function buildReadinessSnapshot(input: {
  components: ReadinessComponent[];
  stageThresholds: Array<{ stage: string; minScore: number }>;
}): ReadinessSnapshot {
  const normalizedComponents = input.components.map((component) => {
    const weight = Number.isFinite(component.weight)
      ? Math.max(0, Math.round(component.weight))
      : 0;
    return {
      ...component,
      weight,
      contribution: component.ok ? weight : 0,
    };
  });

  const score = normalizedComponents.reduce(
    (sum, component) => sum + component.contribution,
    0
  );

  const sortedThresholds = [...input.stageThresholds].sort(
    (left, right) => left.minScore - right.minScore
  );

  let stage = sortedThresholds[0]?.stage ?? "unknown";
  for (const threshold of sortedThresholds) {
    if (score >= threshold.minScore) {
      stage = threshold.stage;
    }
  }

  return {
    score,
    stage,
    components: normalizedComponents,
  };
}
