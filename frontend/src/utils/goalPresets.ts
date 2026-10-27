import type { NutritionTargets } from "./nutrition";

// Illustrative application references, not personalised dietary requirements.
export const GOAL_PRESETS = {
  "Weight loss": {
    caloriesKcal: 450,
    proteinGrams: 20,
    carbohydrateGrams: 55,
    fatGrams: 15,
  },
  "Maintain weight": {
    caloriesKcal: 600,
    proteinGrams: 25,
    carbohydrateGrams: 75,
    fatGrams: 20,
  },
  "Weight gain": {
    caloriesKcal: 750,
    proteinGrams: 30,
    carbohydrateGrams: 95,
    fatGrams: 25,
  },
} as const satisfies Record<string, NutritionTargets>;
export type NutritionGoal = keyof typeof GOAL_PRESETS;
export const GOALS = Object.keys(GOAL_PRESETS) as NutritionGoal[];

// Shared bounds keep interval positions fixed when a goal changes.
export const GOAL_SCALE_MAXIMA = Object.fromEntries(
  Object.keys(GOAL_PRESETS["Maintain weight"]).map((key) => [
    key,
    Math.max(
      ...GOALS.map((goal) => GOAL_PRESETS[goal][key as keyof NutritionTargets]),
    ),
  ]),
) as NutritionTargets;
export const GOAL_NOTICE =
  "Illustrative goal references—not personalised dietary advice.";
export const SAMPLE_GOAL_NOTICE =
  "Demonstration presets—not personalised nutrition recommendations. These example values do not guarantee weight changes.";
