import { getProjectUniverseTruthSnapshot } from "@/lib/server/project-universe-truth";
import TradingOperatingFloor from "./_components/TradingOperatingFloor";

export const metadata = {
  title: "Pro Max Trading | Trading Operating Floor",
  description:
    "The canonical private, demo-safe Pro Max Trading operating floor with Earth-scale intelligence and Swiss-inspired precision.",
};

export default function TradingPage() {
  const truth = getProjectUniverseTruthSnapshot();

  return <TradingOperatingFloor truth={truth} />;
}
