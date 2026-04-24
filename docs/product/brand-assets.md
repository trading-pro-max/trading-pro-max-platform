# Trading Pro Max Brand Assets

This document defines export-ready brand asset sources for Trading Pro Max. These assets are SVG sources only. They do not claim app-store readiness, launch readiness, shipped desktop apps, shipped mobile apps, or public campaign publication.

## Source Asset Inventory

| Asset | Path | Purpose |
| --- | --- | --- |
| Canonical app icon | `app/icon.svg` | Next app icon and favicon source family |
| Compact icon mark | `public/brand/tpm-mark.svg` | icon-only mark for docs, compact headers, and future exports |
| Dark app icon source | `public/brand/tpm-app-icon-dark.svg` | future dark desktop/mobile icon export source |
| Light app icon source | `public/brand/tpm-app-icon-light.svg` | future light desktop/mobile icon export source |
| Dark wordmark | `public/brand/tpm-wordmark.svg` | dark-surface wordmark source |
| Light wordmark | `public/brand/tpm-wordmark-light.svg` | light-surface wordmark source |
| Dark lockup | `public/brand/tpm-lockup-dark.svg` | mark plus wordmark for dark backgrounds |
| Light lockup | `public/brand/tpm-lockup-light.svg` | mark plus wordmark for light backgrounds |
| Documentation header | `public/brand/tpm-doc-header.svg` | documentation and internal presentation header source |
| Social preview source | `public/brand/tpm-social-preview-source.svg` | future reviewed social preview source, not published output |

## Logo System

- Brand mark: graphite and gold hexagon/shield with three market candles and a rising signal.
- Wordmark: `Trading Pro Max`, with `Max` emphasized in gold.
- Lockup: mark plus wordmark, optionally with the descriptor `Global trading foundation`.
- Small use: use the compact mark alone.
- Large use: use the lockup.

The mark must remain simple and scalable. Do not add extra candles, complex chart lines, ornamental effects, gradients, copied competitor shapes, or launch badges.

## Theme Variants

Dark surfaces:

- prefer `public/brand/tpm-lockup-dark.svg`
- use `public/brand/tpm-wordmark.svg` when the mark is already present
- use `public/brand/tpm-app-icon-dark.svg` for future dark app icon exports

Light surfaces:

- prefer `public/brand/tpm-lockup-light.svg`
- use `public/brand/tpm-wordmark-light.svg` when the mark is already present
- use `public/brand/tpm-app-icon-light.svg` for future light app icon exports

## Future Export Notes

These notes define future export targets only. They do not mean those assets are shipped.

| Target | Source | Notes |
| --- | --- | --- |
| favicon | `app/icon.svg` | export square PNG/ICO only from the canonical SVG if needed |
| desktop icon | `public/brand/tpm-app-icon-dark.svg` or `public/brand/tpm-app-icon-light.svg` | generate platform sizes during real packaging |
| mobile icon | `public/brand/tpm-app-icon-dark.svg` or `public/brand/tpm-app-icon-light.svg` | export only when real mobile packaging exists |
| splash screen | `public/brand/tpm-lockup-dark.svg` or `public/brand/tpm-lockup-light.svg` | keep centered, quiet, and no launch claims |
| social preview | `public/brand/tpm-social-preview-source.svg` | requires media, Guardian, Legal, and Founder review before publication |
| documentation header | `public/brand/tpm-doc-header.svg` | approved for internal docs and future branded PDFs |

## Clear Space And Size

- Keep clear space around the mark equal to at least one candle width.
- Do not render the mark below 24px in UI contexts.
- Use icon-only mark for 16px-32px favicon-style contexts.
- Use wordmark or lockup for contexts wider than 180px.
- Keep the wordmark horizontal; do not stack the words unless a future layout spec requires it.

## Color Rules

- Gold: brand emphasis and `Max`.
- Graphite/midnight: app icon and dark surfaces.
- White/ink: core wordmark legibility.
- Aqua: rising signal and paper-safe action identity.

Do not use status colors as decoration. Buy, sell, warning, blocked, fallback, degraded, paper, and live-disabled states must remain tied to product truth.

## What Not To Export Yet

- app-store listing images
- Play Store graphics
- installer artwork
- public launch campaign images
- paid plan campaign assets
- billing screenshots
- broker/feed activation visuals
- real user or revenue graphics

Those require real release readiness and review.

## Product Truth

The brand assets are visual sources only. They do not activate or imply:

- live execution
- real-money routing
- broker activation
- feed activation
- billing
- native desktop app shipment
- native mobile app shipment
- public launch
- Islamic or Sharia certification
- Swiss legal/company status
