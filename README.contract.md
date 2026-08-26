# README document contract

- Goal: Enable a developer who is new to the repository to understand the site, run it locally, update its content, verify changes, and prepare a production deployment without reading the implementation first.
- Audience: Developers and future maintainers familiar with basic Node.js and Git workflows, but not with this repository.
- Essential claims:
  - This repository contains a bilingual personal portfolio built with the Next.js App Router, with Japanese pages under `/ja` and English pages under `/en`.
  - Node.js 22 and the repository-pinned pnpm version are the supported toolchain.
  - Local setup consists of installing dependencies, creating `.env.local`, and starting the development server.
  - Portfolio content is maintained in Japanese source JSON files and English overlay JSON files under `src/data`.
  - The repository provides commands for linting, type checking, unit tests, E2E tests, data validation, production builds, and bundle analysis.
  - `NEXT_PUBLIC_SITE_URL` controls production URL metadata; analytics variables are optional.
- Completion criteria:
  - Every documented command exists in `package.json` and uses `corepack pnpm`.
  - Required versions and environment-variable behavior agree with the repository configuration.
  - Main locale-prefixed routes, content locations, verification commands, and deployment prerequisites are easy to find.
  - The README uses concise Japanese and renders as valid Markdown.
- Prohibitions:
  - Do not claim that a public deployment URL, CI workflow, license, or contribution process exists unless it is present in the repository.
  - Do not document obsolete npm, npx, Yarn, or Bun commands.
  - Do not include private credentials, unpublished content, or guarantees not established by the code.
