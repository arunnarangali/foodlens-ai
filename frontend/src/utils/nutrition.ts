import type { NutritionEstimate, NutritionRange } from "../types/api";

// Illustrative UI references only; these are not dietary recommendations.
export const NUTRIENTS = [
  { key: "caloriesKcal", label: "Calories", unit: "kcal", reference: 600 },
  { key: "proteinGrams", label: "Protein", unit: "g", reference: 25 },
  {
    key: "carbohydrateGrams",
    label: "Carbohydrates",
    unit: "g",
    reference: 75,
  },
  { key: "fatGrams", label: "Fat", unit: "g", reference: 20 },
] as const satisfies readonly {
  key: keyof NutritionEstimate;
  label: string;
  unit: string;
  reference: number;
}[];

export type NutrientKey = (typeof NUTRIENTS)[number]["key"];
export type NutritionTargets = Record<NutrientKey, number>;
export const REFERENCE_NOTICE =
  "Illustrative per-meal comparison values—not personalised dietary recommendations. A midpoint is a summary of the estimated range, not a measured value.";

export function compareNutrition(
  range: NutritionRange | null,
  reference: number,
) {
  if (range === null) return null;
  return {
    midpoint: range.min + (range.max - range.min) / 2,
    status:
      range.max < reference
        ? "below"
        : range.min > reference
          ? "above"
          : "includes",
    label:
      range.max < reference
        ? "Below reference"
        : range.min > reference
          ? "Above reference"
          : "Includes reference",
  } as const;
}

export function formatAmount(value: number): string {
  return String(Math.round(value * 10) / 10);
}

export function nutritionText(
  range: NutritionRange | null,
  reference: number | null,
  unit: string,
  goal = false,
): string {
  if (!range) return "Unknown";
  const base = `${range.min}–${range.max} ${unit}; approximate midpoint: ${formatAmount(range.min + (range.max - range.min) / 2)} ${unit}`;
  if (reference === null) return base;
  const comparison = compareNutrition(range, reference)!;
  if (goal)
    return `${base}; ${comparison.label.toLowerCase().replace("reference", "goal reference")} (illustrative per-meal goal reference: ${reference} ${unit})`;
  return `${range.min}–${range.max} ${unit}; approximate midpoint: ${formatAmount(comparison.midpoint)} ${unit}; ${comparison.label.toLowerCase()} (illustrative per-meal reference: ${reference} ${unit})`;
}
