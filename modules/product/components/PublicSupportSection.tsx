const supportItems = [
  {
    title: "Help Center",
    state: "Readiness",
    summary: "Public-safe guidance surface for product basics and blocked-state explanations.",
  },
  {
    title: "Contact Support",
    state: "Planned",
    summary: "Contact readiness only; no ticket backend, email sending, or external account is active.",
  },
  {
    title: "Report a Problem",
    state: "Readiness",
    summary: "Problem-report direction remains local and review-led until backend support exists.",
  },
  {
    title: "Security Contact",
    state: "Readiness",
    summary: "Security contact wording is prepared without exposing secrets or private channels.",
  },
  {
    title: "Partnership Contact",
    state: "Future",
    summary: "Partnership readiness only; no contracts, endorsements, or fake partners.",
  },
];

export default function PublicSupportSection() {
  return (
    <section
      className="tpm-product-section tpm-product-section-compact"
      data-public-section="support"
      id="support"
    >
      <div className="tpm-product-section-head">
        <div>
          <span className="tpm-product-kicker">Support</span>
          <h2>Support paths are clear without pretending a backend exists.</h2>
        </div>
        <p>Readiness only until actual support systems are configured and reviewed.</p>
      </div>

      <div className="tpm-public-readiness-grid">
        {supportItems.map((item) => (
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
