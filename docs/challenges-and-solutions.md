# Challenges and solutions log

**Important:** The risks below are anticipated, not problems observed during implementation. Move an item into the actual incident log only when it occurs and record evidence.

## Anticipated risks

| Potential challenge | Planned mitigation | Verification |
|---|---|---|
| Image format/size abuse | Server body limit, allowlist and content sniffing. | Tests for missing, unsupported and oversized files. |
| AI response doesn't match schema | Request structured output if available; validate fields and numeric ranges in Go. | Malformed/empty response test or mocked adapter. |
| Model gives overconfident nutrition numbers | Force ranges, serving assumptions and explicit uncertainty; UI disclaimer. | Review sample outputs and add a prompt regression case. |
| API quota or model unavailable | Timeouts and generic retry-later messages. | Simulate provider failure with a fake AI client. |
| Key accidentally committed | `.env` in `.gitignore`, secret scan and review `git status`. | Confirm no key-like value or `.env` file in tracked files. |
| History accidentally stores photos | Store only structured result text; no image/base64 field. | Inspect localStorage contents after one analysis. |
| Context drift across AI sessions | Maintain summary, prompt log, API contract and weekly update. | Compare handoff against source before resuming. |

## Actual incidents (fill only after occurrence)

| Date | Observed issue | Reproduction | Root cause (verified) | Fix | Commit | Test proving fix | Learning |
|---|---|---|---|---|---|---|---|
| — | No implementation issue recorded yet | — | — | — | — | Not run | Add first real incident here |

## Observed during milestone 1 (2026-10-27)

- `go version` through `/snap/bin/go` failed with a Snap confinement error. Installed standalone `/usr/lib/go-1.26/bin/go` was available and used for checks instead; no system settings were changed.
- `git status --short` failed: this workspace is not a Git repository. No commit, diff status or commit SHA can be reported.
- Planned docs used `/api/v1` while the requested milestone used `/api`; updated the contract and architecture to `/api` before implementing frontend types and calls.
- Go's default build cache was read-only. `GOCACHE=/tmp/foodlens-go-cache` allowed the backend tests and vet to pass.
- npm registry DNS resolution failed (`EAI_AGAIN`); offline install also failed (`ENOTCACHED`). Frontend checks could not execute because dependencies are missing. No lockfile or successful frontend build is claimed.
- Sandbox denies listening sockets; the live server smoke check failed. In-memory HTTP handler tests passed instead, but live browser behaviour remains unverified.

### Git initialization follow-up — 2026-10-27
Git metadata is now present. The existing ignore file lacked TypeScript build metadata, logs and the default backend binary; added focused rules and checked exclusion behaviour. Earlier reports of missing Git metadata describe the earlier session.

## Actual Ollama Cloud milestone observations — 2026-10-27

- The user restored the placeholder skeleton before this implementation. Baseline Go and frontend checks passed; no preexisting test failures needed repair in the final restored state.
- General chat API docs list format, but cloud capability docs explicitly state structured outputs are unsupported. The user selected prompt-only JSON with strict validation; no unsupported format field or extra repair call is sent.
- The hosted public tags response lists gemma4:31b with vision; no OLLAMA_API_KEY exists in this execution environment. Signed-in account authentication/credits and live inference cannot be claimed. Shell curl to ollama.com also failed DNS resolution; native web access could read the public docs/listing.
- Existing 15-second processing/20-second browser deadlines were shorter than the new 120-second cloud default. Coordinated connection/provider/processing/write/browser limits and cancellation are implemented and tested.
- Go TimeoutHandler labels its timeout body as HTML by default. A small writer wrapper preserves application/json; a dedicated test covers timeout JSON and cancellation.
- Copy access can fail or be unavailable. The UI announces failure and supplies selectable text; tests cover both clipboard outcomes.

Mocked provider auth, quota, bad-model and network responses are test scenarios, not live incidents. No actual cloud output, billing failure or model-quality observation is invented.

## Key-only setup follow-up — 2026-10-27

The prior source accepted optional address/model/timeout/allowlist variables while README still described the older exported-variable workflow. The user requested only a key. Configuration now reads only OLLAMA_API_KEY, old exported settings cannot override fixed defaults, and private-file loading accepts only the key. Documentation now explains the explicit loader and fixed model selection. Hosted model metadata cannot identify free eligibility; no free-price inference was fabricated. Existing private key values were preserved without appearing in tool output.

## Invalid-response diagnosis and compatibility — 2026-10-27

Observed: the user received the generic AI_INVALID_RESPONSE error. Code review confirmed that envelope, truncation, JSON and semantic failures were all collapsed into that code without safe diagnostic metadata. The exact live reason was not available and is not asserted.

Fix: keep the public error stable while logging controlled reason/approved-field/size metadata only; replace raw parsing errors with safe typed validation errors. Add complete analyzed/non-food output templates. A mocked regression demonstrates acceptance of valid JSON wrapped in a whole-response Markdown fence; surrounding prose, multiple objects and invalid nutrient data remain rejected. No claim is made that Markdown was the user's actual failure. Thinking and token/deadline budgets remain unchanged; no live credits consumed.

## Backend Makefile — 2026-10-27

The default go executable is the Snap launcher, so Makefile verification used the installed standalone Go path through the GO make variable and a writable /tmp Go cache. No system settings changed.

## Camera capture and placeholder cleanup — 2026-10-27

Camera access is browser/permission/secure-context dependent, so the existing file picker remains available. Session invalidation stops late permission responses after cancellation. An initial check was mistakenly run at the project root (no package.json); rerunning in frontend reached TypeScript and caught a helper placed inside an effect. Moved the helper into component scope; the final lint/test/build chain passed. Camera hardware was not exercised.

## Prompt and feature history consolidation — 2026-10-27

The old prompt log mixed unused scaffold templates with execution entries and still contained a no-implementation placeholder. Consolidated the available conversation and repository evidence, separated undone/superseded work from current features and removed the stale placeholder. Public-listing, mock-test and live-account evidence are distinguished; unknown history was not reconstructed as fact.
