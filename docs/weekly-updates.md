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

## Native-runtime deployment simplification — 2026-10-27

Removed Dockerfile, .dockerignore, the GitHub Actions workflow and the CI-only smoke script. Current hosting instructions use one native Render Go service with direct frontend/Go build commands and manual deployment (Auto-Deploy Off). Local backend tests/vet/compile and frontend TypeScript/25 tests/build pass. No application feature or secret changed; actual Render deployment remains outstanding.
