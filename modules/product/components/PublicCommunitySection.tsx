const communityItems = [
  {
    title: "Learning",
    state: "Planned",
    summary: "Future learning discussions without fake active rooms or fake members.",
  },
  {
    title: "Feedback",
    state: "Readiness",
    summary: "Feedback direction is planned; no external posting or sending is active.",
  },
  {
    title: "Support",
    state: "Planned",
    summary: "Support discussions stay future-ready until moderation and backend gates exist.",
  },
  {
    title: "Pro Community",
    state: "Planned",
    summary: "Future Pro layer is not activated while billing and entitlements are inactive.",
  },
  {
    title: "VIP Rooms",
    state: "Planned",
    summary: "Future VIP spaces are not live rooms, signal rooms, or copy-trading areas.",
  },
];

export default function PublicCommunitySection() {
  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="community"
      id="community"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Community</span>
          <h2>Community stays honest until real systems exist.</h2>
        </div>
        <p>No fake members, rooms, live chat, signals, or copy trading.</p>
      </div>

      <div className="tpm-public-readiness-grid">
        {communityItems.map((item) => (
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
