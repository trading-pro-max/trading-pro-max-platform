import { ProMaxCosmicIdentity } from "@/app/_components/ProMaxCosmicIdentity";
import styles from "./AlKawnUnifiedVisualIdentity.module.css";

type AlKawnCosmicIdentityProps = {
  variant?: "hero" | "desktop" | "tradingCompact" | "center" | "tinyChip";
  showLabels?: boolean;
  includePrivateLabels?: boolean;
};

const variantConfig = {
  hero: { size: "hero", surface: "founder", compact: false },
  desktop: { size: "large", surface: "founder", compact: false },
  tradingCompact: { size: "small", surface: "trading", compact: true },
  center: { size: "large", surface: "public", compact: false },
  tinyChip: { size: "small", surface: "trading", compact: true },
} as const;

export function AlKawnCosmicIdentity({
  variant = "desktop",
  showLabels = true,
  includePrivateLabels = true,
}: AlKawnCosmicIdentityProps) {
  const config = variantConfig[variant];

  return (
    <div
      className={styles.cosmicIdentity}
      data-testid="al-kawn-cosmic-identity"
      data-al-kawn-earth-moon-identity="canonical"
      data-variant={variant}
    >
      <ProMaxCosmicIdentity
        size={config.size}
        surface={config.surface}
        compact={config.compact}
        showLabels={false}
      />
      {showLabels && includePrivateLabels ? (
        <div className={styles.identityLabel}>
          <strong>الكون هو الامتداد الإلكتروني الخاص بأحمد</strong>
          <span>Pro Max Earth is the product planet inside Universe</span>
          <span>Moon orbiting Pro Max Earth</span>
          <span>Device-time reality active</span>
          <span>Swiss-inspired precision mark</span>
          <span>Pro Max Galaxy داخل الكون</span>
          <span>Earth Planet داخل Pro Max Galaxy</span>
          <span>Product Truth هو قانون الحقيقة الأعلى</span>
        </div>
      ) : showLabels ? (
        <div className={styles.identityLabel}>
          <strong>Pro Max Earth / Moon identity</strong>
          <span>Future public product surface</span>
          <span>Product Truth enforced</span>
        </div>
      ) : (
        <span className={styles.srOnly}>
          {includePrivateLabels
            ? "الكون هو الامتداد الإلكتروني الخاص بأحمد / Pro Max Galaxy داخل الكون / Earth Planet داخل Pro Max Galaxy / Product Truth هو قانون الحقيقة الأعلى"
            : "Pro Max Earth and Moon identity / Product Truth enforced"}
        </span>
      )}
    </div>
  );
}
