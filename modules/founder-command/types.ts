import type { FounderCommandRoomFoundationSnapshot } from "@/lib/server/founder-command";

export type FounderCommandRoomProps = {
  snapshot?: FounderCommandRoomFoundationSnapshot;
  className?: string;
};

export type FounderCommandPanelTone =
  | "ready"
  | "review"
  | "approval"
  | "blocked"
  | "planned";

export function toneFromCommandState(
  state: string,
  riskLevel?: string
): FounderCommandPanelTone {
  if (state === "blocked" || riskLevel === "critical") return "blocked";
  if (riskLevel === "high" || state === "founder_approval_required") return "approval";
  if (state === "review_required" || riskLevel === "medium" || state === "degraded") {
    return "review";
  }
  if (state === "planned" || state === "inactive") return "planned";
  return "ready";
}
