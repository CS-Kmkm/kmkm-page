# Repository Instructions

- Use pnpm for all JavaScript package operations in this repository.
- Prefer `corepack pnpm ...` so the pinned package manager in `package.json` is used.
- Do not use `npm install`, `npm run`, `npx`, Yarn, or Bun for this project unless the user explicitly asks for it.
- When adding or updating dependencies, update `pnpm-lock.yaml` and keep `package-lock.json` absent.
- This repository enforces `minimumReleaseAge: 10080` in `pnpm-workspace.yaml`, so pnpm should only install package versions that have been published for at least 7 days.
- Do not add `minimumReleaseAgeExclude` entries unless the user explicitly approves the exception and the reason is documented in the change.
- Common commands:
  - `corepack pnpm install`
  - `corepack pnpm add <package>`
  - `corepack pnpm add -D <package>`
  - `corepack pnpm build`
  - `corepack pnpm lint`
  - `corepack pnpm type-check`
  - `corepack pnpm exec playwright test e2e/dev-experience.spec.ts --project=chromium`
