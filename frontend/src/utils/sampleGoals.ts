import type { NutritionEstimate } from "../types/api";

export const SAMPLE_NUTRITION: NutritionEstimate = {
  servingAssumption: "One standard shallow bowl (~350g).",
  confidence: "medium",
  caloriesKcal: { min: 380, max: 480 },
  proteinGrams: { min: 14, max: 19 },
  carbohydrateGrams: { min: 48, max: 62 },
  fatGrams: { min: 14, max: 20 },
};
