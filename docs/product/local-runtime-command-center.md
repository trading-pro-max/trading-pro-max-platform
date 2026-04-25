# Local Runtime Command Center

The Local Runtime Command Center documents local commands and validation expectations for Ahmad's laptop.

It is not a remote execution panel.

## Display-Only Command Set

- `npm run build`: create the production build and catch route, type, and runtime build failures.
- `npm start`: run the built local app for review.
- `npm run dev`: run the local development server while editing.
- `npx tsc --noEmit`: type-check without writing output.
- `npx eslint app modules tests --max-warnings=0`: strict linting.
- `npm run prisma:validate`: validate Prisma schema.
- `npm run test:regression`: run regression coverage.
- `npm run smoke:routes`: run canonical route smoke checks.
- `git status --short`: confirm the local worktree state.

## Safety

The web app must not execute local runtime commands. Commands are for terminal use only and require human review when they change evidence, screenshots, validation state, or Git state.
