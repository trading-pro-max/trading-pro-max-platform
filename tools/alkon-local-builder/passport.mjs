const passport = {
  passportId: "local_builder_next_action_passport",
  mode: "preview_only",
  valid: true,
  allowed: ["read reports", "prepare one safe local task"],
  forbidden: ["run Codex", "execute shell from web app", "delete", "publish", "bill", "trade live"],
  validation: ["tsc", "eslint", "build", "prisma validate", "regression", "smoke", "diff check"],
};

console.log(JSON.stringify(passport, null, 2));

