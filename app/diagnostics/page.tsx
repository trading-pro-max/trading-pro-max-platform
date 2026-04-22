import { getDictionary } from "../../lib/i18n/get-dictionary";
import { PlatformDiagnosticsSurface } from "../../modules/shell/components/PlatformUtilitySurfaces";

export default function DiagnosticsPage() {
  return <PlatformDiagnosticsSurface locale="en" dict={getDictionary("en")} />;
}
