# Weekly updates

Add a dated section every Wednesday. Link the actual commit, issue, PR, test output, screenshots, presentation and demo. Don't report planned work as completed.

## Historical Week 0 — Planning scaffold (2026-10-27)
- **Status:** Planning and documentation scaffold prepared; application implementation not started.
- **Project chosen:** FoodLens AI.
- **Goal:** One photo upload → Go validation → Gemini analysis → cautious structured result.
- **Scope decision:** No accounts, database, exact calorie promises, or agent orchestration in day-one MVP.
- **Documentation created:** README, architecture, API contract, requirements map, prompt-history template, context guide, model/tool guide, skill, security/test plans, presentation/demo outline and submission checklist.
- **Tests:** Not run; application source not implemented yet.
- **Risks:** Confirm model availability/free quota; nutrition outputs can be inaccurate; free-tier data terms need review.
- **Next:** Scaffold Vite + Go server, implement validation/health endpoint, integrate model and tests.
- **Commit / PR / demo:** Add when created.

## Week 1 — Template
- Date/session topic:
- Tasks assigned:
- Implemented:
- AI prompts used (IDs):
- Context compaction summary (or `not needed` with reason):
- Tests run and exact results:
- Challenges and fixes:
- Security review:
- GitHub commit/PR:
- Demo/presentation link:
- Next session actions:

## Milestone 1 session — 2026-10-27

- Implemented: React/Vite responsive upload page, preview/removal, loading/errors, dedicated API service, Go health and multipart validation, explicit temporary placeholder, environment example and local run instructions.
- No AI SDK, provider calls, fabricated nutrition, history, authentication or persistence added.
- Tests and build evidence: see `testing.md` for exact commands and observed outcomes.
- Challenges: Snap Go launcher fails; standalone toolchain available. Workspace has no Git metadata, so no commit/PR link is available.
- Context compaction: not needed in this session.
- Next: review skeleton and its signature-validation limitation before authorizing AI integration.

### Git ignore follow-up — 2026-10-27
Added ignore rules for TypeScript build metadata, logs and `/backend/server`. Verified generated/private paths are ignored and source, `.env.example` and lockfiles remain eligible for Git. No commit created.

## Ollama Cloud milestone — 2026-10-27

- Implemented: direct hosted HTTP adapter with backend Bearer authentication, bounded uploads/output, strict domain validation, unknown/non-food states, coordinated timeouts, safe errors, responsive result cards and accessible copy/fallback.
- Provider choice: Ollama Cloud only; no local model or SDK. Public listing includes gemma4:31b with vision. Account authentication, entitlement, credits and a real image result remain unverified.
- Tests: exact commands/counts are recorded in testing.md; fixtures are synthetic and consume no credits.
- Documentation: current runtime references, setup, privacy, skill, prompt, model settings, workflow/demo guidance and context handoff updated. Earlier provider planning is clearly historical where retained.
- No compaction, MCP/plugin integration, sub-agents, commit, publication, screenshot or demo recording performed in this milestone.

### Key-only configuration follow-up — 2026-10-27

Removed optional configuration variables from active setup and backend reads. Only OLLAMA_API_KEY remains; fixed Go defaults and default-model capability discovery preserve the analysis flow. Updated key-only loading/config tests and documentation. No real credential, live-provider output, billing entitlement, commit or deployment is claimed. See testing.md for actual commands/results.

### AI_INVALID_RESPONSE follow-up — 2026-10-27

Added safe backend rejection reasons, complete output prompt templates, and BOM/single-fence compatibility while preserving nutrition checks and public API fields. New backend regressions pass; frontend checks and all 18 tests/build pass. No live response was reproduced, so the user's original provider failure remains unclassified until the new diagnostic is observed. No model fallback, retries, token increases or credential changes.

## Backend Makefile — 2026-10-27

Added backend Makefile and usage documentation. Tests, vet, binary build and cleanup passed through make. No server launch or live AI call performed.

## Camera capture and placeholder cleanup — 2026-10-27

Added live camera capture with permission/error states, JPEG preview through existing validation, and stream cleanup; no automatic upload. Removed 11 .gitkeep markers at user request. Final frontend TypeScript checks, 25 tests and production build pass. No live device/browser or provider test performed.

## Prompt and feature history consolidation — 2026-10-27

Consolidated docs/prompt-history.md into 14 chronological request/feature entries, a feature summary, two runtime prompt versions and a labelled historical-template appendix. Added a README link. This is documentation-only; application features and test claims were not changed or reverified. Existing user staging, file relocations and deletions were preserved.

## Google Slides presentation deck preparation — 2026-10-27

- Analyzed full codebase, architecture, test suites, and documentation.
- Created `docs/presentation-deck.md`: a complete slide-by-slide Google Slides presentation blueprint with 7 structured slides (Cover + 6 core content slides), visual wireframes, 16:9 widescreen layout guidelines, color scheme, content cards, and verbatim speaker notes under 3 minutes.
- Generated native presentation file `docs/FoodLens-AI-Presentation.pptx` ready for direct upload/import into Google Slides.
- Created `docs/screenshots/` catalog and `docs/screenshots/README.md` defining the 6 required screenshots (`foodlens-landing-clean.png`, `foodlens-image-preview.png`, `foodlens-analysis-result.png`, `foodlens-unclear-or-error.png`, `backend-go-terminal.png`, `frontend-test-terminal.png`) with reproduction steps.
- Verified all backend and frontend tests continue to pass (Go test suites 100% pass, Vitest 25/25 pass).


## Historical single-service deployment — 2026-10-27

Prepared Go static hosting, Render PORT handling, a multi-stage non-root Docker runtime, read-only GitHub Actions checks and a no-inference container smoke script. Local Go checks/build and frontend TypeScript/25 tests/build pass. Workflow/Python syntax and built-asset simulated checks pass. Docker build is blocked by daemon permissions; GitHub Actions and Render deployment have not run. No key exposed, account changed or live inference performed. Follow deployment.md to finish hosting and record actual evidence.

## Historical workflow filename follow-up — 2026-10-27

Renamed the workflow to .github/workflows/foodlens-ci.yml. Contents are unchanged; deployment instructions and links now use the new path.

## Product landing page and sample showcase — 2026-10-27

- Created `frontend/src/components/LandingSections.tsx` featuring `HowItWorks` (3 visual steps), `SampleMealShowcase` (*Mediterranean Quinoa & Chickpea Bowl*, *380–480 kcal* with transparent assumptions and illustrative disclosure badge), `PhotoRealityGap` (2-column comparison against deceptive exact calorie tracking), and `TrustAndSafety` (ephemeral storage, backend isolation, educational purpose).
- Updated `frontend/src/App.tsx` with header navigation anchors, enriched hero CTA with feature guarantee pills, `#analyzer` anchor link, and footer links.
- Expanded `frontend/src/style.css` with responsive layout classes following the botanical design system and Georgia serif typography.
- Added landing page unit tests to `frontend/src/test/App.test.tsx`; 28/28 frontend Vitest tests pass and production build succeeds. Backend test suites continue to pass 100%.


## Native-runtime deployment simplification — 2026-10-27

Removed Dockerfile, .dockerignore, the GitHub Actions workflow and the CI-only smoke script. Current hosting instructions use one native Render Go service with direct frontend/Go build commands and manual deployment (Auto-Deploy Off). Local backend tests/vet/compile and frontend TypeScript/25 tests/build pass. No application feature or secret changed; actual Render deployment remains outstanding.

## Separate pages architecture & full-width responsive navbar — 2026-10-27

- Decoupled the application into two dedicated pages using client-side hash routing (`#/` for Landing Page and `#/analyze` for dedicated Analyzer Workspace), removing the upload cards from the landing scroll flow.
- Created `frontend/src/components/AnalyzerWorkspace.tsx`: dedicated workspace screen with a top-bar `← Back to Overview` button, photo upload card, and analysis results card.
- Created `frontend/src/components/LandingPage.tsx`: standalone marketing landing page with full-width navigation, hero CTA, How It Works, Sample Meal Showcase card (*380–480 kcal*), Reality Gap comparison, and Trust & Safety pillars.
- Updated `frontend/src/style.css` to make the navigation bar take **100% full width of the screen** with fluid padding, sticky top positioning, and responsive breakpoints (`@media (max-width: 860px)` and `@media (max-width: 580px)`) preventing overflow on mobile.
- Fixed navbar flex layout bug where `.primary` rule caused `width: 100%` and `margin-top` to squash `.nav-links a` text onto multiple vertical lines; added `white-space: nowrap`, `flex-shrink: 0`, and explicit button sizing.
- Updated `frontend/src/test/App.test.tsx` and `frontend/src/test/CameraCapture.test.tsx`; all 29/29 frontend tests pass cleanly, production build succeeds, and backend Go test suites pass 100%.

## Single-screen viewport workspace & landing layout fixes — 2026-10-27

- Implemented single-screen viewport-locked mode for the Analyzer Workspace (`height: 100vh; overflow: hidden` on desktop `≥ 860px`): header and compact intro remain fixed, and both upload and analysis cards fill the viewport with independent internal sleek thin scrollbars (`scrollbar-width: thin; scrollbar-color: #cbd8c5 transparent`).
- Resolved landing page visual defects: decoupled the Sample Meal Showcase into its own top-level section (`#sample-result`), eliminating the cropped step cards floating at the top of the viewport and removing the redundant outer card-in-card container.
- Added global `html { scroll-behavior: smooth; scroll-padding-top: 88px; }` preventing sticky navbar from clipping section titles on anchor navigation.
- Harmonized container max-width to `1260px` across header, content, and footer, and equalized card heights in comparison and trust grids.
- Scaled down typography, paddings, and card dimensions across all pages to a refined, high-density proportional layout (reduced base font to 14px, tightened header and card paddings, compact buttons, and unified max-width to 1120px).
- All 29/29 Vitest tests pass, production bundle compiles cleanly, and Go backend tests pass 100%.


