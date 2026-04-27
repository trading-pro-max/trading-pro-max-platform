const STATUS_LABELS: Record<string, string> = {
  active_with_notes: "Active with notes",
  active: "Active",
  needs_review: "Needs Ahmad review",
  needs_visual_review: "Needs Ahmad review",
  complete_with_notes: "Complete with notes",
  visual_acceptance_needed: "Ahmad visual acceptance needed",
  not_started: "Not started",
  not_ready: "Not ready",
  ready_with_notes: "Ready with notes",
  private_readiness: "Private readiness",
  blocked_actions: "Blocked actions",
  one_next_action: "One next action",
  waiting_ahmad_visual_acceptance: "Ahmad visual acceptance needed",
  activate_with_notes: "Activate with notes",
  pass_with_notes: "Pass with notes",
  preview_ready: "Preview ready",
  private_founder_only: "Private Founder-only",
  readiness_only: "Readiness only",
  needs_proof: "Needs proof",
};

export function formatAlkonStatusLabel(value: unknown): string {
  if (value === null || value === undefined) return "Unknown";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);

  const raw = String(value).trim();
  const mapped = STATUS_LABELS[raw];
  if (mapped) return mapped;
  if (!raw.includes("_")) return raw;

  return raw
    .split("_")
    .filter(Boolean)
    .map((part, index) =>
      index === 0
        ? part.charAt(0).toUpperCase() + part.slice(1)
        : part
    )
    .join(" ");
}

export function formatAlkonStatusList(values: string[]) {
  return values.map((value) => formatAlkonStatusLabel(value));
}
