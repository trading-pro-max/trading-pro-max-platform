"use client";

export type ShellStatusTone = "ready" | "planned" | "inactive" | "blocked" | "neutral";

export type ShellStatusBadge = {
  label: string;
  tone?: ShellStatusTone;
};

type ShellStatusBadgesProps = {
  items: ShellStatusBadge[];
  variant: "public" | "workspace" | "founder";
};

export const PUBLIC_SHELL_STATUS_BADGES: ShellStatusBadge[] = [
  { label: "Paper-safe", tone: "ready" },
  { label: "Web current", tone: "ready" },
  { label: "Live inactive", tone: "inactive" },
];

export default function ShellStatusBadges({
  items,
  variant,
}: ShellStatusBadgesProps) {
  return (
    <div
      className={`tpm-shell-status tpm-shell-status-${variant}`}
      data-shell-status={variant}
      aria-label={`${variant} readiness status`}
    >
      {items.map((item) => (
        <span
          key={item.label}
          className={`tpm-shell-status-badge ${item.tone ?? "neutral"}`}
        >
          {item.label}
        </span>
      ))}
    </div>
  );
}
