import { useState } from 'react';
import type { AnalysisResponse, NutritionRange } from '../types/api';

const amount = (value: NutritionRange | null, unit: string) =>
  value ? `${value.min}–${value.max} ${unit}` : 'Unknown';

function resultText(result: AnalysisResponse): string {
  if (result.status === 'notFoodOrUnclear') {
    return [result.dishName, ...result.uncertainties, result.disclaimer].join('\n');
  }
  const n = result.nutritionEstimate;
  return [
    result.dishName,
    `Identification confidence: ${result.identificationConfidence}`,
    `Likely visible ingredients: ${result.visibleIngredients.join(', ') || 'Unknown'}`,
    n.servingAssumption,
    `Nutrition confidence: ${n.confidence}`,
    `Calories: ${amount(n.caloriesKcal, 'kcal')}`,
    `Protein: ${amount(n.proteinGrams, 'g')}`,
    `Carbohydrates: ${amount(n.carbohydrateGrams, 'g')}`,
    `Fat: ${amount(n.fatGrams, 'g')}`,
    'Preparation idea:', ...result.preparationIdea,
    'Uncertainties:', ...result.uncertainties, result.disclaimer,
  ].join('\n');
}

function CopyResults({ text }: { text: string }) {
  const [status, setStatus] = useState('');
  const [fallback, setFallback] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Results copied.');
      setFallback(false);
    } catch {
      setStatus('Copy unavailable. Select the text below to copy.');
      setFallback(true);
    }
  }
  return <>
    <button type="button" className="secondary" onClick={copy}>Copy results</button>
    <p role="status">{status}</p>
    {fallback && <>
      <label htmlFor="copy-results">Results to copy</label>
      <textarea id="copy-results" readOnly value={text} rows={8}
        onFocus={event => event.target.select()} />
    </>}
  </>;
}

export default function AnalysisResults({ result }: { result: AnalysisResponse }) {
  if (result.status === 'notFoodOrUnclear') {
    return <div>
      <h3>A clearer food photo would help</h3>
      <p>{result.dishName}</p>
      <ul>{result.uncertainties.map((item, index) => <li key={index}>{item}</li>)}</ul>
      <p className="notice">{result.disclaimer}</p>
      <CopyResults text={resultText(result)} />
    </div>;
  }
  const n = result.nutritionEstimate;
  const nutrients = [
    ['Calories', amount(n.caloriesKcal, 'kcal')],
    ['Protein', amount(n.proteinGrams, 'g')],
    ['Carbohydrates', amount(n.carbohydrateGrams, 'g')],
    ['Fat', amount(n.fatGrams, 'g')],
  ];
  return <div>
    <span className="badge">Identification confidence: {result.identificationConfidence}</span>
    <h3>{result.dishName}</h3>
    <h4>Likely visible ingredients</h4>
    {result.visibleIngredients.length > 0
      ? <ul>{result.visibleIngredients.map((item, index) => <li key={index}>{item}</li>)}</ul>
      : <p>Ingredients could not be identified visually.</p>}
    <h4>Approximate nutrition</h4>
    <p>{n.servingAssumption}</p>
    <p className="small">Nutrition confidence: {n.confidence}</p>
    <dl className="nutrition-grid">{nutrients.map(([label, value]) =>
      <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <h4>Assumptions & uncertainty</h4>
    <ul>{result.uncertainties.map((item, index) => <li key={index}>{item}</li>)}</ul>
    <h4>Simple preparation idea</h4>
    <ol>{result.preparationIdea.map((item, index) => <li key={index}>{item}</li>)}</ol>
    <p className="notice">{result.disclaimer}</p>
    <CopyResults text={resultText(result)} />
  </div>;
}
