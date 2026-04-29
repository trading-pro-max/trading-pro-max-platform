import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnLayerBadgeProps = {
  label: string;
  layer: string;
};

export function AlKawnLayerBadge({ label, layer }: AlKawnLayerBadgeProps) {
  return (
    <span className={styles.layerBadge} data-al-kawn-layer-badge="canonical">
      <span>{label}</span>
      <small>{layer}</small>
    </span>
  );
}
