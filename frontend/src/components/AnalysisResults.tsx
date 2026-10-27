import { useState } from "react";
import type { AnalysisResponse } from "../types/api";
import NutritionGoals, { useNutritionGoals } from "./NutritionGoals";
import { GOAL_NOTICE, GOAL_SCALE_MAXIMA } from "../utils/goalPresets";
import NutritionCards from "./NutritionCards";
import {
  NUTRIENTS,
  nutritionText,
  type NutritionTargets,
} from "../utils/nutrition";

function resultText(
  result: AnalysisResponse,
  goal: string,
  references: NutritionTargets,
): string {
  if (result.status === "notFoodOrUnclear") {
    return [result.dishName, ...result.uncertainties, result.disclaimer].join(
      "\n",
    );
  }
  const n = result.nutritionEstimate;
  return [
    result.dishName,
    `Identification confidence: ${result.identificationConfidence}`,
    `Likely visible ingredients: ${result.visibleIngredients.join(", ") || "Unknown"}`,
    n.servingAssumption,
    `Nutrition confidence: ${n.confidence}`,
    `Selected goal: ${goal}`,
    `Illustrative per-meal goal references: ${NUTRIENTS.map(({ key, label, unit }) => `${label} ${references[key]} ${unit}`).join(", ")}`,
    ...NUTRIENTS.map(
      ({ key, label, unit }) =>
        `${label}: ${nutritionText(n[key], references[key], unit, true)}`,
    ),
    GOAL_NOTICE,
    "Preparation idea:",
    ...result.preparationIdea,
    "Uncertainties:",
    ...result.uncertainties,
    result.disclaimer,
  ].join("\n");
}

function ClipboardIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg
        className="copy-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  return (
    <svg
      className="copy-icon"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function CopyResults({ text }: { text: string }) {
  const [status, setStatus] = useState("");
  const [fallback, setFallback] = useState(false);
  const isCopied = status === "Results copied.";

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Results copied.");
      setFallback(false);
    } catch {
      setStatus("Copy unavailable. Select the text below to copy.");
      setFallback(true);
    }
  }

  return (
    <div className="copy-results-container">
      <div className="copy-action-wrapper">
        <button
          type="button"
          className={`copy-btn secondary ${isCopied ? "copied" : ""}`}
          onClick={copy}
          aria-label="Copy results"
          title={isCopied ? "Results copied" : "Copy results"}
        >
          <ClipboardIcon copied={isCopied} />
        </button>
        <p role="status" className="copy-status sr-only">
          {status}
        </p>
      </div>
      {fallback && (
        <div className="copy-fallback-area">
          <label htmlFor="copy-results">Results to copy</label>
          <textarea
            id="copy-results"
            readOnly
            value={text}
            rows={8}
            onFocus={(event) => event.target.select()}
          />
        </div>
      )}
    </div>
  );
}

export default function AnalysisResults({
  result,
}: {
  result: AnalysisResponse;
}) {
  const { goal, references } = useNutritionGoals();
  if (result.status === "notFoodOrUnclear") {
    return (
      <div className="analysis-result">
        <div className="analysis-summary">
          <div className="results-header-bar">
            <span className="badge">Photo check</span>
            <CopyResults
              key={`${goal}-${JSON.stringify(references)}`}
              text={resultText(result, goal, references)}
            />
          </div>
          <h3>A clearer food photo would help</h3>
        </div>
        <div className="analysis-scroll-body">
          <p>{result.dishName}</p>
          <ul>
            {result.uncertainties.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="notice">{result.disclaimer}</p>
        </div>
      </div>
    );
  }
  const n = result.nutritionEstimate;
  return (
    <div className="analysis-result">
      <div className="analysis-summary">
        <div className="results-header-bar">
          <span className="badge">
            Identification confidence: {result.identificationConfidence}
          </span>
          <CopyResults
            key={`${goal}-${JSON.stringify(references)}`}
            text={resultText(result, goal, references)}
          />
        </div>
        <h3>{result.dishName}</h3>
      </div>
      <div className="analysis-scroll-body">
        <h4>Likely visible ingredients</h4>
        {result.visibleIngredients.length > 0 ? (
          <ul>
            {result.visibleIngredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <p>Ingredients could not be identified visually.</p>
        )}
        <h4>Approximate nutrition</h4>
        <p>{n.servingAssumption}</p>
        <p className="small">Nutrition confidence: {n.confidence}</p>
        <NutritionGoals />
        <NutritionCards
          nutrition={n}
          targets={references}
          scaleMaxima={GOAL_SCALE_MAXIMA}
          goal
        />
        <h4>Assumptions & uncertainty</h4>
        <ul>
          {result.uncertainties.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <h4>Simple preparation idea</h4>
        <ol>
          {result.preparationIdea.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
        <p className="notice">{result.disclaimer}</p>
      </div>
    </div>
  );
}
