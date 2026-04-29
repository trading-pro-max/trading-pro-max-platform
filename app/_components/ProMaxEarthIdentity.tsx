import { ProMaxLivingEarth } from "./ProMaxLivingEarth";

type ProMaxEarthIdentityProps = {
  size?: "compact" | "command" | "hero";
  label?: string;
  showText?: boolean;
};

const sizeMap: Record<NonNullable<ProMaxEarthIdentityProps["size"]>, "small" | "medium" | "hero"> = {
  compact: "small",
  command: "medium",
  hero: "hero",
};

export function ProMaxEarthIdentity({
  size = "command",
  label = "Real 3D animated Pro Max Earth identity",
  showText = false,
}: ProMaxEarthIdentityProps) {
  return (
    <ProMaxLivingEarth
      size={sizeMap[size]}
      surface={size === "hero" ? "founder" : "logo"}
      label={label}
      showText={showText}
    />
  );
}
