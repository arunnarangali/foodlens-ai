import NutritionColourLegend from "./NutritionColourLegend";
import { GOAL_NOTICE } from "../utils/goalPresets";
import type { NutritionEstimate } from "../types/api";
import {
  compareNutrition,
  formatAmount,
  NUTRIENTS,
  REFERENCE_NOTICE,
  type NutritionTargets,
} from "../utils/nutrition";

export default function NutritionCards({
  nutrition,
  targets,
  goal = false,
  demo = false,
  scaleMaxima,
}: {
  nutrition: NutritionEstimate;
  targets?: NutritionTargets | null;
  goal?: boolean;
  demo?: boolean;
  scaleMaxima?: NutritionTargets;
}) {
  return (
    <>
      <NutritionColourLegend />
      <dl className="nutrition-grid">
        {NUTRIENTS.map(
          ({ key, label, unit, reference: illustrativeReference }) => {
            const range = nutrition[key];
            const reference =
              goal || demo ? (targets?.[key] ?? null) : illustrativeReference;
            const comparison =
              reference === null ? null : compareNutrition(range, reference);
            // Each card has its own zero-based scale, with headroom for both markers.
            const scale = Math.max(
              range?.max ?? 0,
              reference ?? 0,
              scaleMaxima?.[key] ?? 0,
              1,
            );
            const position = (value: number) =>
              `${(value / scale / 1.15) * 100}%`;
            return (
              <div
                className={`nutrition-card ${comparison?.status ?? "unknown"}`}
                key={key}
              >
                <dt>{label}</dt>
                <dd>
                  <span className="nutrition-value">
                    {range ? `${range.min}–${range.max} ${unit}` : "Unknown"}
                  </span>
                  {range && (
                    <span className="nutrition-detail">
                      Approximate midpoint:{" "}
                      {formatAmount(range.min + (range.max - range.min) / 2)}{" "}
                      {unit}
                    </span>
                  )}
                  {range && comparison && reference !== null && (
                    <>
                      <span
                        className={`nutrition-comparison ${comparison.status}`}
                      >
                        {goal
                          ? comparison.label.replace(
                              "reference",
                              "goal reference",
                            )
                          : demo
                            ? comparison.label.replace(
                                "reference",
                                "demo reference",
                              )
                            : comparison.label}
                      </span>
                      <span className="nutrition-detail">
                        {goal
                          ? "Goal reference:"
                          : demo
                            ? "Demo reference:"
                            : "Illustrative reference:"}{" "}
                        {reference} {unit} per meal
                      </span>
                      <span className="nutrition-scale" aria-hidden="true">
                        <span
                          className="nutrition-interval"
                          style={{
                            left: position(range.min),
                            width: position(range.max - range.min),
                          }}
                        />
                        <span
                          className="nutrition-midpoint"
                          style={{ left: position(comparison.midpoint) }}
                        />
                        <span
                          className="nutrition-reference"
                          style={{ left: position(reference) }}
                        />
                      </span>
                      <span className="nutrition-legend" aria-hidden="true">
                        ● Midpoint · │{" "}
                        {goal
                          ? "Goal reference"
                          : demo
                            ? "Demo reference"
                            : "Reference"}
                      </span>
                    </>
                  )}
                </dd>
              </div>
            );
          },
        )}
      </dl>
      <p className="small nutrition-reference-notice">
        {goal ? GOAL_NOTICE : REFERENCE_NOTICE}
      </p>
    </>
  );
}
