type TaskPassportPreviewPayload = {
  taskId: string;
  title: string;
  ownerArea: string;
  workerLevel: string;
  valid: boolean;
  invalidReasons: string[];
  allowedFiles: string[];
  forbiddenFiles: string[];
  requiredReviews: string[];
  forbiddenScope: string[];
  validationCommands: string[];
  productTruthRequirements: string[];
};

export default function FounderTaskPassportPreview({
  passport,
}: {
  passport: TaskPassportPreviewPayload;
}) {
  return (
    <article className="tpm-founder-panel">
      <div className="tpm-founder-panel-head">
        <span>Task Passport Preview</span>
        <h3>{passport.title}</h3>
        <p>
          {passport.taskId} / {passport.ownerArea} / {passport.workerLevel}
        </p>
      </div>

      <div className="tpm-founder-metrics">
        <div className="tpm-founder-metric">
          <span>Validity</span>
          <strong>{passport.valid ? "valid" : "invalid"}</strong>
          <small>
            {passport.invalidReasons.length
              ? passport.invalidReasons.join(" / ")
              : "Scoped preview only"}
          </small>
        </div>
        <div className="tpm-founder-metric">
          <span>Validation</span>
          <strong>{passport.validationCommands.length}</strong>
          <small>commands required</small>
        </div>
        <div className="tpm-founder-metric">
          <span>Forbidden scope</span>
          <strong>{passport.forbiddenScope.length}</strong>
          <small>non-negotiable boundaries</small>
        </div>
      </div>

      <div className="tpm-founder-briefing-grid">
        <article>
          <h4>Allowed files</h4>
          <ul>
            {passport.allowedFiles.slice(0, 5).map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Forbidden scope</h4>
          <ul>
            {passport.forbiddenScope.slice(0, 5).map((scope) => (
              <li key={scope}>{scope}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Validation</h4>
          <ul>
            {passport.validationCommands.slice(0, 5).map((command) => (
              <li key={command}>{command}</li>
            ))}
          </ul>
        </article>
        <article>
          <h4>Product Truth</h4>
          <ul>
            {passport.productTruthRequirements.slice(0, 5).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </div>
    </article>
  );
}
