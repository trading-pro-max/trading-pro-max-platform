"use client";

import {
  ENVIRONMENT_MODE_LABELS,
  ENVIRONMENT_MODES,
  WEATHER_STATES,
  type EnvironmentMode,
  type WeatherState,
} from "../../../lib/environment/client-types";
import { usePlanetaryEnvironment } from "./PlanetaryEnvironmentProvider";

export default function EnvironmentModeControl({
  label = "Adaptive Atmosphere",
  showWeather = false,
}: {
  label?: string;
  showWeather?: boolean;
}) {
  const { environment, setMode, setWeatherState } = usePlanetaryEnvironment();

  return (
    <div className="tpm-environment-control" data-environment-control="true">
      <label>
        <span>{label}</span>
        <select
          aria-label={label}
          value={environment.mode}
          onChange={(event) => setMode(event.target.value as EnvironmentMode)}
        >
          {ENVIRONMENT_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {ENVIRONMENT_MODE_LABELS[mode]}
            </option>
          ))}
        </select>
      </label>

      {showWeather ? (
        <label>
          <span>Weather Theme</span>
          <select
            aria-label="Weather Theme"
            value={environment.weatherState}
            onChange={(event) =>
              setWeatherState(event.target.value as WeatherState)
            }
          >
            {WEATHER_STATES.map((state) => (
              <option key={state} value={state}>
                {state.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}
