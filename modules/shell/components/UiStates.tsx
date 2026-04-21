export function LoadingState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="tpm-ui-state loading">
      <div className="tpm-ui-state-title">{title}</div>
      <div className="tpm-ui-state-text">{text}</div>
      <div className="tpm-ui-loading-bars" aria-hidden="true">
        <div className="tpm-ui-loading-bar" />
        <div className="tpm-ui-loading-bar" />
        <div className="tpm-ui-loading-bar" />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="tpm-ui-state empty">
      <div className="tpm-ui-state-title">{title}</div>
      <div className="tpm-ui-state-text">{text}</div>
    </div>
  );
}

export function ErrorState({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="tpm-ui-state error">
      <div className="tpm-ui-state-title">{title}</div>
      <div className="tpm-ui-state-text">{text}</div>
    </div>
  );
}