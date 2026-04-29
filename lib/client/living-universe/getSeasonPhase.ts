import type { SeasonPhase, SeasonReality } from "./types";

const seasonLabels: Record<SeasonPhase, string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

export function getSeasonPhase(date = new Date()): SeasonReality {
  const month = date.getMonth() + 1;
  let season: SeasonPhase = "winter";

  if (month >= 3 && month <= 5) season = "spring";
  if (month >= 6 && month <= 8) season = "summer";
  if (month >= 9 && month <= 11) season = "autumn";

  return {
    month,
    season,
    label: seasonLabels[season],
  };
}
