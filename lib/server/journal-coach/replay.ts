import "server-only";

import { getDecisionReplayFoundation } from "./state";

export function getDecisionReplaySnapshot(
  selectedSymbol = "EUR/USD",
  timeframe = "1m"
) {
  return getDecisionReplayFoundation({ selectedSymbol, timeframe });
}
