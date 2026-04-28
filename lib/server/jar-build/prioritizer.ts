import type { JarBuildItem, JarOneNextAction } from "./types";

const decisionWeight = {
  black_hole: 100,
  validate_only: 90,
  ask_ahmad: 80,
  prepare_command: 70,
  produce_now: 65,
  return_to_heart: 60,
  delay: 30,
  archive: 20,
  block: 10,
} as const;

export function prioritizeJarItems(items: JarBuildItem[]) {
  return [...items].sort((a, b) => {
    const decisionDelta = decisionWeight[b.decision] - decisionWeight[a.decision];
    if (decisionDelta !== 0) return decisionDelta;
    return b.priority - a.priority;
  });
}

export function getJarOneNextAction(items: JarBuildItem[]): JarOneNextAction {
  const [item] = prioritizeJarItems(items);

  if (!item) {
    return {
      itemId: "jar_empty",
      title: "No Jar item",
      jarId: "jar_9_founder_decision",
      action: "Ask Ahmad for the next Founder instruction.",
      whyNow: "The Jar has no classified item.",
      decision: "ask_ahmad",
    };
  }

  return {
    itemId: item.id,
    title: item.title,
    jarId: item.jarId,
    action:
      item.decision === "black_hole"
        ? "Contain the unsafe item and keep a safe alternative only."
        : item.decision === "ask_ahmad"
        ? "Ask Ahmad for the required decision before action."
        : "Prepare an exit permit preview before any command passport.",
    whyNow: item.reason,
    decision: item.decision,
  };
}
