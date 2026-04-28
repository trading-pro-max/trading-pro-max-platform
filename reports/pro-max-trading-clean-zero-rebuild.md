# Pro Max Trading Clean Zero Rebuild

Mission: Execute Pro Max Trading Clean Zero Rebuild + Sign-in Surface Correction

Status: validated_committed_pushed_clean

Official path:

`C:\Users\ahmad\Desktop\ALKON\Pro Max\Pro Max Trading\pro-max-trading-platform`

Result:

- Rebuilt the public Trading Workspace surface from the current route instead of adding another shell.
- Kept the canonical Trading Workspace route at `/en`; Home and the public topbar both open the same route and route refresh works.
- Preserved Pro Max as the public center and Pro Max Trading as the first paper-safe trading workspace.
- Removed visible public navigation from the workspace route.
- Kept one compact Pro Max logo in the workspace header.
- Kept Sign in to one compact shell control on Home and one tiny utility control inside the workspace topbar.
- Replaced repeated status spam with one compact Product Truth row.
- Moved workspace focus controls into the chart toolbar.
- Made the chart the dominant object, with the execution rail attached to the right side of the chart core.
- Kept the Assistant collapsed by default and below the chart core, with Journal / Coach secondary.
- Kept the activity shelf below the core as compatibility evidence, not above the chart.

Demolition audit summary:

| Surface | Finding | Action |
| --- | --- | --- |
| Public Home | Pro Max Center direction already existed but needed proof with the canonical workspace link. | Verified and captured. |
| Public header | Sign in could read as another nav control. | Tightened shell Sign in styling and proved one public instance. |
| Trading Workspace route | Old layers created a dashboard wall before the chart. | Collapsed the market summary and moved activity below the core. |
| Trading chart | Inner chart layers were not fully owned by the current clean-zero route CSS. | Added clean-zero ownership for chart sizing and positioned chart internals inside the chart surface. |
| Execution rail | Execution existed but needed to feel attached to chart. | Kept it in the core grid beside the chart and compacted the rail. |
| Assistant | Assistant must not cover chart or execution. | Verified collapsed default and open no-cover state. |
| Journal / Coach | Journal / Coach was secondary but still part of workspace. | Kept it below the core as quiet reflection. |

Product Truth preserved:

- Paper-safe active.
- Live inactive.
- Broker/feed inactive.
- Billing inactive.
- Real money blocked.
- No trading signals, profit promises, win-rate claims, public #1/global/regulated claims, fake downloads, fake plan activation, or fake production activation.

Public/private boundary:

- Public Home and Trading Workspace do not expose Alkon, الكون, Founder Command, Kernel, Zero Truth, Reality Trial, Reality Production, Self-Correction, Pocket Universe, Local Builder, Treasury internals, Legal internals, Product Memory internals, or internal governance.
- No public link was added to `/founder/alkon`, `/founder/pocket`, or founder APIs.

Visual proof:

- `test-results/pro-max-trading-clean-zero-rebuild/home-pro-max-center-clean.png`
- `test-results/pro-max-trading-clean-zero-rebuild/public-header-signin-clean.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-route-open.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-workspace-clean-zero-dark.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-workspace-clean-zero-light.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-chart-dominant.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-chart-starts-high.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-execution-integrated.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-assistant-collapsed.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-assistant-open-no-cover.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-journal-secondary.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-single-logo-header.png`
- `test-results/pro-max-trading-clean-zero-rebuild/trading-no-public-nav.png`
- `test-results/pro-max-trading-clean-zero-rebuild/sign-in-not-duplicated.png`
- `test-results/pro-max-trading-clean-zero-rebuild/no-alkon-public-leak.png`

Validation:

- `npx tsc --noEmit`: pass
- `npx eslint app modules tests --max-warnings=0`: pass
- `npm run build`: pass
- `npm run prisma:validate`: pass
- `npx playwright test tests/regression/pro-max-trading-clean-zero-rebuild.spec.ts`: pass, 5 tests
- `npm run test:regression`: pass, 250 tests
- `npm run smoke:routes`: pass, 4 canonical routes after stopping a stale local Next dev server for this repo
- `git diff --check`: pass

Next:

Ahmad reviews the clean-zero Trading Workspace proof and decides visual acceptance or a focused correction. Ahmad visual acceptance remains separate from code validation.
