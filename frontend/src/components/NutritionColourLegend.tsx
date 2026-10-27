const meanings = [
  { status: "above", text: "Above reference" },
  { status: "below", text: "Below reference" },
  { status: "includes", text: "Range includes reference" },
  { status: "unknown", text: "Estimate unknown" },
];

export default function NutritionColourLegend() {
  return (
    <aside className="nutrition-colour-key" aria-label="What the colours mean">
      <p className="nutrition-colour-key-title">What the colours mean</p>
      <ul>
        {meanings.map(({ status, text }) => (
          <li key={status}>
            <span className={`nutrition-colour-swatch ${status}`} aria-hidden="true" />
            {text}
          </li>
        ))}
      </ul>
      <p className="nutrition-colour-key-note">
        Colours compare the estimated range with the selected reference; they do not rate how healthy the food is.
      </p>
    </aside>
  );
}
