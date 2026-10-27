import React from "react";
import AnalysisResults from "./AnalysisResults";
import ImageUploader from "./ImageUploader";
import type { AnalysisResponse } from "../types/api";

interface AnalyzerWorkspaceProps {
  file: File | null;
  busy: boolean;
  error: string;
  result: AnalysisResponse | null;
  onFileChange: (file: File | null) => void;
  onSubmit: (event: React.FormEvent) => void;
  showError: (message: string) => void;
  onNavigateToHome: () => void;
}

export default function AnalyzerWorkspace({
  file,
  busy,
  error,
  result,
  onFileChange,
  onSubmit,
  showError,
  onNavigateToHome,
}: AnalyzerWorkspaceProps) {
  return (
    <div className="analyzer-page">
      <header className="full-width-header">
        <div className="header-inner">
          <div className="brand-group">
            <a
              className="brand"
              href="#/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToHome();
              }}
            >
              ◉ FoodLens <span>AI</span>
            </a>
            <span className="badge">Food photo exploration</span>
          </div>
          <button
            type="button"
            className="secondary back-link-btn"
            onClick={onNavigateToHome}
          >
            ← Back to Overview
          </button>
        </div>
      </header>

      <main className="analyzer-main">
        <section className="intro analyzer-intro">
          <p className="eyebrow">Interactive Estimation</p>
          <h1>Analyze your plate.</h1>
          <p className="subtitle">
            Upload or capture a food photo to explore likely ingredients, rough nutrition ranges, and simple preparation ideas.
          </p>
        </section>

        <div className="workspace" id="analyzer">
          <section className="card" aria-label="Upload a food image">
            <div className="card-heading">
              <span className="step">01</span>
              <h2>Your food photo</h2>
            </div>
            <form onSubmit={onSubmit}>
              <ImageUploader
                file={file}
                disabled={busy}
                onError={showError}
                onChange={onFileChange}
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
                app does not save photos. Provider terms and retention policies
                apply. Cloud usage limits and charges may apply. Avoid sensitive
                or personal photos.
              </p>
            </form>
          </section>

          <section
            className="card results"
            aria-live="polite"
            aria-busy={busy}
          >
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
                  Choose a photo to explore likely ingredients, approximate
                  nutrition ranges and a basic preparation idea.
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
          An estimate, always. Results include assumptions and uncertainty.
          FoodLens is educational and does not provide medical or dietetic
          advice.
        </aside>
      </main>

      <footer className="analyzer-footer">
        <div className="footer-brand">
          <strong>FoodLens AI</strong>{" "}
          <span>One photo. A little more understanding.</span>
        </div>
        <button
          type="button"
          className="text-link"
          onClick={onNavigateToHome}
        >
          ← Return to Overview
        </button>
      </footer>
    </div>
  );
}
