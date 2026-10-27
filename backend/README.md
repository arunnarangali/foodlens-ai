# Backend

Go 1.22+, standard library only. Set only `OLLAMA_API_KEY` in private `backend/.env`, then run `go run ./cmd/server` from `backend/`. The server explicitly loads that file; an exported key takes precedence. Unknown file settings are rejected. No other environment settings are supported.

Fixed Go defaults: `127.0.0.1:8080`, `https://ollama.com/api`, model `gemma4:31b`, inference deadline 120 seconds. Before analysis, authenticated hosted discovery checks that the default model advertises vision and completion. No fallback model is selected. A public listing does not establish free access, balance or account entitlement; payment/quota failures stop the request.

`GET /api/health` reports process health; `POST /api/analyze` accepts one JPEG/PNG/WebP multipart `image` at most 5 MiB and validates cloud output. Uploads are never written to disk. No SDK or local runtime is required.

Checks: `gofmt -w .`, `go test ./...`, `go vet ./...`. Tests use synthetic credentials and fake transports, never real keys or credits. See root README and API contract for privacy, limits and setup.

From this directory, use `make run`, `make build`, `make test`, `make vet`, `make fmt`, `make check` (tests + vet), or `make clean`. Plain `make` lists the targets. Override the toolchain when needed with `make GO=/path/to/go check`. The build creates the Git-ignored `server` binary; `make clean` removes it. Run and build use the existing key-only configuration.

## Hosted/static frontend

The server also serves `../frontend/dist` when built, while `/api/*` retains the JSON API. Build React from the repository root with `npm --prefix frontend ci && npm --prefix frontend run build`, then compile/run Go from backend. Local Vite development remains unchanged.

Render uses its native Go runtime with repository-root build/start commands documented in `../docs/deployment.md`; Docker and GitHub Actions are not needed. Start from backend so static assets and private local .env resolve correctly. Render supplies PORT automatically for public binding; it is infrastructure metadata, not a private .env setting. Keep only OLLAMA_API_KEY in private configuration. Actual hosted deployment remains unverified.
