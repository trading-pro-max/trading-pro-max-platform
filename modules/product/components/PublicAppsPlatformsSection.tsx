const platforms = [
  {
    title: "Web App",
    state: "Current",
    summary: "Available now for Home, Trading Workspace, Settings, and Diagnostics.",
  },
  {
    title: "Desktop App",
    state: "Planned",
    summary: "Future desktop packaging readiness only; no native app release claim.",
  },
  {
    title: "Mobile App",
    state: "Planned",
    summary: "Future mobile readiness only; no store release or push activation claim.",
  },
  {
    title: "Tablet",
    state: "Future",
    summary: "Future responsive product direction; no separate tablet app is active.",
  },
];

export default function PublicAppsPlatformsSection() {
  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="apps-platforms"
      id="apps-platforms"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Apps / Platforms</span>
          <h2>Use the Web App today. Desktop and mobile stay planned.</h2>
        </div>
        <p>No fake downloads, no store listing claim, and no native app release claim.</p>
      </div>

      <div className="tpm-public-readiness-grid">
        {platforms.map((item) => (
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
