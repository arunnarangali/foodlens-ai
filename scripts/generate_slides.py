import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # blank

    # Palette
    C_BG = RGBColor(250, 250, 250)
    C_WHITE = RGBColor(255, 255, 255)
    C_PRIMARY = RGBColor(21, 128, 61)       # #15803D Forest Green
    C_PRIMARY_LIGHT = RGBColor(220, 252, 231) # #DCFCE7
    C_CARD_BG = RGBColor(248, 250, 252)     # #F8FAFC
    C_CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0
    C_TEXT_MAIN = RGBColor(15, 23, 42)      # #0F172A
    C_TEXT_MUTED = RGBColor(100, 116, 139)  # #64748B
    C_AMBER = RGBColor(180, 83, 9)          # Warning/Notice

    def set_slide_background(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, prs.slide_width, prs.slide_height)
        bg.fill.solid()
        bg.fill.fore_color.rgb = C_BG
        bg.line.fill.background()

    def add_header(slide, title_text, category_text="FOODLENS AI"):
        # Category / Eyebrow
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.4))
        tf_c = cat_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = tf_c.margin_top = tf_c.margin_right = tf_c.margin_bottom = 0
        p_c = tf_c.paragraphs[0]
        p_c.text = category_text.upper()
        p_c.font.size = Pt(11)
        p_c.font.bold = True
        p_c.font.color.rgb = C_PRIMARY
        p_c.font.name = "Arial"

        # Main Slide Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.7), Inches(0.65))
        tf = t_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_MAIN
        p.font.name = "Arial"

    def add_card(slide, left, top, width, height, title="", border_color=C_CARD_BORDER, bg_color=C_CARD_BG):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        
        if title:
            tb = slide.shapes.add_textbox(left + Inches(0.25), top + Inches(0.2), width - Inches(0.5), Inches(0.4))
            tf = tb.text_frame
            tf.word_wrap = True
            tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
            p = tf.paragraphs[0]
            p.text = title
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = C_TEXT_MAIN
            p.font.name = "Arial"
        return card

    def add_image_placeholder(slide, left, top, width, height, label, suggested_file):
        box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        box.fill.solid()
        box.fill.fore_color.rgb = RGBColor(241, 245, 249)
        box.line.color.rgb = RGBColor(203, 213, 225)
        box.line.width = Pt(1.5)
        
        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(height.inches / 2 - 0.5), width - Inches(0.4), Inches(1.0))
        tf = tb.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.alignment = PP_ALIGN.CENTER
        p1.text = f"[SCREENSHOT PLACEHOLDER]\n{label}"
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = C_TEXT_MUTED
        p1.font.name = "Arial"
        
        p2 = tf.add_paragraph()
        p2.alignment = PP_ALIGN.CENTER
        p2.text = f"File: {suggested_file}"
        p2.font.size = Pt(10)
        p2.font.color.rgb = C_PRIMARY
        p2.font.name = "Arial"

    # =========================================================================
    # SLIDE 0: TITLE / COVER
    # =========================================================================
    slide0 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide0)

    # Accent decorative bar
    bar = slide0.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.8), Inches(0.12), Inches(3.8))
    bar.fill.solid()
    bar.fill.fore_color.rgb = C_PRIMARY
    bar.line.fill.background()

    # Title box
    t0_box = slide0.shapes.add_textbox(Inches(1.2), Inches(1.7), Inches(7.5), Inches(3.8))
    tf0 = t0_box.text_frame
    tf0.word_wrap = True

    p_badge = tf0.paragraphs[0]
    p_badge.text = "1-DAY MVP PRESENTATION"
    p_badge.font.size = Pt(12)
    p_badge.font.bold = True
    p_badge.font.color.rgb = C_PRIMARY
    p_badge.font.name = "Arial"

    p_t1 = tf0.add_paragraph()
    p_t1.text = "FoodLens AI"
    p_t1.font.size = Pt(44)
    p_t1.font.bold = True
    p_t1.font.color.rgb = C_TEXT_MAIN
    p_t1.font.name = "Arial"

    p_sub = tf0.add_paragraph()
    p_sub.text = "Understand what’s on your plate.\nSafe, honest food photo estimation — not false precision."
    p_sub.font.size = Pt(18)
    p_sub.font.color.rgb = C_TEXT_MUTED
    p_sub.font.name = "Arial"

    p_meta = tf0.add_paragraph()
    p_meta.text = "\nStack: React + TypeScript + Vite | Go net/http | Hosted Ollama Cloud (gemma4:31b)\nDeliverable: Educational MVP Deck"
    p_meta.font.size = Pt(12)
    p_meta.font.bold = True
    p_meta.font.color.rgb = C_TEXT_MAIN
    p_meta.font.name = "Arial"

    # Right side visual card
    add_image_placeholder(slide0, Inches(9.0), Inches(1.6), Inches(3.5), Inches(4.2), "Clean Landing Hero View", "docs/screenshots/foodlens-landing-clean.png")

    slide0.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "Hello everyone. Today I'm presenting FoodLens AI, a safe, focused web application designed to help people "
        "explore what's on their plate using a single food photograph. We built this as a small, production-grade 1-day MVP "
        "that provides educational nutritional ranges and ingredient estimates without making false promises or giving medical advice. "
        "Let's dive in."
    )

    # =========================================================================
    # SLIDE 1: PROBLEM AND USER
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1)
    add_header(slide1, "Problem & User: The Food Photo Reality Gap")

    # Card 1: The Challenge
    add_card(slide1, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.3), "The Challenge: Invisible Food Variables")
    tb1_c1 = slide1.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(5.1), Inches(4.4))
    tf1_c1 = tb1_c1.text_frame
    tf1_c1.word_wrap = True
    items1 = [
        ("Everyday Curiosity:", " People want quick visibility into their food without tedious weighing or barcode lookups."),
        ("Physical Reality:", " A 2D photograph cannot reveal exact portion depth, cooking oils, heavy dressings, or interior ingredients."),
        ("The Industry Mistake:", " Many AI tools deceptively present exact single numbers (e.g. '542 kcal'), creating a dangerous illusion of scientific precision.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(items1):
        p = tf1_c1.paragraphs[0] if i == 0 else tf1_c1.add_paragraph()
        p.space_after = Pt(14)
        run_b = p.add_run()
        run_b.text = "• " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(13)
        run_b.font.color.rgb = C_TEXT_MAIN
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(13)
        run_r.font.color.rgb = C_TEXT_MUTED

    # Card 2: FoodLens Solution
    add_card(slide1, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.3), "The FoodLens Promise: Honest Estimation", border_color=C_PRIMARY)
    tb1_c2 = slide1.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.2), Inches(4.4))
    tf1_c2 = tb1_c2.text_frame
    tf1_c2.word_wrap = True
    items2 = [
        ("Honest Nutrient Ranges:", " Calories and macronutrients provided exclusively as broad Min–Max ranges tied to stated serving sizes."),
        ("Visible vs. Inferred:", " Explicitly separates what is directly seen from inferred recipe components."),
        ("Clear Non-Medical Disclaimer:", " Non-medical, educational estimation with upfront uncertainties stated on every output."),
        ("Strict MVP Scope:", " Zero accounts, zero database, zero persistent photos. Focused entirely on safe estimation.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(items2):
        p = tf1_c2.paragraphs[0] if i == 0 else tf1_c2.add_paragraph()
        p.space_after = Pt(14)
        run_b = p.add_run()
        run_b.text = "✔ " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(13)
        run_b.font.color.rgb = C_PRIMARY
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(13)
        run_r.font.color.rgb = C_TEXT_MAIN

    slide1.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "Anyone trying to eat mindfully faces a dilemma: manual tracking apps are tedious, while AI apps often claim to measure "
        "exact calories from pixels. But a photo cannot reveal hidden butter, frying oils, or dense fillings. FoodLens AI bridges this "
        "gap with honesty. We provide educational Min–Max nutrient ranges, state our portion assumptions upfront, and explicitly declare "
        "uncertainties rather than pretending to be a digital medical scale."
    )

    # =========================================================================
    # SLIDE 2: FOODLENS MVP CAPABILITIES & UX
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2)
    add_header(slide2, "FoodLens MVP: Focused, Honest, & Accessible UX")

    # Left: Capabilities list
    add_card(slide2, Inches(0.8), Inches(1.5), Inches(5.2), Inches(5.3), "Core User Capabilities")
    tb2 = slide2.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(4.7), Inches(4.4))
    tf2 = tb2.text_frame
    tf2.word_wrap = True
    items3 = [
        ("In-Browser Capture & Upload:", " Drag-and-drop file picker (JPEG, PNG, WebP ≤ 5 MiB) and WebRTC camera stream."),
        ("Identification & Confidence:", " Dish name tagged with confidence tier (low, medium, high)."),
        ("Visible Ingredients:", " Discloses visible items and labels assumed additions."),
        ("Nutrient Ranges:", " Min–Max Calories, Protein, Carbs, and Fat with serving assumptions."),
        ("Preparation Idea:", " Basic cooking or recipe concept — never a medical diet plan."),
        ("Zero-Retention Privacy:", " Client object URLs revoked immediately; one-click text copy.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(items3):
        p = tf2.paragraphs[0] if i == 0 else tf2.add_paragraph()
        p.space_after = Pt(10)
        run_b = p.add_run()
        run_b.text = "• " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = C_TEXT_MAIN
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(12)
        run_r.font.color.rgb = C_TEXT_MUTED

    # Right: Screenshot Placeholders
    add_image_placeholder(slide2, Inches(6.3), Inches(1.5), Inches(3.0), Inches(5.3), "Upload / Preview State", "docs/screenshots/foodlens-image-preview.png")
    add_image_placeholder(slide2, Inches(9.5), Inches(1.5), Inches(3.0), Inches(5.3), "Analysis Result Card", "docs/screenshots/foodlens-analysis-result.png")

    slide2.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "Here is our 1-day MVP in action. On the left, the user can upload or capture a photo through their browser camera with immediate preview. "
        "On the right, the results card highlights our core philosophy: identification confidence, visible ingredients, portion assumptions, "
        "and nutrient ranges. Notice that nutrients are displayed as ranges like 350 to 450 calories, not an exact figure. "
        "If a photo is unclear or not food, the system gracefully guides the user rather than inventing advice."
    )

    # =========================================================================
    # SLIDE 3: STACK AND ARCHITECTURE
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3)
    add_header(slide3, "System Architecture: Lean & Standard-Library Driven")

    # Left: Architecture Flow Box
    add_card(slide3, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.3), "Clean Architectural Boundaries")
    tb3 = slide3.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(5.5), Inches(4.4))
    tf3 = tb3.text_frame
    tf3.word_wrap = True
    arch_points = [
        ("Frontend Layer (React + TS + Vite):", " Lightweight, accessible UI. Never contacts AI provider directly. Zero secrets stored in frontend."),
        ("Go net/http Backend:", " Standard library only. No heavy frameworks or SDKs. Authoritative upload validation and size limits (5 MiB)."),
        ("Memory-Only Stream Sniffing:", " Magic byte detection verifies actual JPEG/PNG/WebP format before forwarding; no temporary disk files."),
        ("Ollama Cloud Hosted API:", " Communicates over HTTPS to https://ollama.com/api/chat using gemma4:31b vision model."),
        ("4-Tier Timeout Cascade:", " 10s TLS -> 120s provider inference -> 135s processing deadline -> 210s browser abort.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(arch_points):
        p = tf3.paragraphs[0] if i == 0 else tf3.add_paragraph()
        p.space_after = Pt(11)
        run_b = p.add_run()
        run_b.text = "• " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = C_TEXT_MAIN
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(12)
        run_r.font.color.rgb = C_TEXT_MUTED

    # Right: Architecture Diagram & Backend Terminal
    add_card(slide3, Inches(7.1), Inches(1.5), Inches(5.4), Inches(2.5), "Data Flow Pipeline")
    tb3_flow = slide3.shapes.add_textbox(Inches(7.3), Inches(2.0), Inches(5.0), Inches(1.8))
    tf3_f = tb3_flow.text_frame
    p_f = tf3_f.paragraphs[0]
    p_f.text = "Browser (React UI)\n  ↓ [Multipart image upload]\nGo net/http Backend (Magic byte sniff ≤ 5 MiB)\n  ↓ [HTTPS POST + Bearer Key + Base64]\nOllama Cloud /api/chat (gemma4:31b)\n  ↓ [Prompted JSON]\nGo Domain Parser (Range & Type validation)\n  ↓ [Safe JSON]\nBrowser UI"
    p_f.font.size = Pt(10)
    p_f.font.name = "Courier New"
    p_f.font.color.rgb = C_TEXT_MAIN

    add_image_placeholder(slide3, Inches(7.1), Inches(4.3), Inches(5.4), Inches(2.5), "Backend Go Server & Tests Terminal", "docs/screenshots/backend-go-terminal.png")

    slide3.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "Behind the scenes, we built a lean, zero-SDK architecture. The browser talks only to our Go backend. "
        "The Go server uses standard library net/http, verifies binary magic bytes to prevent spoofed uploads, and handles outbound "
        "HTTPS calls to Ollama Cloud using a private backend Bearer token. We engineered cascading deadlines from 10 seconds up to "
        "135 seconds so requests never stall or consume unbounded resources."
    )

    # =========================================================================
    # SLIDE 4: AI-ASSISTED DEVELOPMENT & PROMPT ENGINEERING
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4)
    add_header(slide4, "AI Engineering: Defensive Prompting & Validation")

    # Left: The Challenge & Prompt Design
    add_card(slide4, Inches(0.8), Inches(1.5), Inches(5.7), Inches(5.3), "Structured Outputs Without Server Schemas")
    tb4 = slide4.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(5.2), Inches(4.4))
    tf4 = tb4.text_frame
    tf4.word_wrap = True
    ai_points = [
        ("The Provider Reality:", " Ollama Cloud explicitly documents structured JSON schemas as unsupported. We could not rely on server-side schema constraints."),
        ("Template-Driven Prompting:", " Authored full JSON contracts directly in the system prompt (internal/ai/prompt.go) covering analyzed and notFoodOrUnclear cases."),
        ("Strict Boundary Enforcement:", " Instructed model to set uncertain nutrients to null/Unknown rather than guessing point numbers."),
        ("Prompt Injection Defense:", " Explicit instruction to ignore any malicious text or instructions embedded in user photos."),
        ("Prompt Versioning:", " Documented 14 prompt iterations and changes in docs/prompt-history.md.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(ai_points):
        p = tf4.paragraphs[0] if i == 0 else tf4.add_paragraph()
        p.space_after = Pt(11)
        run_b = p.add_run()
        run_b.text = "• " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = C_TEXT_MAIN
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(12)
        run_r.font.color.rgb = C_TEXT_MUTED

    # Right: Go Authoritative Parser & Skill Card
    add_card(slide4, Inches(6.8), Inches(1.5), Inches(5.7), Inches(5.3), "Authoritative Go Domain Parser")
    tb4_r = slide4.shapes.add_textbox(Inches(7.05), Inches(2.1), Inches(5.2), Inches(4.4))
    tf4_r = tb4_r.text_frame
    tf4_r.word_wrap = True
    val_points = [
        ("Strict JSON Extraction:", " Strips markdown code blocks safely, rejects trailing prose or multi-object payloads."),
        ("Domain Range Invariants:", " Enforces min <= max, finite numbers, non-negative nutrient values, and valid confidence enums in internal/food."),
        ("Safe Failure Modes:", " Malformed or hallucinated responses trigger controlled AI_INVALID_RESPONSE error with zero secret leakage."),
        ("Custom Agent Skill:", " Developed skills/food-image-analysis/SKILL.md to standardize reasoning across sessions.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(val_points):
        p = tf4_r.paragraphs[0] if i == 0 else tf4_r.add_paragraph()
        p.space_after = Pt(12)
        run_b = p.add_run()
        run_b.text = "✔ " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = C_PRIMARY
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(12)
        run_r.font.color.rgb = C_TEXT_MAIN

    slide4.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "Because Ollama Cloud doesn't support server-enforced JSON schemas, we couldn't rely on provider-level guarantees. "
        "We solved this with defensive AI engineering. We versioned full JSON templates inside our Go system prompt, instructed "
        "the model to acknowledge unknowns, and wrote strict Go parsers to validate numeric bounds. If the model hallucinates "
        "or outputs malformed data, our backend catches it and fails safely."
    )

    # =========================================================================
    # SLIDE 5: TESTING, SECURITY & LIMITATIONS
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5)
    add_header(slide5, "Testing, Security Safeguards & Honest Limitations")

    # Left: Security & Limitations
    add_card(slide5, Inches(0.8), Inches(1.5), Inches(5.6), Inches(5.3), "Defensive Safeguards & Boundaries")
    tb5 = slide5.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(5.1), Inches(4.4))
    tf5 = tb5.text_frame
    tf5.word_wrap = True
    sec_points = [
        ("Server-Side MIME Verification:", " Validates file binary signatures (magic bytes) to defeat file-extension spoofing."),
        ("Zero Persistence Storage:", " Uploaded images exist only in memory during analysis. No disk writes, no database history."),
        ("Credential Isolation:", " OLLAMA_API_KEY read only in backend environment; excluded from error responses and client bundles."),
        ("Memory Hygiene:", " Browser object URLs revoked immediately on replacement or unmount."),
        ("Honest Limitations:", " Visual estimation can never guarantee allergen safety or exact calorie intake; disclaimer is mandatory.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(sec_points):
        p = tf5.paragraphs[0] if i == 0 else tf5.add_paragraph()
        p.space_after = Pt(10)
        run_b = p.add_run()
        run_b.text = "• " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = C_TEXT_MAIN
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(12)
        run_r.font.color.rgb = C_TEXT_MUTED

    # Right: Test suite & Error handling screenshots
    add_image_placeholder(slide5, Inches(6.7), Inches(1.5), Inches(5.8), Inches(2.5), "Automated Vitest Suite (25/25 Passing)", "docs/screenshots/frontend-test-terminal.png")
    add_image_placeholder(slide5, Inches(6.7), Inches(4.3), Inches(5.8), Inches(2.5), "Defensive Error & Unclear Image Notice", "docs/screenshots/foodlens-unclear-or-error.png")

    slide5.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "Quality and security are proven by actual test suites, not assumptions. Our Go backend tests and 25 Vitest frontend tests "
        "pass 100%, covering every edge case from missing files to clipboard failures. Security-wise, food images are processed strictly "
        "in memory and discarded. We display privacy disclosures upfront and remind users that external cloud inference terms apply."
    )

    # =========================================================================
    # SLIDE 6: LIVE DEMO & LEARNINGS
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6)
    add_header(slide6, "Live Demo Walkthrough & Engineering Takeaways")

    # Left: Demo sequence
    add_card(slide6, Inches(0.8), Inches(1.5), Inches(5.4), Inches(5.3), "Live Demo Sequence (< 3 Minutes)")
    tb6 = slide6.shapes.add_textbox(Inches(1.05), Inches(2.1), Inches(4.9), Inches(4.4))
    tf6 = tb6.text_frame
    tf6.word_wrap = True
    demo_steps = [
        ("Step 1: Photo Input:", " Select a food photo or open the live WebRTC camera viewfinder."),
        ("Step 2: Inspect Privacy Notice:", " Note that submission goes to Ollama Cloud with zero server disk persistence."),
        ("Step 3: Submit Analysis:", " Observe bounded multipart upload and backend capability verification."),
        ("Step 4: Review Ranges & Assumptions:", " Inspect dish identification, likely ingredients, and Min–Max nutrient cards."),
        ("Step 5: Export & Error Handling:", " Click 'Copy results' for plain text; test an invalid file to show polite, safe error handling.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(demo_steps):
        p = tf6.paragraphs[0] if i == 0 else tf6.add_paragraph()
        p.space_after = Pt(10)
        run_b = p.add_run()
        run_b.text = f"{i+1}. " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(12)
        run_b.font.color.rgb = C_PRIMARY
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(12)
        run_r.font.color.rgb = C_TEXT_MAIN

    # Right: Key Takeaways & Screenshot
    add_card(slide6, Inches(6.5), Inches(1.5), Inches(6.0), Inches(2.5), "Key Engineering Takeaways")
    tb6_t = slide6.shapes.add_textbox(Inches(6.75), Inches(2.0), Inches(5.5), Inches(1.8))
    tf6_t = tb6_t.text_frame
    tf6_t.word_wrap = True
    takeaways = [
        ("Defensive AI Engineering:", " Pair prompt templates with strict server-side schema parsers when LLM schemas aren't enforced."),
        ("Standard Library Power:", " Go standard library is lean, reliable, and avoids external dependency bloat."),
        ("Transparent UX Builds Trust:", " Users value honest ranges and disclaimers over fake, precise numbers.")
    ]
    for i, (bold_txt, regular_txt) in enumerate(takeaways):
        p = tf6_t.paragraphs[0] if i == 0 else tf6_t.add_paragraph()
        p.space_after = Pt(6)
        run_b = p.add_run()
        run_b.text = "• " + bold_txt
        run_b.font.bold = True
        run_b.font.size = Pt(11)
        run_b.font.color.rgb = C_TEXT_MAIN
        run_r = p.add_run()
        run_r.text = regular_txt
        run_r.font.size = Pt(11)
        run_r.font.color.rgb = C_TEXT_MUTED

    add_image_placeholder(slide6, Inches(6.5), Inches(4.3), Inches(6.0), Inches(2.5), "Full Analysis Result View", "docs/screenshots/foodlens-analysis-result.png")

    slide6.notes_slide.notes_text_frame.text = (
        "Speaker Notes:\n"
        "To conclude: FoodLens AI demonstrates that a useful, trustworthy AI application can be built in a single day when you "
        "focus on clean boundaries, robust tests, and truthful UX. By pairing React with a standard-library Go backend and defensive "
        "prompt engineering, we delivered an end-to-end tool that educates users without making false promises. Thank you! I welcome your questions."
    )

    out_path = "docs/FoodLens-AI-Presentation.pptx"
    prs.save(out_path)
    print(f"Presentation successfully created at: {out_path}")

if __name__ == "__main__":
    create_presentation()
