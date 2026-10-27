# Architecture — Ollama Cloud

React owns selection, in-memory preview, validation feedback and results. Go owns authoritative upload checks, cloud authentication, timeouts and domain validation. The browser never contacts Ollama directly.

```mermaid
sequenceDiagram
  actor User
  participant UI as React
  participant API as Go API
  participant Cloud as Ollama Cloud
  User->>UI: Select photo and inspect cloud notice
  UI->>API: POST /api/analyze (multipart image)
  API->>API: Bound size, sniff allowed content
  API->>Cloud: POST https://ollama.com/api/chat (Bearer auth, base64 image)
  Cloud-->>API: Completed assistant message.content
  API->>API: Strict JSON and domain validation
  API-->>UI: Validated analysis/unclear result or safe error
  User->>UI: Copy full result with assumptions and disclaimer
```

## Boundaries

- `validation`: existing inclusive 5 MiB signature allowlist; multipart body adds 64 KiB framing. Memory-only stream reading, no temporary files. Complete decoding is not performed.
- `config`: validates server address, exact hosted HTTPS URL, backend key, model and 1–180 second inference timeout.
- `ai`: mockable standard-library HTTP adapter; explicit Bearer header, two messages, base64 images, stream false, 4096 generated-token limit. No automatic retries, redirects or unsupported cloud format enforcement.
- `food`: strict required/unknown-field checks, non-negative finite ordered ranges, explicit unknowns, bounded strings/arrays and status consistency. Final disclaimer is owned by the application.
- `api`: injects analyzer; health stays process-only. Errors are sanitized JSON, including overall timeout responses.
- React `services/api.ts`: only application API calls; validates result shape and handles unreadable proxy errors. Small result/copy components render plain text, never HTML from the model.

## Deadlines and memory

Inference defaults to 120 seconds (maximum 180); connection/TLS deadlines 10 seconds. Processing deadline is inference + 15 seconds, server write deadline 200 seconds, browser deadline 210 seconds. Existing 5-second header, 15-second read and 60-second idle limits remain. Cancellation propagates to the HTTP request.

Cloud response envelope is bounded at 256 KiB and extracted JSON at 32 KiB. Upload/base64/JSON allocations remain bounded by the image limit; no image/result persistence or payload logging occurs. Preview URLs are revoked on replacement/removal/unmount. Copy contains text only.

The app uses no SDK, database, local Ollama server, history, authentication for users or orchestration. Health does not prove provider readiness. Public model listing and account entitlement are separate checks. Structural validation cannot prove visual truthfulness or detect every unsupported health claim; the prompt and permanent uncertainty disclaimer remain necessary.
