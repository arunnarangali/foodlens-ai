package food

import (
	"bytes"
	"encoding/json"
	"math"
	"strings"
	"unicode/utf8"
)

const Disclaimer = "Nutrition is a rough visual estimate, not a measured value. FoodLens is educational, not medical or dietetic advice."
const MaxResponseBytes = 32 * 1024

type Range struct {
	Min float64 `json:"min"`
	Max float64 `json:"max"`
}
type Nutrition struct {
	ServingAssumption string `json:"servingAssumption"`
	CaloriesKcal      *Range `json:"caloriesKcal"`
	ProteinGrams      *Range `json:"proteinGrams"`
	CarbohydrateGrams *Range `json:"carbohydrateGrams"`
	FatGrams          *Range `json:"fatGrams"`
	Confidence        string `json:"confidence"`
}
type Result struct {
	Status                   string     `json:"status"`
	DishName                 string     `json:"dishName"`
	IdentificationConfidence string     `json:"identificationConfidence"`
	VisibleIngredients       []string   `json:"visibleIngredients"`
	NutritionEstimate        *Nutrition `json:"nutritionEstimate"`
	PreparationIdea          []string   `json:"preparationIdea"`
	Uncertainties            []string   `json:"uncertainties"`
	Disclaimer               string     `json:"disclaimer"`
}

// ValidationError exposes controlled metadata, never model content or decoder messages.
type ValidationError struct{ Reason, Field string }

func (e *ValidationError) Error() string { return e.Reason }
func invalid(reason, field string) error { return &ValidationError{Reason: reason, Field: field} }

func decode(data []byte, value any, required ...string) error {
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		if !json.Valid(data) {
			return invalid("invalid_json", "")
		}
		return invalid("invalid_type", "")
	}
	if fields == nil {
		return invalid("invalid_type", "")
	}
	for _, key := range required {
		raw, ok := fields[key]
		if !ok {
			return invalid("missing_field", key)
		}
		if bytes.Equal(bytes.TrimSpace(raw), []byte("null")) && key != "nutritionEstimate" && key != "caloriesKcal" && key != "proteinGrams" && key != "carbohydrateGrams" && key != "fatGrams" {
			return invalid("invalid_type", key)
		}
	}
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(value); err != nil {
		if safe, ok := err.(*ValidationError); ok {
			return safe
		}
		return invalid("invalid_type", "")
	}
	return nil
}

func (r *Range) UnmarshalJSON(data []byte) error {
	type plain Range
	return decode(data, (*plain)(r), "min", "max")
}

func (n *Nutrition) UnmarshalJSON(data []byte) error {
	type plain Nutrition
	return decode(data, (*plain)(n), "servingAssumption", "caloriesKcal", "proteinGrams", "carbohydrateGrams", "fatGrams", "confidence")
}

func text(s string) bool { return strings.TrimSpace(s) != "" && utf8.RuneCountInString(s) <= 1000 }

func confidence(s string) bool { return s == "low" || s == "medium" || s == "high" }

func texts(list []string, min, max int) bool {
	if list == nil || len(list) < min || len(list) > max {
		return false
	}
	for _, s := range list {
		if !text(s) {
			return false
		}
	}
	return true
}

func (r Result) Validate() error {
	if !text(r.DishName) {
		return invalid("invalid_value", "dishName")
	}
	if !confidence(r.IdentificationConfidence) {
		return invalid("invalid_value", "identificationConfidence")
	}
	if !texts(r.VisibleIngredients, 0, 30) {
		return invalid("invalid_value", "visibleIngredients")
	}
	if !texts(r.Uncertainties, 1, 10) {
		return invalid("invalid_value", "uncertainties")
	}
	if !text(r.Disclaimer) {
		return invalid("invalid_value", "disclaimer")
	}
	if r.Status == "notFoodOrUnclear" {
		if r.IdentificationConfidence != "low" || len(r.VisibleIngredients) != 0 || r.NutritionEstimate != nil || r.PreparationIdea == nil || len(r.PreparationIdea) != 0 {
			return invalid("invalid_value", "status")
		}
		return nil
	}
	if r.Status != "analyzed" {
		return invalid("invalid_value", "status")
	}
	if !texts(r.PreparationIdea, 1, 5) {
		return invalid("invalid_value", "preparationIdea")
	}
	if r.NutritionEstimate == nil {
		return invalid("invalid_type", "nutritionEstimate")
	}
	n := r.NutritionEstimate
	if !text(n.ServingAssumption) {
		return invalid("invalid_value", "nutritionEstimate.servingAssumption")
	}
	if !confidence(n.Confidence) {
		return invalid("invalid_value", "nutritionEstimate.confidence")
	}
	for _, nutrient := range []struct {
		field string
		value *Range
	}{
		{"nutritionEstimate.caloriesKcal", n.CaloriesKcal}, {"nutritionEstimate.proteinGrams", n.ProteinGrams}, {"nutritionEstimate.carbohydrateGrams", n.CarbohydrateGrams}, {"nutritionEstimate.fatGrams", n.FatGrams},
	} {
		v := nutrient.value
		if v != nil && (math.IsNaN(v.Min) || math.IsNaN(v.Max) || math.IsInf(v.Min, 0) || math.IsInf(v.Max, 0) || v.Min < 0 || v.Max < v.Min) {
			return invalid("invalid_range", nutrient.field)
		}
	}
	return nil
}

// Normalize only removes a whole-response formatting wrapper; it never repairs JSON.
func normalize(data []byte) []byte {
	data = bytes.TrimSpace(data)
	data = bytes.TrimSpace(bytes.TrimPrefix(data, []byte("\xef\xbb\xbf")))
	if !bytes.HasPrefix(data, []byte("```")) {
		return data
	}
	lines := bytes.Split(data, []byte("\n"))
	if len(lines) < 3 {
		return data
	}
	opening := strings.TrimSpace(string(lines[0]))
	if (opening != "```" && opening != "```json") || strings.TrimSpace(string(lines[len(lines)-1])) != "```" {
		return data
	}
	return bytes.TrimSpace(bytes.Join(lines[1:len(lines)-1], []byte("\n")))
}

func Parse(data []byte) (Result, error) {
	var result Result
	if len(data) > MaxResponseBytes {
		return result, invalid("output_too_large", "")
	}
	if err := decode(normalize(data), &result, "status", "dishName", "identificationConfidence", "visibleIngredients", "nutritionEstimate", "preparationIdea", "uncertainties", "disclaimer"); err != nil {
		return Result{}, err
	}
	if err := result.Validate(); err != nil {
		return Result{}, err
	}
	result.Disclaimer = Disclaimer
	return result, nil
}

// ProviderError carries only a controlled application code, never provider content.
type ProviderError struct{ Code string }

func (e *ProviderError) Error() string { return e.Code }
