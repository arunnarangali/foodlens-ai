# Simple deployment on Render — native Go runtime

## One repository, one public URL

React and Go stay in this repository. Render builds the frontend and Go server, then Go serves frontend/dist and the existing `/api/*` endpoints on one HTTPS origin. No Dockerfile, GitHub Actions workflow, deploy hook, extra build script or separate frontend service is required. GitHub Pages cannot run this backend; use Render's actual service URL for the complete app.

## Render settings

Create a **Web Service**, connect the GitHub repository and use:

| Setting | Value |
|---|---|
| Runtime / Language | Go (native) |
| Branch | main |
| Root Directory | Leave empty: repository root |
| Build Command | `npm --prefix frontend ci && npm --prefix frontend run build && cd backend && go build -o server ./cmd/server` |
| Start Command | `cd backend && ./server` |
| Health Check Path | /api/health |
| Environment secret | OLLAMA_API_KEY, entered privately |
| Instance type | Free for a learning demo, if available to your account |
| Auto-Deploy | Off; use manual deployment |

Render's native runtime includes node and npm. The project requires Node 20.19+ and Go 1.22+; verify versions in the first build logs. No application credential is needed for compilation. Do not print the real runtime key in logs or put it in frontend settings, source or Git. No private .env is uploaded; configure the key through Render's environment settings. The service supplies PORT automatically, which the app validates and binds on 0.0.0.0. Private local .env files remain key-only.

Leave Root Directory empty so both frontend and backend are available during the build. The start command must change into backend: the app serves `../frontend/dist` relative to that working directory. npm ci uses the committed frontend lockfile.

If you already created a Docker service, create a replacement native Go service with these settings; do not assume deleting the Dockerfile changes an existing service's configured runtime. Keep the previous service until the replacement is verified, then manage the old service in Render yourself. This repository change does not modify your account or running services.

## Manual deployment

1. Run the checks below and push the reviewed commit to GitHub.
2. Create the native Go service, or select **Manual Deploy → Deploy latest commit** on an existing correctly configured service. Initial service creation may start its first deployment automatically.
3. Wait for the build and health check to succeed. Render then displays the real HTTPS URL; do not invent or assume one.
4. For subsequent releases, run tests locally, push changes and deliberately deploy the latest intended commit. There is no CI gate after workflow removal.

## Local build and checks

Run from the repository root:

```bash
npm --prefix frontend ci
npm --prefix frontend run lint
npm --prefix frontend test
npm --prefix frontend run build
```

Then:

```bash
cd backend
go test ./...
go vet ./...
go build -o server ./cmd/server
# For a local combined frontend/API preview, configure the private key first:
./server
```

The backend Makefile remains available. For separate local development, continue using Go and Vite as described in README. Local bind defaults to 127.0.0.1:8080 when no platform PORT exists.

## Verify the actual hosted app

- Open the Render URL and confirm the page and its JS/CSS load.
- Request `https://YOUR-ACTUAL-SERVICE.onrender.com/api/health`; expect `{"status":"ok"}`. Health checks do not call Ollama or prove account quota/model access.
- Request an unknown API route; expect a JSON 404, not the frontend HTML.
- Confirm missing assets/private paths do not expose files or directory listings.
- Use one permitted non-sensitive photo to verify preview, analysis, ranges/unknowns, uncertainty and copy. Camera capture needs browser permission and HTTPS. Check Ollama allowance/billing before submitting.
- Verify browser analysis requests go to the same origin's Go API; never directly to Ollama. Record the deployed commit, actual URL and test outcomes without keys or private photos.

No actual Render deployment or live inference was performed by this cleanup. The former Docker/CI setup is historical and has been removed at the user's request; earlier workflow success does not deploy the new native service.

## Limits

Render documents idle sleeping/cold starts and usage limits for Free services. Free hosting does not imply free Ollama inference. Public visitors can consume the service's provider allowance; this MVP has no user authentication or abuse-rate limiting. Use account budgets/limits where available and a limited demo audience before sharing widely.

## References

- Native runtime tools (including Node/npm): https://render.com/docs/native-runtimes
- Supported languages: https://render.com/docs/language-support
- Native runtime versus Docker: https://render.com/docs/docker
- Port binding: https://render.com/docs/web-services#port-binding
- Manual deploys: https://render.com/docs/deploys#manual-deploys
- Free service limits: https://render.com/docs/free
