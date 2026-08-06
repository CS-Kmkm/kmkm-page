# Fix Push Tests

## Requirements
- Make push-triggered tests work reliably for this pnpm-based repository.
- Keep JavaScript package operations on `corepack pnpm`.
- Keep `package-lock.json` absent and rely on `pnpm-lock.yaml`.
- Preserve test coverage for lint, type-check, unit tests, build, and Playwright E2E where appropriate.

## Progress
- [done] Identified that local `corepack pnpm test` passes.
- [done] Identified CI uses npm commands even though the repo is pinned to pnpm.
- [done] Identified workflows only trigger on `main` and `develop`, while the active branch is `test`.
- [done] Update CI and surrounding automation to use pnpm.
- [done] Run focused verification and review the changes.
- [done] Triage review findings and finalize.

## Review And Commits
- Bugs: fixed job-level `secrets` references in deploy job conditions by moving token checks to step-level `env`.
- Maintainability: narrowed workflow triggers to `main`, `develop`, and `test` pushes; removed duplicate Lighthouse action server overrides; kept package scripts free of `corepack`.
- Commit: not requested yet.

## Open
- None currently.

## Verification
- `corepack pnpm lint`
- `corepack pnpm type-check`
- `corepack pnpm test`
- `corepack pnpm build`
- `corepack pnpm exec playwright test e2e/dev-experience.spec.ts --project=chromium`
- `git diff --check`
- JSON parse checks for `package.json`, `.lighthouserc.json`, and `vercel.json`

## Test Coverage Follow-up
- Added CI data validation so checked-in content is tested before unit tests.
- Added unit tests for display-date filtering, strict date parsing, career/event validation, publication utilities, and generated data integrity.
- Fixed stale `validate-data` behavior that expected a removed `updates.json` file.
- Reviewed E2E coverage, removed fixed waits, replaced placeholder accessibility checks with axe scans, aligned stale homepage assertions with the current mobile/desktop navigation, and narrowed CI E2E to the chromium suite with CJK fonts installed.
- Made `corepack pnpm test:e2e` run the same chromium suite as CI and added `test:e2e:all` for explicit cross-project runs.
- Reworded E2E performance and responsive smoke tests so the names/comments match the current implementation rather than implying unsupported Core Web Vitals, network failure injection, or removed homepage layouts.
- Fixed the accessibility E2E wait condition to scan after CSS animations finish, avoiding false color-contrast failures during delayed fade-in transitions.
