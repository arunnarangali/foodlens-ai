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
| Model configuration | Fixed gemma4:31b; hosted discovery verifies vision/completion before each analysis; no fallback |
| Ollama/SDK installation | Not needed; Go standard library only |
| Input/output | One base64 image in user message; stream false; parse message.content |
| JSON policy | Prompt-only JSON plus strict validation; cloud format enforcement documented as unsupported |
| Output limit | options.num_predict 4096; envelope 256 KiB; model JSON 32 KiB |
| Generation temperature/thinking | Provider defaults; no explicit overrides |
| Timeouts | Provider 120 seconds fixed (includes discovery); request 135; write 200; browser 210 |
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

## Current setup simplification

OLLAMA_API_KEY is the sole environment/file setting. The backend explicitly loads its private .env with exported-key precedence; all other runtime settings are code defaults. Key-only setup does not imply a free-model detection API: /api/tags advertises capabilities, not allowance/price/account balance. The default model is a public-listing choice, not a verified free entitlement. No live requests were made during this change.

## Sample goals and research boundary — 2026-10-27

Shared sample/analyzer presets are frontend constants, not model generations; see README for all three profiles. They do not change model settings, prompts, inference counts or food estimates. Native web tools consulted the [FDA label guidance](https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label) and [NIDDK planner overview](https://www.niddk.nih.gov/health-information/weight-management/body-weight-planner). The FDA describes individual variation in calorie needs; NIDDK describes personalised planning. Neither source supplies or endorses FoodLens demo numbers. No personalised calculator, new provider or MCP integration was introduced.
