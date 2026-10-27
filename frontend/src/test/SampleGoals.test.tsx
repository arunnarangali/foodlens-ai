import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SampleMealShowcase } from "../components/LandingSections";
import NutritionCards from "../components/NutritionCards";
import NutritionGoals, { NutritionGoalsProvider } from "../components/NutritionGoals";
import { SAMPLE_NUTRITION } from "../utils/sampleGoals";
import { GOAL_PRESETS, GOAL_SCALE_MAXIMA, SAMPLE_GOAL_NOTICE, type NutritionGoal } from "../utils/goalPresets";
import { NUTRIENTS } from "../utils/nutrition";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const sampleGroup = () => screen.getByRole("group", {name:"Explore a demo goal"});
const chooseSample = (goal: string) => fireEvent.click(within(sampleGroup()).getByRole("radio", {name:goal}));

it.each(Object.keys(GOAL_PRESETS) as NutritionGoal[])("updates every reference for demo goal %s", goal => {
  render(<SampleMealShowcase/>);
  expect((within(sampleGroup()).getByRole("radio", {name:"Maintain weight"}) as HTMLInputElement).checked).toBe(true);
  chooseSample(goal);
  for (const {key, label, unit} of NUTRIENTS) {
    const range = SAMPLE_NUTRITION[key]!;
    const reference = GOAL_PRESETS[goal][key];
    const card = screen.getByText(label).closest("div")!;
    expect(within(card).getByText(`Demo reference: ${reference} ${unit} per meal`)).toBeTruthy();
    const expected = range.max < reference ? "Below" : range.min > reference ? "Above" : "Includes";
    expect(within(card).getByText(`${expected} demo reference`)).toBeTruthy();
    expect(card.classList.contains(expected.toLowerCase())).toBe(true);
    const marker = card.querySelector<HTMLElement>(".nutrition-reference")!;
    expect(parseFloat(marker.style.left)).toBeCloseTo(reference / GOAL_SCALE_MAXIMA[key] / 1.15 * 100);
  }
  expect(screen.getByRole("status").textContent).toContain(goal);
  expect(screen.getByText(SAMPLE_GOAL_NOTICE)).toBeTruthy();
  const legend = screen.getByRole("complementary", {name:"What the colours mean"});
  for (const meaning of ["Above reference", "Below reference", "Range includes reference", "Estimate unknown"]) {
    expect(within(legend).getByText(meaning)).toBeTruthy();
  }
  expect(legend.querySelectorAll('[aria-hidden="true"]')).toHaveLength(4);
  expect(legend.textContent).not.toMatch(/\b(Amber|Blue|Green|Grey)\b/);
});

it("keeps the meal ranges, midpoints and interval positions stable while moving references", () => {
  const { container } = render(<SampleMealShowcase/>);
  const values = () => Array.from(container.querySelectorAll(".nutrition-value,.nutrition-detail:first-of-type"), node => node.textContent);
  const positions = () => Array.from(container.querySelectorAll<HTMLElement>(".nutrition-interval,.nutrition-midpoint"), node => node.style.cssText);
  const initialPositions = positions();
  const initialValues = values();
  const initialMarker = container.querySelector<HTMLElement>(".nutrition-reference")!.style.left;
  for (const goal of Object.keys(GOAL_PRESETS)) {
    chooseSample(goal);
    expect(positions()).toEqual(initialPositions);
    expect(values()).toEqual(initialValues);
    expect(screen.getByText("380–480 kcal")).toBeTruthy();
    expect(screen.getByText("Approximate midpoint: 430 kcal")).toBeTruthy();
  }
  expect(container.querySelector<HTMLElement>(".nutrition-reference")!.style.left).not.toBe(initialMarker);
});

it("keeps sample goals separate from analyzer selection and makes no network requests", () => {
  const fetchMock = vi.fn(); vi.stubGlobal("fetch", fetchMock);
  render(<NutritionGoalsProvider><SampleMealShowcase/><NutritionGoals/></NutritionGoalsProvider>);
  fireEvent.click(within(screen.getByRole("group", {name:"Your goal"})).getByRole("radio", {name:"Weight loss"}));
  chooseSample("Weight gain");
  expect((within(screen.getByRole("group", {name:"Your goal"})).getByRole("radio", {name:"Weight loss"}) as HTMLInputElement).checked).toBe(true);
  fireEvent.click(within(screen.getByRole("group", {name:"Your goal"})).getByRole("radio", {name:"Maintain weight"}));
  expect((within(sampleGroup()).getByRole("radio", {name:"Weight gain"}) as HTMLInputElement).checked).toBe(true);
  expect(fetchMock).not.toHaveBeenCalled();
});

it("preserves unknown handling with explicit demo references", () => {
  render(<NutritionCards nutrition={{...SAMPLE_NUTRITION, proteinGrams:null}} targets={GOAL_PRESETS["Weight loss"]} scaleMaxima={GOAL_SCALE_MAXIMA} demo/>);
  const protein = screen.getByText("Protein").closest("div")!;
  expect(within(protein).getByText("Unknown")).toBeTruthy();
  expect(protein.querySelector(".nutrition-reference")).toBeNull();
  expect(protein.classList.contains("unknown")).toBe(true);
});

it("supports the shared radio keyboard controls without a hidden dropdown", async () => {
  vi.stubGlobal("CSS", {escape: (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "\\$&")});
  const user = userEvent.setup(); render(<SampleMealShowcase/>);
  expect(screen.queryByRole("combobox", {hidden:true})).toBeNull();
  const maintain = within(sampleGroup()).getByRole("radio", {name:"Maintain weight"});
  await user.tab(); expect(document.activeElement).toBe(maintain);
  await user.keyboard("{ArrowRight}");
  const gain = within(sampleGroup()).getByRole("radio", {name:"Weight gain"});
  expect(document.activeElement).toBe(gain);
  expect((gain as HTMLInputElement).checked).toBe(true);
  expect(gain.closest("label")?.classList.contains("active")).toBe(true);
  expect(within(sampleGroup()).getAllByRole("radio", {checked:true})).toHaveLength(1);
  expect(screen.getByRole("status").textContent).toContain("Weight gain");
});
