import { resolveLivingEarthFocus } from "@/lib/brand/earth-focus";
import type {
  EarthFocusRegion,
  LivingEarthSurface,
} from "@/lib/brand/earth-background-types";

type LocalizedEarthFocusProps = {
  className?: string;
  locale?: string;
  selectedRegion?: EarthFocusRegion;
  surface?: LivingEarthSurface;
  timeZone?: string;
};

export default function LocalizedEarthFocus({
  className,
  locale,
  selectedRegion,
  surface = "public_entry",
  timeZone,
}: LocalizedEarthFocusProps) {
  const focus = resolveLivingEarthFocus({ locale, selectedRegion, timeZone });

  return (
    <span
      className={["tpm-localized-earth-focus", className].filter(Boolean).join(" ")}
      data-earth-focus-region={focus.region}
      data-earth-focus-basis={focus.basis}
      data-earth-focus-precision={focus.precision}
      data-earth-gps-used="false"
      data-earth-exact-city-used="false"
      data-earth-focus-persisted="false"
      data-surface={surface}
    >
      {focus.label}
    </span>
  );
}
