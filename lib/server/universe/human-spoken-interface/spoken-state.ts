import "server-only";

import { getAlKawnSpokenDailyBriefing } from "./spoken-briefing";
import { getAlKawnSpokenBlockers } from "./spoken-blockers";
import { getAlKawnSpokenWakeMessage } from "./spoken-message";
import { getAlKawnSpokenNeedsFromAhmad } from "./spoken-needs";
import { getAlKawnSpokenNextAction } from "./spoken-next-action";
import { getAlKawnSpokenToneRules } from "./spoken-tone";
import type { AlKawnHumanSpokenInterfaceState } from "./types";

export function getAlKawnHumanSpokenInterfaceState(): AlKawnHumanSpokenInterfaceState {
  return {
    id: "al_kawn_human_spoken_interface",
    title: "Human Spoken Interface is active.",
    state: "active",
    audience: "Ahmad only",
    summary:
      "الكون يتكلم مع أحمد بلغة بشرية واضحة. The interface is founder-facing, Arabic-first, calm, direct, and never claims more certainty than the local evidence supports.",
    wakeMessage: getAlKawnSpokenWakeMessage(),
    dailyWording: [
      {
        id: "daily_loop_enhancement_spoken",
        text: "أحمد، الكون مستيقظ ويعمل داخليًا.",
        purpose: "Daily wake/work loop status.",
      },
      {
        id: "daily_checks_spoken",
        text: "أحمد، فحصت Product Truth والنواة والسطح المكتبي.",
        purpose: "Daily checks summary.",
      },
    ],
    taskWording: [
      {
        id: "selected_safe_work_spoken",
        text: "أحمد، العمل الداخلي الآمن المختار اليوم هو Product Truth verification.",
        purpose: "Selected task wording.",
      },
    ],
    blockerWording: [
      {
        id: "legal_money_spoken_stop",
        text: "أحمد، القانون والمال متوقفان عندك فقط.",
        purpose: "Legal and money stop wording.",
      },
      {
        id: "no_launch_money_broker_spoken",
        text: "أحمد، لا يوجد إطلاق عام أو مال أو بروكر.",
        purpose: "Blocked public/money/broker wording.",
      },
    ],
    nextActionWording: [
      {
        id: "only_next_spoken",
        text: "أحمد، الخطوة التالية الوحيدة هي Daily Work Loop enhancement.",
        purpose: "One next action wording.",
      },
    ],
    dailyBriefing: getAlKawnSpokenDailyBriefing(),
    needsFromAhmad: getAlKawnSpokenNeedsFromAhmad(),
    blockers: getAlKawnSpokenBlockers(),
    nextAction: getAlKawnSpokenNextAction(),
    toneRules: getAlKawnSpokenToneRules(),
  };
}
