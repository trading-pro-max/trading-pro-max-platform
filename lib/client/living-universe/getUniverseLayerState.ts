import { getEarthLifeLayerState } from "./getEarthLifeLayerState";
import { getRealitySourceLabel, getRealityTruthWarnings } from "./realitySources";

export function getUniverseLayerState(date = new Date()) {
  const earth = getEarthLifeLayerState(date);

  return {
    layerMeaning: "Living Earth Reality",
    statement: "Living Earth Layers use device-time and device-date simulation.",
    realWhenSourced: "Real when sourced. Simulated when labeled.",
    deviceTimeLabel: getRealitySourceLabel("deviceTime"),
    deviceDateLabel: getRealitySourceLabel("deviceDate"),
    dayNightLabel: getRealitySourceLabel("dayNight"),
    seasonLabel: getRealitySourceLabel("season"),
    weatherLabel: getRealitySourceLabel("weather"),
    locationLabel: getRealitySourceLabel("location"),
    soundscapeLabel: getRealitySourceLabel("soundscape"),
    tradingLabel: getRealitySourceLabel("trading"),
    legalLabel: getRealitySourceLabel("legal"),
    earth,
    warnings: getRealityTruthWarnings(),
  };
}
