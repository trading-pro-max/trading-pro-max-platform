import { getUniverseAssetSet } from "./getUniverseAssetSet";
import { getUniverseMood } from "./getUniverseMood";
import { getRealitySources } from "./realitySources";

export function getEarthLifeLayerState(date = new Date()) {
  const mood = getUniverseMood(date);
  const assets = getUniverseAssetSet(mood.time.phase, mood.season.season);
  const sources = getRealitySources();

  return {
    timePhase: mood.time.phase,
    season: mood.season.season,
    atmosphereIntensity: mood.atmosphereStrength,
    sunlightAngle: mood.earthLightAngle,
    shadowStrength: 1 - mood.visualIntensity,
    starVisibility: mood.starVisibility,
    cloudOpacity: mood.cloudOpacity,
    nightLightsOpacity: mood.nightLightsOpacity,
    orbitMotion: mood.orbitSpeedSeconds,
    particleDensity: mood.particleDensity,
    backgroundDepth: mood.backgroundDepth,
    horizonGlow: mood.horizonGlow,
    soundscapeMood: mood.soundscapeMood,
    motionIntensity: mood.motionIntensity,
    reducedMotionSafe: true,
    productTruthOverlayPriority: mood.productTruthOverlayPriority,
    assetMode: assets.mode,
    sourceLabels: [
      sources.dayNight.visibleLabel,
      sources.season.visibleLabel,
      sources.weather.visibleLabel,
      sources.earthAssets.visibleLabel,
      sources.soundscape.visibleLabel,
    ],
  };
}
