import "server-only";

export function explainAlKawnDesktopBoundary(action: string): string {
  const normalized = action.toLowerCase();

  if (/(legal|finma|license|regulated|trademark|contract|court)/.test(normalized)) {
    return "Legal stop: Ahmad approval is required before any official/legal/regulatory matter.";
  }

  if (/(money|payment|billing|bank|broker|trading|payout|subscription)/.test(normalized)) {
    return "Money stop: Ahmad approval is required before payment, receiving funds, bank, broker, or real trading actions.";
  }

  if (/(public universe|public alkon|secret|api key|product truth disabled)/.test(normalized)) {
    return "Blocked by Product Truth: the action would expose private systems, secrets, or disable truth protection.";
  }

  return "Direct internal execution: safe private audit, report, planning, or task work may proceed inside الكون.";
}
