Goal: Complete issues #144–#149 in priority order with reproducible UI/accessibility/performance evidence on feat/ui-quality-improvements.

Scope / non-scope:
- #144 baseline audit; #145 shared modal; #146 Git timeline keyboard/mobile; #147 localized Lighthouse/performance coverage; #148 existing-data browsing; #149 shared UI consistency.
- Exclude deferred #150, new owner facts/content/images, crawler/Markdown work, direct production deployment. Commit/push/PR merge and closing #144–#149 are now authorized by the user; #147 closure is an explicit user decision despite documented remaining measurements.

Constraints:
- Preserve Japanese/English, themes, Git graph, and both technology/project views. No speculative relationships or mandatory content fields.
- Use corepack pnpm (escalated on this host); preserve minimumReleaseAge; avoid permanent new dependencies.
- Preserve pre-existing AGENTS.md modifications and untracked CLAUDE.md.
- Capture before/after screenshots, local lab metrics, and actual browser keyboard/axe results. Label production/RUM and physical-device checks unavailable when not performed.
- Independent read-only audit via authenticated Claude CLI after local checks; do not delegate implementation.

Reuse / creation plan:
- Extend existing Modal, timeline nodes, DevExperienceClient, ProjectModal, modalStyles/tokens, accessibility/performance E2E and Lighthouse config.
- Add reproducible audit scripts/specs and docs/ui-quality.md, with generated evidence under ignored .ai/test-results/ui-quality/.
- Evaluate official Modern Web Guidance via pinned temporary CLI; keep guidance review separate from legacy-scan and browser results. Compare Astryx patterns without adopting its runtime.

Acceptance criteria:
1. #144: official guidance and scan reproduced, 2 locales x 4 routes x 2 themes x 2 sizes captured with axe, overflow and interaction evidence; findings/limitations documented.
2. #145: modal focus entry/trap/return, background isolation, Escape/backdrop/close, long content, unique ARIA IDs and reduced motion verified in browser; preserve callers.
3. #146: event and descriptive career nodes operable with keyboard and visible focus; mobile graph remains readable with all content accessible; order/view controls preserved.
4. #147: Lighthouse measures 8 actual localized URLs; record comparable local before/after lab metrics and bundles; replace unreliable wall-clock assertions with meaningful checks; do not claim field INP without data.
5. #148: technology/project navigation works both ways with focus restoration and current/back context; add publication links only where existing data proves a relation; localized E2E covers both views.
6. #149: unify measured inconsistent control/focus/target styles with existing tokens; document shared rules and Astryx comparison; theme/reduced-motion/browser regression checks pass.
7. lint, type-check, unit tests, validate-data, production build, focused Chromium E2E pass; before/after visuals inspected; independent audit findings resolved or reported.

Open questions:
- May decide myself: native dialog selected; presentational Git SVG stays decorative while labeled HTML career controls expose full records. No verified publication-project association exists. Use 8 localized Lighthouse URLs x 3 mobile lab runs.

Context:
- GitHub CS-Kmkm/kmkm-page #144–#149; #150 explicitly deferred. Base main 7e48da8.
- README.md, playwright.config.ts, .lighthouserc.json, e2e/accessibility.spec.ts, e2e/performance.spec.ts, Modal.tsx, GitBranchTimeline/index.tsx, EventPoint.tsx, DevExperienceClient.tsx.
- Historical .kiro/specs and doc/progress are not task requirements. Prior TASK.md concerned completed content work.

Status:
- Criteria 1–3,5–6: implementation and regression evidence retained from prior work.
- Criterion 4 reopened: EN scores regressed in the historical sequential measurement; host benchmark differed, and causal attribution is unresolved. Do not claim performance completion.
- Follow-up scope: reproduce baseline HEAD 7e48da8 vs current UI branch under matched build env, fixed Playwright Chromium, interleaved local Lighthouse runs; inspect main-thread/script costs; implement measured improvements without content/visual regressions; independently audit changes and final claims.
- Follow-up done criteria: record all EN routes for original/current/improved as needed with per-run settings and benchmark values; show a reproducible measured reduction in identified costs; explain remaining variation and any score regression, then run relevant tests and before/after visual checks. Commit/push/merge and issue closure are now authorized; no separate production deployment.
- Preserve historical evidence; new measurements use .ai/test-results/perf-recheck/. Reuse existing scripts/UI, extend measurement runner for interleaved variants. Keep original content and #150 excluded.
- Progress: matched original/current diagnosis and balanced retained-build comparisons complete. Global WebVitals candidate rejected after publications regression; retained change only reduces home measurement DOM. Retained unit 204, types/build/focused lint and scoped Chromium 32 passed (1 development-only skip); prior candidate full Chromium 141 passed (1 skip). Eight locale/theme/size PNG pairs identical. Home Lighthouse median 59.5→63.5 and TBT 3100→1935ms; publications 68→57 remains unresolved. Supplemental eight-run direct Chromium counters improve on home but not publications. No EN-wide improvement or performance completion claimed. Existing margin-calculation correction deferred to preserve visible counts. Evidence: docs/performance-recheck.md and docs/performance-comparison.json. Final independent audit verified the supplied numbers and found no blocking issue; resize-test race and PowerShell version guard corrected, final home recheck 10 passed on explicit retained-build port3103.

Rendering follow-up (current user request):
- Reduce demonstrably unnecessary work across active routes; preserve work that benefits later navigation. Keep #150 and separate deployment excluded; publishing and issue closure authorized in the latest request.
- First target: defer the unvisited projects tab on development experience; retain visited tabs and already expanded category grids to preserve state and fast revisits. Reuse existing components; no new dependency, content or visual changes.
- Done: compare fixed before/after production builds for initial DOM/HTML and real client navigation plus first/repeated tab-switch timings; inspect locale/theme/viewport screenshots; verify tab keyboard, category state and project/technology focus round trips; run lint/typecheck/unit/build and relevant Chromium tests; obtain independent audit through the configured route. Report timing variation and unresolved publications regression separately.
- Status: complete for this rendering follow-up. Unvisited project subtree deferred; visited tabs/category state retained. Production build/types/unit204, focused Chromium49 plus final DOMcheck1 passed; lint0 errors/1 existing warning. EN initial DOM704→401 and HTML165640→127410 bytes. Eight-pair median navigation946→833ms, first-project123→165ms, repeat-project79→64ms; first-use tradeoff documented. Visual24 pairs checked (22 exact, two logo-only pixel differences independently verified). Claude hit weekly quota; configured native gpt-6.1-sol xhigh audit verified code and evidence with no blocking findings. Durable report: docs/rendering-performance.md. Original #147 publications regression remains unresolved; publishing and issue closure now authorized; no separate deployment.

Publishing snapshot: implementation and evidence are split by issue, with independent scope checks for each PR. GitHub PR/issue state is the source of truth for merge/closure status. User explicitly authorized closing #147 as well as solved UI issues; retain evidence of the unresolved publications measurements without claiming they improved.
