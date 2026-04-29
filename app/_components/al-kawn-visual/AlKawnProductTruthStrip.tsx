import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnProductTruthStripProps = {
  compact?: boolean;
  includePrivateAlKawn?: boolean;
  includeAlkon?: boolean;
};

function getSharedTruthLabels(useLiteralWorkingName: boolean) {
  return [
    { label: "Product Truth هو قانون الحقيقة الأعلى", tone: "truth" },
    { label: "Product Truth enforced", tone: "truth" },
    { label: "public launch blocked", tone: "danger" },
    { label: "billing inactive", tone: "danger" },
    { label: "payments inactive", tone: "danger" },
    { label: "receiving money inactive", tone: "danger" },
    { label: "real money disabled", tone: "danger" },
    { label: "broker execution disabled/not connected", tone: "danger" },
    { label: "legal review pending", tone: "truth" },
    {
      label: useLiteralWorkingName ? "Pro Max working_name_only" : "Pro Max working name only",
      tone: "protected",
    },
    { label: "ALKON private/background", tone: "protected" },
  ] as const;
}

export function AlKawnProductTruthStrip({
  compact = false,
  includePrivateAlKawn = true,
  includeAlkon = true,
}: AlKawnProductTruthStripProps) {
  const sharedTruthLabels = getSharedTruthLabels(includePrivateAlKawn);
  const baseLabels = includeAlkon
    ? sharedTruthLabels
    : sharedTruthLabels.filter((item) => item.label !== "ALKON private/background");
  const labels = includePrivateAlKawn
    ? [
        { label: "الكون خاص بأجهزة أحمد", tone: "protected" },
        { label: "الكون هو الامتداد الإلكتروني الخاص بأحمد", tone: "protected" },
        { label: "Pro Max Galaxy داخل الكون", tone: "protected" },
        { label: "Earth Planet داخل Pro Max Galaxy", tone: "protected" },
        ...baseLabels,
      ]
    : baseLabels;

  return (
    <div
      className={[styles.truthStrip, compact ? styles.compact : ""].join(" ")}
      data-testid="al-kawn-product-truth-strip"
      data-al-kawn-product-truth-style="canonical"
      aria-label="Canonical Al-Kawn Product Truth Strip"
    >
      {labels.map((item) => (
        <span key={item.label} data-tone={item.tone}>
          {item.label}
        </span>
      ))}
    </div>
  );
}
