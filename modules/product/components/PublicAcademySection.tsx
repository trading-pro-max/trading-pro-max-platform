const academyPaths = [
  {
    title: "Getting Started",
    state: "Readiness",
    summary: "Learn the Home, Trading Workspace, Settings, and Diagnostics path.",
  },
  {
    title: "Paper Trading Basics",
    state: "Paper-safe",
    summary: "Practice platform mechanics without live execution or real-money routing.",
  },
  {
    title: "Chart Basics",
    state: "Current",
    summary: "Understand chart controls, watchlist, timeframes, and blocked-state labels.",
  },
  {
    title: "Why Blocked",
    state: "Current",
    summary: "See why live, broker/feed, billing, and external posting are inactive.",
  },
];

export default function PublicAcademySection() {
  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="academy"
      id="academy"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Academy</span>
          <h2>Learning paths focus on product use and safety.</h2>
        </div>
        <p>No advice claim, signal claim, or guaranteed outcome appears.</p>
      </div>

      <div className="tpm-public-readiness-grid">
        {academyPaths.map((item) => (
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
  );
}
