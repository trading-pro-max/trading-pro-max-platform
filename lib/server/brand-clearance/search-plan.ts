import type { BrandSearchSource, TrademarkClassTarget } from "./types";

export const brandSearchSources: BrandSearchSource[] = [
  "WIPO Global Brand Database",
  "USPTO Trademark Search",
  "EUIPO / TMview",
  "Swiss IPI / Swissreg",
  "Domain availability",
  "Google/web conflict scan",
  "Social handle scan",
  "App store name scan",
];

export const trademarkClassTargets: TrademarkClassTarget[] = [
  {
    classNumber: 9,
    label: "Software and downloadable applications",
    reason: "Pro Max public world and trading workspace are software surfaces.",
  },
  {
    classNumber: 35,
    label: "Business operations and commercial services",
    reason: "Future public world may include business support and platform services.",
  },
  {
    classNumber: 36,
    label: "Financial information and trading education surfaces",
    reason: "Trading, markets, paper-safe finance, and public trust claims require review.",
  },
  {
    classNumber: 41,
    label: "Education and academy",
    reason: "Academy and learning surfaces are planned public-safe extensions.",
  },
  {
    classNumber: 42,
    label: "SaaS, AI assistant, and technology services",
    reason: "Assistant, operating layer, diagnostics, and platform services require review.",
  },
];

export function getBrandSearchPlan(candidateName = "final global brand candidate") {
  return {
    candidateName,
    sources: brandSearchSources,
    classTargets: trademarkClassTargets,
    automaticLegalClaim: false as const,
    finalApprovalWithoutLegalReview: false as const,
    notes: [
      "No automated search result is treated as legal clearance.",
      "No name becomes public/global brand until Ahmad approval and legal review pass.",
      "Domain checks are review tasks only; no purchase is attempted from the app.",
    ],
  };
}
