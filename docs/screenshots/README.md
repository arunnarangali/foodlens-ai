# Screenshots for FoodLens AI Presentation

Place your presentation screenshots in this directory. The filenames below correspond directly to the slides in `docs/presentation-deck.md`:

| Filename | Slide | Description | How to Capture |
|---|---|---|---|
| `foodlens-landing-clean.png` | Slide 2 & Slide 6 | Initial clean landing screen | Open `http://localhost:5173` before selecting any file. Capture the full window showing the header, hero text, upload box, and privacy disclaimer. |
| `foodlens-image-preview.png` | Slide 2 | Photo preview state | Select a food image (JPEG/PNG/WebP ≤ 5 MiB). Capture the screen showing the image preview in the card and the active "Analyze photo →" button. |
| `foodlens-analysis-result.png` | Slide 2 & Slide 6 | Completed analysis result | Submit an analysis. Capture the full result view showing identification confidence, dish name, likely ingredients, nutrient range cards, assumptions, and the "Copy results" button. |
| `foodlens-unclear-or-error.png` | Slide 5 & Slide 6 | Error or unclear image state | Upload a non-food image (showing *"A clearer food photo would help"*) or an unsupported file (showing the validation error alert). |
| `backend-go-terminal.png` | Slide 3 & Slide 5 | Go backend test/build output | Run `cd backend && go test ./... -v` and take a clean screenshot of the terminal output showing passing packages. |
| `frontend-test-terminal.png` | Slide 5 | Frontend Vitest test output | Run `cd frontend && npm test -- --run` and capture the terminal showing all 25 passing tests. |
| `camera-modal-capture.png` *(Optional)* | Slide 2 | Live WebRTC camera viewfinder | Click "Capture with camera" and screenshot the active camera viewfinder. |

---

### Tips for High-Quality Slides:
- Use a clean desktop browser window (e.g. 1440x900 or 1920x1080 resolution).
- Avoid capturing personal bookmarks, browser tabs, or unrelated desktop elements.
- Crop or frame neatly to focus on the application card and results.
