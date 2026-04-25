type TPMEarthMarkProps = {
  className?: string;
  title?: string;
  variant?: "compact" | "lockup" | "command";
};

export default function TPMEarthMark({
  className,
  title = "Trading Pro Max product mark",
  variant = "compact",
}: TPMEarthMarkProps) {
  return (
    <span
      aria-label={title}
      className={["tpm-earth-mark", `tpm-earth-mark-${variant}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <circle className="tpm-earth-globe" cx="32" cy="32" r="22" />
        <ellipse className="tpm-earth-line" cx="32" cy="32" rx="10" ry="22" />
        <ellipse className="tpm-earth-line" cx="32" cy="32" rx="22" ry="8" />
        <path className="tpm-earth-line" d="M13.5 24.8h37M13.5 39.2h37" />
        <path className="tpm-earth-orbit" d="M8 39.5C18 52 43.8 55.6 56 28.5" />
        <path className="tpm-earth-market-bar" d="M25.5 39.5V31h3.8v8.5h-3.8Z" />
        <path className="tpm-earth-market-bar" d="M31.3 39.5V25.5h3.8v14h-3.8Z" />
        <path className="tpm-earth-market-bar" d="M37.1 39.5V20.8h3.8v18.7h-3.8Z" />
        <circle className="tpm-earth-swiss-point" cx="48.5" cy="18.8" r="3.1" />
      </svg>
    </span>
  );
}
