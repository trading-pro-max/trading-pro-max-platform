# Local Runtime Tooling

Local runtime tooling defines the commands Ahmad may run manually from the terminal while building Trading Pro Max.

The web application may display these commands as readiness documentation. It must not execute them.

## Commands

- `npm run build`
- `npm start`
- `npm run dev`
- `npx tsc --noEmit`
- `npx eslint app modules tests --max-warnings=0`
- `npm run prisma:validate`
- `npm run test:regression`
- `npm run smoke:routes`
- `git status --short`

## Boundaries

- no shell command execution from the web app
- no remote command execution
- no unsafe automation
- no production activation
- no billing activation
- no broker/feed activation
- no live or real-money execution
- no social publishing

## Safe Next Action

Run commands manually in the local terminal and record validation summaries without raw sensitive logs.
