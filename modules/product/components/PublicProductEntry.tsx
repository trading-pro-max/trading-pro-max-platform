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
    note: "A calmer premium market view with a clean paper ticket.",
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

const publicNavigationItems = [
  {
    href: "#workspace-experience",
    title: "Trading Workspace",
    summary: "Chart-first paper workspace with clear blocked-state truth.",
  },
  {
    href: "#markets",
    title: "Markets",
    summary: "Paper-safe market categories with fallback and planned states.",
  },
  {
    href: "#plans",
    title: "Plans",
    summary: "Free, Pro, VIP, and Institutional shown without fake activation.",
  },
  {
    href: "#apps-platforms",
    title: "Apps / Platforms",
    summary: "Web App current; desktop and mobile remain planned.",
  },
  {
    href: "#academy",
    title: "Academy",
    summary: "Learning paths for platform, chart, paper mode, and safety basics.",
  },
  {
    href: "#community",
    title: "Community",
    summary: "Learning and feedback spaces planned without fake members.",
  },
  {
    href: "#support",
    title: "Support",
    summary: "Public-safe help, problem reporting, and contact readiness.",
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

const marketReadiness = [
  {
    title: "Forex",
    state: "Paper-safe",
    summary: "Fallback-labeled context for familiar currency workspace review.",
  },
  {
    title: "Crypto",
    state: "Paper-safe",
    summary: "Paper review only; no exchange, wallet, or real-money routing.",
  },
  {
    title: "Commodities",
    state: "Fallback",
    summary: "Market context is available for product review with truth labels.",
  },
  {
    title: "Indices",
    state: "Planned",
    summary: "Planned category for future market coverage, not active feed access.",
  },
  {
    title: "Stocks",
    state: "Future",
    summary: "Future category; no broker/feed activation is implied.",
  },
];

const appPlatformReadiness = [
  {
    title: "Web App",
    state: "Available / Current",
    summary: "Current local web experience for public entry, workspace, settings, and diagnostics.",
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

const academyReadiness = [
  "Getting started",
  "Paper trading basics",
  "Chart basics",
  "Risk basics",
  "Why Blocked",
  "TPM Assistant guide",
  "Journal/Coach guide",
];

const communityReadiness = [
  {
    title: "Learning community",
    state: "Planned",
  },
  {
    title: "Feedback room",
    state: "Planned",
  },
  {
    title: "Pro community",
    state: "Planned",
  },
  {
    title: "VIP rooms",
    state: "Planned",
  },
];

const supportReadiness = [
  "Help Center readiness",
  "Contact Support readiness",
  "Report a Problem",
  "Security Contact",
  "Partnership Contact",
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
              <span className="tpm-product-chip">Readiness-first</span>
              <span className="tpm-product-chip">Live execution blocked</span>
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
              <h1>
                A calmer, chart-first trading workspace for paper-safe review.
              </h1>
              <p>
                Trading Pro Max opens around a deeper chart, a clear paper execution ticket,
                and a clean professional product surface. Free stays familiar and premium;
                Pro and VIP introduce deeper professional layers only when real entitlement
                support exists.
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

        <section className="tpm-product-section tpm-product-section-compact" id="public-navigation">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Product navigation</span>
              <h2>Everything users need, kept simple and professional.</h2>
            </div>
            <p>
              Navigation stays focused on workspace, markets, plans, learning, support,
              settings, and readiness. Advanced build and approval systems stay hidden.
            </p>
          </div>

          <div className="tpm-public-world-nav-grid">
            {publicNavigationItems.map((item) => (
              <a key={item.href} className="tpm-public-world-nav-card" href={item.href}>
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </a>
            ))}
          </div>
        </section>

        <section id="plans" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Plans at a glance</span>
              <h2>Simple first. Deeper only when the plan actually supports it.</h2>
            </div>
            <p>
              Public plans stay easy to scan and truthful: no fake paid activation, no billing
              claim, no real-money access, and no advanced control surface.
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

        <section id="markets" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Markets</span>
              <h2>Paper-safe market categories, clearly labeled.</h2>
            </div>
            <p>
              Markets support product review and learning only. Live feed, broker routing, and
              real-money access remain inactive.
            </p>
          </div>

          <div className="tpm-public-readiness-grid">
            {marketReadiness.map((item) => (
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

        <section id="apps-platforms" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Apps / Platforms</span>
              <h2>Web first; desktop and mobile stay planned.</h2>
            </div>
            <p>
              Platform wording stays honest: the Web App is current, while desktop, mobile, and
              tablet support remain future product readiness.
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

        <section id="academy" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Academy</span>
              <h2>Learning paths before complexity.</h2>
            </div>
            <p>
              Academy readiness focuses on product understanding, paper-safe learning, chart
              basics, and risk clarity without financial advice or performance claims.
            </p>
          </div>

          <div className="tpm-public-pill-grid">
            {academyReadiness.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section id="community" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Community</span>
              <h2>Planned learning spaces, no fake activity.</h2>
            </div>
            <p>
              Community remains readiness-only: no fake members, no active signal rooms, no copy
              trading, and no profit screenshots.
            </p>
          </div>

          <div className="tpm-public-readiness-grid">
            {communityReadiness.map((item) => (
              <article key={item.title} className="tpm-foundation-card tpm-product-card">
                <div className="tpm-product-card-head">
                  <strong>{item.title}</strong>
                  <span className="tpm-product-chip">{item.state}</span>
                </div>
                <p>Future safe space with moderation and public claim review.</p>
              </article>
            ))}
          </div>
        </section>

        <section id="support" className="tpm-product-section tpm-product-section-compact">
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Support</span>
              <h2>Public-safe support options, readiness only.</h2>
            </div>
            <p>
              Support surfaces describe future help flows without sending emails, creating tickets,
              connecting accounts, or exposing private systems.
            </p>
          </div>

          <div className="tpm-public-pill-grid">
            {supportReadiness.map((item) => (
              <span key={item}>{item}</span>
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
