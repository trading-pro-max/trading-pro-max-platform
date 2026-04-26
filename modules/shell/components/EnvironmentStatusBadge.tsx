"use client";

import { usePlanetaryEnvironment } from "./PlanetaryEnvironmentProvider";

function display(value: string) {
  return value.replaceAll("_", " ");
}

export default function EnvironmentStatusBadge({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { environment } = usePlanetaryEnvironment();

  return (
    <div className="tpm-environment-status-badge" data-environment-status="true">
      <span>{environment.publicLabel}</span>
      <strong>
        {compact
          ? display(environment.solarPhase)
          : `${display(environment.solarPhase)} / ${display(
              environment.weatherState
            )}`}
      </strong>
      <small>
        {environment.motionAllowed
          ? "Motion respects device preference"
          : "Static Mode / Reduced Motion"}
      </small>
    </div>
  );
}
