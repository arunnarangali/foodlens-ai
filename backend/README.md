# Backend

Go 1.22+, standard library only. Export `OLLAMA_API_KEY` privately and `OLLAMA_MODEL=gemma4:31b` in the backend shell, then run `go run ./cmd/server`. No SDK, model downloads or local inference runtime.

Defaults: `SERVER_ADDR=127.0.0.1:8080`, `OLLAMA_BASE_URL=https://ollama.com/api`, `OLLAMA_TIMEOUT_SECONDS=120` (1–180). Only the hosted HTTPS base URL is accepted. Key/model are required. `.env` is not automatically loaded. See the root README for private key entry and account/usage checks.

`GET /api/health` reports process health; `POST /api/analyze` accepts one JPEG/PNG/WebP multipart `image` at most 5 MiB, calls the cloud once and validates its output. Uploads are never written to disk. Cloud account access and quota remain unverified here.

Checks: `gofmt -w .`, `go test ./...`, `go vet ./...`. Tests use fake transports and synthetic data, never real keys/credits. Full schemas/errors are in `../docs/api-contract.md`.
