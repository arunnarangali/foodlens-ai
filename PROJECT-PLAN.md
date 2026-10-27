# FoodLens AI — complete project plan

## Product definition
**Target user:** Someone curious about a meal who wants a quick, plain-language explanation of what it might be and its approximate nutrition.

**Problem:** A food photo is easy to capture but hard to turn into a helpful nutrition/recipe explanation. Food labels may not be available, and general nutrition data can be hard to interpret.

**Value proposition:** One photo generates a cautious explanation of the likely dish, visible ingredients, broad nutrition ranges under a stated serving assumption, and a simple preparation idea.

**Important product honesty:** The model cannot infer exact food weight, recipe, hidden ingredients, cooking method, oil or sauce quantity from an image. Never position the app as a precise calorie counter or medical tool.

## MVP feature set
1. Select/take one photo (JPEG/PNG/WebP, max 5 MiB).
2. Preview and remove/change the photo.
3. Submit to a Go API; validate the request server-side.
4. Call one multimodal model via backend-only credentials.
5. Render likely dish, confidence, ingredients, nutrition ranges, portion assumptions, uncertainty and a preparation idea.
6. Copy results and optionally keep the last 5–10 result objects as text-only browser history.
7. Handle invalid image, timeout, quota/rate limit and malformed model output.
8. Display provider privacy and nutrition accuracy notices.

## Technical decisions
- React + TypeScript + Vite for quick UI development.
- Go `net/http` rather than a framework to reduce setup time.
- Go standard-library HTTP client for the authenticated Ollama Cloud chat API.
- Evaluate hosted `gemma4:31b` (publicly listed with vision); account entitlement/usage remains to be verified. No local runtime or model download.
- No database or login. No history or persistence in this milestone; copy generated text only.
- Maximum 5 MiB, JPEG/PNG/WebP allowlist, actual content sniffing and 120-second default AI request timeout.

## API design
- `GET /api/health` → simple health JSON.
- `POST /api/analyze` → multipart `image`; returns the schema in `docs/api-contract.md`.

## One-day order of work
1. Scaffold frontend/backend and confirm the API contract.
2. Add upload validation and health handler.
3. Add AI adapter, prompt, response validation and timeout.
4. Connect UI and result cards.
5. Add loading/error/uncertainty states.
6. Add copy/history if time remains.
7. Run tests and security review.
8. Update documentation, publish GitHub and prepare the demo/presentation.

## Non-goals
No auth, cloud database, meal tracking, exact calorie claims, barcode scanner, external nutrition database, chat memory, paid deployment, or multi-agent workflow.

## 20 requirement coverage
The detailed `docs/session-requirements.md` maps all numbered requirements to a concrete artifact/action. In short: source repo, README, architecture/API contract, prompt and context logs, instruction file, skill/agent documentation, model settings, MCP/tool inventory, workflow, challenge/test logs, session requirements, slide outline, demo script, submission links, privacy/security checklist and weekly updates.

## Acceptance criteria
- A normal image successfully travels through React → Go → AI and returns validated structured results.
- Invalid/oversized image and AI failure paths are handled safely.
- Nutrition ranges, assumptions and uncertainty are visible.
- No provider key in client code and no image data in history/logs.
- Core tests are actually executed and documented.
- All submission artifacts are linked after being created.
