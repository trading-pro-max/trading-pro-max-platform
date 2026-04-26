import Link from "next/link";
import { getPublicPlanRealms } from "@/lib/plans/realms";
import LivingEarthBackground from "../../brand/components/LivingEarthBackground";
import LocalizedEarthFocus from "../../brand/components/LocalizedEarthFocus";
import ProductLogo from "../../brand/components/ProductLogo";
import TPMEarthMark from "../../brand/components/TPMEarthMark";
import EnvironmentStatusBadge from "../../shell/components/EnvironmentStatusBadge";
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
    label: "Devices",
    value: "Web now",
    note: "Desktop and Mobile are planned; Tablet is future. No fake downloads.",
  },
  {
    label: "Live inactive",
    value: "Blocked",
    note: "No broker, billing, or real-money activation is enabled.",
  },
  {
    label: "Personal Reality",
    value: "User controlled",
    note: "Calm, chart comfort, low motion, static, and high contrast are plan-aware.",
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

const planCopy = {
  free_earth: {
    title: "Free",
    badge: "Active",
    headline: "Start on the web workspace",
  },
  pro_orbit: {
    title: "Pro",
    badge: "Planned",
    headline: "Professional workspace tools",
  },
  vip_lunar: {
    title: "VIP",
    badge: "Planned",
    headline: "Premium advanced layer",
  },
  institutional_station: {
    title: "Institutional",
    badge: "Future",
    headline: "Future team/institutional layer",
  },
} as const;

const planInterfaceLadder = getPublicPlanRealms().map((realm) => ({
  realmId: realm.realmId,
  title: planCopy[realm.realmId as keyof typeof planCopy].title,
  badge: planCopy[realm.realmId as keyof typeof planCopy].badge,
  headline: planCopy[realm.realmId as keyof typeof planCopy].headline,
  plan: realm.visualIdentity.plan,
  summary: realm.workspaceBehavior,
  assistant: realm.assistantBehavior,
  journalCoach: realm.journalCoachDepth,
  reports: realm.reportsDepth,
  apps: realm.appsPlatformsAccess,
}));

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
              <span className="tpm-product-chip">Adaptive Atmosphere</span>
              <span className="tpm-product-chip">Personal Reality</span>
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
                Trading Pro Max starts with a complete Free web workspace, then keeps Pro,
                VIP, and Institutional depth clearly planned or future until real gates exist.
              </p>

              <div className="tpm-product-cta-row">
                <Link className="tpm-product-cta tpm-product-cta-primary" href={workspaceHref}>
                  Enter workspace
                </Link>
                <Link className="tpm-product-cta tpm-product-cta-secondary" href="#apps-platforms">
                  View platforms
                </Link>
                <Link className="tpm-product-cta tpm-product-cta-secondary" href="#plans">
                  Explore plans
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
              <EnvironmentStatusBadge compact />
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
            <p>Plans differ by workspace, Assistant, Journal/Coach, reports, apps, and support truth.</p>
          </div>

          <div className="tpm-product-plan-grid">
            {planInterfaceLadder.map((plan) => (
              <article
                key={plan.title}
                className="tpm-foundation-card tpm-product-card tpm-product-plan-card"
                data-earth-plan={plan.plan}
                data-plan-realm={plan.realmId}
              >
                <div className="tpm-product-card-head">
                  <div className="tpm-product-plan-card-title">
                    <TPMEarthMark
                      animated={plan.plan === "vip"}
                      motionIntensity={plan.plan === "vip" ? "low" : "none"}
                      plan={plan.plan}
                      state={plan.plan === "free" ? "paper_safe" : "planned"}
                      surface="public_entry"
                      title={`${plan.title} plan identity`}
                      variant="compact"
                    />
                    <strong>{plan.title}</strong>
                  </div>
                  <span className="tpm-product-chip">{plan.badge}</span>
                </div>
                <h3>{plan.headline}</h3>
                <p>{plan.summary}</p>
                <ul className="tpm-product-plan-depth-list">
                  <li>{plan.assistant}</li>
                  <li>{plan.journalCoach}</li>
                  <li>{plan.reports}</li>
                  <li>{plan.apps}</li>
                </ul>
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
