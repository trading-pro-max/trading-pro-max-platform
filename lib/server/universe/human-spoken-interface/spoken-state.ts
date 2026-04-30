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
    dailyBriefing: getAlKawnSpokenDailyBriefing(),
    needsFromAhmad: getAlKawnSpokenNeedsFromAhmad(),
    blockers: getAlKawnSpokenBlockers(),
    nextAction: getAlKawnSpokenNextAction(),
    toneRules: getAlKawnSpokenToneRules(),
  };
}
