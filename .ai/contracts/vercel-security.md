Goal: Resolve the repository security findings from the Vercel deployment review and explain dashboard protection checks.

Scope: Dependency patches and lockfile, release-age policy, headers, analytics input validation, Vercel routing, CI security, focused regression tests, README analytics prerequisites. No commit, push, deployment, or dashboard mutation.

Constraints: Use corepack pnpm with escalated execution. minimumReleaseAge is 10080 minutes without exceptions. Preserve static rendering and locale/navigation behavior. Optional analytics must use explicitly allowed origins. Claude source audit is authorized; exclude credentials.

Reuse / creation plan: Extend existing configs and analytics components; centralize CSP generation in src/lib/securityHeaders.ts; add focused regression tests. Leave prior task contracts unchanged.

Acceptance criteria:
1. Resolve known production vulnerabilities with versions published at least seven days ago; verify registry dates, frozen lockfile install and pnpm audit --prod.
2. Emit CSP, strict referrer policy, frame denial and MIME protection from one configuration; remove obsolete XSS headers. Verify config and production browser tests. Static hydration requires unsafe-inline; do not claim strict XSS protection.
3. Validate GA IDs and HTTPS custom analytics origins without credentials; strip query/fragment from explicitly sent analytics locations/referrers and omit the custom POST Referer header. Use manual GA pageviews and document the external prerequisite: disable automatic enhanced measurement in GA to avoid independently generated events. Verify malicious inputs, manual navigation and fetch options. Live GA property settings require external access.
4. Pin Snyk action and restrict GitHub token permissions while preserving the audit failure gate; verify workflow diff.
5. Preserve hydration, theme, navigation, sitemap and icons. Verify lint, type-check, unit tests, build and focused Chromium E2E tests.
6. Complete an independent read-only audit and resolve confirmed material findings.
7. Explain Vercel Authentication / Standard Protection, bypass exceptions, environment scope, members and anonymous tests in Japanese. Dashboard state is unverified until connected.

Open questions: None blocking. Implementation details may be decided within scope.

Initial implementation status: Repository work complete. Criteria 1-6 verified: frozen lockfile install; production audit zero; full audit one unpatched development-only braces advisory; lint passes with the pre-existing EventDetailModal unused-locale warning; type-check, data validation and analytics-enabled static build pass; 174 unit tests pass; initial 16 focused Chromium tests and final 3 security tests pass. Independent Claude audit could not run because of quota (429); one native GPT-6 Sol reviewer completed the audit and bounded recheck. Both confirmed analytics findings were corrected; no material findings remain in the bounded recheck. Application-controlled GA events were tested with a synthetic loader; real GA payloads/property settings remain unverified. Dashboard instructions accompany the final response. No commit/push/deployment/dashboard mutation performed.

External follow-up: Authenticated Vercel project access is now confirmed. The production domain is public, and the sampled generated production and Preview URLs redirect anonymous users to Vercel login. Project environment variables are empty and the team has one Owner. Shared-link bypasses, OPTIONS Allowlist, account MFA and detailed Firewall state remain unverified. Subsequent repository security changes and publication are recorded in security-header-branch.md. If GA is used, disable Enhanced Measurement in the web data stream before relying on the application's manual sanitized events. Keep the existing full-audit CI gate failing on GHSA-vfj7-8cjw-p6xm until an official fix is available; no vulnerability ignore or release-age exception was added.
