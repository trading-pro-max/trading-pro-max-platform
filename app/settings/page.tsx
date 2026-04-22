import { getDictionary } from "../../lib/i18n/get-dictionary";
import { PlatformSettingsSurface } from "../../modules/shell/components/PlatformUtilitySurfaces";

export default function SettingsPage() {
  return <PlatformSettingsSurface locale="en" dict={getDictionary("en")} />;
}
