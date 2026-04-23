import Link from "next/link";

type PublicProductEntryProps = {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
};

const productSignals = [
  {
    label: "TPM IQ / Brain",
    value: "Interpretive operator assist",
    note: "Context, execution posture, and risk awareness stay grounded in visible platform state.",
  },
  {
    label: "Trading depth layer",
    value: "Panel-first workstation",
    note: "Chart, watchlist, execution, blotter, diagnostics, and settings now behave like one mature product.",
  },
  {
    label: "Execution truth",
    value: "Paper-only manual route",
    note: "Operators can rehearse decisions without enabling live-money routing or automated profit claims.",
  },
  {
    label: "Market truth",
    value: "Fallback-first feed discipline",
    note: "Current market context stays honest about bounded confidence, degraded states, and local-safe fallbacks.",
  },
];

const trustCards = [
  {
    title: "Paper-only execution",
    summary:
      "Trading Pro Max is ready for serious evaluation, but it still enforces paper-only execution. The ticket remains professional without pretending to control real capital.",
    chips: ["Manual operator authority", "Paper route only", "Live blocked"],
  },
  {
    title: "Fallback-first market data",
    summary:
      "Market surfaces are designed to be useful even when the route is bounded by fallback data. Degraded and limited-data states stay explicit instead of hidden behind hype.",
    chips: ["Fallback-first", "Degraded states explicit", "Confidence is bounded"],
  },
  {
    title: "Broker and review gates",
    summary:
      "Broker connectivity remains unconfigured and live activation remains policy-blocked. Operator review surfaces are unavailable unless explicitly configured.",
    chips: ["Broker unconfigured", "Review unavailable", "Policy guardrails intact"],
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Frame the product first",
    note:
      "Start with the truth layer: TPM is a commercial-grade evaluation product with intelligent operator assist, not a live brokerage terminal.",
  },
  {
    step: "02",
    title: "Read the workspace quickly",
    note:
      "Use TPM IQ / Brain, market depth, and execution preflight to understand context before touching the paper ticket.",
  },
  {
    step: "03",
    title: "Validate trust surfaces",
    note:
      "Check diagnostics and settings to confirm fallback feed state, persistence, and blocked live-routing conditions.",
  },
  {
    step: "04",
    title: "Operate in evaluation mode",
    note:
      "Stay inside paper-only workflows while the platform communicates readiness, caution, and degraded states clearly.",
  },
];

const productStructureCards = [
  {
    title: "Commercial foundation",
    summary:
      "The product now presents a public entry, product trust language, onboarding cues, and route cohesion suitable for external evaluation.",
  },
  {
    title: "Account and product status",
    summary:
      "Settings and diagnostics now read like product surfaces, not internal leftovers, while still exposing blocked, fallback, and readiness truth.",
  },
  {
    title: "Future expansion, clearly marked",
    summary:
      "Packaging, support paths, and commercial growth are framed as future-ready placeholders only. No fake billing, broker activation, or live claims are implied.",
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
            <span className="tpm-product-kicker">Commercial Product Readiness</span>
            <div className="tpm-product-chip-row">
              <span className="tpm-product-chip">Paper-only evaluation</span>
              <span className="tpm-product-chip">Fallback-first market data</span>
              <span className="tpm-product-chip">Live execution blocked</span>
            </div>
          </div>

          <div className="tpm-product-hero-layout">
            <div className="tpm-product-hero-copy">
              <h1>
                Trading Pro Max is a serious operator workstation that can now be shown,
                understood, and evaluated as a public-facing product.
              </h1>
              <p>
                The platform now opens with restrained commercial framing, explicit truth about
                paper-only execution and bounded market data, and guided pathways into the
                workstation, diagnostics, and settings. The product feels ready for real user
                evaluation without pretending to have live-broker power it does not have.
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
                  <strong>Commercial evaluation foundation</strong>
                </div>
                <div>
                  <span>Execution authority</span>
                  <strong>Manual paper operator only</strong>
                </div>
                <div>
                  <span>Support routes</span>
                  <strong>Workspace, diagnostics, settings</strong>
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
              <span className="tpm-product-kicker">Public trust layer</span>
              <h2>Product truth is explicit before anyone touches the workstation.</h2>
            </div>
            <p>
              These surfaces are designed to increase trust by explaining what Trading Pro Max
              does, what remains intentionally unavailable, and how the platform behaves under
              fallback or degraded conditions.
            </p>
          </div>

          <div className="tpm-product-card-grid">
            {trustCards.map((card) => (
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
              <span className="tpm-product-kicker">Onboarding guidance</span>
              <h2>New users can move from first contact to informed evaluation quickly.</h2>
            </div>
            <p>
              The public layer now explains how to enter the platform, read the main surfaces,
              and validate the product state without adding noisy tutorial clutter.
            </p>
          </div>

          <div className="tpm-product-step-grid">
            {onboardingSteps.map((step) => (
              <article key={step.step} className="tpm-foundation-card tpm-product-step-card">
                <span>{step.step}</span>
                <strong>{step.title}</strong>
                <p>{step.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tpm-product-section">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Product structure readiness</span>
              <h2>
                Commercial surfaces are clearer, while blocked and future states remain honest.
              </h2>
            </div>
            <p>
              The product now reads as a coherent system that could support plans, support flows,
              and future account packaging without inventing capabilities that do not exist today.
            </p>
          </div>

          <div className="tpm-product-card-grid">
            {productStructureCards.map((card) => (
              <article key={card.title} className="tpm-foundation-card tpm-product-card">
                <div className="tpm-product-card-head">
                  <strong>{card.title}</strong>
                </div>
                <p>{card.summary}</p>
              </article>
            ))}
          </div>

          <div className="tpm-foundation-card tpm-product-cta-panel">
            <div>
              <span className="tpm-product-kicker">Public to platform flow</span>
              <strong>Move from product framing into the live workstation without losing context.</strong>
            </div>
            <div className="tpm-product-cta-row">
              <a
                className="tpm-product-cta tpm-product-cta-primary"
                href="#workspace-experience"
              >
                Continue into workstation
              </a>
              <Link className="tpm-product-cta" href={settingsHref}>
                Inspect product settings
              </Link>
              <Link className="tpm-product-cta tpm-product-cta-secondary" href={diagnosticsHref}>
                Inspect trust diagnostics
              </Link>
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
