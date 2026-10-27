# AI agents and skills

## Development roles (prompt-defined, not autonomous agents by default)

| Role | Purpose | When used | Evidence to keep |
|---|---|---|---|
| Planner | Break one-day scope into small tasks and acceptance criteria. | Before implementation and when scope drifts. | Prompt history entry and accepted plan. |
| Implementer | Make one focused vertical slice at a time. | During implementation. | Prompt, diff and commit. |
| Reviewer | Inspect security, correctness, UX, AI overclaiming and tests. | After backend and end-to-end flow. | Findings, fixes and test output. |

These are reusable working roles/prompts, not proof that a custom autonomous agent was configured. If your coding environment supports custom agents, add agent configuration only when actually used and document the file path, model, tools, permissions and limitations.

## Reusable skill
`skills/food-image-analysis/SKILL.md` documents the domain prompt and output rules for food-photo analysis. It can be referenced manually or adapted to a coding tool's supported skill mechanism. Do not claim that a tool auto-loaded it unless you verified that behavior.

## Tool integrations / MCP
No MCP server is needed by this MVP. The required runtime integration is the authenticated Ollama Cloud HTTP API from the Go backend using the standard library. If an MCP server is added for development (for example, a repository or documentation connector), record its exact name, purpose, accessible resources, permissions, and whether it was used in that week's work. Do not add MCP merely to satisfy a checkbox.
