import "server-only";

import { getAlKawnActionSelector } from "./action-selector";
import { getAlKawnAutonomousCycle } from "./autonomous-cycle";
import { getAlKawnAwarenessModel } from "./awareness-model";
import { getAlKawnContextReader } from "./context-reader";
import { getAlKawnDecisionEngine } from "./decision-engine";
import { getAlKawnIntelligenceBoundaries } from "./intelligence-boundaries";
import { getAlKawnIntelligenceNextAction } from "./intelligence-next-action";
import { getAlKawnIntelligenceReport } from "./intelligence-report";
import { getAlKawnSelfObservation } from "./self-observation";
import type { AlKawnLivingAutonomousIntelligence } from "./types";

const REQUIRED_WORDING = [
  "Al-Kawn Living Autonomous Intelligence",
  "الكون يعمل بذكاء حي داخل أجهزة أحمد.",
  "الكون لا ينتظر فقط؛ الكون يراقب ويفهم ويختار وينفذ داخليًا.",
  "الذكاء الحي داخل الكون يعمل عبر Trigger آمن، وليس loop فوضوي.",
  "كل دورة تختار عملًا داخليًا واحدًا.",
  "Product Truth يحكم كل قرار ذكي.",
  "أحمد وحده يتحكم بالمال الحقيقي.",
  "الخروج للعالم يمر عبر بوابات أحمد.",
  "الكون يشرح ماذا فعل ولماذا فعل.",
];

export function getAlKawnLivingAutonomousIntelligence(): AlKawnLivingAutonomousIntelligence {
  const selectedAction = getAlKawnActionSelector();

  return {
    id: "al_kawn_living_autonomous_intelligence",
    title: "Al-Kawn Living Autonomous Intelligence",
    state: "waiting_for_safe_trigger",
    definition:
      "الكون = كل ما هو موجود إلكترونيًا داخل عالم أحمد الخاص، داخل نظام واحد، يعمل ذاتيًا، يتطور ذاتيًا، يحكم ذاته، ويخدم أحمد فقط.",
    requiredWording: REQUIRED_WORDING,
    awareness: getAlKawnAwarenessModel(),
    contextSources: getAlKawnContextReader(),
    selfObservation: getAlKawnSelfObservation(),
    decisionEngine: getAlKawnDecisionEngine(),
    selectedAction,
    autonomousCycle: getAlKawnAutonomousCycle(),
    boundaries: getAlKawnIntelligenceBoundaries(),
    report: getAlKawnIntelligenceReport(),
    spokenSummary: [
      "أحمد، راقبت حالة الكون وحددت عملًا داخليًا آمنًا.",
      "أحمد، اخترت هذه المهمة لأنها تحمي Product Truth.",
      "أحمد، لا يوجد لمس للمال أو القانون.",
      "أحمد، نفذت داخليًا ثم تحققت وكتبت التقرير.",
      "أحمد، الخطوة التالية الوحيدة هي مراجعة /desktop/kawn قبل Local Day One.",
    ],
    nextAction: getAlKawnIntelligenceNextAction(),
  };
}
