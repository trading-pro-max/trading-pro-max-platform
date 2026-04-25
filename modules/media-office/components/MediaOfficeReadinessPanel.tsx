import AIVideoStudioPanel from "./AIVideoStudioPanel";
import ContentLifecyclePreview from "./ContentLifecyclePreview";

const channels = [
  "X / Twitter",
  "Instagram",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Telegram",
  "Discord",
  "Blog / Newsroom",
];

export default function MediaOfficeReadinessPanel() {
  return (
    <section className="tpm-media-office-panel" aria-label="Media Office readiness">
      <header>
        <span>Media Office</span>
        <h2>Draft, review, approval readiness</h2>
        <p>
          Media and AI video are readiness surfaces only. No social
          accounts, tokens, uploads, publishing, followers, views, or ads exist.
        </p>
      </header>

      <ContentLifecyclePreview />

      <div className="tpm-media-office-channel-grid">
        {channels.map((channel) => (
          <article key={channel}>
            <strong>{channel}</strong>
            <small>registry planned / no token</small>
          </article>
        ))}
      </div>

      <AIVideoStudioPanel />
    </section>
  );
}
