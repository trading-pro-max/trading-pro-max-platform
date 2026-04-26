# Rollback Plan

Rollback readiness is required before any soft launch or production launch.

Required:
- previous deployment artifact kept
- database migration rollback decision documented
- backup restore test before soft launch
- DNS/traffic switch manual and reversible
- Founder approval before traffic change
- incident notes recorded after rollback

No rollback automation, production deployment, or traffic switch is activated in this pass.
