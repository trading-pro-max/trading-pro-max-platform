import type {
  EarthFocusRegion,
  LivingEarthPlan,
  LivingEarthState,
  LivingEarthSurface,
} from "@/lib/brand/earth-background-types";
import { resolveLivingEarthFocus } from "@/lib/brand/earth-focus";

type LivingEarthBackgroundProps = {
  className?: string;
  locale?: string;
  plan?: LivingEarthPlan;
  region?: EarthFocusRegion;
  state?: LivingEarthState;
  surface?: LivingEarthSurface;
  timeZone?: string;
};

export default function LivingEarthBackground({
  className,
  locale,
  plan = "free",
  region,
  state = "paper_safe",
  surface = "public_entry",
  timeZone,
}: LivingEarthBackgroundProps) {
  const focus = resolveLivingEarthFocus({
    locale,
    selectedRegion: region,
    timeZone,
  });

  return (
    <div
      aria-hidden="true"
      className={["tpm-living-earth-background", className].filter(Boolean).join(" ")}
      data-code-only="true"
      data-earth-exact-city-used="false"
      data-earth-external-map-assets="false"
      data-earth-focus-region={focus.region}
      data-earth-gps-used="false"
      data-earth-plan={plan}
      data-earth-raster-assets="false"
      data-earth-state={state}
      data-earth-surface={surface}
      data-reduced-motion-supported="true"
    >
      <div className="tpm-living-earth-stars" />
      <div className="tpm-living-earth-orbital-grid" />
      <div className="tpm-living-earth-horizon">
        <div className="tpm-living-earth-globe" />
        <div className="tpm-living-earth-continent tpm-living-earth-continent-a" />
        <div className="tpm-living-earth-continent tpm-living-earth-continent-b" />
        <div className="tpm-living-earth-continent tpm-living-earth-continent-c" />
        <div className="tpm-living-earth-focus-signal" />
      </div>
    </div>
  );
}
