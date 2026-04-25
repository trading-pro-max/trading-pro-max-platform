import Link from "next/link";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import ProductLogo from "../../brand/components/ProductLogo";

type PublicProductEntryProps = {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
};

const platformSignals = [
  {
    label: "Workspace",
    value: "Chart first",
    note: "A familiar market view with a clean paper ticket.",
  },
  {
    label: "TPM Assistant",
    value: "Basic guidance",
    note: "Compact explanations for state, plan, and blocked actions.",
  },
  {
    label: "Safety",
    value: "Paper-safe",
    note: "Live, real-money, billing, broker, and launch claims stay inactive.",
  },
];

const truthLedger = [
  {
    label: "Mode",
    value: "Free paper workspace",
  },
  {
    label: "Execution",
    value: "Paper-only",
  },
  {
    label: "Live route",
    value: "Blocked",
  },
];

const planInterfaceLadder = [
  {
    title: "Free",
    badge: "Active",
    summary:
      "Familiar paper trading with chart, watchlist, paper ticket, TPM Assistant, Academy, and concise readiness labels.",
  },
  {
    title: "Pro",
    badge: "Planned",
    summary:
      "Professional workspace layer for richer Assistant guidance, Journal/Coach depth, replay, alerts, and workflows when entitled.",
  },
  {
    title: "VIP",
    badge: "Planned",
    summary:
      "Premium advanced layer for deeper Assistant support, strategy review, premium reports, and private rooms when entitled.",
  },
  {
    title: "Institutional",
    badge: "Future",
    summary:
      "Future team, admin, audit, compliance, runbook, and institution-grade support layer.",
  },
];

export default function PublicProductEntry({
  diagnosticsHref,
  settingsHref,
  workspaceHref,
}: PublicProductEntryProps) {
  return (
    <div className="tpm-product-shell">
      <section className="tpm-foundation-page tpm-product-entry">
        <section className="tpm-foundation-card tpm-product-hero">
          <div className="tpm-product-kicker-row">
            <span className="tpm-product-kicker">Trading workspace</span>
            <div className="tpm-product-chip-row">
              <span className="tpm-product-chip">Free paper-safe access</span>
              <span className="tpm-product-chip">Swiss precision identity</span>
              <span className="tpm-product-chip">Live execution blocked</span>
            </div>
          </div>

          <div className="tpm-product-hero-layout">
            <div className="tpm-product-hero-copy">
              <ProductLogo
                className="tpm-product-hero-logo"
                subtitle="Swiss-inspired intelligent trading workspace"
                variant="hero"
              />
              <h1>
                A familiar paper-safe trading workspace with a sharper edge.
              </h1>
              <p>
                Trading Pro Max opens around the chart, the watchlist, and a clear paper
                execution ticket. Free stays simple and premium; Pro and VIP introduce deeper
                professional layers only when real entitlement support exists.
              </p>

              <div className="tpm-product-cta-row">
                <Link className="tpm-product-cta tpm-product-cta-primary" href={workspaceHref}>
                  Enter workspace
                </Link>
                <Link className="tpm-product-cta tpm-product-cta-secondary" href={diagnosticsHref}>
                  Review readiness
                </Link>
              </div>

              <div className="tpm-product-proof-row">
                {truthLedger.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>

              <p className="tpm-product-route-note">
                Settings remains available for account, plan, Assistant, theme, and language
                controls.{" "}
                <Link href={settingsHref}>Open settings</Link>
              </p>
            </div>

            <div className="tpm-product-hero-side">
              <div className="tpm-product-signal-grid">
                {platformSignals.map((item) => (
                  <article key={item.label} className="tpm-product-signal-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>

              <AuthSessionPanel
                className="tpm-product-auth"
                title="Account access"
                note="Sign in with seeded beta credentials for protected account routes. Registration, live execution, real money, and billing remain disabled."
              />
            </div>
          </div>
        </section>

        <section className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Plans at a glance</span>
              <h2>Simple first. Deeper only when the plan actually supports it.</h2>
            </div>
            <p>
              Public plans stay easy to scan and truthful: no fake paid activation, no billing
              claim, no real-money access, and no restricted controls.
            </p>
          </div>

          <div className="tpm-product-plan-grid">
            {planInterfaceLadder.map((plan) => (
              <article key={plan.title} className="tpm-foundation-card tpm-product-card">
                <div className="tpm-product-card-head">
                  <strong>{plan.title}</strong>
                  <span className="tpm-product-chip">{plan.badge}</span>
                </div>
                <p>{plan.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tpm-product-section tpm-product-truth-strip">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Readiness stays honest</span>
              <h2>Free is paper-safe; Pro and VIP remain planned unless entitled.</h2>
            </div>
            <p>
              Live execution, real money, broker/feed activation, billing, and public launch stay
              inactive until future configuration and approval.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}
