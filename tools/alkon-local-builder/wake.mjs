import fs from "node:fs";
import path from "node:path";

const wakePath = path.join(process.cwd(), "reports", "alkon-wake-report.md");
const wake = fs.existsSync(wakePath)
  ? fs.readFileSync(wakePath, "utf8")
  : "WAKE REPORT\nStatus: missing\nNext: recreate wake report";

console.log(wake);

