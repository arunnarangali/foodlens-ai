# Deploy React and Go together on Render

## Architecture and current verification

One repository, one Docker Web Service, one public HTTPS origin. Go serves the React production build and `/api/*`. GitHub Actions validates the commit; Render builds/runs it after checks pass. GitHub Pages is not used because it cannot run Go.

Local Go tests/vet, frontend checks/build and workflow YAML/Python syntax checks passed; see testing.md. Docker build/container smoke checks, GitHub Actions execution and an actual Render deployment have **not** been verified in this environment: Docker daemon access was denied. No live inference or account credits were consumed.

## Files and runtime

- Root `Dockerfile`: Node 22 builds React, Go 1.26 builds a static binary, Alpine 3.23 runs it as UID 10001 with trusted HTTPS certificates.
- `.dockerignore`: excludes private environment files, Git metadata, dependencies, local media and generated artifacts. Only the server binary and built frontend files are copied from build stages into the final image, alongside base OS/runtime certificates.
- `.github/workflows/foodlens-ci.yml`: checks PRs, pushes to main and manual runs. No Ollama or deployment secrets are required by CI.
- `.github/scripts/smoke.py`: checks the homepage, referenced JS/CSS, health, safe API errors and missing/private paths. It makes no POST/inference requests.

The image working directory is `/app/backend`, with the server there and frontend assets at `/app/frontend/dist`. Go serves only that assets directory. Missing assets/directories return 404; unknown API paths retain JSON errors. No source-directory fallback or directory listing exists.

`.env` still accepts only OLLAMA_API_KEY for local development. Render supplies the infrastructure PORT automatically; the server validates it and binds `0.0.0.0:PORT`. Without PORT, local binding stays `127.0.0.1:8080`. Do not add PORT to the private .env. Other provider/model settings stay fixed.

## Verify Docker locally when daemon access is available

Run from the repository root:

```bash
docker build --tag foodlens-ai .
docker run --rm --name foodlens-ai \
  --publish 127.0.0.1:8080:10000 \
  --env-file backend/.env \
  foodlens-ai
```

In another terminal:

```bash
python3 .github/scripts/smoke.py http://127.0.0.1:8080
```

These are instructions, not evidence of a successful container run here. Use a permitted non-sensitive photo for the separate live AI test after checking Ollama usage/billing. The private .env is passed at runtime and must never be copied into an image or supplied as a build argument.

## Connect Render

1. Push the reviewable changes to GitHub. Confirm **FoodLens CI / Test and validate deployment** passes.
2. In Render, choose **New → Web Service → Git Provider**. Connect the GitHub repository through the provider integration rather than an unauthenticated public-repo URL, so Render can observe CI checks.
3. Set these values:

| Setting | Value |
|---|---|
| Name | foodlens-ai, or another available service name |
| Runtime / language | Docker |
| Branch | main |
| Root Directory | Leave empty: repository root |
| Dockerfile Path | ./Dockerfile |
| Docker Build Context | Repository root |
| Health Check Path | /api/health |
| Instance type | Free for the learning demo, if available to the account |
| Environment secret | OLLAMA_API_KEY, entered privately in Render |
| Auto-Deploy | After CI Checks Pass |

Do not set separate backend/frontend root directories: both trees are required by the Docker build. Do not add the real key to GitHub Actions secrets for this workflow, a Docker ARG/ENV instruction, frontend settings, logs or Git. The key is needed by the running service only. Render's supplied PORT needs no custom setup.

The first service creation may trigger an initial deployment before you have adjusted every setting. Run CI successfully on the intended main commit before creating the service; then ensure **After CI Checks Pass** is selected before subsequent pushes. Configure `/api/health` in the service's health-check settings if it is not available in the creation form. No deploy hook is needed.

## Confirm the hosted service

1. Use Render's actual HTTPS URL, not localhost or a guessed service name.
2. Run `python3 .github/scripts/smoke.py https://YOUR-SERVICE.onrender.com --timeout 120`. This checks hosting without consuming AI inference credits.
3. Verify upload/preview/removal, camera permission/capture on a supported HTTPS browser, analysis, unknown nutrients, uncertainty/disclaimer and copy. Verify the browser calls the same origin's `/api/analyze` and never Ollama directly.
4. Check service logs and usage without exposing credentials, private photos or raw model output. Record the deployed commit, actual URL, test outcomes and unresolved issues in testing.md/weekly-updates.md.
5. If deployment fails, inspect the failed CI/build/health step. Use Render's deploy history to roll back to a known-good deploy where available. Health reports process status, not provider quota/model readiness.

Do not claim public availability or a successful live result until these steps actually pass.

## Limits and cost

Render documents that Free web services can sleep after 15 minutes of inactivity and take about a minute to wake; bandwidth, build minutes and service hours are limited. Free hosting does not make Ollama inference free. Check both accounts' current usage/billing before publishing. The app has no user authentication or public abuse-rate limiting: public visitors can consume your Ollama allowance. Use a limited demo audience and provider-side budgets/limits where available before broad sharing.

## Official references checked 2026-10-27

- GitHub Pages is static hosting: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- Render port binding and web services: https://render.com/docs/web-services#port-binding
- Deploy after GitHub checks pass: https://render.com/docs/deploys#integrating-with-ci
- Repository root/build context: https://render.com/docs/monorepo-support
- Free service limitations: https://render.com/docs/free
- GitHub workflow syntax: https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax
