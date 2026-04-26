const markets = [
  {
    title: "Forex",
    state: "Paper-safe",
    summary: "Major pairs can appear in the paper workspace with fallback-ready truth.",
  },
  {
    title: "Crypto",
    state: "Paper-safe",
    summary: "Crypto symbols are displayed for evaluation only, not live execution.",
  },
  {
    title: "Commodities",
    state: "Paper / Planned",
    summary: "Gold, oil, and related market categories stay clearly labeled.",
  },
  {
    title: "Indices",
    state: "Paper / Planned",
    summary: "Index views support platform review without broker/feed activation.",
  },
  {
    title: "Stocks",
    state: "Future",
    summary: "Stock coverage remains future/planned until real data and review gates exist.",
  },
  {
    title: "OTC / Paper-ready",
    state: "Fallback",
    summary: "Fallback-only contexts stay disclosed and do not imply live prices.",
  },
];

export default function PublicMarketsSection() {
  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="markets"
      id="markets"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Markets</span>
          <h2>Market coverage stays paper-safe and truthful.</h2>
        </div>
        <p>No live-feed, broker, execution, or real-money claim is made.</p>
      </div>

      <div className="tpm-public-readiness-grid">
        {markets.map((market) => (
          <article key={market.title} className="tpm-foundation-card tpm-product-card">
            <div className="tpm-product-card-head">
              <strong>{market.title}</strong>
              <span className="tpm-product-chip">{market.state}</span>
            </div>
            <p>{market.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
