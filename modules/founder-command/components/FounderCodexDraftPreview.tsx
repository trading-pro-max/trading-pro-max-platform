type CodexDraftPreviewPayload = {
  draftId: string;
  mode: string;
  codexReadyPrompt: string;
  executableFromWebApp: false;
  externalSubmissionActive: false;
  secretsIncluded: false;
  includesForbiddenScope: boolean;
  includesValidation: boolean;
};

export default function FounderCodexDraftPreview({
  draft,
}: {
  draft: CodexDraftPreviewPayload | null;
}) {
  if (!draft) {
    return (
      <article className="tpm-founder-panel">
        <div className="tpm-founder-panel-head">
          <span>Codex Draft Preview</span>
          <h3>Blocked or review-only</h3>
          <p>
            No Codex draft is generated for blocked or restricted ideas. Keep
            the item in Founder review.
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Codex Draft Preview</span>
        <h3>{draft.draftId}</h3>
        <p>
          {draft.mode}; no web-app execution, no external submission, no secrets.
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Forbidden scope</span>
          <strong>{String(draft.includesForbiddenScope)}</strong>
          <small>included in prompt</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Validation</span>
          <strong>{String(draft.includesValidation)}</strong>
          <small>included in prompt</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Executable</span>
          <strong>{String(draft.executableFromWebApp)}</strong>
          <small>web app cannot execute</small>
        </div>
      </div>

      <pre className="tpm-founder-code-preview">
        {draft.codexReadyPrompt.slice(0, 1400)}
      </pre>
    </article>
  );
}
