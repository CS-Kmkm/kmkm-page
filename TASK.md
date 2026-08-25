Goal: Refine the career and publications view-switching/filtering UI to match the solid, minimal visual language of the current development-experience page.

Scope / non-scope:
- In scope: Japanese and English career/publications controls, shared control components, focused E2E assertions for the changed behavior and responsive layout.
- In scope: removal of unnecessary rounded frames, filled control surfaces, and redundant decoration around switching/filtering UI.
- Out of scope: changing career/publication data, route structure, modal content, timeline rendering logic, or unrelated in-progress development-experience/home-page work.

Constraints:
- Preserve all existing control labels, accessible names, keyboard operability, filter semantics, and mobile touch targets.
- Use the current development-experience underline-tab pattern as the visual reference while keeping filter controls recognizable as independently toggleable options.
- Preserve the user's existing uncommitted changes; do not revert or rewrite unrelated files.
- Use `corepack pnpm` with escalated permissions for JavaScript commands and redirect long command output to temporary log files.

Acceptance criteria:
1. Career view mode is presented as a two-option underline tablist aligned with the page heading; both timeline and list panels remain operable and expose correct tab semantics. Verify with focused Playwright assertions for click and keyboard navigation.
2. Timeline order is a quiet inline control without a bordered/filled container and remains available only in timeline view. Verify by DOM/class audit and focused Playwright interaction.
3. Career list and publication filters use a consistent low-chrome treatment with no rounded outer frame or nested filled segmented-control frame; active states remain unambiguous without relying only on color. Verify by DOM/class audit and pressed-state E2E flows.
4. Publication filters remain heading-aligned on desktop, wrap cleanly on mobile, and both pages have no horizontal overflow at 375px and 1280px. Verify with focused Playwright checks.
5. Japanese and English labels/accessibility remain correct, and filter result counts update. Verify with existing Japanese and English E2E suites plus targeted assertions.
6. Type-check, lint, unit tests, production build, and focused career/publication E2E tests pass.

Open questions:
- Decided: use true tab semantics for mutually exclusive career views, matching development experience; filters remain toggle buttons because multiple selections are allowed.
- Decided: keep the result count inline on desktop and let it move to a secondary row on narrow viewports; focused responsive E2E confirms no horizontal overflow.
- Decided: retain only thin separators between distinct control concepts/groups; decorative enclosing borders are removed.

Context:
- Read the latest uncommitted development-experience changes as the design baseline, especially DevExperienceClient.tsx and listItemStyles.ts.
- Read CareerPageClient.tsx, ViewToggleButton.tsx, FilterControls.tsx, PublicationFilters.tsx, PublicationList.tsx, and the focused E2E specs.
- Do not broadly refactor timeline SVG/modal implementations; they are outside the visual-control scope.

Verification status (2026-08-25):
- Criteria 1-5: done. Career tabs, keyboard switching, order control, shared low-chrome filters, pressed states, desktop alignment, and responsive overflow checks pass in focused Chromium E2E.
- Criterion 6: done. Type-check, 54 unit tests, lint (0 errors; one pre-existing unrelated warning), production build, 10 career E2E tests, 12 publication E2E tests, and 3 English E2E tests pass.
- Final independent review: no blocking issues. Adopted all findings by enforcing 44px minimum control dimensions, attaching separators to their following groups, and covering ArrowLeft/ArrowRight/Home/End tab navigation.
- Visual inspection limitation: the in-app browser runtime reported no available browser tabs. Chromium E2E rendered and exercised the target pages, including computed-style assertions, but no manual in-app visual review was possible.
