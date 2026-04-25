import AIVideoStudioPanel from "./AIVideoStudioPanel";
import ContentLifecyclePreview from "./ContentLifecyclePreview";

const channels = [
  "X / Twitter",
  "Instagram",
  "TikTok",
  "YouTube",
  "LinkedIn",
  "Campaign planning",
  "Telegram",
  "Discord",
  "Blog / Newsroom",
];

export default function MediaOfficeReadinessPanel() {
  return (
    <section className="tpm-media-office-panel" aria-label="Updates readiness">
      <header>
        <span>Updates</span>
        <h2>Draft and review readiness</h2>
        <p>
          Education posts, product updates, and video scripts are readiness
          surfaces only. Drafts, campaign planning, and scripts require review.
          No social accounts, tokens, uploads, publishing, followers, views, or ads exist.
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
