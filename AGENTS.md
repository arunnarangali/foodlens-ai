# Instructions for AI coding agents

## Mission
Build FoodLens AI as a safe, small, one-day MVP. Prefer a working end-to-end path over extra features.

## Product boundaries
- Analyse a user-provided food photo and return likely dish, likely visible ingredients, approximate nutrition **ranges**, stated assumptions, uncertainty, and one basic preparation suggestion.
- This is educational estimation, not medical or dietetic advice. Never claim exact nutritional values from pixels.
- Do not add authentication, cloud storage, a database, payments, RAG, or multi-agent orchestration without an explicit requirement.

## Technical conventions
- Frontend: React + TypeScript + Vite. Keep components small and use accessible labels/states.
- Backend: Go `net/http`; separate API handlers, validation, AI adapter, config, and domain types.
- Use Ollama Cloud only via Go standard HTTP at `https://ollama.com/api/chat`; no local inference, cloud SDK or alternate provider.
- Read `OLLAMA_API_KEY` only in the backend environment; never expose Bearer headers or credentials.
- Call the AI provider only from the backend. Never place provider secrets in frontend code or Vite variables.
- Only OLLAMA_API_KEY is configurable, through the private backend .env (loaded explicitly) or backend environment. The hosting platform may supply PORT automatically for public binding; do not add it to .env. All other application runtime settings are fixed Go defaults; `.env.example` must contain only the key placeholder.
- Validate upload size and actual content type; accept only the explicit allowlist implemented by the team (planned: JPEG, PNG, WebP; 5 MiB maximum).
- Apply request and provider timeouts. Avoid logging raw images, secrets, or full user payloads.
- Do not write uploaded images to disk. Do not persist image bytes in browser history.
- Return consistent JSON errors and use appropriate HTTP status codes.

## AI response rules
- Ollama Cloud currently documents structured outputs as unsupported. Request JSON in the prompt, omit unsupported format enforcement, and validate the complete response in Go.
- Validate parsed output before returning it to the client; handle malformed model output safely.
- Nutrition values must be ranges with serving assumptions and uncertainty. If the photo is unclear, say so.
- Avoid unsupported health claims, allergen guarantees, and medical recommendations.

## Workflow
1. Read `README.md`, `docs/architecture.md`, `docs/api-contract.md`, and the relevant skill before changing code.
2. Implement one milestone at a time: API types/health → upload validation → provider adapter → UI integration → tests/docs.
3. Before changing API response fields, update `docs/api-contract.md` and frontend types together.
4. Run relevant formatting, lint, and tests. Report exact commands and results; never invent results.
5. Update `docs/prompt-history.md`, `docs/challenges-and-solutions.md`, `docs/testing.md`, and `docs/weekly-updates.md` from actual work, not assumptions.
6. Keep diffs focused and explain important design decisions.

## Security
Never commit `.env`, real API keys, credentials, personal data, or private food photos. Never imply that a key grants free/unlimited usage or that hosted inference is suitable for sensitive or regulated workloads. Keep privacy limitations visible in the UI and README.
