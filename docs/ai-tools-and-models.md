# AI tools, model configuration and access evidence

## Selected runtime

| Setting | Value / status |
|---|---|
| Provider | Ollama Cloud only, direct HTTPS HTTP API |
| Base/chat URL | https://ollama.com/api / https://ollama.com/api/chat |
| Authentication | Backend environment OLLAMA_API_KEY → Bearer header |
| Evaluated hosted model | gemma4:31b; public listing advertises vision, completion, thinking and tools |
| Public listing evidence | Checked 2026-10-27 via https://ollama.com/api/tags; returned digest 221b330d11a8 |
| Account-specific access/credits | Not verified: no key supplied to execution environment; signed-in account usage unavailable |
| Model configuration | OLLAMA_MODEL required; no silent fallback or automatic selection |
| Ollama/SDK installation | Not needed; Go standard library only |
| Input/output | One base64 image in user message; stream false; parse message.content |
| JSON policy | Prompt-only JSON plus strict validation; cloud format enforcement documented as unsupported |
| Output limit | options.num_predict 4096; envelope 256 KiB; model JSON 32 KiB |
| Generation temperature/thinking | Provider defaults; no explicit overrides |
| Timeouts | Provider 120 seconds default (1–180); request +15; write 200; browser 210 |
| Retries/redirects | None |

`gemma4:31b` is verified as publicly listed, not exercised by this app. No actual model output, account plan or quota measurement is claimed. Hosted weights need not be downloaded; published local weight sizes/hardware requirements do not apply to this direct cloud path.

## Usage and privacy

The pricing page checked on 2026-10-27 describes pay-as-you-go token charges and subscription credits. Authentication does not imply free or unlimited inference. Check signed-in usage, credits, model access and billing before a permitted-image smoke test. No automated test consumes credits. Do not substitute a local tag or CLI `:cloud` alias for a model name returned by the hosted API.

Submitting uploads to Ollama Cloud leaves the computer. Provider privacy/retention terms apply; no regulated-workload guarantee is made.

## Official references

- https://docs.ollama.com/cloud
- https://docs.ollama.com/api/chat
- https://docs.ollama.com/api/authentication
- https://docs.ollama.com/capabilities/vision
- https://docs.ollama.com/capabilities/structured-outputs
- https://ollama.com/api/tags
- https://ollama.com/library/gemma4
- https://ollama.com/pricing
- https://ollama.com/settings/keys

## Development tool evidence

Codex assisted implementation; exact coding-model identifier not recorded. Native web tools checked official documentation and public listing. No MCP server/plugin or multi-agent orchestration was used for this milestone. Runtime provider requests remain Go-only. Historical provider ideas are superseded and are not active integration instructions.
