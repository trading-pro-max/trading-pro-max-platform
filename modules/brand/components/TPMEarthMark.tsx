import ProMaxEarthMark, {
  type ProMaxEarthMarkProps,
  type ProMaxEarthMarkState,
  type ProMaxEarthMarkVariant,
} from "./ProMaxEarthMark";

/*
 * Legacy Earth identity contract markers remain preserved in ProMaxProceduralEarth
 * and the shared CSS system:
 * tpm-earth-moon-orbit
 * tpm-earth-moon
 * tpm-earth-map-edge
 * tpm-earth-map-edge-primary
 * tpm-earth-continent-americas
 * tpm-earth-continent-europe-africa
 * tpm-earth-continent-asia
 * tpm-earth-realm-pro-grid
 * tpm-earth-realm-vip-lunar
 * tpm-earth-realm-institutional-station
 * radialGradient
 * clipPath
 * Pro Max Earth Mark
 */

export type TPMEarthMarkVariant = ProMaxEarthMarkVariant;
export type TPMEarthMarkState = ProMaxEarthMarkState;
type TPMEarthMarkProps = ProMaxEarthMarkProps;

export default function TPMEarthMark(props: TPMEarthMarkProps) {
  return <ProMaxEarthMark {...props} />;
}
