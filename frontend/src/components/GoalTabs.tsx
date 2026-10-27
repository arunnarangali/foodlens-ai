import { useId } from "react";
import { GOALS, type NutritionGoal } from "../utils/goalPresets";

interface Props {
  label: string;
  value: NutritionGoal;
  onChange: (goal: NutritionGoal) => void;
  announcement?: string;
}

// These choose a comparison value, rather than switch tab panels.
export default function GoalTabs({ label, value, onChange, announcement }: Props) {
  const name = useId();
  return (
    <fieldset className="nutrition-goals">
      <legend>{label}</legend>
      <div className="demo-goal-tabs">
        {GOALS.map(goal => (
          <label key={goal} className={`demo-goal-tab goal-option ${value === goal ? "active" : ""}`}>
            <input className="sr-only" type="radio" name={name} value={goal}
              checked={value === goal} onChange={() => onChange(goal)} />
            {goal}
          </label>
        ))}
      </div>
      {announcement && <span className="sr-only" role="status">{announcement}</span>}
    </fieldset>
  );
}
