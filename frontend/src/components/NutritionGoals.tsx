import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import GoalTabs from "./GoalTabs";
import { GOALS, GOAL_PRESETS, type NutritionGoal } from "../utils/goalPresets";

export { GOALS };

type GoalState = { goal: NutritionGoal; select: (goal: NutritionGoal) => void };
const Context = createContext<GoalState | null>(null);

export function NutritionGoalsProvider({ children }: { children: ReactNode }) {
  const [goal, select] = useState<NutritionGoal>("Maintain weight");
  return (
    <Context.Provider value={{ goal, select }}>{children}</Context.Provider>
  );
}

export function useNutritionGoals() {
  const state = useContext(Context);
  if (!state) throw new Error("NutritionGoalsProvider is required");
  return { ...state, references: GOAL_PRESETS[state.goal] };
}

export default function NutritionGoals() {
  const { goal, select } = useNutritionGoals();
  return <GoalTabs label="Your goal" value={goal} onChange={select}
    announcement={`Showing references for ${goal}.`} />;
}
