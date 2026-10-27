# One-day implementation plan

## Goal
Ship a single end-to-end use case: upload one food image → inspect safely → request AI analysis → show approximate result → copy/save result text.

## Timebox (adjust to actual session time)

| Timebox | Work | Definition of done |
|---|---|---|
| 0:00–0:30 | Confirm contract, create Vite and Go skeleton, env/config | Frontend and health endpoint start locally; README commands updated. |
| 0:30–1:15 | Upload UI and Go multipart validation | Preview works; invalid/oversize/non-image input is rejected. |
| 1:15–2:15 | Ollama Cloud HTTP adapter + prompt + response validation | Valid request returns typed JSON; provider failure is mapped to a safe error. |
| 2:15–3:00 | Results and uncertainty UX | Show dish, ingredients, approximate nutrition ranges, assumptions, preparation idea. |
| 3:00–3:30 | Copy result | Copy result with assumptions/disclaimer; history deferred. |
| 3:30–4:15 | Tests and security pass | Core API validation and UI states covered; test outcomes recorded honestly. |
| 4:15–4:45 | Docs, GitHub, demo and presentation | README, 20-point mapping, prompt log, context log and deck/demo checklist updated. |

If your available session is shorter than this, cut history first, then styling. Do not cut validation, secret handling, timeouts, accuracy caveats, or basic error states.

## Must-pass acceptance criteria
- [ ] User can select a JPEG/PNG/WebP image no larger than 5 MiB.
- [ ] UI previews the file and gives a clear validation message for rejected files.
- [ ] Browser calls Go API; browser bundle contains no provider key.
- [ ] API uses a timeout and responds with structured JSON.
- [ ] Analysis describes uncertainty and uses ranges for nutrition values.
- [ ] AI failure/rate-limit/timeout does not crash the page.
- [ ] Results can be copied with assumptions and disclaimer; no history is introduced.
- [ ] Core tests are executed and actual outputs recorded.
- [ ] Demo and submission records are updated.

## Scope guard
No login, database, remote deployment, exact macro calculation, nutrition API integration, food database, multi-image analysis, or custom agent runtime in the one-day MVP.

## Milestone 1 scope (2026-10-27)

This session implements the skeleton and upload validation only. API paths are `/api/health` and `/api/analyze`. Successful uploads return an explicit placeholder without fabricated food or nutrition values. AI adapter, results schema, copy/history and deployment remain deferred. See `testing.md` for verification evidence.

## Milestone 2 — hosted-only update

Use Ollama Cloud with a backend Bearer key and publicly listed vision model. No local inference or model downloads. Finish mock-tested analysis, copy and safe errors even when account access is unavailable; clearly separate that work from a live smoke test. Cloud format enforcement is currently unsupported: prompt JSON and strictly validate. No history, SDK, database or unrelated features.

## Explicit hosting follow-up — 2026-10-27

The user subsequently authorized a single hosted frontend/API service with GitHub Actions. Deployment preparation is now an explicit follow-up to the original one-day scope guard. See deployment.md; actual container/CI/Render deployment remains unverified, rather than being counted as completed day-one evidence.
