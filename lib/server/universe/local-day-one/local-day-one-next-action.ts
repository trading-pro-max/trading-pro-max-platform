import "server-only";

import type { LocalDayOneNextAction } from "./types";

export function getLocalDayOneNextAction(): LocalDayOneNextAction {
  return {
    next: "Ahmad reviews /desktop/kawn and decides whether to start Local Day One.",
    reason:
      "The internal operating sequence is ready, but Local Day One must not start automatically. Ahmad must review the private desktop and decide.",
    requiresAhmad: true,
  };
}
