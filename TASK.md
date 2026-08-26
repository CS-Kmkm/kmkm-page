Goal: Make `/ja` the canonical URL prefix for every Japanese page while preserving working redirects from the previous unprefixed URLs.

Scope / non-scope:
- In scope: Japanese App Router entries, root and legacy redirects, locale-aware links, metadata alternates/canonicals, sitemap and manifest URLs, route-focused E2E/unit tests, and README route documentation.
- In scope: Japanese home, career, publications, development experience, privacy, terms, and the legacy events redirect.
- Out of scope: English page content, portfolio data, component visual design, and a broad i18n architecture refactor.

Constraints:
- Keep English routes at `/en` and `/en/...`.
- Use `/ja` and `/ja/...` for every generated or internal Japanese page link.
- Preserve old public URLs with permanent redirects instead of leaving duplicate content or returning 404.
- Preserve the user's existing README changes and use `corepack pnpm` for JavaScript commands.
- New route behavior is test-first; long command output is redirected outside the worktree.

Acceptance criteria:
1. `/ja`, `/ja/career`, `/ja/publications`, `/ja/dev-experience`, `/ja/privacy`, and `/ja/terms` render the corresponding Japanese content. Verify with focused Playwright route and content assertions.
2. `/`, `/career`, `/publications`, `/dev-experience`, `/privacy`, `/terms`, and `/events` permanently redirect to their `/ja` targets. Verify status and `Location` headers with a table-driven route test.
3. Japanese navigation, home/update links, recovery links, and language switching use `/ja`; English navigation stays under `/en`. Verify with focused unit/E2E assertions for Japanese and English pages.
4. Japanese canonical URLs and sitemap entries use `/ja`, English alternates remain under `/en`, and the manifest starts at `/ja`. Verify with unit tests or route responses and a source/config audit.
5. README route documentation matches the new canonical URLs and its document contract remains accurate. Verify with technical and expression review lenses.
6. Type-check, lint, unit tests, production build, and focused Chromium E2E tests pass.

Open questions:
- Decided: `/` redirects to `/ja` so both supported locales have explicit prefixes; this avoids treating Japanese as an implicit special case.
- Decided: legacy unprefixed Japanese routes use permanent redirects to preserve inbound links while preventing duplicate canonical content.
- Decided: keep shared/client implementation files in their existing directories where practical; route entry files under `/ja` may import them to avoid a broad move-only refactor.

Context:
- Route definitions: `src/app`, especially the Japanese root/primary/policy pages and the existing `src/app/en` tree.
- URL generation: `src/lib/i18n/index.tsx`, `src/lib/metadata.ts`, `src/lib/site.ts`, `src/app/sitemap.ts`, and `src/app/manifest.ts`.
- Internal links: `src/components/layout/Header.tsx`, `src/components/common/PageError.tsx`, `src/components/ui/UpdatesList.tsx`, `src/components/ui/NavigationCard.tsx`, and root error/not-found pages.
- Verification: `e2e/*.spec.ts` and existing unit tests under `src/**/__tests__`.

Verification status (2026-08-26):
- Criteria 1-5: done. Canonical `/ja` pages, legacy 308 redirects with query preservation, locale-aware links, metadata alternates, sitemap/manifest URLs, and README route documentation are implemented and covered.
- Criterion 6: done. Type-check passed; lint passed with one pre-existing unrelated warning; 63 unit tests passed; production build passed; Chromium E2E passed 68/68 tests.
- Independent defect review: one missing `/ja/events` regression case was adopted; the focused route suite passed 3/3 afterward.
