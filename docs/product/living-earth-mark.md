# TPM Living Earth Mark

The TPM Living Earth Mark is the SVG-only identity signal for Trading Pro Max. It replaces heavy filled logo treatment with a clean digital globe: latitude and longitude geometry, a disciplined gold orbit, a small Swiss red precision point, and minimal market movement.

## Core Rules

- SVG/code only; no raster, GIF, video, or external image dependency.
- Public UI uses the calm `public` or small `compact` variants.
- Founder/internal command surfaces may use the stronger `command` variant.
- The mark must never become a giant dark block or dominate the public entry.
- The mark must stay secondary to chart and execution in the workstation.
- Swiss red is a precision accent only, not a Swiss legal/company claim.

## Variants

| Variant | Use | Behavior |
| --- | --- | --- |
| `public` | Public entry, auth, settings, diagnostics | Calm, premium, subtle motion when explicitly animated. |
| `compact` | Topbar, nav, small app surfaces | Minimal detail, readable at 24-40px, usually static. |
| `command` | Founder/internal command surfaces | Stronger black/graphite/gold identity, still restrained and reduced-motion safe. |

## State-Aware Signal

The mark may use safe product/readiness truth only:

| State | Visual rule |
| --- | --- |
| `ready` | Smooth soft orbit. |
| `local_only` | Contained calm pulse. |
| `paper_safe` | Stable orbit with neutral/cyan state accent. |
| `fallback` | Slower orbit and softer secondary orbit. |
| `blocked` | Swiss red point steady; orbit is muted. |
| `review_required` | Segmented subtle orbit. |
| `degraded` | Muted pulse and softer lines. |
| `inactive` | Static, quiet, low contrast. |
| `planned` | Static, quiet, low contrast. |

The mark must not read or expose secrets, API keys, broker credentials, payment data, private user data, raw logs, emails, social tokens, or production configuration.

## Motion Law

Motion is CSS-only, slow, and meaningful:

- no rapid spin
- no casino/game glow
- no chart distraction
- no large animated overlay
- `prefers-reduced-motion: reduce` disables orbit and pulse animation

## Implementation

Canonical runtime component:

- `modules/brand/components/TPMEarthMark.tsx`
- `modules/brand/components/ProductLogo.tsx`
- `app/theme-localization.css`

The component exposes `variant`, `state`, `animated`, `size`, `className`, and `title` props. Decorative instances may omit a title and become `aria-hidden`; meaningful public hero instances use an accessible title.

## Rejected Direction Reset

Ahmad rejected the previous logo direction as not distinctive or premium enough. The accepted direction for this pass is the TPM Celestial Swiss Earth Mark:

- Earth globe with visible longitude and latitude geometry.
- Abstract world-map paths with gold coast/edge strokes.
- Small moon orbiting Earth with a visible premium orbit path.
- Swiss red micro-accent only; Swiss-inspired precision, not Swiss legal/company status.
- Code/SVG only; no generated images, raster files, GIF, video, copied maps, or external image assets.
- Motion must be felt in public and compact identity, quieter on workstation, stronger only on Founder/internal command surfaces, and static under reduced motion.
