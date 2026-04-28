import type { DomainSearchTask, TrademarkSearchTask } from "./types";

export function generateTrademarkSearchTasks(candidateName: string): TrademarkSearchTask[] {
  const name = candidateName || "final global brand candidate";

  return [
    ["WIPO", "Search WIPO Global Brand Database for exact, visual, and phonetic conflicts."],
    ["USPTO", "Search USPTO trademark records for exact and confusingly similar marks."],
    ["EUIPO_TMVIEW", "Search EUIPO and TMview for European Union and international conflicts."],
    ["SWISS_IPI", "Search Swiss IPI / Swissreg if Swiss-facing public use is planned."],
    ["PHONETIC", "Perform manual phonetic similarity review across Arabic, English, and German."],
    ["NEWS_SURFACE", "Perform manual Google/news surface scan for reputation and confusion risk."],
    ["LEGAL_REVIEW", "Prepare legal review with a qualified trademark professional before adoption."],
  ].map(([registry, task]) => ({
    id: `brand_task_${name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "_")}_${registry.toLowerCase()}`,
    candidateName: name,
    registry: registry as TrademarkSearchTask["registry"],
    task,
    status: "needs_manual_check",
    externalCallMade: false,
  }));
}

export function generateDomainSearchTasks(candidateName: string): DomainSearchTask[] {
  const name = (candidateName || "final global brand candidate")
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "");
  const readableName = candidateName || "final global brand candidate";

  return [".com", ".ai", ".app", ".ch", "social handles"].map((suffix) => {
    const domainOrHandle = suffix.startsWith(".") ? `${name}${suffix}` : suffix;

    return {
      id: `brand_domain_${name}_${suffix.replaceAll(/[^a-z0-9]+/g, "_")}`,
      candidateName: readableName,
      domainOrHandle,
      status: "needs_check",
      task:
        suffix === "social handles"
          ? "Manually check future social handle conflicts without account creation."
          : `Manually check ${domainOrHandle} availability without purchase or payment.`,
      externalCallMade: false,
      purchaseAttempted: false,
    };
  });
}
