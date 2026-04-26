import type { ReactNode } from "react";
import ProductLogo from "../../brand/components/ProductLogo";
import ShellStatusBadges from "./ShellStatusBadges";

type PrivateFounderShellProps = {
  checkedAt?: string;
  children: ReactNode;
};

const founderNavItems = [
  "Alkon",
  "Earth Command",
  "Moon Cycle",
  "Orbit Command",
  "Construction",
  "Defense",
  "Memory",
  "World Interface",
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
      <header className="tpm-founder-shell-header" aria-label="Private Founder command shell">
        <ProductLogo
          className="tpm-shell-logo tpm-founder-shell-logo"
          motionIntensity="medium"
          state="local_only"
          surface="founder_command"
          subtitle="Private Founder Command"
          variant="command"
        />

        <nav className="tpm-shell-nav tpm-shell-nav-founder" aria-label="Private command navigation">
          {founderNavItems.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>

        <ShellStatusBadges
          items={[
            { label: "Owner-only", tone: "blocked" },
            { label: "Read-only", tone: "ready" },
            { label: checkedAt ? `Checked ${checkedAt}` : "Internal", tone: "neutral" },
          ]}
          variant="founder"
        />
      </header>

      {children}
    </div>
  );
}
