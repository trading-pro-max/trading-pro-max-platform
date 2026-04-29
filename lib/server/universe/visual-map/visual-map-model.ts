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
      "الكون هو نسخة أحمد الإلكترونية الخاصة.",
      "الكون هو الوجود الرقمي الخاص بأحمد",
      "الكون فوق برو ماكس.",
      "Every entity inside الكون needs an Existence Contract",
      "Product Truth هو قانون الحقيقة الأعلى",
      "Universe Operating Kernel هو القاضي التنفيذي",
      "كل شيء داخل الكون يجب أن ينتمي إلى طبقة واضحة.",
      "Pro Max Galaxy is inside الكون",
      "Pro Max Galaxy داخل الكون.",
      "Earth Planet is the trading project",
      "Earth Planet داخل Pro Max Galaxy.",
      "/trading ينتمي إلى Earth Planet.",
      "Swiss Local Constitution is above the Global Layer",
      "ALKON is private/background",
      "ALKON هو حارس خلفي خاص.",
      "Infinity Mode محجوب حاليًا.",
      "Operator Mode محجوب حاليًا.",
      "Public Pro Max Future بوابة مستقبلية.",
      "Legal and Money gates stop execution for Ahmad",
      "∞ إلى 0 يعني تفسير البنية والرجوع إلى الأصل.",
    ],
    nextAction: getAlKawnVisualMapNextAction(),
  };
}
