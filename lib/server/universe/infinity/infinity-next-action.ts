import "server-only";

import type { InfinityNextAction } from "./types";

export function getInfinityNextAction(): InfinityNextAction {
  return {
    next: "Infinity Mode controlled activation",
    reason:
      "Infinity preparation is ready with notes: the daily loop, Product Truth, kernel, desktop route, local auth, and safety boundaries are visible, but any controlled activation must still be explicitly approved and remain private/internal.",
    blockedUntil: [
      "Ahmad approves a controlled activation mission.",
      "No background daemon is introduced without a safe trigger model.",
      "Legal and money gates remain Ahmad stops.",
      "Public, broker, billing, payment, receiving-money, external-account, and legal-claim automation remains blocked.",
      "Product Truth remains visible in every cycle.",
    ],
  };
}
