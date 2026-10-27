import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import NutritionCards from "../components/NutritionCards";
import { compareNutrition, nutritionText, REFERENCE_NOTICE } from "../utils/nutrition";

afterEach(cleanup);

it.each([
  [380, 480, 600, "below", 430],
  [700, 900, 600, "above", 800],
  [500, 700, 600, "includes", 600],
  [400, 600, 600, "includes", 500],
  [600, 800, 600, "includes", 700],
  [600, 600, 600, "includes", 600],
  [0, 0, 600, "below", 0],
  [14, 19, 25, "below", 16.5],
])("compares %s–%s against %s without discarding uncertainty", (min, max, reference, status, midpoint) => {
  expect(compareNutrition({ min, max }, reference)).toMatchObject({ status, midpoint });
});

it("keeps unknown nutrients unknown", () => {
  expect(compareNutrition(null, 25)).toBeNull();
  expect(nutritionText(null, 25, "g")).toBe("Unknown");
});

it("renders ranges, midpoints, neutral statuses and illustrative references", () => {
  render(<NutritionCards nutrition={{
    servingAssumption: "One bowl", confidence: "low",
    caloriesKcal: { min: 380, max: 480 }, proteinGrams: null,
    carbohydrateGrams: { min: 75, max: 90 }, fatGrams: { min: 25, max: 30 },
  }} />);
  expect(screen.getByText("380–480 kcal")).toBeTruthy();
  expect(screen.getByText("Approximate midpoint: 430 kcal")).toBeTruthy();
  for (const label of ["Below reference", "Includes reference", "Above reference", REFERENCE_NOTICE]) {
    expect(screen.getByText(label, label === REFERENCE_NOTICE ? {} : {selector:".nutrition-comparison"})).toBeTruthy();
  }
  const protein = screen.getByText("Protein").closest("div")!;
  expect(within(protein).getByText("Unknown")).toBeTruthy();
  expect(protein.classList.contains("unknown")).toBe(true);
  expect(within(protein).queryByText(/midpoint|reference/i)).toBeNull();
});

it("exports the same comparison with the original range", () => {
  expect(nutritionText({ min: 380, max: 480 }, 600, "kcal")).toBe(
    "380–480 kcal; approximate midpoint: 430 kcal; below reference (illustrative per-meal reference: 600 kcal)",
  );
});

it("updates card theme statuses when references change, preserving inclusive boundaries", () => {
  const nutrition = {
    servingAssumption:"One bowl", confidence:"low" as const,
    caloriesKcal:{min:400,max:600}, proteinGrams:{min:25,max:25},
    carbohydrateGrams:{min:40,max:50}, fatGrams:null,
  };
  const {rerender} = render(<NutritionCards nutrition={nutrition} targets={{caloriesKcal:600,proteinGrams:25,carbohydrateGrams:75,fatGrams:20}} goal/>);
  const card = (label: string) => screen.getByText(label).closest("div")!;
  expect(card("Calories").classList.contains("includes")).toBe(true);
  expect(card("Protein").classList.contains("includes")).toBe(true);
  expect(card("Carbohydrates").classList.contains("below")).toBe(true);
  expect(card("Fat").classList.contains("unknown")).toBe(true);
  rerender(<NutritionCards nutrition={nutrition} targets={{caloriesKcal:300,proteinGrams:20,carbohydrateGrams:50,fatGrams:20}} goal/>);
  expect(card("Calories").classList.contains("above")).toBe(true);
  expect(card("Protein").classList.contains("above")).toBe(true);
  expect(card("Carbohydrates").classList.contains("includes")).toBe(true);
});
