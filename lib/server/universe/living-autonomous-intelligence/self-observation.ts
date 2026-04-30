import "server-only";

import { getAlKawnAwarenessModel } from "./awareness-model";
import type { SelfObservation } from "./types";

export function getAlKawnSelfObservation(): SelfObservation {
  const awareness = getAlKawnAwarenessModel();

  return {
    state: "observing",
    observedAtSource: "device_time_when_rendered",
    summary: "الكون يعرف حالته وطبقاته وقدراته وحدوده.",
    observations: [
      "الكون يقرأ سياقه من مصادره الداخلية.",
      "لا توجد قراءة خارجية بدون موافقة أحمد.",
      ...awareness.map((item) => `${item.label}: ${item.state}`),
    ],
  };
}
