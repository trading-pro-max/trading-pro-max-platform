import type { AlkonChatCommandPassportDraft } from "@/lib/server/alkon-chat";

export default function AlkonCommandPassportDraftPanel({
  draft,
}: {
  draft: AlkonChatCommandPassportDraft;
}) {
  const fields = [
    ["Mission", draft.mission],
    ["Why now", draft.whyNow],
    ["Ownership layer", draft.affectedLayer],
    ["Allowed scope", draft.allowedScope.join(" / ")],
    ["Forbidden scope", draft.forbiddenScope.join(" / ")],
    ["Validation required", draft.validation.join(" / ")],
    ["Visual proof required", draft.visualProof.join(" / ")],
    ["Wake Report required", draft.wakeReportFormat.join(" / ")],
    ["Stop conditions", draft.stopConditions.join(" / ")],
  ];

  return (
    <section
      className="alkon-command-passport-draft"
      data-proof-section="alkon-command-passport-preview"
      data-chat-proof="command-passport-draft"
      aria-label="Command Passport Preview"
    >
      <div className="alkon-rail-head">
        <span>Preview only</span>
        <h2>Command Passport Preview</h2>
        <p>No execution. This prepares scope, evidence, validation, and stop conditions for Ahmad.</p>
      </div>
      <dl className="alkon-command-passport-grid">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
