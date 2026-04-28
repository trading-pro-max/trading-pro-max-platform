import { trademarkClassTargets } from "./search-plan";
import type { BrandCandidate } from "./types";

const candidateNames = [
  ["Aurenza", "Swiss-clean trust and measured financial intelligence"],
  ["Veyronis", "Precision operating-world feel without using generic Pro/Max words"],
  ["Noveris", "New-world software and assistant continuity"],
  ["Elyvara", "Calm premium public-world identity with Arabic/English softness"],
  ["Orvanta", "Operating universe and dependable digital world"],
  ["Lunarisq", "Measured intelligence with risk-aware tone"],
  ["Vantoro", "Professional trust, world expansion, and platform stability"],
  ["Averiq", "Evidence-aware intelligence and concise domain form"],
  ["Sovira", "Sovereign operating feel without exposing Alkon"],
  ["Pravora", "Precision and proof without using Pro Max directly"],
  ["Quantara", "Financial intelligence and world-scale extensibility"],
  ["Veltrix", "Technology, trading cockpit, and assistant platform direction"],
  ["Asteriq", "Clear knowledge signal and memorable invented form"],
  ["Omnivera", "Digital world and assistant surface scalability"],
  ["Evidra", "Evidence-first trust identity"],
  ["Calvion", "Calm premium operating layer with finance/tech fit"],
  ["Zerava", "Zero Truth memory without exposing internal doctrine"],
  ["Monteriq", "Swiss-clean mountain precision hinted abstractly"],
  ["Truvanta", "Truth, trust, and public-safe confidence"],
  ["Axisora", "Operating center, markets, and world platform alignment"],
] as const;

function domainForms(name: string) {
  const slug = name.toLowerCase();
  return [`${slug}.com`, `${slug}.ai`, `${slug}.app`, `${slug}.ch`];
}

export function generateBrandCandidates(): BrandCandidate[] {
  return candidateNames.map(([name, reason], index) => ({
    id: `brand_candidate_${index + 1}_${name.toLowerCase()}`,
    name,
    source: "generated_candidate",
    useStatus: "candidate_only",
    decision: "needs_deeper_search",
    riskLevel: "unknown",
    publicUseAllowed: false,
    globalLaunchAllowed: false,
    reasons: [reason, "Unchecked candidate; no availability, clearance, or ownership is claimed."],
    reason,
    risks: [
      "Trademark conflict unknown",
      "Domain availability unknown",
      "Language review unknown",
      "Sector class review unknown",
      "Legal review not started",
    ],
    internalSafeUsage: "Private Founder review candidate only.",
    nextSafeAction: `Run manual trademark, domain, conflict, language, class, and legal review for ${name}.`,
    ahmadApprovalRequired: true,
    clearanceStatus: "unchecked",
    suggestedDomainForms: domainForms(name),
    recommendedTrademarkClasses: trademarkClassTargets,
    nextSearchAction:
      "Run WIPO, USPTO, EUIPO/TMview, Swiss IPI if applicable, domain, web conflict, social handle, app store, and legal review tasks.",
  }));
}
