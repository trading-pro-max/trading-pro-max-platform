const studioReadiness = [
  "video ideas",
  "short script",
  "long script",
  "captions",
  "thumbnail brief",
  "compliance risk score",
];

export default function AIVideoStudioPanel() {
  return (
    <section className="tpm-ai-video-studio-panel" aria-label="AI Video Studio readiness">
      <header>
        <span>AI Video Studio</span>
        <h2>Script readiness only</h2>
        <p>
          The studio can model future scripts and review states. No generation
          API, upload, external publishing, views, followers, or ad metrics are active.
        </p>
      </header>
      <div>
        {studioReadiness.map((item) => (
          <article key={item}>
            <strong>{item}</strong>
            <small>Legal + Guardian + Founder review required</small>
          </article>
        ))}
      </div>
    </section>
  );
}
