package food

import (
	"bytes"
	"encoding/json"
	"errors"
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

func decode(data []byte, value any, required ...string) error {
	var fields map[string]json.RawMessage
	if err := json.Unmarshal(data, &fields); err != nil {
		return err
	}
	for _, key := range required {
		raw, ok := fields[key]
		if !ok {
			return errors.New("missing field")
		}
		if bytes.Equal(bytes.TrimSpace(raw), []byte("null")) && key != "nutritionEstimate" && key != "caloriesKcal" && key != "proteinGrams" && key != "carbohydrateGrams" && key != "fatGrams" {
			return errors.New("unexpected null")
		}
	}
	decoder := json.NewDecoder(bytes.NewReader(data))
	decoder.DisallowUnknownFields()
	return decoder.Decode(value)
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
	bad := errors.New("invalid analysis")
	if !text(r.DishName) || !confidence(r.IdentificationConfidence) || !texts(r.VisibleIngredients, 0, 30) || !texts(r.Uncertainties, 1, 10) || !text(r.Disclaimer) {
		return bad
	}
	if r.Status == "notFoodOrUnclear" {
		if r.IdentificationConfidence != "low" || len(r.VisibleIngredients) != 0 || r.NutritionEstimate != nil || r.PreparationIdea == nil || len(r.PreparationIdea) != 0 {
			return bad
		}
		return nil
	}
	if r.Status != "analyzed" || !texts(r.PreparationIdea, 1, 5) || r.NutritionEstimate == nil {
		return bad
	}
	n := r.NutritionEstimate
	if !text(n.ServingAssumption) || !confidence(n.Confidence) {
		return bad
	}
	for _, v := range []*Range{n.CaloriesKcal, n.ProteinGrams, n.CarbohydrateGrams, n.FatGrams} {
		if v != nil && (math.IsNaN(v.Min) || math.IsNaN(v.Max) || math.IsInf(v.Min, 0) || math.IsInf(v.Max, 0) || v.Min < 0 || v.Max < v.Min) {
			return bad
		}
	}
	return nil
}

func Parse(data []byte) (Result, error) {
	var result Result
	if len(data) > MaxResponseBytes {
		return result, errors.New("analysis too long")
	}
	if err := decode(data, &result, "status", "dishName", "identificationConfidence", "visibleIngredients", "nutritionEstimate", "preparationIdea", "uncertainties", "disclaimer"); err != nil {
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
