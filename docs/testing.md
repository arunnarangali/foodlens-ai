# Latest verification — invalid-response reliability (2026-10-27)

- Root: `/usr/lib/go-1.26/bin/gofmt -w backend` — exit 0.
- backend: `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go test ./... && GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go vet ./...` — exit 0; ai/api/config/food passed, vet produced no diagnostics.
- frontend: `npm run lint && npm test && npm run build` — exit 0; TypeScript passed, all 18 tests passed, Vite built 30 modules.
- Root: `git diff --check` — exit 0.

New backend regressions cover valid plain/whitespace/BOM/fenced food JSON, rejected prose/multiple fences/truncation/invalid ranges, typed missing/type/range/value/size errors, and adapter diagnostic reasons. Captured logs are checked for absence of synthetic secrets, image data, raw model text and Authorization headers. Existing upload, discovery, timeout, quota, API and frontend regressions pass.

The wrapped-JSON regression passes through the real HTTP adapter with a fake transport. The user's actual cloud response was not available; no live reproduction, paid request or root-cause confirmation is claimed. The updated backend diagnostic can identify the next real rejection safely. Thinking remains at provider defaults; no unsupported control or schema-enforcement parameter was added. Public API/result fields and key-only configuration remain unchanged.

Earlier records below describe preceding milestones/configuration.

---

# Latest verification — key-only configuration (2026-10-27)

Only OLLAMA_API_KEY remains in .env.example and private backend/.env. Assignment-name-only inspection confirmed this without printing values; production-source inspection found only OLLAMA_API_KEY passed to os.Getenv. `git check-ignore backend/.env` returned exit 0 and listed the private file. An existing private key assignment was preserved during cleanup; no real key value was printed.

Exact commands/results from this follow-up:

- Root: `/usr/lib/go-1.26/bin/gofmt -w backend` — exit 0.
- In backend: `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go test ./... && GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go vet ./...` — exit 0; ai/api/config/food passed; vet had no diagnostics. Server/validation have no separate test files.
- In frontend: `npm run lint && npm test && npm run build` — exit 0; TypeScript passed, all 18 tests passed, Vite built 30 modules.
- Root: `git diff --check` — exit 0.

New/revised config tests cover fixed defaults despite obsolete exported settings, invalid/missing/redacted keys, key-only private file loading, exported-key precedence, literal quoting/no command expansion, unknown file settings, atomic parse failure and missing private files. Existing discovery/provider/API/frontend tests remain passing. No live-provider request or free account entitlement was verified. Success schemas and food prompt are unchanged; runtime defaults are fixed in Go rather than configured through other variables.

The records below are historical milestone evidence and may describe configuration options superseded by this key-only follow-up.

---

# Current verification — Ollama Cloud milestone (2026-10-27)

Environment: Node 20.19.2, npm 10.8.2, Vite 6.4.5, Vitest 3.2.7. Go checks use the installed standalone `/usr/lib/go-1.26/bin/go` with writable `GOCACHE=/tmp/foodlens-go-cache`; module minimum remains Go 1.22. Historical records below describe earlier environments and do not override this report.

## Baseline before implementation

- In `backend`: `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go test ./... && GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go vet ./...` — exit 0; restored skeleton passed.
- In `frontend`: `npm run lint && npm test && npm run build` — exit 0; TypeScript check, six tests and production build passed.

No baseline repair was required after the user's final undo.

## Final implementation checks

| Directory | Exact command | Result |
|---|---|---|
| Root | `/usr/lib/go-1.26/bin/gofmt -w backend` | Exit 0; Go formatting completed. |
| backend | `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go test ./...` | Exit 0; ai, api, config and food packages passed. Server/validation packages have no separate test files; upload behaviour is covered in API tests. |
| backend | `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go vet ./...` | Exit 0; no diagnostics. |
| frontend | `npm run lint` | Exit 0; TypeScript checks passed (not ESLint). |
| frontend | `npm test` | Exit 0; 18 tests passed in one file. |
| frontend | `npm run build` | Exit 0; TypeScript and Vite production build passed, 30 modules transformed. |
| Root | `git diff --check` | Exit 0; no whitespace errors. |
| Root | `git check-ignore --no-index backend/.env frontend/.env frontend/.env.local frontend/node_modules/example.js frontend/dist/index.html` | Exit 0; all representative private/generated paths ignored. |

Go test/vet and frontend commands were each invoked as the chained commands above; every stage completed successfully. Frontend checks were rerun after copy, duplicate-submit and state-machine tests were added.

## Cases actually executed

- Existing health JSON, upload MIME/size/multipart rejection tests retained. JPEG/PNG/WebP signatures and inclusive 5 MiB boundary covered.
- Mocked analysis and unclear/non-food results; authoritative domain revalidation and fixed disclaimer.
- Cloud request URL, method, Bearer header with synthetic key, base64 image, prompt, selected model, stream false, output budget and omitted unsupported format field.
- 401/403 authentication, 402/payment/quota, 429, invalid/missing model, 500/service, 504/deadline, network error, cancellation and redirect rejection. No retries; no raw upstream messages returned.
- Invalid JSON/envelope, incomplete/token-limited response, missing/unknown fields, explicit null bounds, negative/reversed/equal ranges, required nullable nutrient properties, invalid confidence, excessive strings/lists/output size and trailing JSON.
- Overall request timeout returns application/json and cancels the analyzer.
- React preview/removal and URL cleanup, invalid/empty/oversized input, ranges/unknowns/assumptions/disclaimer, loading, duplicate prevention, API/network/non-JSON failures, unclear results, cloud privacy notice, copy success and selectable fallback.

## Security and availability checks

A repository credential-pattern scan returned no matches (paths-only reporting). A frontend source scan found no OLLAMA_API_KEY, OLLAMA_BASE_URL, Bearer header or direct hosted chat endpoint references. These checks are limited pattern checks, not a proof of absence of every possible secret. No real key was supplied or printed. Existing Git staging was preserved; no commit was created.

The official hosted public model listing checked via native web access on 2026-10-27 includes `gemma4:31b` with vision capability. Official cloud docs state format enforcement is unsupported; prompted JSON was selected by the user. Account entitlement, authentication, usage credits and current free usage were not verified. The key settings page requires sign-in. Shell `curl --max-time 5 -sS https://ollama.com/api/tags` returned exit 6 (DNS resolution unavailable in this sandbox), although native web access could read the public listing.

**No live inference, real model output, browser screenshot, visual/mobile inspection or demo recording is claimed.** Automated HTTP adapter tests use a fake RoundTripper instead of listening sockets and consume no credits. Synthetic illustrative nutrition fixtures are not model output.

## Remaining local integration steps

1. Check signed-in Ollama account model access, usage credits/billing and current hosted tags.
2. Set only OLLAMA_API_KEY in private backend/.env following README; start Go and Vite.
3. With one permitted non-sensitive food photo, verify preview → analysis → ranges/uncertainty → copy, removal, and narrow-screen layout. Confirm the browser calls only Go.
4. Record the actual model/result/time and any errors without keys or private images. Do not treat public listing or mocked success as proof of account access or model quality.

---

# Milestone 1 verification — 2026-10-27

Environment: Node v20.19.2, npm 10.8.2, installed standalone Go 1.26 toolchain. No Git metadata is available (`git status --short` returned `fatal: not a git repository`), so no SHA is reported.

## Commands and actual results

Run from repository root unless a directory is specified.

| Command | Actual result |
|---|---|
| `go version` | Exit 1: Snap confinement launcher refused to run. |
| `/usr/lib/go-1.26/bin/gofmt -w backend` | Exit 0; Go sources formatted. |
| In `backend`: `/usr/lib/go-1.26/bin/go test ./... && /usr/lib/go-1.26/bin/go vet ./...` | Exit 1: default Go build cache is read-only; vet was not reached. |
| In `backend`: `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go test ./... && GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go vet ./...` | Exit 0, including final rerun after config tests. API and config packages passed; other packages have no test files. Vet produced no diagnostics. |
| In `frontend`: `npm install --offline --cache /home/texol/.npm --no-audit --no-fund` | Exit 1: ENOTCACHED for `@testing-library/react`. |
| In `frontend`: `npm install --cache /tmp/foodlens-npm-cache --fetch-retries=0 --fetch-timeout=15000 --no-audit --no-fund` | Exit 1: EAI_AGAIN resolving registry.npmjs.org. |
| In `frontend`: `npm run lint` | Exit 127: `tsc: not found`, dependencies unavailable. |
| In `frontend`: `npm test` | Exit 127: `vitest: not found`, dependencies unavailable. |
| In `frontend`: `npm run build` | Exit 127: `tsc: not found`, dependencies unavailable. |
| In `backend`: `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go run ./cmd/server` | Exit 1: sandbox denied local listening socket (`socket: operation not permitted`). Live server/browser verification blocked. |

An initial `npm install --no-audit --no-fund` attempt produced no useful output while waiting on registry access; the bounded retry above establishes the DNS failure. No frontend tests, frontend build, browser inspection, or live HTTP checks are claimed as passing. The original empty scaffold lockfile was removed; generate a real one with `npm install` when registry access is available.

## Backend coverage actually executed

- Health status, exact health JSON and JSON content type.
- Valid PNG and JPEG uploads; WebP signature acceptance (not full WebP decoding).
- Missing, empty, wrong-field, duplicate-file and malformed multipart requests.
- Unsupported bytes despite a `.png` filename.
- Uploads exactly 5 MiB accepted; uploads over 5 MiB rejected with 413.
- Explicit `placeholder` status on successful uploads; structured error codes on validation failures.
- Wrong methods and unknown paths return JSON errors.
- Default/valid server address and invalid placeholder/port configuration.

The backend checks content signatures only. Corrupt files with supported signatures can pass; no claim of full image decoding or food detection is made.

## Frontend tests written, execution blocked

`src/test/App.test.tsx` covers type/size limits, preview/removal and object URL cleanup, invalid files, multipart submission/placeholder display, server errors and retry. These tests have not run.

## Required local follow-up

1. `cd frontend && npm install` (retain the generated lockfile).
2. `npm run lint`, `npm test`, `npm run build`.
3. Run Go and Vite using the root README commands; check health and the complete select → preview → validate → placeholder → remove flow in a browser, including a narrow viewport.
4. Before AI integration, resolve any failures and record actual results. Provider timeout/output tests and history/copy tests belong to later milestones.

## Git ignore verification — 2026-10-27
`git check-ignore --no-index frontend/tsconfig.tsbuildinfo frontend/npm-debug.log backend/server backend/.env frontend/node_modules/example/index.js frontend/dist/index.html` returned exit 0 and listed all six paths.

`git check-ignore --no-index .env.example frontend/src/App.tsx frontend/package-lock.json backend/go.mod` returned exit 1 with no output, confirming those paths are not ignored. These checks use representative paths and do not create files. No application tests were needed for ignore-only rules.

## Backend Makefile — 2026-10-27

From backend: `make` — exit 0; help listed targets. `GOCACHE=/tmp/foodlens-go-cache make GO=/usr/lib/go-1.26/bin/go check build` — exit 0; Go tests, vet and binary build passed. `make -n run fmt` — exit 0; command expansion verified only, neither target executed. `make clean` — exit 0; generated server binary removed. No new tests needed for command aliases.

## Camera capture and placeholder cleanup — 2026-10-27

From frontend: `npm run lint && npm test && npm run build` — final exit 0; TypeScript passed, 25 tests passed across two files, Vite built 31 modules. Camera tests cover video-only opening, cancel/track cleanup, capture into preview without fetch, removal, denied permission, unsupported browsers, late permission cancellation, unmount cleanup and frame readiness. Initial attempts failed due to wrong working directory, then a misplaced helper; both were corrected before the successful final run. `git diff --check` passed. Placeholder cleanup removed 11 files; no new tests were needed for marker deletion. Real camera hardware/mobile layouts and HTTPS deployment were not manually verified; no claim of live camera certification is made.

## Prompt and feature history consolidation — 2026-10-27

Documentation-only validation: `python3 /tmp/foodlens-history-check.py` checked 14 unique sequential history IDs, five historical scaffold templates, exact agreement of the current V2 prompt with the Go constant, balanced code fences, local file/heading links and the README history link. `git diff --check` checked whitespace. No application tests were rerun for this documentation-only change; prior results retain their historical scope. The checker is a temporary session script, not a new application dependency or repository test suite.

Result: both documentation checks returned exit 0; the checker verified 27 local file/heading links. No missing links, duplicate task IDs, prompt mismatch or whitespace errors were found.

## Single-service deployment — 2026-10-27

Actual commands and outcomes:

| Directory | Command/check | Actual result |
|---|---|---|
| Root | `/usr/lib/go-1.26/bin/gofmt -w backend` | Exit 0. |
| backend | `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go test ./... && GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go vet ./...` | Exit 0; ai/api/config/food/web passed, vet no diagnostics. Server/validation have no separate test files. |
| backend | `GOCACHE=/tmp/foodlens-go-cache /usr/lib/go-1.26/bin/go build -o /tmp/foodlens-deploy-server ./cmd/server` | Exit 0; binary compiled. |
| frontend | `npm run lint && npm test && npm run build` | Exit 0; TypeScript, 25 tests in two files, 31-module Vite production build passed. |
| Root | Python AST parse of `.github/scripts/smoke.py`; PyYAML BaseLoader parse/assertions of `.github/workflows/foodlens-ci.yml` (current path; the original check preceded the rename) | Exit 0; syntax/triggers/main/read-only permissions verified. This is not actionlint or an actual Actions run. |
| Root | Python smoke-harness import with actual frontend/dist assets and simulated API fetch responses | Exit 0; smoke assertions passed. No network, live server, container or inference call was made by this harness. |
| Root | `docker version` | Exit 1; Docker CLI installed, daemon socket access denied. |
| Root | `docker build --tag foodlens-ci .` | Exit 1; permission denied accessing /var/run/docker.sock. Container build/run, non-root runtime and image-file checks remain unverified. |
| Root | `git diff --check` | Exit 0 before documentation completion; rerun after final edits. |

New Go tests cover homepage/assets, content types, HEAD, disallowed static methods, missing build/files, directory/hidden/traversal rejection, health and unknown API JSON, invalid upload routing without inference, local binding and valid/invalid platform PORT. No provider key is required by tests. Docker CI is written to build, start with a synthetic key, check non-root/file exclusions and run the smoke helper without inference.

Two initial helper commands used root-relative paths from backend and failed; paths were corrected and helpers rerun from root. Successful checks are listed separately from those setup failures. No actionlint executable was available. No Render account/service, runtime secret, live HTTPS URL, camera hardware or live-provider request was configured or verified. See deployment.md for exact remaining account and local Docker steps.

Final deployment-documentation checks: workflow YAML, each CI shell step (`bash -n`), Python syntax, required Docker exclusion/non-root/no-build-secret declarations, 15 sequential history IDs and local file targets passed. A tracked-private-env/frontend-key-reference scan passed. These static declaration checks are not Docker runtime or GitHub Actions execution. Final `git diff --check` returned exit 0.

## Workflow filename follow-up — 2026-10-27

Workflow rename only: verified the new file exists, old path is absent, contents are byte-for-byte identical to the pre-rename file, and YAML parses successfully. The deployment record now identifies the current workflow path and notes that its original check preceded the rename. No application tests rerun for the filename-only change.

Related-reference audit: active README, deployment instructions, prompt-history link and testing references use .github/workflows/foodlens-ci.yml. Verified referenced workflow paths exist and no obsolete workflow-path reference remains. Historical rename descriptions retain the old filename as narrative only.
