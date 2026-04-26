# Planetary Life Cycle Engine

The Planetary Life Cycle Engine is the internal model behind Adaptive
Atmosphere. It resolves the product day into safe visual states while preserving
user control and chart readability.

Life cycle sequence:
1. Resolve privacy-safe time.
2. Resolve solar phase.
3. Attach Moon layer as a visual hint only.
4. Resolve manual or unavailable weather state.
5. Resolve UTC market-session awareness.
6. Resolve product system weather.
7. Resolve plan realm atmosphere.
8. Resolve surface intensity.
9. Apply motion and reduced-motion rules.
10. Produce CSS classes, public-safe copy, and diagnostics.

This engine never uses GPS, stores exact location, calls external weather
providers, produces trading recommendations, or changes execution decisions.
