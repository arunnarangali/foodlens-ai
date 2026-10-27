# Development workflow

## Delivery method
Use short vertical slices so a single day produces a demonstrable flow rather than many incomplete features.

1. **Plan:** confirm acceptance criteria, read `AGENTS.md`, architecture and API contract.
2. **Scaffold:** generate React + TypeScript + Vite, initialize Go module, use standard HTTP, create health endpoint.
3. **Validate upload:** implement body limit, MIME/magic-byte checks, allowed formats and rejection tests before calling AI.
4. **AI adapter:** write one focused prompt, model call with timeout, prompted JSON parsing and safe failure mapping.
5. **UI integration:** wire file selection, preview, submit, loading/success/error states and disclaimer.
6. **Finish MVP:** add copy result; defer history for this milestone.
7. **Review:** inspect security, accessibility, error paths, prompt and uncertainty language.
8. **Validate:** run formatting, lint (if configured), Go tests, frontend tests and manual test matrix. Record actual results.
9. **Document:** update prompt log, challenges, context log, AI settings, weekly update and session evidence.
10. **Publish:** remove secrets and local media, push GitHub, add presentation/demo links to submission sheet.

## Suggested Git habits
- Initial branch: `main`.
- Feature branches if useful: `feat/image-upload`, `feat/ollama-cloud-analysis`, `feat/results-ui`, `test/core-flows`, `docs/session-evidence`.
- Use small factual commits such as `feat: add validated food image upload` or `docs: document session workflow` only after the changes actually exist.
- Do not commit generated test images from private sources or real `.env` files.

## AI-assisted implementation rules
- Ask for a plan before edits and restrict each task to a few related files.
- Review diffs rather than accepting large uninspected changes.
- Ask AI to explain assumptions and edge cases, especially for nutrition estimates.
- Never trust model output as executable instructions or guaranteed nutrition facts.
- When debugging, provide the minimal error and relevant code, with secrets redacted.
- Keep the source of truth in repository files; use the session summary format in `docs/context-management.md` when continuing work.

## Code review checklist
- API key stays server-side.
- Upload limit and file type are checked on the server.
- File names and model output are not trusted.
- Provider call has a deadline.
- UI includes loading/empty/error/uncertainty states.
- Result JSON is validated.
- No history or image persistence is introduced.
- Tests and README match the actual implementation.

## Current cloud integration workflow

Run the existing baseline checks before changing code; this session's baseline passed. Update contract and TypeScript types together, implement a mockable analyzer and test the real cloud HTTP adapter with a fake transport. No live credits or sockets are required for ordinary tests. Use private exported backend variables; Go does not load `.env` automatically. Verify hosted model names with the public tags endpoint and account entitlement/usage separately before one non-sensitive live request.

Use `go test ./...`, `go vet ./...`, frontend TypeScript checks, Vitest and production build. If the system Go launcher fails, use the installed standalone toolchain and a writable GOCACHE as recorded in testing.md. Do not alter system services or install a local runtime. Keep evidence factual and preserve user staging; this session creates no commit or deployment.
