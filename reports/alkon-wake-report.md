WAKE REPORT
Status: validated_committed_pushed_clean
Mission: Execute Pro Max Trading Clean Zero Rebuild + Sign-in Surface Correction
Done: rebuilt the Trading Workspace from the current canonical route; kept `/en` as the canonical workspace opened by Home and public topbar; corrected Pro Max / Pro Max Trading identity; compacted Sign in; collapsed status spam into one Product Truth row; made the chart dominant with execution attached; kept Assistant collapsed and Journal / Coach secondary; captured all requested screenshots under `test-results/pro-max-trading-clean-zero-rebuild/`
Not done: Local Day One was not started; Ahmad visual acceptance remains separate; no live execution, real money, broker/feed activation, billing activation, production activation, public Alkon exposure, image/raster asset addition, fake claim, secret exposure, or web shell/Codex execution was performed
Validation: `npx tsc --noEmit` pass; `npx eslint app modules tests --max-warnings=0` pass; `npm run build` pass; `npm run prisma:validate` pass; focused clean-zero Playwright proof pass with 5 tests; `npm run test:regression` pass with 250 tests; `npm run smoke:routes` pass with 4 canonical routes after stopping a stale local Next dev server for this repo; `git diff --check` pass
Tests: 5 focused clean-zero tests passed; 250 full regression tests passed; 4 canonical route smoke checks passed
Commit: `rebuild pro max trading clean zero baseline`
Pushed: yes after normal branch push
Clean: yes after normal branch push
Next: Ahmad reviews the Pro Max Trading clean-zero visual proof and decides visual acceptance or focused correction
