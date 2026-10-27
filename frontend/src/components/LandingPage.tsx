import AiSparkleIcon from "./AiSparkleIcon";
import {
  HowItWorks,
  PhotoRealityGap,
  SampleResultSection,
  TrustAndSafety,
} from "./LandingSections";

interface LandingPageProps {
  onNavigateToAnalyzer: () => void;
}

export default function LandingPage({
  onNavigateToAnalyzer,
}: LandingPageProps) {
  return (
    <div className="landing-page">
      <header className="full-width-header">
        <div className="header-inner">
          <div className="brand-group">
            <a className="brand" href="#/">
              ◉ FoodLens <span>AI</span>
            </a>
            <span className="badge">Food photo exploration</span>
          </div>
          <nav className="nav-links" aria-label="Main navigation">
            <a href="#how-it-works">How It Works</a>
            <a href="#sample-result">Sample Result</a>
            <a href="#why-ranges">Why Ranges?</a>
            <a href="#privacy">Privacy</a>
            <button
              type="button"
              className="primary nav-cta-btn"
              onClick={onNavigateToAnalyzer}
            >
              Launch Analyzer <AiSparkleIcon />
            </button>
          </nav>
        </div>
      </header>

      <main className="landing-main">
        <section className="intro hero-intro">
          <p className="eyebrow">A closer look at everyday food</p>
          <h1>
            Understand what’s
            <br />
            on your plate.
          </h1>
          <p className="subtitle">
            Start with a photo. Explore likely ingredients, rough nutrition
            ranges, and simple preparation ideas — without false precision.
          </p>
          <div className="hero-cta-group">
            <button
              type="button"
              className="primary hero-btn"
              onClick={onNavigateToAnalyzer}
            >
              Launch FoodLens Analyzer <AiSparkleIcon />
            </button>
            <div className="hero-pills">
              <span className="badge">✔ Honest Ranges</span>
              <span className="badge">✔ Zero Saved Photos</span>
              <span className="badge">✔ Camera Ready</span>
            </div>
          </div>
        </section>

        <HowItWorks />
        <SampleResultSection />
        <PhotoRealityGap />
        <TrustAndSafety />

        <section className="landing-cta-banner">
          <h2>Ready to explore your food?</h2>
          <p>
            No account required. Photos are processed in memory and never saved.
          </p>
          <button
            type="button"
            className="primary banner-btn"
            onClick={onNavigateToAnalyzer}
          >
            Start Photo Analysis <AiSparkleIcon />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <strong>FoodLens AI</strong>{" "}
            <span>One photo. A little more understanding.</span>
          </div>
          <div className="footer-links">
            <a href="#how-it-works">How It Works</a>
            <a href="#why-ranges">Why Ranges?</a>
            <a href="#privacy">Privacy</a>
            <button
              type="button"
              className="text-link"
              onClick={onNavigateToAnalyzer}
            >
              Launch Analyzer
            </button>
          </div>
        </div>
        <p className="small footer-disclaimer">
          FoodLens AI provides educational nutritional estimates and ingredient
          hypotheses. It is not a substitute for clinical or dietetic advice.
        </p>
      </footer>
    </div>
  );
}
