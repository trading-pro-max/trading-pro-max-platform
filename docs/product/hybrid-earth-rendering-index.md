# Hybrid Earth Rendering Index

## Components

- `ProMaxHybridEarth`: selects procedural fallback or approved texture mode.
- `ProMaxProceduralEarth`: renders the code-only Earth.
- `ProMaxEarthMark`: public compact mark wrapper.
- `ProductLogo`: brand lockup using the hybrid Earth mark.
- `LivingEarthBackground`: page-level Earth presence for Home, Workspace, Settings, Diagnostics, and private command surfaces.

## Registry

- `earth-texture-types.ts`: texture manifest and readiness types.
- `earth-texture-registry.ts`: static manifest validation and active texture selection.
- `hybrid-earth-policy.ts`: public-safe and founder-ready policy summaries.

## Default

No texture is active by default. The renderer must return procedural fallback until an approved local texture with complete metadata is enabled.

## Validation

Regression coverage must prove:

- no active texture by default
- no remote image URL
- invalid metadata disables texture
- public UI does not expose asset governance internals
- Home and logo render the procedural fallback
- Workspace remains chart-first
- Product Truth remains preserved

