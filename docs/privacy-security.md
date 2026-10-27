# Privacy, security and review

## Current data flow

Browser → Go upload validation → authenticated Ollama Cloud → validated result → browser. Submitting transmits food photos externally. This app writes no image to disk, logs no image/base64/request body and stores no result/image in localStorage or browser history. In-memory preview URLs are revoked. Copy contains result text, selected goal/illustrative references where relevant, assumptions and disclaimer.

Avoid sensitive/identifiable photos. Provider processing/retention terms apply; this educational MVP makes no regulated-workload or allergen guarantee. Read https://docs.ollama.com/cloud and the linked privacy policy before using real photos.

## Credential and transport controls

- OLLAMA_API_KEY is read only by Go; no VITE_* key or browser-to-provider call.
- `.env`, `.env.*`, backend/frontend private env files are ignored; `.env.example` has placeholders only.
- Never print the key, Authorization header, raw upstream errors or complete payloads. Disable shell tracing during credential setup.
- Runtime base URL accepts only https://ollama.com/api; redirects are rejected to avoid credential forwarding.
- Connection/TLS/request deadlines, bounded response reads and no automatic retries limit resource/cost exposure.
- Account credits and entitlement require separate verification. A key is not a promise of unlimited or free usage.

## Upload and output controls

Existing 5 MiB JPEG/PNG/WebP signature checks are preserved; they do not prove full image validity. Uploaded bytes and model output are untrusted. The adapter bounds the envelope and extracted JSON; domain validation checks required fields, approved confidences, status consistency, explicit unknowns and finite non-negative ordered ranges. React renders strings as text. Prompt instructions cannot guarantee factual accuracy; the permanent disclaimer must remain visible.

API errors use controlled messages, application/json and no-store. Health reports process status only. Development uses Vite's same-origin API proxy; no permissive CORS added. This is a local development MVP; public deployment, abuse controls and user authentication are out of scope.

## Review evidence

Automated tests cover auth/header formation with synthetic keys, redirect rejection, safe errors, response limits, cancellation and invalid output. See testing.md for actual results and repository checks. No real key was available for live inference. Do not treat mock success as a live security or model-quality certification. Inspect staged changes and history before publishing; revoke/rotate a real key if it is ever exposed.

## Deployment controls — native runtime

Render runs the Go service natively and receives OLLAMA_API_KEY privately in its runtime settings. Do not commit/upload a private .env or expose credentials in the React build or logs. No Docker image, build argument or GitHub Actions deployment secret is used. Platform PORT is supplied automatically and is not added to .env.

The static handler exposes only frontend/dist and never lists directories or serves hidden files. Frontend/API share an HTTPS origin, so no broad CORS change is required. Public visitors can consume the service's Ollama allowance; this MVP adds no user authentication or abuse controls. Check account budgets/limits and restrict the audience before broad sharing. Test locally before each manual deploy; no CI gate remains. Native hosting and live inference remain unverified here.

## Independent sample goals — 2026-10-27

The landing sample stores its selected demonstration profile only in component memory and resets when unmounted. Changing it sends nothing to Go/Ollama and never changes the analyzer's independent selected goal. Both selectors use shared illustrative references entirely in the frontend. Presets are labelled application examples, not personalised guidance or weight-change guarantees. Automated tests cover state isolation and absence of fetch calls; no live security/browser certification is claimed. Copy of analyzed results includes the selected goal, illustrative references, comparisons, assumptions and disclaimer.
