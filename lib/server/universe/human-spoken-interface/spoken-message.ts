import "server-only";

import type { AlKawnSpokenLine } from "./types";

export function getAlKawnSpokenWakeMessage(): AlKawnSpokenLine {
  return {
    id: "spoken_wake_message",
    text: "أحمد، أنا مستيقظ الآن.",
    purpose: "Tell Ahmad that الكون has entered private daily wake state.",
  };
}
