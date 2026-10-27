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
