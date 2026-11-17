# Repository Instructions

- Use pnpm for all JavaScript package operations in this repository.
- Prefer `corepack pnpm ...` so the pinned package manager in `package.json` is used.
- Do not use `npm install`, `npm run`, `npx`, Yarn, or Bun for this project unless the user explicitly asks for it.
- When adding or updating dependencies, update `pnpm-lock.yaml` and keep `package-lock.json` absent.
- This repository enforces `minimumReleaseAge: 10080` in `pnpm-workspace.yaml`, so pnpm should only install package versions that have been published for at least 7 days.
- Do not add `minimumReleaseAgeExclude` entries unless the user explicitly approves the exception and the reason is documented in the change.
- In Codex shell sessions on this Windows/nvm setup, run `corepack pnpm ...` commands with escalated permissions from the start. Sandboxed execution is expected to fail with `'node' is not recognized as an internal or external command` even though `corepack.cmd` is on PATH. Do not switch to `npm`, `npx`, Yarn, or Bun.
- Common commands:
  - `corepack pnpm install`
  - `corepack pnpm add <package>`
  - `corepack pnpm add -D <package>`
  - `corepack pnpm build`
  - `corepack pnpm lint`
  - `corepack pnpm type-check`
  - `corepack pnpm exec playwright test e2e/dev-experience.spec.ts --project=chromium`
- Full command table, environment variables, and content layout: README.md. Verify with `corepack pnpm lint`, `corepack pnpm type-check`, `corepack pnpm test`, and `corepack pnpm validate-data` after editing `src/data`.
- Content source of truth: Japanese JSON in `src/data/`; `src/data/en/` holds id-matched English overlays. Never invent facts about the site owner.
- `.kiro/specs/` and `doc/progress/` are historical; the current task contract is TASK.md.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
