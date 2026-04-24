# Trading Pro Max Brand Identity

Trading Pro Max is a premium, paper-safe trading workstation. The brand should feel serious, fast to read, and globally credible without copying any competitor.

## Logo System

- **Brand mark:** a graphite hexagon/shield with three market candles and a rising signal arrow.
- **Wordmark:** `Trading Pro Max`, with `Max` carrying the gold emphasis.
- **Primary use:** mark plus wordmark in navigation, workstation topbar, public entry, auth/session, and docs.
- **Small use:** the mark alone can be used for favicon/app icon, compact nav, future desktop icon, and future mobile icon.
- **Do not:** distort the hexagon, add extra candles, add ornamental glow, recolor with random hues, or use competitor-like marks.

## App Icon Source

The canonical app icon source is `app/icon.svg`. Future raster exports for desktop/mobile packaging should be generated from SVG sources, not redrawn.

Export-ready SVG sources live in `public/brand/` and are documented in [Brand Assets](./brand-assets.md). They include compact mark, dark/light app icon sources, wordmarks, lockups, documentation header, and social preview source. These are not app-store or public launch assets.

## Color Tokens

- **Gold:** premium brand emphasis, wordmark `Max`, certification-neutral highlights, and selected identity accents.
- **Graphite / midnight:** core surfaces, chart shell, nav, and execution panels.
- **White / ink:** primary typography and mark candle contrast.
- **Aqua:** active paper action, ready state, buy action, and focused chart accents.
- **Blue:** sell action and controlled secondary emphasis.

Status color rules:

- **ready / paper / buy:** aqua
- **warning / restricted / review required:** gold
- **blocked / live-disabled:** rose
- **fallback:** blue
- **degraded:** violet
- **sell:** blue

Do not use status colors for decoration; they must communicate runtime truth.

## Typography And Spacing

- Use strong, compact headings for market identity and route identity.
- Keep workstation text smaller and denser than public-entry text.
- Preserve the eye path: symbol/price/state, chart, execution, market context, AI/IQ, blotter, support surfaces.
- Prefer 8-10px radii for panels and controls; avoid pill overload except for compact status tags.

## Dark And Light Themes

- **Dark:** graphite-first, high contrast, restrained glow, chart-first.
- **Light:** serious, high-contrast, trading-grade, never washed out.
- Both themes use the same layout and component system; do not create separate UIs.

## RTL And LTR

- Layouts must respect `dir`.
- Brand wordmark and chart numerics remain stable LTR for readability.
- Arabic controls and panels should align naturally without mirroring numeric chart semantics.

## Account Type Truth

The visual system supports these account identity states:

- Standard
- Islamic requested
- Islamic review required
- Islamic configured
- Not certified
- Unavailable

Default state is **Not certified**. Do not claim Islamic or Sharia compliance unless a real configured approval path exists.

## Product Truth Rules

- Do not imply live execution.
- Do not imply real-money routing.
- Do not imply broker/feed/billing/public launch activation.
- Do not imply Islamic/Sharia certification.
- Keep paper-only, fallback, blocked, and unconfigured states compact but visible.

## Earth / Planet Mark

The TPM Earth Mark is an SVG-only identity extension for Planet OS and Founder Command surfaces.

- globe geometry represents the digital planet operating model
- gold orbit represents disciplined growth and command oversight
- Swiss red point is a subtle precision accent, not a Swiss legal/company claim
- market bars remain minimal so the mark stays readable at small sizes
- public trading surfaces should keep the standard Trading Pro Max mark dominant
- Founder/private command surfaces may use the stronger Earth/Planet variant

## What Not To Do

- No copied competitor UI, logo, wording, or brand shapes.
- No cluttered card stacks.
- No badge spam.
- No excessive glow.
- No generic SaaS dashboard look.
- No fake live claims.
- No decorative status colors disconnected from runtime truth.
