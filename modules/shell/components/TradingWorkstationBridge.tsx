import * as Mod from "./TradingWorkstation";

const TradingWorkstation =
  (Mod as any).default ??
  (Mod as any).TradingWorkstation;

if (!TradingWorkstation) {
  throw new Error("TradingWorkstation export missing from modules/shell/components/TradingWorkstation.tsx");
}

export default TradingWorkstation as any;
