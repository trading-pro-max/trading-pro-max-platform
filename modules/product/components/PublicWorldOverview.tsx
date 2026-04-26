const publicWorldItems = [
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
    id: "plans",
    href: "#plans",
    title: "Plans",
    state: "Truthful tiers",
    summary: "Free, Pro, VIP, and Institutional remain simple and scannable.",
    detail: "No fake paid activation, billing, or hidden paid plan.",
  },
  {
    id: "apps-platforms",
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
  {
    id: "settings",
    href: "settings",
    title: "Settings",
    state: "Public-safe",
    summary: "Theme, language, paper ticket defaults, and plan truth controls.",
    detail: "No real-money, billing, broker, or restricted control surfaces.",
  },
  {
    id: "diagnostics",
    href: "diagnostics",
    title: "Diagnostics",
    state: "Readiness",
    summary: "System readiness, route truth, and blocked state checks.",
    detail: "Public-safe readiness only; no private internal details.",
  },
];

export default function PublicWorldOverview({
  diagnosticsHref,
  settingsHref,
  workspaceHref,
}: {
  diagnosticsHref: string;
  settingsHref: string;
  workspaceHref: string;
}) {
  const resolveHref = (href: string) => {
    if (href === "workspace") return workspaceHref;
    if (href === "settings") return settingsHref;
    if (href === "diagnostics") return diagnosticsHref;
    return href;
  };

  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="public-world-overview"
      id="public-navigation"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Product navigation</span>
          <h2>Everything users need, without the overload.</h2>
        </div>
        <p>
          Home guides users to the right public surface instead of showing the whole
          product at once.
        </p>
      </div>

      <div className="tpm-public-world-nav-grid">
        {publicWorldItems.map((item) => (
          <a
            key={`${item.title}-${item.href}`}
            className="tpm-public-world-nav-card"
            href={resolveHref(item.href)}
            id={`public-nav-${item.id}`}
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
  );
}
