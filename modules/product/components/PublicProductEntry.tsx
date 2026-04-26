import Link from "next/link";
import LivingEarthBackground from "../../brand/components/LivingEarthBackground";
import LocalizedEarthFocus from "../../brand/components/LocalizedEarthFocus";
import ProductLogo from "../../brand/components/ProductLogo";
import TPMEarthMark from "../../brand/components/TPMEarthMark";
import PublicAcademySection from "./PublicAcademySection";
import PublicAppsPlatformsSection from "./PublicAppsPlatformsSection";
import PublicCommunitySection from "./PublicCommunitySection";
import PublicMarketsSection from "./PublicMarketsSection";
import PublicSupportSection from "./PublicSupportSection";
import PublicWorldOverview from "./PublicWorldOverview";

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

const planInterfaceLadder = [
  {
    title: "Free",
    badge: "Active",
    plan: "free" as const,
    summary: "Familiar paper-safe workspace with chart, watchlist, Assistant, and learning basics.",
  },
  {
    title: "Pro",
    badge: "Planned",
    plan: "pro" as const,
    summary: "Professional tools planned for deeper workspace guidance and Journal/Coach depth.",
  },
  {
    title: "VIP",
    badge: "Planned",
    plan: "vip" as const,
    summary: "Premium advanced layer planned for deeper coaching and Premium Reports.",
  },
  {
    title: "Institutional",
    badge: "Future",
    plan: "institutional" as const,
    summary: "Future controlled team-ready layer for formal institutional workflows.",
  },
];

const safetyTruth = [
  "Paper-safe",
  "No real-money routing",
  "Live execution inactive",
  "Broker/feed not configured",
];

export default function PublicProductEntry({
  diagnosticsHref,
  settingsHref,
  workspaceHref,
}: PublicProductEntryProps) {
  return (
    <div className="tpm-product-shell">
      <section className="tpm-foundation-page tpm-product-entry">
        <section
          className="tpm-foundation-card tpm-product-hero"
          data-public-section="public-entry-hero"
        >
          <LivingEarthBackground surface="public_entry" plan="free" state="paper_safe" />
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
                plan="free"
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
              <LocalizedEarthFocus locale="en" surface="public_entry" />
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

        <PublicWorldOverview
          diagnosticsHref={diagnosticsHref}
          settingsHref={settingsHref}
          workspaceHref={workspaceHref}
        />

        <section
          id="plans"
          className="tpm-product-section tpm-product-section-compact"
          data-public-section="plans"
        >
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Plans at a glance</span>
              <h2>Free starts simple. Pro and VIP add depth when available.</h2>
            </div>
            <p>Plans stay short, truthful, and public-safe.</p>
          </div>

          <div className="tpm-product-plan-grid">
            {planInterfaceLadder.map((plan) => (
              <article
                key={plan.title}
                className="tpm-foundation-card tpm-product-card tpm-product-plan-card"
                data-earth-plan={plan.plan}
              >
                <div className="tpm-product-card-head">
                  <div className="tpm-product-plan-card-title">
                    <TPMEarthMark
                      animated={plan.plan === "vip"}
                      motionIntensity={plan.plan === "vip" ? "low" : "none"}
                      plan={plan.plan}
                      state={plan.plan === "free" ? "paper_safe" : "planned"}
                      surface="public_entry"
                      title={`${plan.title} Earth identity`}
                      variant="compact"
                    />
                    <strong>{plan.title}</strong>
                  </div>
                  <span className="tpm-product-chip">{plan.badge}</span>
                </div>
                <p>{plan.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <PublicAppsPlatformsSection />
        <PublicMarketsSection />
        <PublicAcademySection />
        <PublicCommunitySection />
        <PublicSupportSection />

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
