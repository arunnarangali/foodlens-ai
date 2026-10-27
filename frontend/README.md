# Frontend

React + TypeScript + Vite. Run `npm ci`, then `npm run dev`. Start Go separately. Vite proxies `/api` to `http://127.0.0.1:8080`.

Checks: `npm run lint` (TypeScript), `npm test`, `npm run build`. `npm run preview` serves the build for static inspection only; it does not proxy the API. No provider credentials are read by this frontend and no images are persisted. Submitting transmits the photo through Go to Ollama Cloud. The backend requires privately exported credentials; see the root README. See the root README for full setup and privacy notes.

## Nutrition goal comparisons

The landing sample offers automatic Weight loss/Maintain weight/Weight gain demo profiles. Maintain weight defaults; selecting another profile moves references on fixed scales while food estimates stay unchanged. Presets are illustrative application constants, not personalised advice. The analyzer uses the same presets through compact Your goal tab-style radio controls; no inputs or Apply button are needed. Its selection is independent and persists across navigation/new results until refresh. Shared references are illustrative, not personalised dietary advice. See the root README for preset values and limitations. No goal-selection API request or browser persistence is used.

Analyzer goal controls support Tab and arrow keys with a visible focus outline. Full-card backgrounds and related text/graph colours mirror above/below/includes comparisons in pale amber/brown, pale blue/dark blue and pale green/dark green; Unknown uses light/dark grey. Text badges remain available without relying on colour. Border width stays 2px across states. See docs/testing.md for actual automated results and manual browser limitations.

The sample at `#sample-result` now uses the same GoalTabs radio component and full-card status themes as the analyzer. There is no hidden sample dropdown. Tab focuses the selected goal; arrow keys switch it and update markers/labels/borders. Each rendered group has its own name and state. Live inspection of port 5175 was blocked by socket restrictions during implementation; refresh/restart Vite to load current source if your browser is showing an older view, but no cache issue was reproduced here.

Theme colours are CSS variables in the shared nutrition-card rules. Changing a goal immediately updates the whole theme without modifying estimated values or scales. Text status badges remain. Source-palette contrast was checked automatically; the user will review actual browser/mobile appearance manually.

A shared What the colours mean legend appears above nutrition cards in analyzer and sample. It shows swatches with Above reference, Below reference, Range includes reference and Estimate unknown, without colour names. Swatches are decorative; text conveys their meanings, and a note distinguishes comparisons from health ratings. Browser/mobile review remains with the user.
