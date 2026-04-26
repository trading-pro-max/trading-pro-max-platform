import type { NumberOneEvaluationTarget, PublicClaimFirewallResult } from "./types";

const BLOCKED_CLAIMS: Array<{ term: string; pattern: RegExp }> = [
  { term: "#1", pattern: /#\s*1|\bnumber\s+one\b/i },
  { term: "best", pattern: /\bbest\b/i },
  { term: "world's best", pattern: /\bworld['’]s\s+best\b/i },
  { term: "global financial center", pattern: /\bglobal\s+financial\s+center\b/i },
  { term: "guaranteed", pattern: /\bguaranteed?\b|\bguarantee\b/i },
  { term: "win-rate", pattern: /\bwin[-\s]?rate\b/i },
  { term: "profit", pattern: /\bprofit\b|\bprofits\b/i },
  { term: "licensed", pattern: /\blicensed\b|\blicence[d]?\b/i },
  { term: "regulated", pattern: /\bregulated\b|\bregulatory\s+approved\b/i },
  { term: "Swiss legal status", pattern: /\bSwiss\s+(legal|company|regulated)\b/i },
  { term: "Sharia certified", pattern: /\bSharia\s+certified\b|\bIslamic\s+certification\b/i },
  { term: "official partnership", pattern: /\bofficial\s+partner(ship)?\b/i },
  { term: "fake app availability", pattern: /\b(app store|download now|mobile app available)\b/i },
  { term: "live execution", pattern: /\blive\s+execution\s+(active|available|enabled)\b/i },
  { term: "billing active", pattern: /\bbilling\s+(active|available|enabled)\b/i },
];

export function evaluatePublicClaimFirewall(
  textOrTarget: string | NumberOneEvaluationTarget
): PublicClaimFirewallResult {
  const text =
    typeof textOrTarget === "string"
      ? textOrTarget
      : `${textOrTarget.title} ${textOrTarget.description} ${textOrTarget.claimText ?? ""}`;
  const blockedTerms = BLOCKED_CLAIMS.filter((claim) =>
    claim.pattern.test(text)
  ).map((claim) => claim.term);

  if (blockedTerms.length > 0) {
    return {
      allowed: false,
      status: "blocked",
      blockedTerms,
      reason:
        "Public copy cannot claim #1 status, best-in-world status, legal/regulatory status, profit, win rate, app availability, or activation without future proof and approval.",
      safeAlternative:
        "Use paper-safe, planned, future, readiness, AI-guided, learning-first, transparent, or private command systems remain internal.",
    };
  }

  return {
    allowed: true,
    status: "allowed",
    blockedTerms: [],
    reason: "Copy stays inside public-safe truth language.",
    safeAlternative:
      "Keep using paper-safe, planned, inactive, future, readiness, transparent, and learning-first wording.",
  };
}

export const PUBLIC_CLAIM_FIREWALL_SAFE_WORDING = [
  "paper-safe",
  "planned",
  "future",
  "readiness",
  "AI-guided",
  "learning-first",
  "transparent",
  "private command systems remain internal",
];
