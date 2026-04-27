import fs from "node:fs";
import path from "node:path";

const nextPath = path.join(process.cwd(), "reports", "alkon-next-command.md");
const next = fs.existsSync(nextPath)
  ? fs.readFileSync(nextPath, "utf8")
  : "Next: Ahmad visual review before Local Day One.";

console.log(next);

