import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenNextAction(): AlKawnSpokenLine {
  return {
    id: "spoken_next_action",
    text: "أحمد، الخطوة التالية هي Daily Work Loop enhancement.",
    purpose: "Give Ahmad one next safe internal action.",
  };
}
