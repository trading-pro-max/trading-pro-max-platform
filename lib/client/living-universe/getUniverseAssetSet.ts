import type { DeviceTimePhase, SeasonPhase, UniverseAssetSet } from "./types";

const phaseOverlay: Record<DeviceTimePhase, string> = {
  dawn: "/assets/promax/overlays/phase-dawn.svg",
  morning: "/assets/promax/overlays/phase-day.svg",
  day: "/assets/promax/overlays/phase-day.svg",
  sunset: "/assets/promax/overlays/phase-sunset.svg",
  night: "/assets/promax/overlays/phase-night.svg",
  deep_night: "/assets/promax/overlays/phase-night.svg",
};

const seasonOverlay: Record<SeasonPhase, string> = {
  spring: "/assets/promax/overlays/season-spring.svg",
  summer: "/assets/promax/overlays/season-summer.svg",
  autumn: "/assets/promax/overlays/season-autumn.svg",
  winter: "/assets/promax/overlays/season-winter.svg",
};

export function getUniverseAssetSet(
  phase: DeviceTimePhase,
  season: SeasonPhase
): UniverseAssetSet {
  return {
    mode: "local_procedural",
    earthBase: "/assets/promax/earth/earth-procedural-base.svg",
    cloudLayer: "/assets/promax/earth/cloud-layer-procedural.svg",
    nightLights: "/assets/promax/earth/night-lights-procedural.svg",
    atmosphereGlow: "/assets/promax/overlays/atmosphere-glow.svg",
    starField: "/assets/promax/universe/star-field.svg",
    swissPrecisionGrid: "/assets/promax/overlays/swiss-precision-grid.svg",
    orbitalRing: "/assets/promax/overlays/orbital-ring.svg",
    dataNode: "/assets/promax/overlays/data-node.svg",
    phaseOverlay: phaseOverlay[phase],
    seasonOverlay: seasonOverlay[season],
  };
}
