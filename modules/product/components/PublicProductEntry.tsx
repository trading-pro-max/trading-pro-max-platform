import Link from "next/link";
import ProductLogo from "../../brand/components/ProductLogo";

type PublicProductEntryProps = {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
};

const heroSignals = [
  {
    label: "Paper-safe",
    value: "Current",
    note: "Start in the web workspace without live routing.",
  },
  {
    label: "Web available",
    value: "Now",
    note: "Use the browser app for workspace, settings, and diagnostics.",
  },
  {
    label: "Live inactive",
    value: "Blocked",
    note: "No broker, billing, or real-money activation is enabled.",
  },
];

const trustStates = [
  {
    label: "Free",
    value: "Paper-safe",
  },
  {
    label: "Apps",
    value: "Web current",
  },
  {
    label: "Live",
    value: "Inactive",
  },
];

const publicNavigationItems = [
  {
    id: "workspace-experience",
    href: "workspace",
    title: "Trading Workspace",
    state: "Web current",
    summary: "Open the chart-first paper workspace with TPM Assistant and Journal/Coach.",
    detail: "Chart, watchlist, paper ticket, and blocked-state explanations.",
  },
  {
    id: "markets",
    href: "#markets",
    title: "Markets",
    state: "Paper / Planned",
    summary: "Forex, Crypto, Commodities, Indices, and Stocks stay clearly labeled.",
    detail: "Paper-safe and fallback truth only; no live feed or broker claim.",
  },
  {
    href: "#plans",
    title: "Plans",
    state: "Truthful tiers",
    summary: "Free, Pro, VIP, and Institutional remain simple and scannable.",
    detail: "No fake paid activation, billing, or hidden paid plan.",
  },
  {
    href: "#apps-platforms",
    title: "Apps / Platforms",
    state: "Web current",
    summary: "Use the Web App today. Desktop, Mobile, and Tablet stay planned.",
    detail: "No fake downloads, store claims, or native installer claim.",
  },
  {
    id: "academy",
    href: "#academy",
    title: "Academy",
    state: "Learning paths",
    summary: "Getting started, paper trading basics, chart basics, and Why Blocked.",
    detail: "Includes TPM Assistant and Journal/Coach guides without advice claims.",
  },
  {
    id: "community",
    href: "#community",
    title: "Community",
    state: "Planned spaces",
    summary: "Learning, feedback, support, Pro community, and VIP rooms are planned.",
    detail: "No fake members, active rooms, signal rooms, or copy trading.",
  },
  {
    id: "support",
    href: "#support",
    title: "Support",
    state: "Readiness",
    summary: "Help Center, Contact Support, Report a Problem, and Security Contact.",
    detail: "Partnership Contact readiness only; no fake ticket system.",
  },
];

const planInterfaceLadder = [
  {
    title: "Free",
    badge: "Active",
    summary: "Familiar paper-safe workspace with chart, watchlist, Assistant, and learning basics.",
  },
  {
    title: "Pro",
    badge: "Planned",
    summary: "Professional tools planned for deeper workspace guidance and Journal/Coach depth.",
  },
  {
    title: "VIP",
    badge: "Planned",
    summary: "Premium advanced layer planned for deeper coaching and Premium Reports.",
  },
  {
    title: "Institutional",
    badge: "Future",
    summary: "Future controlled team-ready layer for formal institutional workflows.",
  },
];

const appPlatformReadiness = [
  {
    title: "Web App",
    state: "Current",
    summary: "Available now for Home, Trading Workspace, Settings, and Diagnostics.",
  },
  {
    title: "Desktop App",
    state: "Planned",
    summary: "Future desktop packaging readiness only; no public installer claim.",
  },
  {
    title: "Mobile App",
    state: "Planned",
    summary: "Future mobile readiness only; no store release or push activation claim.",
  },
  {
    title: "Tablet",
    state: "Future",
    summary: "Future responsive product direction; no separate app is active.",
  },
];

const safetyTruth = [
  "Paper-safe",
  "No real-money routing",
  "Live execution inactive",
  "Broker/feed not configured",
];

export default function PublicProductEntry({ workspaceHref }: PublicProductEntryProps) {
  return (
    <div className="tpm-product-shell">
      <section className="tpm-foundation-page tpm-product-entry">
        <section className="tpm-foundation-card tpm-product-hero">
          <div className="tpm-product-kicker-row">
            <span className="tpm-product-kicker">Trading workspace</span>
            <div className="tpm-product-chip-row">
              <span className="tpm-product-chip">Paper-safe</span>
              <span className="tpm-product-chip">Web available</span>
              <span className="tpm-product-chip">Live inactive</span>
            </div>
          </div>

          <div className="tpm-product-hero-layout">
            <div className="tpm-product-hero-copy">
              <ProductLogo
                className="tpm-product-hero-logo"
                motionIntensity="low"
                state="paper_safe"
                surface="public_entry"
                variant="hero"
              />
              <h1>A familiar paper-safe trading workspace with a sharper edge.</h1>
              <p>
                Trading Pro Max gives users a clean way into the web workspace, market
                categories, learning paths, plan clarity, and readiness truth without extra
                complexity.
              </p>

              <div className="tpm-product-cta-row">
                <Link className="tpm-product-cta tpm-product-cta-primary" href={workspaceHref}>
                  Enter workspace
                </Link>
                <Link className="tpm-product-cta tpm-product-cta-secondary" href="#apps-platforms">
                  View platforms
                </Link>
              </div>

              <div className="tpm-product-proof-row">
                {trustStates.map((item) => (
                  <div key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="tpm-product-hero-side">
              <div className="tpm-product-signal-grid">
                {heroSignals.map((item) => (
                  <article key={item.label} className="tpm-product-signal-card">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="tpm-product-section tpm-product-section-compact" id="public-navigation">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Product navigation</span>
              <h2>Everything users need, without the overload.</h2>
            </div>
            <p>
              Home now guides users to the right public surface instead of showing the whole
              product at once.
            </p>
          </div>

          <div className="tpm-public-world-nav-grid">
            {publicNavigationItems.map((item) => (
              <a
                key={`${item.title}-${item.href}`}
                className="tpm-public-world-nav-card"
                href={item.href === "workspace" ? workspaceHref : item.href}
                id={item.id}
              >
                <div className="tpm-public-world-nav-card-head">
                  <strong>{item.title}</strong>
                  <em>{item.state}</em>
                </div>
                <span>{item.summary}</span>
                <small>{item.detail}</small>
              </a>
            ))}
          </div>
        </section>

        <section id="plans" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Plans at a glance</span>
              <h2>Free starts simple. Pro and VIP add depth when available.</h2>
            </div>
            <p>Plans stay short, truthful, and public-safe.</p>
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

        <section id="apps-platforms" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Apps / Platforms</span>
              <h2>Use the Web App today. Desktop and mobile stay planned.</h2>
            </div>
            <p>
              No fake downloads, no store listing claim, and no native installer claim.
            </p>
          </div>

          <div className="tpm-public-readiness-grid">
            {appPlatformReadiness.map((item) => (
              <article key={item.title} className="tpm-foundation-card tpm-product-card">
                <div className="tpm-product-card-head">
                  <strong>{item.title}</strong>
                  <span className="tpm-product-chip">{item.state}</span>
                </div>
                <p>{item.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tpm-product-section tpm-product-truth-strip">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Readiness stays honest</span>
              <h2>Paper-safe now. Live, billing, and broker routing stay inactive.</h2>
            </div>
            <p>
              Live execution, real-money routing, broker/feed activation, billing, social
              publishing, and public launch remain inactive.
            </p>
          </div>
          <div className="tpm-product-truth-grid">
            {safetyTruth.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
