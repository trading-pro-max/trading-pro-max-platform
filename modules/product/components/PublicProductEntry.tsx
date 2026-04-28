import Link from "next/link";
import { getPublicPlanRealms } from "@/lib/plans/realms";
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
    label: "Earth-native",
    value: "Human scale",
    note: "Pro Max Center stays grounded in an Earth reference while gathering workspace, Assistant, learning, support, apps status, and readiness.",
  },
  {
    label: "First heart",
    value: "Pro Max Trading",
    note: "The first paper-safe workspace stays chart-first for rehearsal, learning, and review.",
  },
  {
    label: "Product Truth",
    value: "Visible",
    note: "No broker, feed activation, billing, live execution, or real-money path is enabled.",
  },
];

const trustStates = [
  {
    label: "Mode",
    value: "Paper-safe",
  },
  {
    label: "Platform",
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

const assistantRevealPrompts = [
  "Start",
  "Why blocked?",
  "Bigger chart",
  "Calmer",
  "Plans",
  "Apps",
  "Support",
  "Journal",
];

const firstDayContinuity = [
  {
    label: "Practice",
    value: "Paper-safe workspace",
    note: "Use the chart and ticket for rehearsal only.",
  },
  {
    label: "Reflect",
    value: "Journal / Coach",
    note: "Write what you observed and what would make you pause.",
  },
  {
    label: "Learn",
    value: "Academy basics",
    note: "Use learning paths without signals or performance promises.",
  },
  {
    label: "Adjust",
    value: "Personal Reality",
    note: "Use Calm, Static, Low Motion, or High Contrast when needed.",
  },
];

const centerStartingPoints = [
  "Start with Trading Workspace",
  "Pro Max Assistant",
  "Academy status",
  "Support",
  "Apps / Platforms status",
];

export default function PublicProductEntry({
  diagnosticsHref,
  settingsHref,
  workspaceHref,
}: PublicProductEntryProps) {
  return (
    <div
      className="tpm-product-shell"
      data-swiss-inspired-precision="true"
      data-visual-origin="pro-max-earth-financial"
    >
      <section className="tpm-foundation-page tpm-product-entry">
        <section
          className="tpm-foundation-card tpm-product-hero"
          data-public-section="public-entry-hero"
          data-revelation-stage="first_3_seconds"
        >
          <LivingEarthBackground surface="public_entry" plan="free" state="paper_safe" />
          <div className="tpm-product-kicker-row">
            <span className="tpm-product-kicker">Pro Max Center</span>
            <LocalizedEarthFocus locale="en" surface="public_entry" />
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
              <h1>Pro Max Center</h1>
              <p>
                The public center for Pro Max. Pro Max Trading is the first
                paper-safe workspace, with Assistant, learning, support, apps
                status, and Product Truth close to the surface.
              </p>

              <div className="tpm-product-cta-row">
                <Link className="tpm-product-cta tpm-product-cta-primary" href={workspaceHref}>
                  Enter workspace
                </Link>
                <Link className="tpm-product-cta tpm-product-cta-secondary" href="#tpm-assistant-guidance">
                  Ask Pro Max Assistant
                </Link>
              </div>
              <p className="tpm-intent-hero-note">
                Start with the chart, ask why something is blocked, or check
                learning, support, and app readiness without fake activation.
              </p>

              <div className="tpm-product-center-paths" aria-label="Pro Max Center starting points">
                {centerStartingPoints.map((item) => (
                  <span key={item}>{item}</span>
                ))}
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
              <div className="tpm-product-signal-grid tpm-product-signal-grid-calm">
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

        <section
          className="tpm-product-section tpm-product-truth-strip"
          data-public-section="product-truth-strip"
        >
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Product Truth</span>
              <h2>Pro Max Center is paper-safe now. Live, billing, and broker routing stay inactive.</h2>
            </div>
            <p>
              Trust stays visible below the hero instead of crowding the header.
            </p>
          </div>
          <div className="tpm-product-truth-grid">
            {safetyTruth.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <PublicWorldOverview
          diagnosticsHref={diagnosticsHref}
          settingsHref={settingsHref}
          workspaceHref={workspaceHref}
        />

        <section
          id="tpm-assistant-guidance"
          className="tpm-product-section tpm-revelation-assistant"
          data-public-section="assistant-guidance"
          data-revelation-stage="first_30_seconds"
        >
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">Pro Max Assistant</span>
              <h2>Tell Pro Max Assistant what you want.</h2>
            </div>
            <p>
              Assistant handles product truth, plan questions, support, apps, Journal,
              comfort settings, and why something is blocked.
            </p>
          </div>
          <div className="tpm-revelation-prompt-row" aria-label="Assistant first-use prompts">
            {assistantRevealPrompts.map((prompt) => (
              <span key={prompt} className="tpm-intent-chip">
                {prompt}
              </span>
            ))}
          </div>
        </section>

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

        <section
          className="tpm-product-section tpm-revelation-continuity"
          data-public-section="first-day-continuity"
          data-revelation-stage="first_day"
        >
          <div className="tpm-product-section-head">
            <div>
              <span className="tpm-product-kicker">First-day loop</span>
              <h2>Practice, reflect, learn, and adjust without fake activation.</h2>
            </div>
            <p>
              Journal and Coach keep the first day grounded in paper-mode reflection.
              Support, Academy, Settings, and Diagnostics stay truthful about what is active.
            </p>
          </div>
          <div className="tpm-product-card-grid tpm-revelation-continuity-grid">
            {firstDayContinuity.map((item) => (
              <article key={item.label} className="tpm-foundation-card tpm-product-card">
                <span className="tpm-product-kicker">{item.label}</span>
                <strong>{item.value}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
