import "server-only";
import { getAlKawnVisualMapConnections } from "./visual-map-connections";
import { getAlKawnVisualMapLayers } from "./visual-map-layers";
import { getAlKawnVisualMapNextAction } from "./visual-map-next-action";
import { getAlKawnVisualMapTruth } from "./visual-map-truth";
import type { AlKawnVisualMap } from "./types";

export function getAlKawnVisualMap(): AlKawnVisualMap {
  return {
    id: "al_kawn_visual_map",
    title: "Al-Kawn Visual Map",
    purpose:
      "Founder-facing private architecture map showing how Ahmad, private devices, الكون, Product Truth, Kernel, Pro Max Galaxy, Earth Planet, /trading, Global Layer, and ALKON belong together.",
    layers: getAlKawnVisualMapLayers(),
    connections: getAlKawnVisualMapConnections(),
    truth: getAlKawnVisualMapTruth(),
    requiredPhrases: [
      "أحمد هو الأصل",
      "الكون هو الوجود الرقمي الخاص بأحمد",
      "Every entity inside الكون needs an Existence Contract",
      "Product Truth هو قانون الحقيقة الأعلى",
      "Universe Operating Kernel هو القاضي التنفيذي",
      "Pro Max Galaxy is inside الكون",
      "Earth Planet is the trading project",
      "Swiss Local Constitution is above the Global Layer",
      "ALKON is private/background",
      "Legal and Money gates stop execution for Ahmad",
    ],
    nextAction: getAlKawnVisualMapNextAction(),
  };
}
