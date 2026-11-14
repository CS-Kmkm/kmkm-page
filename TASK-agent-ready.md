Goal: Implement issues #140–#143 so agents can retrieve accurate localized portfolio content with predictable HTTP behavior.

Scope: Anonymous production access evidence; Markdown negotiation and explicit .md URLs for home, career, publications and development in ja/en; localized Markdown 404; no-JS regression tests; crawler policy and scanner evidence. Privacy/terms remain HTML-only. No new dependencies or owner facts, no llms.txt/DNS-AID/MCP cards.

Constraints: Preserve HTML UI, canonical/hreflang/JSON-LD, redirects and RSC. Reuse localized data getters and their publication/date visibility rules. Preserve user changes in AGENTS.md and CLAUDE.md. Owner explicitly authorized commit, push, production URL environment variable, deployment and issue closure on 2026-11-14 after reviewing the implementation summary. Do not run an Opus audit.

Reuse / creation: Extend Next.js with src/proxy.ts and one Markdown renderer; add focused unit/E2E tests and docs/agent-ready.md for reproducible evidence. Existing TASK.md describes earlier work and is retained.

Acceptance criteria:
1. #140: Anonymous ja/en/publications/robots/sitemap status, type, redirects and login absence recorded; protected deployment URL still redirects to authentication.
2. #141: Eight public pages provide localized data-derived Markdown on explicit Accept and .md URL; ordinary HTML/RSC and redirects preserved; Link and Vary headers tested; alternate variants never mix.
3. #142: Unknown localized document paths return localized Markdown 404; HTML 404 and no-JS main content/links remain accessible. Unit tests, build and focused Chromium tests verify behavior and existing metadata.
4. #143: Document separate search, user-directed access and training policy without changing current permissions. Record both scanner baselines and post-deployment measurements, or precise outstanding external requirements without inventing results.
5. Lint, type-check, unit tests, validate-data, production build and relevant Chromium E2E pass. Independent audit explicitly waived by the user for this task.

Status: Local implementation complete. #140 evidence posted and issue closed. Both scanner baselines recorded (Cloudflare Level 1; Is Agentic 66/100). Next 16.4.4 Vary merge patch applied via pnpm without version changes; 201 unit tests and 33 focused Chromium tests pass (1 development-only test skipped), production build passes, 8-page visual comparison shows no ordinary UI change. No production environment variables exist; NEXT_PUBLIC_SITE_URL=https://kmkm-page.vercel.app must be set before rebuilding production. Independent audit explicitly waived by the user in this session; the running Opus request was stopped and no audit result is used. User AGENTS.md/CLAUDE.md changes preserved. Next: obtain commit/push and production-setting/deployment authorization; deploy and verify CDN alternating Accept, metadata and protected URLs; rerun both scanners with new timestamps and close #141–#143 only after production acceptance.
