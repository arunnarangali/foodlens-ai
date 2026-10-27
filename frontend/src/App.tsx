import { useRef, useState } from "react";
import AnalysisResults from "./components/AnalysisResults";
import ImageUploader from "./components/ImageUploader";
import { analyzeImage } from "./services/api";
import type { AnalysisResponse } from "./types/api";
type AnalysisState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: AnalysisResponse }
  | { status: "error"; message: string };
export default function App() {
  const inFlight = useRef(false);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<AnalysisState>({ status: "idle" });
  const busy = state.status === "loading";
  const error = state.status === "error" ? state.message : "";
  const result = state.status === "success" ? state.result : null;
  const showError = (message: string) =>
    setState(message ? { status: "error", message } : { status: "idle" });
  return (
    <>
      <header>
        <a className="brand" href="/">
          ◉ FoodLens <span>AI</span>
        </a>
        <span className="badge">Food photo exploration</span>
      </header>
      <main>
        <section className="intro">
          <p className="eyebrow">A closer look at everyday food</p>
          <h1>
            Understand what’s
            <br />
            on your plate.
          </h1>
          <p className="subtitle">
            Start with a photo. Explore likely
            ingredients, rough nutrition ranges, and simple preparation ideas.
          </p>
        </section>
        <div className="workspace">
          <section className="card" aria-label="Upload a food image">
            <div className="card-heading">
              <span className="step">01</span>
              <h2>Your food photo</h2>
            </div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                if (inFlight.current) return;
                if (!file) {
                  showError("Choose a food photo before starting analysis.");
                  return;
                }
                inFlight.current = true;
                setState({ status: "loading" });
                try {
                  setState({ status: "success", result: await analyzeImage(file) });
                } catch (err) {
                  showError(
                    err instanceof Error
                      ? err.message
                      : "Could not reach the server. Please try again.",
                  );
                } finally {
                  inFlight.current = false;
                }
              }}
            >
              <ImageUploader
                file={file}
                disabled={busy}
                onError={showError}
                onChange={(next) => {
                  setFile(next);
                  setState({ status: "idle" });
                }}
              />
              {error && (
                <p role="alert" className="error">
                  {error}
                </p>
              )}
              <button
                className="primary"
                disabled={!file || busy}
                type="submit"
              >
                {busy ? "Analyzing photo…" : "Analyze photo"}
                <span aria-hidden="true"> →</span>
              </button>
              <p className="small privacy">
                Submitting sends your photo to Ollama Cloud for analysis. This
                app does not save photos. Provider terms and retention policies apply.
                Cloud usage limits and charges may apply. Avoid sensitive or personal photos.
              </p>
            </form>
          </section>
          <section className="card results" aria-live="polite" aria-busy={busy}>
            <div className="card-heading">
              <span className="step">02</span>
              <h2>Your analysis</h2>
            </div>
            {result ? (
              <AnalysisResults result={result} />
            ) : (
              <>
                <div className="plate" aria-hidden="true">
                  ◯
                </div>
                <h3>
                  {busy
                    ? "Analyzing your photo — this may take a few minutes…"
                    : "A fresh perspective starts here"}
                </h3>
                <p>
                  Choose a photo to explore likely ingredients, approximate nutrition ranges and a basic preparation idea.
                </p>
                <div className="coming">
                  <span>Likely ingredients</span>
                  <span>Nutrition ranges</span>
                  <span>Preparation idea</span>
                </div>
                <p className="small">
                  AI estimates can be wrong. Verify ingredients independently.
                </p>
              </>
            )}
          </section>
        </div>
        <aside className="notice">
          An estimate, always. Results include assumptions and
          uncertainty. FoodLens is educational and does not provide medical or
          dietetic advice.
        </aside>
      </main>
      <footer>
        FoodLens AI <span>One photo. A little more understanding.</span>
      </footer>
    </>
  );
}
