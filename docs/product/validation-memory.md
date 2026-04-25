# Validation Memory

Validation Memory stores summary-level build and verification outcomes only.

Allowed summary fields:

- `npx tsc --noEmit` pass/fail
- `npx eslint app modules tests --max-warnings=0` pass/fail
- `npm run build` pass/fail
- `npm run prisma:validate` pass/fail
- `npm run test:regression` pass/fail
- `npm run smoke:routes` pass/fail
- `git diff --check` pass/fail
- `git status --short` clean yes/no
- visual proof present yes/no

Raw logs are not persisted by the product memory foundation because logs can accidentally contain sensitive data.

Validation Memory cannot claim a pass if validation failed or was not run.
