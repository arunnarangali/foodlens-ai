# Project presentation outline (6 slides)

Create a PPT, PDF or Google Slides deck after the working demo is ready. Use screenshots from the actual implementation; do not create fake test results or imply unimplemented features exist.

## Slide 1 — Problem and user
- People want a quick explanation of the food in front of them.
- Existing difficulty: a photo doesn't reveal exact portion, oil or hidden ingredients.
- Product promise: a quick educational estimate, not precise nutrition measurement.

## Slide 2 — FoodLens MVP
- Upload/capture image, identify likely dish, list likely ingredients, show nutrition ranges and preparation idea.
- Demonstrate uncertainty and privacy disclaimer.
- Explicitly mention out-of-scope features.

## Slide 3 — Stack and architecture
- React + TypeScript + Vite.
- Go `net/http` backend.
- Hosted Ollama Cloud chat API through Go standard HTTP; backend-only Bearer key.
- Diagram from `docs/architecture.md`.

## Slide 4 — AI-assisted development
- Show real prompts from `docs/prompt-history.md`.
- Explain context preservation and any actual compaction events.
- Show `AGENTS.md` and food-analysis skill.
- Describe the model ID and configuration actually used.

## Slide 5 — Testing, security and limitations
- Show actual test commands/output and one real issue/fix.
- Explain server-side image validation, API key isolation and timeouts.
- Explain why nutrition is given as ranges and how external processing, provider terms and usage charges affect privacy/cost.

## Slide 6 — Live demo and learning
- Select image, analyse, inspect uncertainty/nutrition range, copy result and show error handling.
- Summarise lessons learned and next steps.
- Include GitHub, presentation and demo links once real.

## Speaker note
Keep the demo under 3 minutes. Do not depend solely on live model availability: keep a clearly labelled sample response for explaining the UI if the provider is down, but disclose when a sample response is being shown rather than a live AI result.

## Milestone 2 evidence limits

Public vision model: `gemma4:31b`. Account entitlement and a live image result are not verified. Cloud schema enforcement is documented as unsupported; describe prompted JSON and backend validation accurately. No MCP or multi-agent runtime was used. No deck, screenshots, recording or demo link has been produced by the implementation session. Use only actual evidence when preparing slides.
