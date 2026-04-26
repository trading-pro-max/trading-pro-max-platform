"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  ENVIRONMENT_MODE_STORAGE_KEY,
  ENVIRONMENT_PREVIEW_TIMESTAMP_STORAGE_KEY,
  ENVIRONMENT_WEATHER_STORAGE_KEY,
} from "../../../lib/constants/storage";
import {
  ENVIRONMENT_MODES,
  WEATHER_STATES,
  type ClientEnvironmentSnapshot,
  type EnvironmentMode,
  type SolarPhase,
  type WeatherState,
} from "../../../lib/environment/client-types";

const EnvironmentContext = createContext<{
  environment: ClientEnvironmentSnapshot;
  setMode: (mode: EnvironmentMode) => void;
  setWeatherState: (state: WeatherState) => void;
}>({
  environment: {
    mode: "adaptive",
    solarPhase: "day",
    weatherState: "unknown",
    motionAllowed: true,
    publicLabel: "Adaptive Atmosphere",
  },
  setMode: () => {},
  setWeatherState: () => {},
});

function isEnvironmentMode(value: string | null): value is EnvironmentMode {
  return ENVIRONMENT_MODES.includes(value as EnvironmentMode);
}

function isWeatherState(value: string | null): value is WeatherState {
  return WEATHER_STATES.includes(value as WeatherState);
}

function phaseFromDate(date: Date): SolarPhase {
  const minutes = date.getHours() * 60 + date.getMinutes();

  if (minutes >= 270 && minutes < 360) return "dawn";
  if (minutes >= 360 && minutes < 480) return "sunrise";
  if (minutes >= 480 && minutes < 690) return "morning";
  if (minutes >= 690 && minutes < 990) return "day";
  if (minutes >= 990 && minutes < 1110) return "golden_hour";
  if (minutes >= 1110 && minutes < 1230) return "sunset";
  if (minutes >= 1230 && minutes < 1410) return "night";
  return "deep_night";
}

function labelForMode(mode: EnvironmentMode) {
  if (mode === "solar_only") return "Solar Theme";
  if (mode === "weather_only") return "Weather Theme";
  if (mode === "static") return "Static Mode";
  if (mode === "high_contrast") return "High Contrast";
  return "Adaptive Atmosphere";
}

function loadPreviewDate() {
  try {
    const stored = window.localStorage.getItem(
      ENVIRONMENT_PREVIEW_TIMESTAMP_STORAGE_KEY
    );
    if (!stored) return new Date();
    const preview = new Date(stored);
    return Number.isNaN(preview.getTime()) ? new Date() : preview;
  } catch {
    return new Date();
  }
}

function applyEnvironment(environment: ClientEnvironmentSnapshot) {
  const root = document.documentElement;
  root.dataset.tpmEnvironmentMode = environment.mode;
  root.dataset.tpmSolarPhase = environment.solarPhase;
  root.dataset.tpmWeatherState = environment.weatherState;
  root.dataset.tpmMotionAllowed = String(environment.motionAllowed);
  root.classList.remove(
    ...Array.from(root.classList).filter(
      (className) =>
        className.startsWith("tpm-env-") || className.startsWith("tpm-weather-")
    )
  );
  root.classList.add(
    `tpm-env-${environment.mode.replaceAll("_", "-")}`,
    `tpm-env-${environment.solarPhase.replaceAll("_", "-")}`,
    `tpm-weather-${environment.weatherState.replaceAll("_", "-")}`,
    environment.motionAllowed ? "tpm-env-motion" : "tpm-env-static"
  );
}

export function PlanetaryEnvironmentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<EnvironmentMode>(() => {
    if (typeof window === "undefined") return "adaptive";

    try {
      const storedMode = window.localStorage.getItem(ENVIRONMENT_MODE_STORAGE_KEY);
      return isEnvironmentMode(storedMode) ? storedMode : "adaptive";
    } catch {
      return "adaptive";
    }
  });
  const [weatherState, setWeatherStateValue] = useState<WeatherState>(() => {
    if (typeof window === "undefined") return "unknown";

    try {
      const storedWeather = window.localStorage.getItem(
        ENVIRONMENT_WEATHER_STORAGE_KEY
      );
      return isWeatherState(storedWeather) ? storedWeather : "unknown";
    } catch {
      return "unknown";
    }
  });
  const [solarPhase, setSolarPhase] = useState<SolarPhase>(() =>
    typeof window === "undefined" ? "day" : phaseFromDate(loadPreviewDate())
  );
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const syncPhase = () => setSolarPhase(phaseFromDate(loadPreviewDate()));
    const timer = window.setInterval(syncPhase, 60_000);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    motionQuery.addEventListener("change", syncMotion);

    return () => {
      window.clearInterval(timer);
      motionQuery.removeEventListener("change", syncMotion);
    };
  }, []);

  const environment = useMemo<ClientEnvironmentSnapshot>(() => {
    const motionAllowed = mode !== "static" && !reducedMotion;

    return {
      mode,
      solarPhase,
      weatherState,
      motionAllowed,
      publicLabel: labelForMode(mode),
    };
  }, [mode, reducedMotion, solarPhase, weatherState]);

  useEffect(() => {
    applyEnvironment(environment);
  }, [environment]);

  function setMode(nextMode: EnvironmentMode) {
    setModeState(nextMode);
    try {
      window.localStorage.setItem(ENVIRONMENT_MODE_STORAGE_KEY, nextMode);
    } catch {}
  }

  function setWeatherState(nextState: WeatherState) {
    setWeatherStateValue(nextState);
    try {
      window.localStorage.setItem(ENVIRONMENT_WEATHER_STORAGE_KEY, nextState);
    } catch {}
  }

  return (
    <EnvironmentContext.Provider
      value={{ environment, setMode, setWeatherState }}
    >
      {children}
    </EnvironmentContext.Provider>
  );
}

export function usePlanetaryEnvironment() {
  return useContext(EnvironmentContext);
}
