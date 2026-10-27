# FoodLens AI — Google Slides Presentation Deck

> **Deck Title:** FoodLens AI — Understand What’s on Your Plate  
> **Target Audience:** Technical evaluators, product reviewers, engineering peers  
> **Presentation Duration:** 3–5 minutes (Demo under 3 minutes)  
> **Source Outline:** [`docs/presentation-outline.md`](file:///home/texol/arun/foodlens-ai-project-plan/foodlens-ai-project/docs/presentation-outline.md)  
> **Screenshot Directory:** [`docs/screenshots/`](file:///home/texol/arun/foodlens-ai-project-plan/foodlens-ai-project/docs/screenshots/)

---

## Google Slides Setup & Theme Recommendations
- **Slide Aspect Ratio:** 16:9 (Widescreen)
- **Color Palette:**
  - Primary Accent: Forest Green (`#16a34a` / `#15803d`)
  - Background: Crisp Warm White (`#fbfbfa` / `#ffffff`)
  - Surface/Cards: Light Neutral (`#f4f4f0`)
  - Text: Dark Charcoal (`#1c1917`) & Muted Gray (`#78716c`)
  - Badges/Alerts: Amber (`#f59e0b`) & Crimson (`#ef4444`)
- **Typography:**
  - Header font: *Inter* or *Plus Jakarta Sans* (Bold / SemiBold)
  - Body font: *Inter* or *Open Sans* (Regular)
  - Code/Numbers: *JetBrains Mono* or *Roboto Mono*

---

## Slide 0: Title Slide (Cover)

### Visual Layout
- **Left Column (60%):** Bold title, subtitle, badges, presenter metadata, repository link.
- **Right Column (40%):** Clean product illustration or crop of `foodlens-landing-clean.png`.

### Slide Content
- **Main Title:** **FoodLens AI**
- **Subtitle:** Understand what’s on your plate. A safe, lean 1-day MVP for educational food photo estimation.
- **Tagline:** *One photo. A little more understanding.*
- **Technology Badges:** `React + TypeScript + Vite` | `Go net/http` | `Ollama Cloud (gemma4:31b)`
- **Presenter:** [Your Name / Team]
- **Date:** October 2026

### Speaker Notes
> "Hello everyone. Today I'm presenting FoodLens AI, a safe, focused web application designed to help people explore what's on their plate using a single food photograph. We built this as a small, production-grade 1-day MVP that provides educational nutritional ranges and ingredient estimates without making false promises or giving medical advice. Let's dive in."

---

## Slide 1: Problem and User

### Visual Layout
- **2-Column Split:**
  - Left: Problem & Reality Gap (Card with subtle warning border).
  - Right: Product Philosophy & Value Proposition (Card with green success border).

### Slide Content
#### [Left Card] The Challenge: The Photo Reality Gap
- **Everyday curiosity:** People want quick visibility into meals without tedious manual calorie diaries or barcode lookups.
- **The physical limitation:** A single 2D photograph **cannot** reveal exact portion depth, cooking oils, heavy dressings, or interior ingredients.
- **The industry mistake:** Many apps deceptively present exact single numbers (e.g. *"542 kcal"*), creating a false sense of scientific precision.

#### [Right Card] The Solution: Transparent Educational Estimation
- **Honest ranges:** Nutrition provided exclusively as broad **Min–Max ranges** tied to explicitly stated portion assumptions.
- **Visible vs. inferred:** Distinguishes what is directly visible from inferred recipe components.
- **Clear boundaries:** Strict non-medical disclaimer; explicit declaration of uncertainties.

### Screenshot Placement
- Optional: Insert a small sample food photo showing hidden ingredients (e.g., salad with dressing or layered pasta bowl).

### Speaker Notes *(~30 seconds)*
> "Anyone trying to eat mindfully faces a dilemma: manual tracking apps are tedious, while AI apps often claim to measure exact calories from pixels. But a photo cannot reveal hidden butter, frying oils, or dense fillings. FoodLens AI bridges this gap with honesty. We provide educational Min–Max nutrient ranges, state our portion assumptions upfront, and explicitly declare uncertainties rather than pretending to be a digital medical scale."

---

## Slide 2: FoodLens MVP — Capabilities & UX

### Visual Layout
- **Top Row (30%):** 3 Core MVP Feature Pills (`01 Visual Input` → `02 Range Nutrition` → `03 Zero-Data Privacy`).
- **Bottom Row (70%):** Side-by-side screenshots showing the user journey from upload to structured analysis.

### Slide Content
- **Capture & Selection:**
  - Standard file picker supporting JPEG, PNG, and WebP (up to 5 MiB).
  - Integrated in-browser WebRTC camera capture with automatic stream teardown.
- **Structured Visual Estimation:**
  - Dish identification with confidence tier (`low`, `medium`, `high`).
  - Likely visible ingredients vs. unseen recipe components.
  - Macronutrient grid: Calories (kcal), Protein (g), Carbohydrates (g), and Fat (g).
  - One simple, safe preparation idea (no medical meal plans).
- **Zero-Storage Privacy & Export:**
  - Temporary in-memory processing only; no disk persistence and no user accounts.
  - Accessible single-click "Copy results" with automatic text-area fallback.

### Screenshot Placement
- **Left image:** `docs/screenshots/foodlens-landing-clean.png` (or `foodlens-image-preview.png`).
- **Right image:** `docs/screenshots/foodlens-analysis-result.png` (showing dish name, confidence, nutrient ranges, uncertainties, and copy button).

### Speaker Notes *(~45 seconds)*
> "Here is our 1-day MVP in action. On the left, the user can upload or capture a photo through their browser camera with immediate preview. On the right, the results card highlights our core philosophy: identification confidence, visible ingredients, portion assumptions, and nutrient ranges. Notice that nutrients are displayed as ranges like 350 to 450 calories, not an exact figure. If a photo is unclear or not food, the system gracefully guides the user rather than inventing advice."

---

## Slide 3: Stack and Lean Architecture

### Visual Layout
- **Left Column (55%):** System Architecture Sequence Diagram.
- **Right Column (45%):** Technical highlights & strict boundary controls.

### Slide Content
- **Frontend Layer:**
  - React 18 + TypeScript + Vite.
  - Accessible UI with semantic markup, ARIA live regions, and zero model credentials in client code.
- **Authoritative Go Backend:**
  - Go standard library (`net/http`) only — no heavy frameworks or external dependencies.
  - Multipart upload parsing with strict 5 MiB in-memory buffer limit.
  - Magic byte MIME verification: checks file content signatures, not just file extensions.
- **Hosted Cloud AI Provider:**
  - Direct HTTPS connection to Ollama Cloud Chat API (`https://ollama.com/api/chat`).
  - Default vision model: `gemma4:31b` with automated capability discovery.
  - Private `OLLAMA_API_KEY` stored strictly on backend; never exposed to browser.
- **Cascading Timeout Safety:**
  - 10s TLS handshake → 120s provider inference → 135s processing deadline → 210s browser abort.

### Architecture Diagram (To Render in Slide)
```
[ Browser / React UI ]
        │  (multipart/form-data image)
        ▼
[ Go net/http API ]  ──>  In-Memory Magic Byte Sniffing (≤ 5 MiB)
        │  (HTTPS POST + Backend Bearer Auth + base64)
        ▼
[ Ollama Cloud /api/chat ] (gemma4:31b vision model)
        │  (Prompted JSON response)
        ▼
[ Go Domain Validator ]  ──>  Strict Range & Unknown Field Validation
        │  (Sanitized JSON result)
        ▼
[ Browser / React UI ]  ──>  Renders Range Cards & Disclaimer
```

### Screenshot Placement
- `docs/screenshots/backend-go-terminal.png` (showing Go server startup or test verification).

### Speaker Notes *(~40 seconds)*
> "Behind the scenes, we built a lean, zero-SDK architecture. The browser talks only to our Go backend. The Go server uses standard library net/http, verifies binary magic bytes to prevent spoofed uploads, and handles outbound HTTPS calls to Ollama Cloud using a private backend Bearer token. We engineered cascading deadlines from 10 seconds up to 135 seconds so requests never stall or consume unbounded resources."

---

## Slide 4: AI Engineering & Disciplined Prompting

### Visual Layout
- **Left Column (50%):** The Structured Output Challenge & Prompt Design.
- **Right Column (50%):** Prompt snippet / Agent skill card from repository.

### Slide Content
- **The Constraint:** Ollama Cloud documents server-enforced JSON schema outputs as currently unsupported.
- **Defensive Prompt Engineering:**
  - Authored a reusable system prompt in `backend/internal/ai/prompt.go`.
  - Embedded full JSON output contracts for both `analyzed` and `notFoodOrUnclear` cases.
  - Explicit rule: instruct the model to return `"Unknown"` or `null` for obscure nutrients rather than hallucinating numbers.
  - Instructed the model to ignore any text or instructions embedded inside user photographs.
- **Authoritative Backend Validation:**
  - Go parses raw model responses, strips markdown fences if present, and executes strict range validation:
    - Min ≤ Max, non-negative numbers, finite floats.
    - Explicit validation of status strings and confidence enums.
  - Invalid model output returns safe, typed error codes (`AI_INVALID_RESPONSE`) without leaking prompt internals.
- **Context & Prompt Versioning:**
  - All prompt iterations recorded in [`docs/prompt-history.md`](file:///home/texol/arun/foodlens-ai-project-plan/foodlens-ai-project/docs/prompt-history.md) across 14 documented milestones.

### Screenshot Placement
- Code block excerpt of `backend/internal/ai/prompt.go` or `skills/food-image-analysis/SKILL.md`.

### Speaker Notes *(~35 seconds)*
> "Because Ollama Cloud doesn't support server-enforced JSON schemas, we couldn't rely on provider-level guarantees. We solved this with defensive AI engineering. We versioned full JSON templates inside our Go system prompt, instructed the model to acknowledge unknowns, and wrote strict Go parsers to validate numeric bounds. If the model hallucinates or outputs malformed data, our backend catches it and fails safely."

---

## Slide 5: Testing, Security & Limitations

### Visual Layout
- **2-Row Grid:**
  - Top: Automated Testing Evidence (Green terminal outputs).
  - Bottom: Security Safeguards & Product Limitations.

### Slide Content
- **Comprehensive Automated Verification:**
  - **Backend (Go):** 100% pass across AI client, upload validator, config loader, domain parser, and HTTP handlers (`go test ./...`).
  - **Frontend (Vitest):** 25 automated tests covering camera lifecycle, file validation, results rendering, and clipboard fallbacks (`npm test -- --run`).
- **Security & Privacy Guardrails:**
  - **Ephemeral processing:** Zero photos saved to disk, zero database records, zero analytics cookies.
  - **Credential isolation:** `OLLAMA_API_KEY` loaded only in backend environment; omitted from client code and logs.
  - **Memory hygiene:** Browser `URL.revokeObjectURL()` called immediately upon image replacement or unmount.
- **Honest Product Boundaries:**
  - Non-medical disclaimer rendered on every screen and copy export.
  - No claims of exact nutritional accuracy from pixels alone.
  - Dependent on external cloud provider availability, latency, and billing limits.

### Screenshot Placement
- **Left image:** `docs/screenshots/frontend-test-terminal.png` (25/25 passing tests).
- **Right image:** `docs/screenshots/foodlens-unclear-or-error.png` (polite error handling / non-food state).

### Speaker Notes *(~35 seconds)*
> "Quality and security are proven by actual test suites, not assumptions. Our Go backend tests and 25 Vitest frontend tests pass 100%, covering every edge case from missing files to clipboard failures. Security-wise, food images are processed strictly in memory and discarded. We display privacy disclosures upfront and remind users that external cloud inference terms apply."

---

## Slide 6: Live Demo & Engineering Learnings

### Visual Layout
- **Left Column (45%):** 5-Step Demo Checklist & Live Results.
- **Right Column (55%):** Key Technical Learnings & Future Roadmap.

### Slide Content
- **3-Minute Demo Sequence:**
  1. **Upload/Capture:** Select a meal photo (or open camera viewfinder).
  2. **Inspect Preview & Notice:** Review privacy notice and size limits.
  3. **Analyze:** Submit request; observe fast Go validation and cloud inference.
  4. **Explore Output:** Inspect dish name, confidence, visible ingredients, nutrient ranges, and cooking tip.
  5. **Export & Error Branch:** Copy result to clipboard; test an invalid file to show defensive error handling.
- **Key Engineering Takeaways:**
  - **Prompt + Go Validation > Blind Trust:** LLM visual outputs must be constrained and verified at the boundary.
  - **Standard Library Strength:** Go's standard library provides everything needed for high-performance HTTP microservices.
  - **Transparent AI UX:** Users appreciate honesty: ranges, portion assumptions, and clear disclaimers build trust.
- **Future Roadmap:**
  - Multi-angle photo aggregation for complex meals.
  - Offline local model support (when local edge vision models mature).
  - PWA installability for mobile food logging.

### Screenshot Placement
- `docs/screenshots/foodlens-analysis-result.png` alongside repository QR code or link.

### Speaker Notes *(~30 seconds)*
> "To conclude: FoodLens AI demonstrates that a useful, trustworthy AI application can be built in a single day when you focus on clean boundaries, robust tests, and truthful UX. By pairing React with a standard-library Go backend and defensive prompt engineering, we delivered an end-to-end tool that educates users without making false promises. Thank you! I welcome your questions."

---

## Appendix: Presentation Delivery Checklist

| Step | Action | Status |
|---|---|---|
| 1 | Create Google Slides deck using the 16:9 widescreen layout | Ready |
| 2 | Apply color scheme: Forest green (`#16a34a`), Warm neutral (`#f4f4f0`), Dark charcoal text | Ready |
| 3 | Copy-paste slide titles, bullet points, and speaker notes from this document | Ready |
| 4 | Capture screenshots using the specifications in [`docs/screenshots/README.md`](file:///home/texol/arun/foodlens-ai-project-plan/foodlens-ai-project/docs/screenshots/README.md) | In Progress |
| 5 | Insert captured screenshots into Slides 2, 3, 5, and 6 | Pending screenshots |
| 6 | Rehearse demo using [`docs/demo-script.md`](file:///home/texol/arun/foodlens-ai-project-plan/foodlens-ai-project/docs/demo-script.md) (keep under 3 minutes) | Ready |
| 7 | Share public view link in `docs/submission-checklist.md` | Pending deck creation |
