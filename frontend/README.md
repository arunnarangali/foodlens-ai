# Frontend

React + TypeScript + Vite. Run `npm ci`, then `npm run dev`. Start Go separately. Vite proxies `/api` to `http://127.0.0.1:8080`.

Checks: `npm run lint` (TypeScript), `npm test`, `npm run build`. `npm run preview` serves the build for static inspection only; it does not proxy the API. No provider credentials are read by this frontend and no images are persisted. Submitting transmits the photo through Go to Ollama Cloud. The backend requires privately exported credentials; see the root README. See the root README for full setup and privacy notes.
