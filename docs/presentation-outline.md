# Project presentation outline (6 slides)

Create a PPT, PDF or Google Slides deck after the working demo is ready. Use screenshots from the actual implementation; do not create fake test results or imply unimplemented features exist.

## Slide 1 — Problem and user
- People want a quick explanation of the food in front of them.
- Existing difficulty: a photo doesn't reveal exact portion, oil or hidden ingredients.
- Product promise: a quick educational estimate, not precise nutrition measurement.

## Slide 2 — FoodLens MVP
- Upload/capture image, identify likely dish, list likely ingredients, show nutrition ranges and preparation idea.
- Demonstrate uncertainty and privacy disclaimer.
- Explicitly mention out-of-scope features.

## Slide 3 — Stack and architecture
- React + TypeScript + Vite.
- Go `net/http` backend.
- Hosted Ollama Cloud chat API through Go standard HTTP; backend-only Bearer key.
- Diagram from `docs/architecture.md`.

## Slide 4 — AI-assisted development
- Show real prompts from `docs/prompt-history.md`.
- Explain context preservation and any actual compaction events.
- Show `AGENTS.md` and food-analysis skill.
- Describe the model ID and configuration actually used.

## Slide 5 — Testing, security and limitations
- Show actual test commands/output and one real issue/fix.
- Explain server-side image validation, API key isolation and timeouts.
- Explain why nutrition is given as ranges and how external processing, provider terms and usage charges affect privacy/cost.

## Slide 6 — Live demo and learning
- Select image, analyse, inspect uncertainty/nutrition range, copy result and show error handling.
- Summarise lessons learned and next steps.
- Include GitHub, presentation and demo links once real.

## Speaker note
Keep the demo under 3 minutes. Do not depend solely on live model availability: keep a clearly labelled sample response for explaining the UI if the provider is down, but disclose when a sample response is being shown rather than a live AI result.

## Milestone 2 evidence limits

Public vision model: `gemma4:31b`. Account entitlement and a live image result are not verified. Cloud schema enforcement is documented as unsupported; describe prompted JSON and backend validation accurately. No MCP or multi-agent runtime was used. No deck, screenshots, recording or demo link has been produced by the implementation session. Use only actual evidence when preparing slides.

## Current goal-comparison addition — 2026-10-27

Slide 2: show the compact analyzer selector and interactive sample using shared illustrative presets with independent selections. Slide 5: show the actual latest frontend result (56 tests, TypeScript and build passed), without implying manual visual or live-model validation. Slide 6: switch sample goals and point out that only reference markers/comparison labels change; food estimates and interval positions stay fixed. Explain that presets are not model output or researched dietary recommendations. Use the README table and research links; no new screenshots or deck export were produced in this feature session.

## Goal tabs and borders follow-up — 2026-10-27

For Slides 2/6, show analyzer tab-style goal controls and immediate full-card colour themes (pale amber/brown Above, pale blue/dark blue Below, pale green/dark green Includes, grey Unknown). Explain whole-range comparisons and unchanged estimates; preserve text badges for accessibility. Latest automated frontend result: 58 tests, TypeScript and build passed. Manual browser/mobile appearance and new screenshots remain unverified.

## Matching sample controls follow-up — 2026-10-27

Use the same native-radio segmented controls in both sample and analyzer demonstrations. The sample now has no hidden dropdown; its full-card themes follow the shared card status classes. Explain independent selections and unchanged estimated ranges. Updated automated frontend checks pass 58 tests; live port 5175/browser validation remains unverified because socket access was denied.

## Current full-card colour presentation — 2026-10-27

Show matching status backgrounds and readable text/badge/graph colours in both sections. Explain that explicit labels remain alongside colours and visual changes do not modify estimates. Automated source-palette contrast checks passed; rendered browser/mobile verification will be performed manually by the user. No new presentation export or screenshot evidence was created.

## Shared colour-key addition — 2026-10-27

Show the compact legend in both nutrition views: swatches plus Above reference, Below reference, Range includes reference and Estimate unknown. Colour names are omitted from UI labels. Explain whole-range comparisons rather than meal health; retain disclaimers. Latest automated checks pass 58 tests plus TypeScript/build, while manual browser/mobile review remains with the user.
