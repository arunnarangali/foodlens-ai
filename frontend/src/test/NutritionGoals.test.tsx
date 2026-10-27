import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";
import { NutritionGoalsProvider } from "../components/NutritionGoals";
import { GOALS, GOAL_PRESETS, GOAL_NOTICE, GOAL_SCALE_MAXIMA } from "../utils/goalPresets";
import { NUTRIENTS } from "../utils/nutrition";
import AnalysisResults from "../components/AnalysisResults";
import type { AnalysisResponse } from "../types/api";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const result: AnalysisResponse = {
  status: "analyzed", dishName: "Illustrative meal", identificationConfidence: "medium", visibleIngredients: [],
  nutritionEstimate: { servingAssumption: "One bowl", confidence: "low", caloriesKcal: {min:800,max:950}, proteinGrams:null, carbohydrateGrams:{min:50,max:80}, fatGrams:{min:10,max:20} },
  preparationIdea:["Cook the ingredients."], uncertainties:["Oil and portions are uncertain."], disclaimer:"Educational estimate only.",
};
const card = (label: string) => screen.getByText(label).closest("div")!;
function start(value: AnalysisResponse = result) {
  return render(<NutritionGoalsProvider><AnalysisResults result={value}/></NutritionGoalsProvider>);
}

it.each(GOALS)("immediately compares all known nutrients for %s without a form or network call", goal => {
  const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
  start();
  expect((screen.getByRole("radio", {name:"Maintain weight"}) as HTMLInputElement).checked).toBe(true);
  expect(screen.queryByRole("spinbutton")).toBeNull();
  expect(screen.queryByRole("button", {name:"Apply targets"})).toBeNull();
  fireEvent.click(screen.getByRole("radio", {name:goal}));
  for (const {key, label, unit} of NUTRIENTS) {
    const range = result.nutritionEstimate![key];
    if (!range) {
      expect(within(card(label)).getByText("Unknown")).toBeTruthy();
      expect(card(label).querySelector(".nutrition-reference")).toBeNull();
      continue;
    }
    const reference = GOAL_PRESETS[goal][key];
    const expected = range.max < reference ? "Below" : range.min > reference ? "Above" : "Includes";
    expect(within(card(label)).getByText(`${expected} goal reference`)).toBeTruthy();
    expect(card(label).classList.contains(expected.toLowerCase())).toBe(true);
    expect(within(card(label)).getByText(`Goal reference: ${reference} ${unit} per meal`)).toBeTruthy();
  }
  expect(screen.getByText(GOAL_NOTICE)).toBeTruthy();
  const legend = screen.getByRole("complementary", {name:"What the colours mean"});
  expect(within(legend).getAllByRole("listitem")).toHaveLength(4);
  expect(within(legend).getByText("Colours compare the estimated range with the selected reference; they do not rate how healthy the food is.")).toBeTruthy();
  expect(fetchMock).not.toHaveBeenCalled();
});

it("moves references while retaining the current meal's interval, midpoint and scale", () => {
  const {container} = start();
  const positions = () => Array.from(container.querySelectorAll<HTMLElement>(".nutrition-interval,.nutrition-midpoint"), node => node.style.cssText);
  const initial = positions();
  const marker = () => card("Calories").querySelector<HTMLElement>(".nutrition-reference")!;
  const initialMarker = marker().style.left;
  fireEvent.click(screen.getByRole("radio", {name:"Weight gain"}));
  expect(positions()).toEqual(initial);
  expect(marker().style.left).not.toBe(initialMarker);
  expect(parseFloat(marker().style.left)).toBeCloseTo(750 / Math.max(950, GOAL_SCALE_MAXIMA.caloriesKcal) / 1.15 * 100);
  expect(screen.getByText("800–950 kcal")).toBeTruthy();
  expect(screen.getByText("Approximate midpoint: 875 kcal")).toBeTruthy();
  expect(within(card("Calories")).getByText("Above goal reference")).toBeTruthy();
});

it.each([{min:600,max:700}, {min:500,max:600}])("includes the reference at either interval boundary: %j", range => {
  start({...result, nutritionEstimate:{...result.nutritionEstimate!,caloriesKcal:range}});
  expect(within(card("Calories")).getByText("Includes goal reference")).toBeTruthy();
});

it("copies the selected goal and every reference, including an unknown nutrient's reference", async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);vi.stubGlobal("navigator", {clipboard:{writeText}});
  start(); fireEvent.click(screen.getByRole("radio", {name:"Weight gain"}));
  fireEvent.click(screen.getByRole("button", {name:"Copy results"}));await screen.findByText("Results copied.");
  for (const text of ["Selected goal: Weight gain", "Calories 750 kcal", "Protein 30 g", "Protein: Unknown", "800–950 kcal", "above goal reference", GOAL_NOTICE, result.disclaimer]) {
    expect(writeText.mock.calls[0][0]).toContain(text);
  }
});

it("retains the analyzer goal across navigation/new results and resets on a fresh mount", async () => {
  window.scrollTo = vi.fn(); window.location.hash = "#/analyze";
  URL.createObjectURL = vi.fn(() => "blob:test"); URL.revokeObjectURL = vi.fn();
  const fetchMock = vi.fn().mockResolvedValue({ok:true,json:async()=>result});vi.stubGlobal("fetch", fetchMock);
  const view = render(<App initialRoute="analyzer"/>);
  const submit = async () => {
    fireEvent.change(screen.getByLabelText(/Choose (a food|another) photo/), {target:{files:[new File(["x"], "meal.png", {type:"image/png"})]}});
    fireEvent.click(screen.getByRole("button", {name:/Analyze photo/}));await screen.findByText(result.dishName);
  };
  await submit(); fireEvent.click(screen.getByRole("radio", {name:"Weight gain"}));
  fireEvent.click(screen.getByRole("button", {name:"← Back to Overview"}));
  fireEvent.click(screen.getByRole("button", {name:/Launch FoodLens Analyzer/}));
  expect((screen.getByRole("radio", {name:"Weight gain"}) as HTMLInputElement).checked).toBe(true);
  await submit();expect((screen.getByRole("radio", {name:"Weight gain"}) as HTMLInputElement).checked).toBe(true);
  expect(fetchMock).toHaveBeenCalledTimes(2);
  view.unmount();render(<App initialRoute="analyzer"/>);await submit();
  expect((screen.getByRole("radio", {name:"Maintain weight"}) as HTMLInputElement).checked).toBe(true);
});

it("omits goals and comparisons for non-food results", () => {
  start({...result,status:"notFoodOrUnclear",identificationConfidence:"low",nutritionEstimate:null,preparationIdea:[]});
  expect(screen.queryByRole("group", {name:"Your goal"})).toBeNull();
  expect(screen.queryByText(GOAL_NOTICE)).toBeNull();
  expect(screen.queryByRole("complementary", {name:"What the colours mean"})).toBeNull();
});

it("supports native radio keyboard navigation with one checked goal and no dropdown", async () => {
  // JSDOM lacks CSS.escape, which user-event uses to find radio-group siblings.
  vi.stubGlobal("CSS", {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "\\$&")});
  const user = userEvent.setup(); start();
  expect(screen.queryByRole("combobox")).toBeNull();
  const group = screen.getByRole("group", {name:"Your goal"});
  const maintain = within(group).getByRole("radio", {name:"Maintain weight"});
  await user.tab(); expect(document.activeElement).toBe(screen.getByRole("button", {name:"Copy results"}));
  await user.tab(); expect(document.activeElement).toBe(maintain);
  await user.keyboard("{ArrowRight}");
  const gain = within(group).getByRole("radio", {name:"Weight gain"});
  expect(document.activeElement).toBe(gain);
  expect((gain as HTMLInputElement).checked).toBe(true);
  expect(gain.closest("label")?.classList.contains("active")).toBe(true);
  expect(within(group).getAllByRole("radio", {checked:true})).toHaveLength(1);
  await user.keyboard("{ArrowRight}");
  expect((within(group).getByRole("radio", {name:"Weight loss"}) as HTMLInputElement).checked).toBe(true);
});
