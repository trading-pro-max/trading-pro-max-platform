import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnRealitySourceChipProps = {
  label: string;
  source: string;
};

export function AlKawnRealitySourceChip({ label, source }: AlKawnRealitySourceChipProps) {
  return (
    <span className={styles.realityChip} data-al-kawn-reality-source="canonical">
      <strong>{label}</strong>
      <small>{source}</small>
    </span>
  );
}
