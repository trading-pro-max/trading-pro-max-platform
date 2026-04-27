import type { ReactNode } from "react";
import ShellStatusBadges from "./ShellStatusBadges";

type PrivateFounderShellProps = {
  checkedAt?: string;
  children: ReactNode;
};

const founderCommandMarkers = [
  "Kernel 0-16",
  "Zero Truth",
  "Wake Report",
  "One Next Action",
  "Local Day One Gate",
];

export default function PrivateFounderShell({
  checkedAt,
  children,
}: PrivateFounderShellProps) {
  return (
    <div
      className="tpm-app-shell tpm-founder-shell"
      data-shell-mode="founder_private"
      data-owner-only="true"
      data-public-route-exposed="false"
    >
      <header className="tpm-founder-shell-header" aria-label="Private Alkon founder shell">
        <div className="alkon-private-shell-brand" aria-label="Alkon private identity">
          <span className="alkon-private-mark" aria-hidden="true">
            A
          </span>
          <div className="alkon-private-copy">
            <strong>Alkon / الكون</strong>
            <small>Private Founder Universe</small>
          </div>
        </div>

        <div className="tpm-shell-nav tpm-shell-nav-founder" aria-label="Private Alkon command markers">
          {founderCommandMarkers.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>

        <ShellStatusBadges
          items={[
            { label: "Ahmad only", tone: "blocked" },
            { label: "Read-only", tone: "ready" },
            { label: checkedAt ? `Checked ${checkedAt}` : "Alkon private", tone: "neutral" },
          ]}
          variant="founder"
        />
      </header>

      {children}
    </div>
  );
}
