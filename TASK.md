Goal: Add a coherent English version of the portfolio at /en while preserving the existing Japanese site.

Scope / non-scope:
- In scope: /en, /en/career, /en/publications, /en/dev-experience; shared locale infrastructure; English profile, career, publication, technology, project, generated-event, metadata, navigation, accessibility, and modal/filter text; sitemap language alternates.
- Out of scope: English versions of the legacy /events redirect and the non-navigated /privacy and /terms pages; redesigning either locale; changing factual dates, links, identifiers, or Japanese copy.

Constraints:
- Use the existing Next.js App Router structure and shared components instead of duplicating complete component trees.
- Keep all current Japanese routes and behavior stable.
- Use pnpm through `corepack pnpm` for JavaScript commands.
- English data overlays must be keyed by stable IDs so references remain aligned with the Japanese source data.
- User-facing English must include visible copy and accessibility labels; the English route subtree must expose `lang="en"` at its content boundary even if changing the document root would require a disruptive route-group migration.

Acceptance criteria:
1. Visiting /en renders an English profile and English recent updates, with English header/footer/navigation and no Japanese user-facing copy. Verify with a focused Playwright English-route test and source audit.
2. English navigation reaches /en/career, /en/publications, and /en/dev-experience; each route renders its primary content, generated labels, controls, filters, dialogs, and empty/loading/error states in English. Verify with focused Playwright flows and a Japanese-character audit of rendered pages.
3. English profile, career, publication, technology, and project content preserves the IDs, dates, URLs, and cross-references of the Japanese source data. Verify with unit tests for localized data integrity.
4. English pages publish English metadata and language-alternate/canonical information, and sitemap includes both language variants for primary routes. Verify with unit/source assertions and production build output.
5. Existing Japanese routes and tests remain unchanged in behavior. Verify with the existing relevant unit and Playwright suites.
6. Type-check, unit tests, lint, production build, and the focused English E2E suite pass.

Open questions:
- Decided: English /events, /privacy, and /terms are excluded because they are not part of the site's primary navigation; add them later if explicitly requested.
- Decided: Prefer shared locale-aware components and ID-keyed overlays over duplicated route/component trees to prevent language versions drifting.
- Decided: Mark the English subtree at its content boundary with lang="en" unless repository-safe implementation of document-level language is found during integration; preserving every Japanese URL takes priority over a broad route migration.

Context:
- Read src/app/** for route composition and metadata.
- Read src/components/** containing user-facing strings to make shared controls locale-aware.
- Read src/data/*.json and src/data/index.ts because generated updates/events contain both source copy and template copy.
- Read src/lib/constants/** and src/lib/site.ts for navigation, labels, categories, and global metadata.
- Read e2e/*.spec.ts and existing unit tests for behavioral contracts; do not rewrite unrelated tests.

Completion report (2026-08-11):
- Criterion 1: done. /en renders localized profile and generated updates; the English E2E audits visible text and accessibility attributes for Japanese characters.
- Criterion 2: done. English primary navigation and all three nested routes render localized controls, filters, dialogs, dates, and error UI. Playwright English flows passed 3/3.
- Criterion 3: done. ID-keyed overlays cover 8 career entries, 6 publications, 25 technologies, and 15 projects. Unit tests preserve IDs, dates, URLs, technology/project references, and generated event identifiers.
- Criterion 4: done. English metadata, canonical/language alternates for localized routes only, and bilingual sitemap entries are implemented; the production build passed.
- Criterion 5: done. Existing Japanese defaults and compatibility assertions remain green; all 53 unit tests passed.
- Criterion 6: done. `corepack pnpm type-check`, `corepack pnpm test -- --reporter=dot`, `corepack pnpm lint`, production build, and `corepack pnpm exec playwright test e2e/english.spec.ts --project=chromium --reporter=line` passed.
- Review: independent contract review found five issues; all were corrected, and the focused re-review confirmed every finding resolved.
- Limitation: the in-app browser had no available tab in this environment, so visual inspection there was unavailable. Chromium Playwright rendered and exercised the pages successfully.
