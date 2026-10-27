# Backend

Go 1.22+, standard library only. Set only `OLLAMA_API_KEY` in private `backend/.env`, then run `go run ./cmd/server` from `backend/`. The server explicitly loads that file; an exported key takes precedence. Unknown file settings are rejected. No other environment settings are supported.

Fixed Go defaults: `127.0.0.1:8080`, `https://ollama.com/api`, model `gemma4:31b`, inference deadline 120 seconds. Before analysis, authenticated hosted discovery checks that the default model advertises vision and completion. No fallback model is selected. A public listing does not establish free access, balance or account entitlement; payment/quota failures stop the request.

`GET /api/health` reports process health; `POST /api/analyze` accepts one JPEG/PNG/WebP multipart `image` at most 5 MiB and validates cloud output. Uploads are never written to disk. No SDK or local runtime is required.

Checks: `gofmt -w .`, `go test ./...`, `go vet ./...`. Tests use synthetic credentials and fake transports, never real keys or credits. See root README and API contract for privacy, limits and setup.
