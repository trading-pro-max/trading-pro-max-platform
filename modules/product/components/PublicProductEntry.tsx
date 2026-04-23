import Link from "next/link";

type PublicProductEntryProps = {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
};

const commandPillars = [
  {
    label: "Workstation core",
    value: "Chart + execution stay primary",
    note: "Decision context and ticket controls stay in one operator-first lane.",
  },
  {
    label: "TPM IQ / Brain",
    value: "Interpretive, bounded guidance",
    note: "Intelligence stays visible but non-predictive and guardrail-bound.",
  },
  {
    label: "Trust posture",
    value: "Paper-only, fallback-first, live blocked",
    note: "Broker and review layers remain unavailable until configured.",
  },
];

const truthLedger = [
  {
    title: "Execution authority",
    summary: "Manual paper entry is available. Live-money routing stays blocked.",
    chips: ["Paper-only", "Manual operator", "Live blocked"],
  },
  {
    title: "Market source truth",
    summary: "Market responses remain fallback-first with explicit degraded semantics.",
    chips: ["Fallback-first", "Degraded visible", "Bounded confidence"],
  },
  {
    title: "Connector posture",
    summary: "Broker and operator-review layers are unconfigured by default.",
    chips: ["Broker unconfigured", "Review unavailable", "No fake activation"],
  },
  {
    title: "Commercial claim boundary",
    summary: "This is not a live brokerage terminal and it does not claim live activation.",
    chips: ["not a live brokerage terminal", "No fake activation", "Truthful semantics"],
  },
];

const firstUseSteps = [
  {
    step: "01",
    title: "Read symbol and state",
    note: "Confirm asset, signal, and ticket readiness before taking action.",
  },
  {
    step: "02",
    title: "Work from chart and execution",
    note: "Chart context and the execution ticket are the primary surfaces.",
  },
  {
    step: "03",
    title: "Verify trust truth",
    note: "Fallback feed, blocked live route, and connector state stay explicit.",
  },
  {
    step: "04",
    title: "Route to diagnostics/settings",
    note: "Use support routes for proof, not speculation.",
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
            <span className="tpm-product-kicker">Public Commercial Entry</span>
            <div className="tpm-product-chip-row">
              <span className="tpm-product-chip">Paper-only evaluation</span>
              <span className="tpm-product-chip">Fallback-first market data</span>
              <span className="tpm-product-chip">Live execution blocked</span>
            </div>
          </div>

          <div className="tpm-product-hero-layout">
            <div className="tpm-product-hero-copy">
              <h1>
                Trading Pro Max is a disciplined trading workstation for
                paper-safe market command.
              </h1>
              <p>
                Chart-first execution rehearsal, TPM IQ / Brain guidance, and diagnostics-ready
                trust semantics stay in one operator flow. Paper-only operation, fallback feed
                truth, blocked live routing, and broker unconfigured state remain explicit; this
                is not a live brokerage terminal.
              </p>

              <div className="tpm-product-cta-row">
                <a
                  className="tpm-product-cta tpm-product-cta-primary"
                  href="#workspace-experience"
                >
                  Enter workstation
                </a>
                <Link className="tpm-product-cta" href={workspaceHref}>
                  Open localized workspace
                </Link>
                <Link className="tpm-product-cta tpm-product-cta-secondary" href={diagnosticsHref}>
                  Review diagnostics
                </Link>
              </div>

              <div className="tpm-product-proof-row">
                <div>
                  <span>Product mode</span>
                  <strong>Commercial evaluation workstation</strong>
                </div>
                <div>
                  <span>Execution</span>
                  <strong>Paper-only manual route</strong>
                </div>
                <div>
                  <span>Broker state</span>
                  <strong>Unconfigured / blocked</strong>
                </div>
              </div>
            </div>

            <div className="tpm-product-signal-grid">
              {commandPillars.map((item) => (
                <article key={item.label} className="tpm-product-signal-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="tpm-product-section">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Platform truth</span>
              <h2>Capability and limits are explicit before command begins.</h2>
            </div>
            <p>
              The entry shows what is available now, what is blocked by policy, and where to
              verify runtime truth.
            </p>
          </div>

          <div className="tpm-product-card-grid">
            {truthLedger.map((card) => (
              <article key={card.title} className="tpm-foundation-card tpm-product-card">
                <div className="tpm-product-card-head">
                  <strong>{card.title}</strong>
                </div>
                <p>{card.summary}</p>
                <div className="tpm-product-chip-row tpm-product-chip-row-left">
                  {card.chips.map((chip) => (
                    <span key={chip} className="tpm-product-chip">
                      {chip}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tpm-product-section">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">First-use path</span>
              <h2>A short operator path keeps attention on decisions, not onboarding noise.</h2>
            </div>
            <p>
              Use this path to orient fast, execute paper rehearsal, and verify trust semantics.
            </p>
          </div>

          <div className="tpm-product-step-grid">
            {firstUseSteps.map((step) => (
              <article key={step.step} className="tpm-foundation-card tpm-product-step-card">
                <span>{step.step}</span>
                <strong>{step.title}</strong>
                <p>{step.note}</p>
              </article>
            ))}
          </div>

          <div className="tpm-foundation-card tpm-product-cta-panel">
            <div>
              <span className="tpm-product-kicker">Route flow</span>
              <strong>Product entry, workstation, settings, and diagnostics stay one coherent system.</strong>
            </div>
            <div className="tpm-product-cta-row">
              <a
                className="tpm-product-cta tpm-product-cta-primary"
                href="#workspace-experience"
              >
                Enter workstation
              </a>
              <Link className="tpm-product-cta" href={settingsHref}>
                Open settings
              </Link>
              <Link className="tpm-product-cta tpm-product-cta-secondary" href={diagnosticsHref}>
                Open diagnostics
              </Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
