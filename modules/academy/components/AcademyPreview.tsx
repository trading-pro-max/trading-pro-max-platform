const learningPaths = [
  "Platform basics",
  "Paper training",
  "Why blocked",
  "Companion guide",
  "Journal / Coach guide",
  "Risk and safety lessons",
];

export default function AcademyPreview() {
  return (
    <section className="tpm-academy-preview" aria-label="Academy preview">
      <header>
        <span>Academy</span>
        <h2>Learning paths foundation</h2>
        <p>
          Education stays paper-first and safety-led. Pro paths and VIP strategy
          reviews remain planned, not active.
        </p>
      </header>
      <div>
        {learningPaths.map((path) => (
          <article key={path}>
            <strong>{path}</strong>
            <small>No financial advice. No guaranteed signal.</small>
          </article>
        ))}
      </div>
    </section>
  );
}
