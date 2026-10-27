# Wednesday session requirements: evidence map

Use this as an evidence checklist. Mark an item complete only when the referenced artifact exists and has been reviewed. Session-specific instructions from the trainer override this general plan.

| No. | Requirement | FoodLens evidence / action | Status at planning stage |
|---:|---|---|---|
| 1 | Session topic | Update this file with the exact Wednesday topic/tasks. | Pending confirmation |
| 2 | Project development | React image upload + Go analysis API + AI result. | Not started |
| 3 | GitHub repository | Publish complete source repo and enter repository URL in submission sheet. | Not created/published |
| 4 | Project documentation | README covers problem, MVP, stack, setup and execution. | Planning scaffold created; update after implementation |
| 5 | Application architecture | `docs/architecture.md`, `docs/api-contract.md`, diagrams and workflow. | Draft |
| 6 | Prompt history | `docs/prompt-history.md`: prompt, purpose, change, test/review and result. | Template ready; add actual implementation records |
| 7 | Context management/compaction | `docs/context-management.md`: summaries and actual compaction events. | Plan drafted; actual event log pending |
| 8 | Instruction Markdown files | `AGENTS.md`; `CLAUDE.md` only if the tool is used. | Created |
| 9 | AI agents and skills | `docs/agents-and-skills.md`; reusable `skills/food-image-analysis/SKILL.md`. | Planning definitions; actual use to be recorded |
| 10 | AI models/settings | `docs/ai-tools-and-models.md`, record model ID/parameters and exact tools used. | Candidate documented; verify at implementation |
| 11 | MCP/tools | Record MCP servers and integrations actually used, or explicitly none. | No MCP required for MVP |
| 12 | Development workflow | `docs/development-workflow.md` and commit/PR trail. | Workflow defined; execution log pending |
| 13 | Challenges/solutions | `docs/challenges-and-solutions.md`, based on actual observed issues. | Anticipated risks only; actual log pending |
| 14 | Testing/validation | `docs/testing.md` with commands and actual results. | Test plan only; not run |
| 15 | Session-specific tasks | Update this file with additional assigned work. | Pending trainer instructions |
| 16 | Project presentation | `docs/presentation-outline.md`; build PPT/PDF/Slides and add actual link. | Outline drafted; deck not created |
| 17 | Application demo | `docs/demo-script.md`; live/recorded run after app works. | Script drafted; demo not recorded |
| 18 | Submission links | `docs/submission-checklist.md` and provided Excel sheet. | Links pending |
| 19 | Security/code quality | `docs/privacy-security.md`, secrets scan, validation, tests and review. | Checklist drafted; implementation audit pending |
| 20 | Weekly updates | `docs/weekly-updates.md`, update every Wednesday. | Log started; future updates pending |

## Evidence discipline
Never mark the entire project complete just because the document exists. Distinguish `Planned`, `In progress`, `Done`, and `Blocked`, and attach a commit, screenshot, command output, presentation link or demo link where practical.

## Actual milestone 2 update — Ollama Cloud

Source now includes the direct cloud HTTP adapter, Go/TypeScript schema, validation, result/copy flow and mock-based tests. See testing.md for actual results; not all planning-table items are complete. Hosted `gemma4:31b` vision is publicly listed, but account access/quota and a live image call remain unverified. No deployment, GitHub publication, commit/PR, screenshots, deck or demo recording is claimed. Native web references were used; no MCP server/plugin or multi-agent runtime was used. Model settings, prompt history, challenges, privacy and context handoff reflect this milestone.
