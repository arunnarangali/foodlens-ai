# Demo script (target: 2–3 minutes)

## Before the session
- [ ] Start Go backend and frontend using the final README commands.
- [ ] Check `/api/health`.
- [ ] Verify the model key is loaded in the backend environment, not the frontend bundle.
- [ ] Use one non-sensitive food image you are permitted to share.
- [ ] Check the available API quota and model access.
- [ ] Keep a clearly labelled fallback screenshot/sample response; do not present it as a live call.

## Live walkthrough
1. Introduce the problem and say this is an estimate, not a nutrition measurement.
2. Select a food photo and show the preview/privacy notice.
3. Submit the image; briefly explain that React calls Go and Go calls the hosted Ollama API with a backend-only key.
4. Show likely dish, ingredients, nutrient ranges, assumed portion size, uncertainty and preparation idea.
5. Copy the result with assumptions and disclaimer; confirm the app does not persist images or result history.
6. Demonstrate an invalid file or a controlled provider error if feasible.
7. Close with architecture, tests that actually passed and what you learned about prompt/context management.

## If live AI fails
State the failure honestly, show the safe error handling, then use a clearly labelled pre-generated sample to explain the intended output schema. Record the failure and resolution in documentation.

## Evidence to capture
- Running UI screenshot.
- Successful analysis response with personal details removed.
- Test command output.
- GitHub repository URL and commit SHA.
- Slides/demo URL.

## Current prerequisites and evidence status

Use `gemma4:31b` only after checking account access/credits; public model listing is not entitlement verification. No local Ollama server, downloads or SDK needed. Export the key privately following README; never show terminal environment or Authorization headers. The UI must visibly disclose external processing. No live demo, screenshots or actual model output have been captured in this milestone; mock fixtures must be labelled illustrative. If the account is unavailable, demonstrate upload validation and safe errors, and disclose the remaining live-test blocker.

## Hosted demo alternative — 2026-10-27

After deployment is actually verified, use the Render HTTPS URL for a one-origin demo. Check the homepage/assets and GET /api/health first, allow for a free-service cold start and confirm provider allowance before submitting a permitted photo. Current session prepared this path but did not deploy it. Follow deployment.md; do not present the local simulated smoke result as a live cloud deployment.

## Interactive sample walkthrough — 2026-10-27

Before launching the analyzer, open Sample Result and use Explore a demo goal to switch Maintain weight → Weight loss → Weight gain. Point out the moving reference markers and changing comparison labels while meal ranges, midpoints and interval positions stay fixed. State that all three profiles are application examples, not personalised dietary prescriptions; no AI call is made. Then launch the analyzer and switch its compact Your goal tab-style controls; references update immediately using the same presets, without number entry. Its selection is independent from the sample. For an 800–950 kcal result, Weight gain displays Above goal reference against 750 kcal. Do not present the sample as observed model output. This is a script, not evidence of a recorded or manually verified demo.

## Goal tabs and card borders — 2026-10-27

In analyzed results, select a goal with the segmented controls, then demonstrate Tab/arrow-key navigation if useful. Point out pale amber/brown Above, pale blue/dark blue Below and pale green/dark green Includes card themes, retaining the text badges and reference amounts. Unknown estimates have a light grey background with dark grey text. Show that estimated ranges stay unchanged while card backgrounds and text change; the themes are comparisons to illustrative references, not meal-health ratings. This is an updated script, not evidence of a recorded or manually verified browser demo.

## Matching sample controls — 2026-10-27

At `#sample-result`, use Explore a demo goal with the same tab-style radio controls as the analyzer. Demonstrate click and Tab/arrow selection, changing pale blue Below/pale green Includes/pale amber Above card backgrounds and related text colours wherever the estimated ranges produce those statuses. Keep the displayed example values unchanged; do not fabricate an Above state when the sample range does not exceed a preset. The demo remains explicitly illustrative and independent of analyzer selection. Live port 5175 inspection was blocked in the implementation environment, so no successful browser demonstration is claimed.

## Full-card theme review — 2026-10-27

Demonstrate readable headings, values, badges, reference text and graph legends on each card theme in both analyzer and sample. Retain the demo/reference disclaimer and do not invent values to force a status. The user will perform browser/mobile checks; this update does not claim new screenshots or a successful visual demo.

## Explain the colour key — 2026-10-27

In both analyzer and sample, point to What the colours mean above the cards. Read the four comparison meanings, then switch goals and show that the key stays visible while references/card themes update. The UI uses swatches plus status words, not colour names. Explain that the legend is not a food-health rating. Non-food results omit it. This is updated guidance, not a record of a new browser demo.
