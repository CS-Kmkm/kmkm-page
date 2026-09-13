Goal: Close the content gaps found in the 2026-09-13 site review so that both locales expose the same information, publication records carry bibliographic detail, and the site is shareable and reachable.

Scope / non-scope:
- In scope: publication DOIs/abstracts, publication list badges, profile bio and laboratory-site link, English policy pages and footer policy links, locale correctness for `<html lang>` / loading / 404, OG image, JSON-LD, PWA icons, removal of unused template assets and dead code.
- Out of scope: researchmap / Google Scholar links, CV download (no artifact exists), publishing an email address, slide/poster/code fields on publications, a Research topic page, career and project description rewrites that need facts only the site owner has.

Constraints:
- Decided: do not publish an email address; the laboratory site link is the single contact route.
- Decided: keep the English publications policy as-is (international venues plus papers with an official English title, 3 of 6). Unused English overlay entries are deleted in a separate, easily revertable commit.
- Decided: publications gain source URL, DOI and abstract only.
- Never invent facts about the owner. Web-sourced values must come from an authoritative page (ACL Anthology, Springer, J-STAGE, AXIES, GitHub) and the source is recorded in the PR.
- `corepack pnpm` for every JavaScript command. `minimumReleaseAge` forbids fresh dependency versions; prefer no new dependencies.
- New logic is test-first. Long command output is redirected to the scratchpad and read filtered.

Acceptance criteria:
1. Every publication that has a public DOI carries it, and every publication carries an abstract in its own language. The English overlay carries the publisher's own English abstract for each paper the English page shows and none is invented; where the publisher issued no English abstract the English page shows none rather than the Japanese one. Verify with `src/data/__tests__/publications-bibliography.test.ts` and the overlay cases in `src/data/__tests__/localized.test.ts`.
2. The publications list shows peer-review status, venue scope, publication type and award badges in both locales. Verify with component tests.
3. The home page shows the bio and the laboratory site link in both locales. Verify with component tests.
4. `/en/privacy` and `/en/terms` return 200 with English content, the footer links to the policy pages in both locales, and the sitemap lists all four policy URLs. Verify with a route test and a sitemap unit test.
5. `<html lang>` matches the rendered locale, the loading state and the 404 page are localized, and `/en/...` 404s link to `/en` targets. Verify with unit and E2E assertions.
6. Every page emits `og:image` and `twitter:image`; a `Person` JSON-LD is present site-wide and `ScholarlyArticle` JSON-LD on the publications pages; the manifest declares 192 and 512 icons and an apple-touch-icon exists. Every URL the sitemap pairs across locales also carries the reciprocal `hreflang` link in its own head. Verify with metadata unit tests and `e2e/document-head.spec.ts`.
7. No unused template SVG or dead component remains, and unused English overlay entries are removed with tests updated.
8. Type-check, lint, unit tests, `validate-data`, production build, and focused Chromium E2E tests pass.

Deviations from the decisions above, recorded rather than hidden:
- The AXIES paper (`pub-003`) has no official English abstract. Confirmed against the J-STAGE English record, which carries no `citation_abstract` and marks the abstract `[in Japanese]`. Its English entry therefore has none; inventing a translation would have broken the no-invented-facts constraint.
- The unused English overlay entries were removed inside the data commit, not a separate one. Separating them would have left an intermediate commit whose tests fail, because the test pinning the visibility rule was added in the same change. The three removed entries are quoted verbatim in the pull request so restoring them stays a copy-paste.

Open questions:
- Owner decision required: the publication-list badges reverse commit `23bf621`, which deliberately removed them and pinned their absence with a unit test and an e2e test. Kept as its own commit so it can be dropped alone.
- Bio placement (hero vs a dedicated section) was left to implementation judgment and is reviewed in the PR.

Context:
- Issues: #123 publication data, #124 publication badges, #125 profile display, #126 policy pages, #127 locale correctness, #128 SEO metadata, #129 cleanup.
- Branch: `feat/content-completeness`. The PR stays open for owner review; issues are not closed automatically.
- Review source: the 2026-09-13 content review covering rendered output of all ten routes on a local dev server.
