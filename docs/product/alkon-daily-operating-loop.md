# Alkon Daily Operating Loop

The Daily Operating Loop is private and read-only by default.

Loop:
1. Read the Wake Report.
2. Read the current station.
3. Check Product Truth.
4. Check the public/private boundary.
5. Check the heart: Pro Max Trading, Workspace, and Chart.
6. Check Assistant readiness.
7. Check visual acceptance notes.
8. Check build, test, and Git evidence when available.
9. Detect drift.
10. Return one next action.
11. Wait for Ahmad decision.

The loop does not execute shell commands, call Codex, publish externally, send email, activate payments, activate broker/feed, enable live execution, route real money, or expose secrets.

The loop exists so Pro Max can improve continuously while Product Truth and Ahmad authority remain intact.
