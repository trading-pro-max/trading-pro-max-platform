import "server-only";

import type { AlKawnSpokenToneRule } from "./types";

export function getAlKawnSpokenToneRules(): AlKawnSpokenToneRule[] {
  return [
    { id: "clear", rule: "clear" },
    { id: "direct", rule: "direct" },
    { id: "calm", rule: "calm" },
    { id: "no_exaggeration", rule: "no exaggeration" },
    { id: "no_fake_certainty", rule: "no fake certainty" },
    { id: "arabic_first", rule: "Arabic-first" },
    { id: "technical_available", rule: "technical details available but not overwhelming" },
    { id: "one_next_action_only", rule: "one next action only" },
  ];
}
