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

const capabilityLanes = [
  {
    title: "Workstation",
    state: "Available",
    summary:
      "A mature operator surface with chart, watchlist, command center, execution ticket, blotter, diagnostics, and settings.",
    points: ["Panel-first workflow", "Keyboard layout shortcuts", "Persistent preferences"],
  },
  {
    title: "TPM IQ / Brain",
    state: "Available",
    summary:
      "An intelligence layer that explains market context, execution posture, operator guidance, and product truth.",
    points: ["Interpretive only", "Bounded confidence", "Never overrides guardrails"],
  },
  {
    title: "Paper execution",
    state: "Manual only",
    summary:
      "The ticket supports local paper rehearsal and operator review without claiming live-money routing.",
    points: ["Paper route only", "Click-confirmed actions", "Risk gates visible"],
  },
  {
    title: "Live and broker",
    state: "Blocked",
    summary:
      "Real-money routing, broker connectivity, and operator review remain unavailable unless explicitly configured later.",
    points: ["Live blocked", "Broker unconfigured", "No activation shortcut"],
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

const trustLedgerRows = [
  {
    state: "Visible",
    title: "Public product entry and workstation",
    detail:
      "The entry route explains the product, then hands off into the actual workstation instead of hiding the platform behind marketing.",
  },
  {
    state: "Paper only",
    title: "Execution authority",
    detail:
      "Manual paper rehearsal is available, while real-money execution and broker routing remain blocked.",
  },
  {
    state: "Fallback",
    title: "Market data truth",
    detail:
      "The platform labels fallback-first market data, degraded feed behavior, and bounded confidence directly in the UI.",
  },
  {
    state: "Unconfigured",
    title: "Broker, billing, and operator review",
    detail:
      "No broker connection, billing system, plan gating, or review queue is presented as active when it is not built or configured.",
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Start with product truth",
    note:
      "Trading Pro Max is a commercial-grade evaluation workstation with intelligent operator assist, not a live brokerage terminal.",
  },
  {
    step: "02",
    title: "Read the command center",
    note:
      "Use the topbar, command center, and IQ / Brain deck to understand asset state, confidence, and operator posture.",
  },
  {
    step: "03",
    title: "Inspect chart and market depth",
    note:
      "Treat the chart, watchlist, market depth panel, and fallback labels as context surfaces, not predictive guarantees.",
  },
  {
    step: "04",
    title: "Use the paper ticket carefully",
    note:
      "The execution panel is for manual paper rehearsal only; no execution hotkeys, broker routes, or live-money paths are armed.",
  },
  {
    step: "05",
    title: "Validate trust surfaces",
    note:
      "Check diagnostics and settings to confirm fallback feed state, persistence, and blocked live-routing conditions.",
  },
  {
    step: "06",
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

const routeMap = [
  {
    label: "Public entry",
    value: "/",
    note: "Commercial framing, onboarding, trust ledger, and workstation handoff.",
  },
  {
    label: "Localized workstation",
    value: "/en",
    note: "Full trading surface with IQ / Brain, chart depth, ticket, blotter, and route truth.",
  },
  {
    label: "Settings",
    value: "/en/settings",
    note: "Account mode, persistence, product readiness, and commercial packaging truth.",
  },
  {
    label: "Diagnostics",
    value: "/diagnostics",
    note: "Runtime probes, connector safety, fallback data state, and blocked live-routing evidence.",
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
              <span className="tpm-product-chip">Evaluation workstation</span>
              <span className="tpm-product-chip">TPM IQ / Brain</span>
              <span className="tpm-product-chip">Paper-only evaluation</span>
              <span className="tpm-product-chip">Fallback data disclosed</span>
              <span className="tpm-product-chip">Live execution blocked</span>
            </div>
          </div>

          <div className="tpm-product-hero-layout">
            <div className="tpm-product-hero-copy">
              <h1>
                A premium paper-trading command center for evaluating market context,
                operator discipline, and product readiness.
              </h1>
              <p>
                Trading Pro Max combines a professional workstation, TPM IQ / Brain,
                manual paper execution, diagnostics, and settings into one coherent product
                experience. It is intentionally clear about fallback-first market data,
                blocked live execution, unconfigured broker connectivity, and the absence of
                active billing or live-broker claims.
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
              <span className="tpm-product-kicker">Product capability map</span>
              <h2>Users can see what the platform does before they operate it.</h2>
            </div>
            <p>
              The public entry separates workstation capability, intelligence support,
              paper execution, and blocked live-broker truth so evaluation starts with a
              clear mental model instead of assumptions.
            </p>
          </div>

          <div className="tpm-product-lane-grid">
            {capabilityLanes.map((lane) => (
              <article key={lane.title} className="tpm-product-lane-card">
                <div className="tpm-product-lane-head">
                  <strong>{lane.title}</strong>
                  <span>{lane.state}</span>
                </div>
                <p>{lane.summary}</p>
                <div className="tpm-product-lane-points">
                  {lane.points.map((point) => (
                    <span key={point}>{point}</span>
                  ))}
                </div>
              </article>
            ))}
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

          <div className="tpm-foundation-card tpm-product-ledger">
            <div className="tpm-product-ledger-head">
              <span className="tpm-product-kicker">Commercial operating ledger</span>
              <strong>Truthful states are visible, not buried.</strong>
            </div>
            <div className="tpm-product-ledger-grid">
              {trustLedgerRows.map((row) => (
                <article key={row.title} className="tpm-product-ledger-row">
                  <span>{row.state}</span>
                  <strong>{row.title}</strong>
                  <p>{row.detail}</p>
                </article>
              ))}
            </div>
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
              <span className="tpm-product-kicker">First-use route map</span>
              <h2>The product gives new users a clean path through every main surface.</h2>
            </div>
            <p>
              Route-level orientation is explicit across the entry page, localized
              workstation, settings, and diagnostics so external reviewers know where to
              verify capability, account state, fallback behavior, and blocked features.
            </p>
          </div>

          <div className="tpm-product-route-map">
            {routeMap.map((route) => (
              <article key={route.value} className="tpm-product-route-card">
                <span>{route.label}</span>
                <strong>{route.value}</strong>
                <p>{route.note}</p>
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
