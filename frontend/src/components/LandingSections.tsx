export function SampleMealShowcase() {
  const nutrients = [
    ["Calories", "380–480 kcal"],
    ["Protein", "14–19 g"],
    ["Carbohydrates", "48–62 g"],
    ["Fat", "14–20 g"],
  ];
  const ingredients = [
    "Cooked quinoa",
    "Seasoned chickpeas",
    "Cucumber slices",
    "Cherry tomatoes",
    "Tahini drizzle",
    "Fresh parsley",
  ];

  return (
    <div className="card sample-card" aria-label="Sample analysis result">
      <div className="sample-badge-bar">
        <span className="badge sample-badge">Sample illustrative result</span>
        <span className="badge">Identification confidence: High</span>
      </div>
      <h3>Mediterranean Quinoa & Chickpea Bowl</h3>
      <p className="subtitle small">
        Typical healthy lunch bowl with grains, legumes, and vegetable toppings.
      </p>

      <h4>Likely visible ingredients</h4>
      <div className="ingredient-tags">
        {ingredients.map((item, index) => (
          <span key={index} className="ingredient-tag">
            {item}
          </span>
        ))}
      </div>

      <h4>Estimated nutrition ranges</h4>
      <p className="serving-note">
        <strong>Assumed portion:</strong> One standard shallow bowl (~350g).
      </p>
      <p className="small">Nutrition confidence: Medium</p>
      <dl className="nutrition-grid">
        {nutrients.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <h4>Assumptions & uncertainty</h4>
      <ul className="uncertainties-list">
        <li>
          Dressing volume, tahini oil concentration, and cooking fats cannot be verified from photos.
        </li>
        <li>
          Bowl depth and exact quinoa density alter total carbohydrates and calories.
        </li>
      </ul>

      <h4>Example preparation concept</h4>
      <ol className="prep-steps">
        <li>Layer warm cooked quinoa with rinsed chickpeas and diced fresh vegetables.</li>
        <li>Whisk tahini with lemon juice and a splash of water, then drizzle gently on top.</li>
      </ol>
      <p className="notice sample-notice">
        Educational visual estimation only. Not medical or dietetic advice.
      </p>
    </div>
  );
}

export function SampleResultSection() {
  return (
    <section className="landing-section" id="sample-result" aria-labelledby="sample-result-title">
      <div className="section-heading">
        <p className="eyebrow">Real Output Example</p>
        <h2 id="sample-result-title">What a FoodLens analysis looks like</h2>
        <p className="subtitle">
          Notice how nutrition is presented as honest ranges rather than falsely precise single numbers.
        </p>
      </div>

      <div className="sample-showcase-wrapper">
        <SampleMealShowcase />
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Snap or Upload",
      description:
        "Select a JPEG, PNG, or WebP photo up to 5 MiB, or capture directly using your browser camera.",
    },
    {
      step: "02",
      title: "AI Vision Analysis",
      description:
        "Hosted Ollama Cloud models analyze visible colors, textures, and dish composition through a secure backend proxy.",
    },
    {
      step: "03",
      title: "Honest Range Estimates",
      description:
        "Receive realistic Min–Max calorie and macro ranges, assumed portion sizes, visible ingredients, and simple recipe ideas.",
    },
  ];

  return (
    <section className="landing-section" id="how-it-works" aria-labelledby="how-it-works-title">
      <div className="section-heading">
        <p className="eyebrow">A simpler way to understand meals</p>
        <h2 id="how-it-works-title">How FoodLens AI Works</h2>
        <p className="subtitle">
          Three straightforward steps to explore what is on your plate without tedious manual logging.
        </p>
      </div>

      <div className="how-it-works-grid">
        {steps.map((item) => (
          <div key={item.step} className="card step-card">
            <span className="step">{item.step}</span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PhotoRealityGap() {
  return (
    <section className="landing-section" id="why-ranges" aria-labelledby="why-ranges-title">
      <div className="section-heading">
        <p className="eyebrow">Our Philosophy</p>
        <h2 id="why-ranges-title">The Photo Reality Gap</h2>
        <p className="subtitle">
          Why we provide broad ranges and transparent uncertainty instead of single exact numbers.
        </p>
      </div>

      <div className="comparison-grid">
        <div className="card comparison-card problem-card">
          <div className="card-heading">
            <span className="step warning-step">✕</span>
            <h3>The Myth of Exact Calories</h3>
          </div>
          <p className="small">
            Many AI apps claim to pinpoint exact numbers like <em>"423 kcal"</em> from a quick 2D photo.
          </p>
          <ul className="comparison-list">
            <li>A photo cannot detect hidden cooking butter, oil, or sugar in sauces.</li>
            <li>Dense bowl layers and depth cannot be measured from pixels alone.</li>
            <li>Falsely exact numbers give a misleading impression of scientific precision.</li>
          </ul>
        </div>

        <div className="card comparison-card solution-card">
          <div className="card-heading">
            <span className="step success-step">✔</span>
            <h3>The FoodLens Honest Approach</h3>
          </div>
          <p className="small">
            We provide realistic Min–Max ranges tied to explicitly stated portion assumptions.
          </p>
          <ul className="comparison-list">
            <li>Nutrients presented as broad ranges (e.g. 380–480 kcal).</li>
            <li>Portion size assumptions and uncertainties stated upfront on every card.</li>
            <li>Explicit identification confidence scores and separation of visible vs. inferred items.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function TrustAndSafety() {
  const pillars = [
    {
      icon: "🔒",
      title: "Zero Photo Storage",
      description:
        "Images are processed in-memory and never written to server disk or stored in browser history. Your food photos remain ephemeral.",
    },
    {
      icon: "🛡️",
      title: "Backend-Only Isolation",
      description:
        "Your browser never connects to the AI provider directly. All credentials and timeouts are strictly controlled on the Go server.",
    },
    {
      icon: "📋",
      title: "Educational & Non-Medical",
      description:
        "FoodLens is designed for curious food exploration. We never claim medical authority or guarantee allergen safety.",
    },
  ];

  return (
    <section className="landing-section" id="privacy" aria-labelledby="privacy-title">
      <div className="section-heading">
        <p className="eyebrow">Safe & Transparent</p>
        <h2 id="privacy-title">Built with Privacy and Restraint</h2>
        <p className="subtitle">
          Lean, defensive architecture that respects your privacy and communicates limits clearly.
        </p>
      </div>

      <div className="trust-grid">
        {pillars.map((item) => (
          <div key={item.title} className="card trust-card">
            <div className="trust-icon" aria-hidden="true">
              {item.icon}
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
