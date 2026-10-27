# FoodLens AI — Google Slides Presentation Deck

> **Deck Title:** FoodLens AI — Understand What’s on Your Plate  
> **Target Audience:** Technical evaluators, product reviewers, engineering peers  
> **Presentation Duration:** 3–5 minutes (Demo under 3 minutes)  
> **Source Outline:** [`docs/presentation-outline.md`](presentation-outline.md)
> **Screenshot Directory:** [`docs/screenshots/`](screenshots/)

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
> "Hello everyone. Today I'm presenting FoodLens AI, a safe, focused web application designed to help people explore what's on their plate using a single food photograph. We built this as a small, focused educational MVP that provides educational nutritional ranges and ingredient estimates without making false promises or giving medical advice. Let's dive in."

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
  - Interactive sample goals: Weight loss / Maintain weight / Weight gain move demo references on fixed scales, preserving meal estimates.
  - Analyzer goals use a tab-style radio controls with immediate illustrative references; no number entry or Apply button. Sample and analyzer selections remain independent, and presets are not personalised recommendations.
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
  - All prompt iterations recorded in [`docs/prompt-history.md`](prompt-history.md) with chronological development entries and versioned runtime prompts.

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
  - **Backend (Go):** Historical checks are recorded in `testing.md`; not rerun for this frontend-only feature.
  - **Frontend (Vitest):** 56 automated tests covering camera lifecycle, file validation, results rendering, and clipboard fallbacks (`npm test -- --run`).
- **Security & Privacy Guardrails:**
  - **Ephemeral processing:** Zero photos saved to disk, zero database records, zero analytics cookies.
  - **Credential isolation:** `OLLAMA_API_KEY` loaded only in backend environment; omitted from client code and logs.
  - **Memory hygiene:** Browser `URL.revokeObjectURL()` called immediately upon image replacement or unmount.
- **Honest Product Boundaries:**
  - Non-medical disclaimer rendered on every screen and copy export.
  - No claims of exact nutritional accuracy from pixels alone.
  - Dependent on external cloud provider availability, latency, and billing limits.

### Screenshot Placement
- **Left image:** `docs/screenshots/frontend-test-terminal.png` (capture current output; 56 tests last verified).
- **Right image:** `docs/screenshots/foodlens-unclear-or-error.png` (polite error handling / non-food state).

### Speaker Notes *(~35 seconds)*
> "Quality and security are proven by actual test suites, not assumptions. Our latest frontend check passed 56 tests, including sample goal references and analyzer state isolation. Backend evidence is recorded separately; tests do not establish every possible edge case. Security-wise, food images are processed strictly in memory and discarded. We display privacy disclosures upfront and remind users that external cloud inference terms apply."

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
| 4 | Capture screenshots using the specifications in [`docs/screenshots/README.md`](screenshots/README.md) | In Progress |
| 5 | Insert captured screenshots into Slides 2, 3, 5, and 6 | Pending screenshots |
| 6 | Rehearse demo using [`docs/demo-script.md`](demo-script.md) (keep under 3 minutes) | Ready |
| 7 | Share public view link in `docs/submission-checklist.md` | Pending deck creation |

## Current sample-goal demo note — 2026-10-27

Use the README preset table for all four values per goal. The sample selector changes comparison references only; whole-range comparisons include equality and never imply a meal is suitable for weight loss/gain. Switch profiles without submitting any photo. Then show the real analyzer's compact goal selector, immediate reference changes and independent selection. Sources linked in README explain personalisation, not endorsement of demo numbers. This Markdown was updated; the existing PowerPoint and generator were not regenerated or verified for these changes. Manual visuals and a recorded demo remain outstanding.

## Goal-control appearance follow-up — 2026-10-27

Show the analyzer's segmented single-choice controls, selected state and keyboard focus. Full-card themes mirror existing labels: above pale amber/dark brown, below pale blue/dark blue, includes pale green/dark green, unknown light/dark grey. They do not judge meal health or change estimated food values. Automated frontend verification now passes 58 tests plus TypeScript/build (see testing.md); no new screenshots, PowerPoint export or manual browser check was produced for this follow-up.

## Sample/control parity — 2026-10-27

The sample and analyzer now render the same GoalTabs native-radio component with matching segmented styling and comparison-coloured card backgrounds and text. Select goals by click or Tab/arrow keys; each section retains independent state. No hidden sample dropdown remains. The latest automated frontend result is 58 passing tests plus TypeScript/build. The PowerPoint and screenshots were not regenerated; browser inspection at port 5175 was blocked by socket permissions.

## Full-card theme follow-up — 2026-10-27

Card background, primary/secondary text, badge and graph colours are now coordinated per status; borders are subtle and remain 2px. Source-palette contrast checks passed, along with TypeScript, 58 frontend tests and the production build. The user will do browser/mobile verification manually. No new PowerPoint or screenshots were generated in this follow-up.

## Colour-key addition — 2026-10-27

The analyzer and sample now show What the colours mean above the cards. Text labels name the comparison status without colour names; decorative swatches match shared card palettes. The key stays visible across goal changes and is absent for non-food results. This Markdown is updated, but no new PowerPoint, screenshot or recorded demo was generated.
