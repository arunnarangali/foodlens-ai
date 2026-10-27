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

## Historical single-service deployment — 2026-10-27

- The app's fixed loopback binding would not expose a Render service. Added validated platform PORT support while preserving key-only private setup and loopback local defaults.
- Existing API-only catch-all would return JSON 404 for the frontend. Added a separate static handler restricted to built assets; unknown /api paths keep the JSON API contract.
- Docker CLI is installed, but docker version/build cannot access /var/run/docker.sock (permission denied). No system permissions were changed; container validation is prepared in CI, not claimed as locally passing.
- Initial root-relative workflow/smoke-helper commands were issued from backend and failed path lookup. Moved the helper to root .github/scripts, removed the accidental directories, and reran syntax/simulated checks from the correct root.
- Live hosting needs the user's Render account, connected GitHub service, private runtime secret and usage limits. These account changes were not executed; exact setup is documented in deployment.md.

## Historical workflow filename follow-up — 2026-10-27

No functional workflow defect was found: ci.yml was valid. Applied the requested descriptive rename to foodlens-ci.yml and updated documentation links.

## Native-runtime deployment simplification — 2026-10-27

The user requested removing the workflow and Docker to simplify hosting. Render native runtime documentation confirms that Node/npm are available alongside Go, so direct build/start commands replace the prior container/CI setup. Removed four deployment-only files and retained Go static routing, platform PORT support, Makefile and tests. Existing hosted-service runtimes are not automatically changed by repository cleanup; deployment.md explains setting up a native service. No native service or live inference was verified.

## Nutrition references without false precision — 2026-10-27

A midpoint alone could label a broad, uncertain estimate as definitely above/below a reference. The UI instead compares the complete interval, includes boundary equality and retains the original range beside an explicitly approximate midpoint. User-selected demo references are labelled illustrative per-meal values, not dietary advice. Shared cards keep the landing sample and live results consistent; narrowed CSS selectors prevent nested indicator styling from inheriting card backgrounds. Baseline checks passed; no existing failure needed repair. Browser layout/hardware and live inference were not exercised for this feature.

## Goal-specific user targets — 2026-10-27

Fixed analyzer references were replaced with user-defined per-meal targets to avoid inventing dietary requirements for weight goals. Goal state lives above routes so navigation and result replacement do not discard entries; drafts and applied values are separate. Blank/zero/negative/non-finite inputs fail locally without replacing applied targets. The landing sample retains its labelled demo values. One new navigation test initially queried the initial upload label after selection; correcting it to accept “Choose another photo” resolved the test failure. Final frontend lint/50 tests/build passed. No model prompt or provider calls were needed; manual visual/mobile checks remain unperformed.

## Goal selection in the pictured sample — 2026-10-27

The user's screenshot showed the landing sample, whereas the existing selector lived only in analyzed results. Added a separate local selector with approved demo profiles. Reusing per-selection scaling would make the food interval shift and obscure what changed; fixed maxima spanning all profiles keep estimate positions stable. Removed “Real Output Example”/“healthy” sample wording to avoid implying live evidence or a health judgement. Baseline checks passed, and no implementation test failures occurred in this follow-up. Manual browser/mobile checks remain unperformed.

## Removing manual goal detail — 2026-10-27

The user wanted immediate reference changes rather than a target form. Centralized sample/analyzer presets, retained only selected-goal state and removed validation/draft UI. Passing preset maxima with each result prevents reference switching from moving food intervals. The first edit script stopped on a stale comment match before completing dependent files; a subsequent TypeScript check reported temporary old imports/state access. Corrected the script and replaced obsolete manual-input tests; final lint/56 tests/build passed. Existing sample tab controls were preserved. No manual browser inspection performed.

## Keyboard-accessible goal styling — 2026-10-27

The requested “tabs” choose a comparison value rather than switch content panels, so the analyzer uses a native radio group with segmented styling rather than ARIA tabs. This provides single selection, Tab entry and arrow-key navigation without bespoke keyboard handlers. Existing sample tabs were preserved. The first keyboard test failed because JSDOM lacks CSS.escape, which user-event needs to find radio siblings; added a scoped test-only escape shim. Final frontend lint/58 tests/build passed. Cards reuse the existing comparison status for borders, keeping text labels and constant 2px widths. No manual browser/mobile appearance validation was performed.

## Sample control parity — 2026-10-27

The sample used older ARIA tab buttons plus a hidden select while the analyzer used native-radio segmented controls. Extracted a controlled GoalTabs component for both and removed the duplicate sample selector, preserving independent state and the visible demo notice/status. The sample already used shared border classes/CSS; source inspection found no sample-specific override, so no separate border fix was invented. A curl attempt to inspect port 5175 failed because opening sockets is prohibited here. Live browser styling/cache state remains undiagnosed; automated lint/58 tests/build passed without implementation test failures in this follow-up.

## Readable full-card themes — 2026-10-27

The earlier card border alone did not provide the requested status emphasis. Replaced fixed green card/text/graph colours with shared status variables, keeping explicit badges and neutral unknown handling. Checked source palettes for readable text and graph contrast; subtle borders are decorative, not the only indicator. Chrome attempts first failed to create a profile, then failed on a restricted socket operation using a temporary profile. The user asked to perform browser checks manually; further browser attempts stopped. No cause for the user's rendered appearance is claimed. Final TypeScript/58 tests/build and contrast checks passed without an application-test failure in this follow-up.

## Explaining nutrition colours — 2026-10-27

Added one shared colour key because card themes alone did not make their meaning obvious. Reused palette variables rather than separately defining swatch colours; explicit text avoids relying on colour recognition. The user subsequently requested no colour names, so the final labels name statuses only. Scoped legend paragraph styles prevent analyzer-wide typography rules from overriding its text. Existing regression cases were strengthened for both views, goal changes, decorative swatches, no colour-name text and non-food omission. All checks passed without a failing test run in this follow-up. Browser/mobile review remains with the user.

## Launch-button icon — 2026-10-27

Used one small inline SVG sparkle component for navbar/hero/banner arrows, with inherited colour and decorative accessibility attributes. No additional dependency or observed implementation failure. Manual browser review remains with the user.

## Keep the analysis header visible — 2026-10-27

The whole results card previously scrolled, including Your analysis/confidence/dish/copy controls. Split the result into a non-scrolling summary and a flex detail scroller, keeping the outer heading outside both. This avoids stacked sticky offsets or covering content. Completed-result cards get a mobile viewport-height cap; the panel itself remains in normal page flow. Both food and unclear outcomes retain copy fallback and disclaimers. Baseline 58 tests and final 59 tests/lint/build passed without test failures. Layout was not browser-verified, per the user's preference.

## Engaging AI loading indicators without breaking accessibility or tests — 2026-10-27

Card 01's analyze button previously used plain text "Analyzing photo…", and Card 02 used a crude unicode circle `◯` during Ollama Cloud analysis.
1. **Analyze Button**: Upgrading the button to display rich AI animations (gradient shimmer, spinning sparkle SVG, pulsing dot) risked breaking existing tests querying `screen.getByRole('button', { name: /Analyzing photo/ })`. Preserved the exact text inside an accessible span while hiding decorative SVG animations behind `aria-hidden="true"`.
2. **AI Plate Scanner**: Replaced the unicode `◯` with a dedicated `AiPlateScanner` component rendering a botanical plate SVG in idle state, and an animated AI vision scanner (conic gradient ring, concentric radar pulses, orbiting sparkles, reticle crosshair, sweeping vertical laser, and skeleton preview) when busy.
3. Added unit tests in `AiPlateScanner.test.tsx` verifying both idle and active states. All 61 Vitest tests and Go backend tests passed with zero regressions.

## Segmented control responsive wrapping and container sizing — 2026-10-27

In both Card 02 "Your goal" and the landing page `#sample-result`, the 3 goal options were wrapping into an awkward 2-on-top, 1-centered-on-bottom layout when available width dropped below 404px.
1. **Grid Replacement**: Replaced `display: inline-flex; flex-wrap: wrap; width: fit-content;` with an equal 3-column CSS Grid (`grid-template-columns: repeat(3, minmax(0, 1fr))`) and `width: 100%; max-width: 480px`. With compact padding (`8px 6px`), all 3 tabs stay locked on 1 horizontal row with equal 33.3% widths across desktop Card 02 (860px+) and tablets.
2. **Clean Stacking on Narrow Mobile**: Added `@container goalbox (max-width: 330px)` and `@media (max-width: 420px)` to cleanly stack into a full-width 3-row vertical pill list when width is strictly constrained on mobile devices, avoiding awkward wrapping or cutoffs.
3. **Workspace Stacking**: Switched `.workspace` to stack at `< 859px` rather than 580px, avoiding squeezed side-by-side cards on tablet displays.

## Mobile results panel cutoff and squished 2-column cards — 2026-10-27

In mobile viewports (< 860px), Card 02's results were being cut off horizontally through Carbohydrates and Fat, completely hiding the rest of the analysis content (sliders, preparation idea, uncertainties, notice).
1. **Cause**: `.analyzer-main .card.results.has-analysis` was styled with `max-height: 85dvh; overflow: hidden;` on mobile without a definite height. As a result, the flex child `.analysis-scroll-body` did not establish a constrained scroll height, causing the parent card's `overflow: hidden` to simply slice the content in half at 85dvh.
2. **Solution**: On screens < 860px, removed `max-height: 85dvh; overflow: hidden;` and allowed the card and scroll body to expand naturally (`overflow: visible; max-height: none;`). To keep the dish name and copy button easily accessible while scrolling down, `.analysis-summary` uses `position: sticky; top: 0; z-index: 10; background: #ffffff;`.
3. **Responsive Cards Grid**: Updated `.nutrition-grid` to `repeat(auto-fit, minmax(210px, 1fr))` with `@media (max-width: 480px) { grid-template-columns: 1fr; }`. On smartphones, cards display in a spacious single column where sliders, badges, and midpoint/reference dots never cram.



