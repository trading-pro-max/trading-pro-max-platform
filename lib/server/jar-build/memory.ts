import type { JarBuildItem } from "./types";

export function buildJarMemory(items: JarBuildItem[]) {
  const blockedCount = items.filter((item) => item.decision === "black_hole").length;

  return {
    persistence: "report_only" as const,
    latestLesson:
      blockedCount > 0
        ? "Unsafe or sensitive items were contained before execution."
        : "Every item must enter the Jar before command passport drafting.",
    returnsToZeroTruth: true as const,
    publicSensitiveDataStored: false as const,
  };
}
