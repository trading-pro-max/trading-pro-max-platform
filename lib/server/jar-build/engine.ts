import "server-only";

import { buildJarCommandPassportPreview } from "./command-passport-bridge";
import { createJarExitPermit } from "./exit-permit";
import { getJarRegistry } from "./jar-registry";
import { buildJarMemory } from "./memory";
import { getJarOneNextAction, prioritizeJarItems } from "./prioritizer";
import { getJarInboxItems } from "./state";
import type { JarBuildSnapshot, JarId } from "./types";

function buildCounts(items: ReturnType<typeof getJarInboxItems>) {
  const counts = Object.fromEntries(
    getJarRegistry().map((jar) => [jar.id, 0])
  ) as Record<JarId, number>;

  for (const item of items) {
    counts[item.jarId] += 1;
  }

  return counts;
}

export function getJarBuildSnapshot(
  checkedAt = new Date().toISOString()
): JarBuildSnapshot {
  const registry = getJarRegistry();
  const inbox = getJarInboxItems();
  const priorities = prioritizeJarItems(inbox);
  const oneNextAction = getJarOneNextAction(inbox);
  const oneNextItem = inbox.find((item) => item.id === oneNextAction.itemId) ?? priorities[0];

  if (!oneNextItem) {
    throw new Error("Jar Build System requires at least one classified item.");
  }
  const exitPermits = priorities.slice(0, 4).map((item) => createJarExitPermit(item));
  const primaryPermit =
    exitPermits.find((permit) => permit.itemId === oneNextItem.id) ??
    createJarExitPermit(oneNextItem);
  const commandPassportPreview = buildJarCommandPassportPreview(
    oneNextItem,
    primaryPermit
  );

  return {
    checkedAt,
    status: "active_with_notes",
    founderOnly: true,
    readOnly: true,
    previewOnly: true,
    noExecution: true,
    noPublicExposure: true,
    registry,
    inbox,
    counts: buildCounts(inbox),
    priorities,
    oneNextAction,
    exitPermits,
    commandPassportPreview,
    memory: buildJarMemory(inbox),
  };
}
