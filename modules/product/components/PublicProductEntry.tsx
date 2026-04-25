import Link from "next/link";
import AuthSessionPanel from "../../auth/components/AuthSessionPanel";
import ProductLogo from "../../brand/components/ProductLogo";

type PublicProductEntryProps = {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
};

const commandPillars = [
  {
    label: "Chart first",
    value: "Price, signal, and context lead",
    note: "The workspace opens around the market, not around settings noise.",
  },
  {
    label: "TPM Assistant",
    value: "Quiet operator assist",
    note: "Guidance stays bounded, visible, and non-predictive.",
  },
  {
    label: "Trust posture",
    value: "Paper-only, fallback-first",
    note: "Live execution and broker routing remain blocked until configured.",
  },
];

const truthLedger = [
  {
    title: "Execution authority",
    summary: "Manual paper entry is available; live-money routing stays blocked.",
    chips: ["Paper-only", "Live blocked"],
  },
  {
    title: "Market source truth",
    summary: "Fallback-first market data stays labeled with bounded confidence.",
    chips: ["Fallback-first", "Bounded confidence"],
  },
  {
    title: "Connector posture",
    summary: "Broker and operator-review layers are unconfigured; no fake activation is claimed.",
    chips: ["Broker unconfigured", "No fake activation"],
  },
];

const firstUseSteps = [
  {
    step: "01",
    title: "Read market",
    note: "Asset, price, signal, and readiness are visible first.",
  },
  {
    step: "02",
    title: "Use chart + ticket",
    note: "Decision context and paper controls stay in one flow.",
  },
  {
    step: "03",
    title: "Check trust",
    note: "Fallback feed and blocked live route remain compact but explicit.",
  },
  {
    step: "04",
    title: "Verify support",
    note: "Settings and diagnostics are available without taking over the screen.",
  },
];

const planInterfaceLadder = [
  {
    title: "Free",
    badge: "Active",
    summary:
      "Familiar premium paper trading: chart, watchlist, paper ticket, basic Assistant, Why Blocked, Academy, clock, and pulse.",
  },
  {
    title: "Pro",
    badge: "Planned",
    summary:
      "Professional intelligent workspace: richer Assistant, Journal/Coach depth, decision replay, memory, alerts, and workflows.",
  },
  {
    title: "VIP",
    badge: "Planned",
    summary:
      "Elite premium workspace layer: advanced Assistant, advanced coaching, strategy review, premium reports, and private rooms when entitled.",
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
            <span className="tpm-product-kicker">Public Commercial Entry</span>
            <div className="tpm-product-chip-row">
              <span className="tpm-product-chip">Paper-only evaluation</span>
              <span className="tpm-product-chip">Fallback-first market data</span>
              <span className="tpm-product-chip">Live execution blocked</span>
            </div>
          </div>

          <div className="tpm-product-hero-layout">
            <div className="tpm-product-hero-copy">
              <ProductLogo
                className="tpm-product-hero-logo"
                subtitle="Paper-safe trading identity"
                variant="hero"
              />
              <h1>
                Trading Pro Max keeps the chart first and every action paper-safe.
              </h1>
              <p>
                Free stays familiar and premium: chart, watchlist, paper ticket, and
                compact TPM guidance. Pro and VIP carry the deeper intelligent workspace and
                premium workspace layers later, while live routing, broker/feed, billing, public
                launch, and real-money access remain inactive.
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
                  <strong>Evaluation workstation</strong>
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

            <div className="tpm-product-hero-side">
              <div className="tpm-product-signal-grid">
                {commandPillars.map((item) => (
                  <article key={item.label} className="tpm-product-signal-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>

              <AuthSessionPanel
                className="tpm-product-auth"
                title="Closed access"
                note="Sign in with seeded beta credentials to unlock protected account routes. Public registration, live execution, and real-money access remain disabled."
              />
            </div>
          </div>
        </section>

        <section className="tpm-product-section">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Plan interface</span>
              <h2>Simple at entry, deeper by plan, private where required.</h2>
            </div>
            <p>
              The public product starts like a serious trading platform. Pro and VIP explain
              future differentiation without pretending paid access, billing, or premium
              entitlement is active.
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

        <section className="tpm-product-section">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Platform truth</span>
              <h2>Capability and limits stay visible without slowing the trade flow.</h2>
            </div>
            <p>
              The entry shows what is available, what is blocked, and where to verify truth in a
              compact operator path.
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
              <h2>A short operator path keeps attention on the market.</h2>
            </div>
            <p>
              Orient fast, rehearse paper execution, and verify trust semantics without onboarding
              noise.
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
