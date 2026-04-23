import Link from "next/link";

type PublicProductEntryProps = {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
};

const productSignals = [
  {
    label: "Workstation core",
    value: "Chart + execution stay primary",
    note: "The trading surface keeps decision context, ticket controls, and market state in one operator-first flow.",
  },
  {
    label: "TPM IQ / Brain",
    value: "Interpretive, bounded guidance",
    note: "Intelligence remains visible and useful while staying non-predictive and constrained by guardrails.",
  },
  {
    label: "Trust posture",
    value: "Paper-only, fallback-first, live blocked",
    note: "Broker connectivity and operator review stay explicitly unavailable unless safely configured.",
  },
];

const truthCards = [
  {
    title: "Execution authority",
    summary:
      "Manual paper entry is available. Live-money routing is blocked and cannot be enabled from the workstation.",
    chips: ["Paper-only", "Manual operator", "Live blocked"],
  },
  {
    title: "Market source truth",
    summary:
      "Market responses remain fallback-first with explicit degraded semantics and bounded confidence messaging.",
    chips: ["Fallback-first", "Degraded visible", "Bounded confidence"],
  },
  {
    title: "Connector posture",
    summary:
      "Broker and operator-review layers are unconfigured by default and disclosed directly in diagnostics and settings.",
    chips: ["Broker unconfigured", "Review unavailable", "No fake activation"],
  },
];

const firstUseSteps = [
  {
    step: "01",
    title: "Read symbol and command center",
    note: "Start with current asset, decision posture, and ticket readiness before placing a paper action.",
  },
  {
    step: "02",
    title: "Work from chart and execution",
    note: "Chart context and the execution ticket are the primary operator surfaces for rehearsal.",
  },
  {
    step: "03",
    title: "Use IQ / Brain as guidance",
    note: "Treat AI output as interpretive support, not execution authority.",
  },
  {
    step: "04",
    title: "Validate trust state",
    note: "Confirm fallback feed, blocked live execution, and broker status in diagnostics and settings.",
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
                Trading Pro Max is a disciplined paper-trading workstation for
                high-signal market evaluation.
              </h1>
              <p>
                The product pairs chart-first execution rehearsal with TPM IQ / Brain and
                transparent runtime diagnostics. Paper-only operation, fallback feed truth,
                blocked live routing, and unconfigured broker state are explicit; this is not
                a live brokerage terminal.
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
              {productSignals.map((item) => (
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
              <h2>Capability and limits are explicit before the workstation opens.</h2>
            </div>
            <p>
              The entry keeps only essential capability and safety semantics: what is
              available now, what is intentionally blocked, and where to verify system truth.
            </p>
          </div>

          <div className="tpm-product-card-grid">
            {truthCards.map((card) => (
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
              <h2>A short operator path replaces noisy multi-section onboarding.</h2>
            </div>
            <p>
              Use this path to move from orientation to chart, ticket, and truth verification
              without extra marketing surfaces.
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
