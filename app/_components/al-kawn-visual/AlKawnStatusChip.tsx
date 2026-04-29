import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnStatusChipProps = {
  children: string;
  tone?: "neutral" | "truth" | "danger" | "safe" | "protected";
  status?: string;
};

export function AlKawnStatusChip({
  children,
  tone = "neutral",
  status,
}: AlKawnStatusChipProps) {
  return (
    <span className={styles.statusChip} data-tone={tone} data-status={status ?? tone}>
      {children}
    </span>
  );
}
