export type Confidence = "low" | "medium" | "high";
export interface NutritionRange {
  min: number;
  max: number;
}
export interface NutritionEstimate {
  servingAssumption: string;
  confidence: Confidence;
  caloriesKcal: NutritionRange | null;
  proteinGrams: NutritionRange | null;
  carbohydrateGrams: NutritionRange | null;
  fatGrams: NutritionRange | null;
}
interface ResultBase {
  dishName: string;
  identificationConfidence: Confidence;
  visibleIngredients: string[];
  preparationIdea: string[];
  uncertainties: string[];
  disclaimer: string;
}
export interface Analysis extends ResultBase {
  status: "analyzed";
  nutritionEstimate: NutritionEstimate;
}
export interface UnclearResult extends ResultBase {
  status: "notFoodOrUnclear";
  nutritionEstimate: null;
}
export type AnalysisResponse = Analysis | UnclearResult;
