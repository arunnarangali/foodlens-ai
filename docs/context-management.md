# Context management and compaction

## Goal
Preserve project decisions while using AI coding tools over multiple prompts or sessions. Compaction is a tool-specific action; do not claim a compaction occurred unless the tool performed it.

## Durable context
Keep these facts in the repository, not only in chat:
1. Product scope and non-goals: `README.md` and `docs/one-day-plan.md`.
2. Current architecture and API schema: `docs/architecture.md` and `docs/api-contract.md`.
3. Working conventions and safety requirements: `AGENTS.md` and `skills/food-image-analysis/SKILL.md`.
4. Current code status and next task: weekly update and a short handoff summary below.
5. Evidence: prompt, issue, commit and test logs.

## When to compact/summarise
Use the coding tool's compaction or summarisation feature when the conversation has accumulated multiple implementation milestones, large diffs, long logs, or the tool indicates that context is getting tight. Before compaction, ask it to preserve current architecture, decisions, modified files, tests executed, unresolved errors, known limitations, and the next smallest task. After compaction, verify the summary against the files and Git diff rather than trusting it blindly.

## Session handoff template

```text
Project: FoodLens AI
Goal for this session:
Current commit/branch:
Implemented files and behaviour:
Tests run (exact command + result):
Important design decisions:
Known failures/limitations:
Security/privacy checks:
Next task (smallest useful step):
Do not change:
```

## Actual compaction log

| Date | Tool | Why compacted | Summary preserved to | Verification after compaction | Outcome |
|---|---|---|---|---|---|
| — | — | No compaction event recorded yet | — | — | Do not invent an event; add a row if/when it happens. |

## Practical rule
A compact summary is a navigation aid, not source of truth. Confirm requirements and behavior against current code, tests, API contract and Git history after resuming.

## Current handoff — Ollama Cloud milestone, 2026-10-27

The user superseded earlier provider plans with direct hosted Ollama API integration and restored the milestone 1 skeleton before this work. Baseline Go/frontend checks passed. Active path: React → Go validation → https://ollama.com/api/chat → Go domain validation → results/copy. No local inference, SDK, history or database. Preserve the existing upload limit and health contract.

Public hosted `gemma4:31b` vision listing verified; no backend API key/account usage was available for a real request. Cloud structured outputs are unsupported per official docs; user selected prompted JSON with strict validation. See testing.md for exact verification and prompt-history.md for the runtime prompt. No context compaction event has been performed or claimed in this milestone; this is a written handoff, not a compaction log entry.

## Historical Docker/CI deployment handoff — 2026-10-27

The user selected one Render Docker Web Service instead of GitHub Pages plus a separate API and requested implementation. Added static hosting under the existing Go server, platform PORT support, Docker build and GitHub Actions validation/smoke script. Local Go/frontend checks pass; Docker daemon access is denied, so container/CI/hosted validation remains outstanding. Render account linkage, runtime key and CI-gated deploy setup are manual steps in deployment.md. No actual deployment or context compaction was performed in this milestone.

## Current simplified deployment handoff — 2026-10-27

The user requested removing the GitHub workflow and Docker to avoid unnecessary complexity. Those files and the CI-only smoke helper were deleted. Active hosting uses Render's native Go runtime, a root command to build React and Go, and `cd backend && ./server` to start. Retain Go static routing, platform PORT, key-only setup, Makefile and application tests. No real service/account or deployment was changed. See deployment.md and the latest testing record; earlier Docker/CI evidence remains historical.
