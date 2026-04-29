import { getUniverseMood } from "./getUniverseMood";
import type { DeviceTimePhase, SeasonPhase } from "./types";

export type EarthImmersionPhaseTokens = {
  skyGradient: string;
  atmosphereColor: string;
  horizonGlow: string;
  moonlightTone: string;
  earthSurfaceLight: string;
  shadowStrength: number;
  starDensity: number;
  cloudOpacity: number;
  panelTransparency: number;
  glassDepth: string;
  tradingReadabilityContrast: string;
};

export type EarthImmersionSeasonTokens = {
  seasonalTint: string;
  seasonGlow: string;
  surfaceTone: string;
};

export type EarthImmersionTokens = EarthImmersionPhaseTokens &
  EarthImmersionSeasonTokens & {
    phase: DeviceTimePhase;
    season: SeasonPhase;
    swissRedPrecisionAccent: string;
    reducedMotionMode: "supported";
  };

const phaseTokens: Record<DeviceTimePhase, EarthImmersionPhaseTokens> = {
  dawn: {
    skyGradient: "linear-gradient(180deg, #07101c 0%, #182737 46%, #05080d 100%)",
    atmosphereColor: "rgba(137, 214, 255, 0.74)",
    horizonGlow: "rgba(255, 176, 127, 0.38)",
    moonlightTone: "rgba(200, 226, 255, 0.22)",
    earthSurfaceLight: "rgba(132, 211, 255, 0.68)",
    shadowStrength: 0.58,
    starDensity: 0.24,
    cloudOpacity: 0.44,
    panelTransparency: 0.84,
    glassDepth: "0 26px 70px rgba(0, 0, 0, 0.38)",
    tradingReadabilityContrast: "rgba(3, 7, 12, 0.9)",
  },
  morning: {
    skyGradient: "linear-gradient(180deg, #081421 0%, #102234 48%, #05090f 100%)",
    atmosphereColor: "rgba(148, 224, 255, 0.66)",
    horizonGlow: "rgba(185, 225, 255, 0.28)",
    moonlightTone: "rgba(208, 232, 255, 0.14)",
    earthSurfaceLight: "rgba(160, 226, 255, 0.72)",
    shadowStrength: 0.48,
    starDensity: 0.08,
    cloudOpacity: 0.4,
    panelTransparency: 0.88,
    glassDepth: "0 22px 60px rgba(0, 0, 0, 0.34)",
    tradingReadabilityContrast: "rgba(4, 8, 13, 0.91)",
  },
  day: {
    skyGradient: "linear-gradient(180deg, #0a1826 0%, #122b3d 48%, #060b12 100%)",
    atmosphereColor: "rgba(171, 230, 255, 0.62)",
    horizonGlow: "rgba(210, 238, 255, 0.24)",
    moonlightTone: "rgba(220, 238, 255, 0.1)",
    earthSurfaceLight: "rgba(178, 235, 255, 0.74)",
    shadowStrength: 0.42,
    starDensity: 0.04,
    cloudOpacity: 0.36,
    panelTransparency: 0.9,
    glassDepth: "0 20px 56px rgba(0, 0, 0, 0.32)",
    tradingReadabilityContrast: "rgba(4, 8, 13, 0.92)",
  },
  sunset: {
    skyGradient: "linear-gradient(180deg, #0b101b 0%, #2a1820 44%, #05070d 100%)",
    atmosphereColor: "rgba(255, 188, 135, 0.72)",
    horizonGlow: "rgba(255, 126, 85, 0.42)",
    moonlightTone: "rgba(210, 228, 255, 0.18)",
    earthSurfaceLight: "rgba(255, 184, 126, 0.64)",
    shadowStrength: 0.62,
    starDensity: 0.28,
    cloudOpacity: 0.48,
    panelTransparency: 0.85,
    glassDepth: "0 26px 72px rgba(0, 0, 0, 0.4)",
    tradingReadabilityContrast: "rgba(4, 7, 12, 0.92)",
  },
  night: {
    skyGradient: "linear-gradient(180deg, #01040a 0%, #06101d 48%, #020409 100%)",
    atmosphereColor: "rgba(97, 193, 255, 0.78)",
    horizonGlow: "rgba(81, 161, 223, 0.24)",
    moonlightTone: "rgba(206, 228, 255, 0.34)",
    earthSurfaceLight: "rgba(96, 186, 245, 0.56)",
    shadowStrength: 0.78,
    starDensity: 0.72,
    cloudOpacity: 0.38,
    panelTransparency: 0.82,
    glassDepth: "0 28px 78px rgba(0, 0, 0, 0.48)",
    tradingReadabilityContrast: "rgba(3, 6, 11, 0.93)",
  },
  deep_night: {
    skyGradient: "linear-gradient(180deg, #000208 0%, #030914 52%, #010206 100%)",
    atmosphereColor: "rgba(86, 178, 255, 0.84)",
    horizonGlow: "rgba(63, 132, 210, 0.18)",
    moonlightTone: "rgba(218, 234, 255, 0.42)",
    earthSurfaceLight: "rgba(82, 168, 235, 0.5)",
    shadowStrength: 0.86,
    starDensity: 0.9,
    cloudOpacity: 0.34,
    panelTransparency: 0.8,
    glassDepth: "0 30px 84px rgba(0, 0, 0, 0.54)",
    tradingReadabilityContrast: "rgba(2, 5, 10, 0.94)",
  },
};

const seasonTokens: Record<SeasonPhase, EarthImmersionSeasonTokens> = {
  spring: {
    seasonalTint: "rgba(117, 204, 168, 0.12)",
    seasonGlow: "rgba(144, 220, 190, 0.2)",
    surfaceTone: "rgba(112, 167, 128, 0.38)",
  },
  summer: {
    seasonalTint: "rgba(255, 210, 125, 0.1)",
    seasonGlow: "rgba(255, 218, 150, 0.18)",
    surfaceTone: "rgba(159, 146, 85, 0.34)",
  },
  autumn: {
    seasonalTint: "rgba(211, 118, 67, 0.12)",
    seasonGlow: "rgba(218, 139, 83, 0.2)",
    surfaceTone: "rgba(163, 107, 71, 0.34)",
  },
  winter: {
    seasonalTint: "rgba(174, 218, 255, 0.12)",
    seasonGlow: "rgba(188, 226, 255, 0.22)",
    surfaceTone: "rgba(178, 206, 218, 0.32)",
  },
};

export function getEarthImmersionTokens(date = new Date()): EarthImmersionTokens {
  const mood = getUniverseMood(date);

  return {
    ...phaseTokens[mood.time.phase],
    ...seasonTokens[mood.season.season],
    phase: mood.time.phase,
    season: mood.season.season,
    cloudOpacity: mood.cloudOpacity,
    starDensity: mood.starVisibility,
    swissRedPrecisionAccent: "rgba(227, 6, 19, 0.78)",
    reducedMotionMode: "supported",
  };
}

export function getEarthImmersionCssVariables(date = new Date()): Record<string, string> {
  const tokens = getEarthImmersionTokens(date);

  return {
    "--pmx-immersion-sky": tokens.skyGradient,
    "--pmx-immersion-atmosphere": tokens.atmosphereColor,
    "--pmx-immersion-horizon": tokens.horizonGlow,
    "--pmx-immersion-moonlight": tokens.moonlightTone,
    "--pmx-immersion-earth-light": tokens.earthSurfaceLight,
    "--pmx-immersion-shadow": tokens.shadowStrength.toString(),
    "--pmx-immersion-stars": tokens.starDensity.toString(),
    "--pmx-immersion-clouds": tokens.cloudOpacity.toString(),
    "--pmx-immersion-season-tint": tokens.seasonalTint,
    "--pmx-immersion-season-glow": tokens.seasonGlow,
    "--pmx-immersion-surface-tone": tokens.surfaceTone,
    "--pmx-immersion-swiss-red": tokens.swissRedPrecisionAccent,
    "--pmx-immersion-panel-alpha": tokens.panelTransparency.toString(),
    "--pmx-immersion-glass-depth": tokens.glassDepth,
    "--pmx-immersion-trading-contrast": tokens.tradingReadabilityContrast,
  };
}
