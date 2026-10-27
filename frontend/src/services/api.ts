import type {
  AnalysisResponse,
  Confidence,
  NutritionRange,
} from "../types/api";

const text = (value: unknown): value is string =>
  typeof value === "string" &&
  value.trim().length > 0 &&
  Array.from(value).length <= 1000;
const confidence = (value: unknown): value is Confidence =>
  ["low", "medium", "high"].includes(value as string);
const texts = (value: unknown, min: number, max: number): value is string[] =>
  Array.isArray(value) &&
  value.length >= min &&
  value.length <= max &&
  value.every(text);

function range(value: unknown): value is NutritionRange | null {
  if (value === null) return true;
  return (
    typeof value === "object" &&
    value !== null &&
    "min" in value &&
    "max" in value &&
    typeof value.min === "number" &&
    typeof value.max === "number" &&
    Number.isFinite(value.min) &&
    Number.isFinite(value.max) &&
    value.min >= 0 &&
    value.max >= value.min
  );
}

export function isAnalysisResponse(value: unknown): value is AnalysisResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (
    !text(data.disclaimer) ||
    !text(data.dishName) ||
    !confidence(data.identificationConfidence) ||
    !texts(data.visibleIngredients, 0, 30) ||
    !texts(data.uncertainties, 1, 10)
  )
    return false;
  if (data.status === "notFoodOrUnclear") {
    return (
      data.identificationConfidence === "low" &&
      data.visibleIngredients.length === 0 &&
      data.nutritionEstimate === null &&
      Array.isArray(data.preparationIdea) &&
      data.preparationIdea.length === 0
    );
  }
  if (
    data.status !== "analyzed" ||
    !texts(data.preparationIdea, 1, 5) ||
    !data.nutritionEstimate ||
    typeof data.nutritionEstimate !== "object"
  )
    return false;
  const n = data.nutritionEstimate as Record<string, unknown>;
  return (
    text(n.servingAssumption) &&
    confidence(n.confidence) &&
    ["caloriesKcal", "proteinGrams", "carbohydrateGrams", "fatGrams"].every(
      (key) => range(n[key]),
    )
  );
}

export async function analyzeImage(image: File): Promise<AnalysisResponse> {
  const body = new FormData();
  body.append("image", image);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 210000);
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      body,
      signal: controller.signal,
    });
    let data: unknown;
    try {
      data = await response.json();
    } catch {
      throw new Error(
        "The server returned an unreadable response. Check that the backend is running and try again.",
      );
    }
    if (!response.ok) {
      const error =
        data && typeof data === "object" && "error" in data ? data.error : null;
      throw new Error(
        error &&
          typeof error === "object" &&
          "message" in error &&
          text(error.message)
          ? error.message
          : "Analysis failed. Please try again later.",
      );
    }
    if (!isAnalysisResponse(data)) {
      throw new Error(
        "The server returned an invalid analysis. Please try again.",
      );
    }
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Analysis timed out. Please try again.");
    }
    if (error instanceof TypeError) {
      throw new Error(
        "Could not reach the server. Check your connection and try again.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
