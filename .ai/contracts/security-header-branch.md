Goal: Prepare and verify the security response-header improvements on a dedicated branch.

Scope: Adopt the existing CSP, Permissions-Policy and obsolete XSS-header removal in next.config.ts, src/lib/securityHeaders.ts and vercel.json; strengthen focused regression coverage. Preserve all pre-existing working-tree changes. Subsequent explicit user authorization includes commits and push of the security work and all remaining existing changes on this branch. No deployment or dashboard mutation.

Constraints: Use corepack pnpm with escalated execution. Preserve static hydration, theme switching, localized navigation and Preview Toolbar support. The static-compatible CSP allows inline scripts; do not claim nonce-based XSS protection.

Reuse / creation plan: Reuse existing header implementation and security tests. Add production-response coverage to e2e/security.spec.ts. Use a temporary isolated production-server Playwright configuration under .ai/test-results.

Acceptance criteria:
1. Work on fix/security-response-headers and preserve existing work; verify branch and diff.
2. CSP and Permissions-Policy are emitted on localized HTML pages, and X-XSS-Protection is absent; verify production HTTP regression tests. Redirects preserve their destination and do not emit legacy XSS filtering; CSP need not be attached to a non-rendered redirect response.
3. Hydration, theme switching, navigation and blocking of untrusted external scripts still work; verify existing Chromium security tests.
4. Lint, type-check, unit tests and production build pass; record pre-existing warnings separately.
5. Independent read-only audit completes and material findings are resolved.

Open questions: None blocking. Remote shared links, OPTIONS Allowlist, account MFA and Firewall remain unverified and are outside this repository change.

Status: All criteria 1-5 verified. Security changes are committed on fix/security-response-headers (2bbcd19 and 8de07ec) and pushed. Lint passes with the pre-existing EventDetailModal unused-locale warning; type-check and all 174 unit tests pass. Default and synthetic-analytics production static builds pass. Isolated Chromium security tests pass: default build 3 passed / 1 optional skip; analytics-enabled build all 4 passed. The modified E2E spec also passes focused ESLint. Claude review failed because of its session usage limit; an independent native GPT-6 Sol reviewer found an analytics test-mock CORS defect, which was corrected and verified with the analytics-enabled E2E run. The same reviewer's bounded recheck confirms the finding resolved and no new material findings. The user subsequently authorized publishing all remaining existing changes. A bounded independent review of dependencies, CI, Vercel configuration and ignore rules found no material findings. Fresh production audit reports zero advisories; full audit still reports the unpatched development-only braces advisory, so the strict CI audit gate will fail. All remaining existing changes are included on the same branch in separate commits. Local audit logs and source packets are excluded from publication. No deployment or dashboard mutation performed. Remote settings listed above remain unverified.
