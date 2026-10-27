package food

import (
	"strings"
	"testing"
)

const validJSON = `{"status":"analyzed","dishName":"Likely rice","identificationConfidence":"medium","visibleIngredients":["rice"],"nutritionEstimate":{"servingAssumption":"One bowl","caloriesKcal":{"min":200,"max":500},"proteinGrams":null,"carbohydrateGrams":{"min":40,"max":80},"fatGrams":null,"confidence":"low"},"preparationIdea":["Cook rice with vegetables."],"uncertainties":["Oils and portion sizes are uncertain."],"disclaimer":"Educational estimate."}`
const unclearJSON = `{"status":"notFoodOrUnclear","dishName":"No clear food visible","identificationConfidence":"low","visibleIngredients":[],"nutritionEstimate":null,"preparationIdea":[],"uncertainties":["Please select a clearer food photo."],"disclaimer":"Educational estimate."}`

func TestParse(t *testing.T) {
	for _, tc := range []struct {
		name, body string
		valid      bool
	}{
		{"valid", validJSON, true}, {"unclear", unclearJSON, true}, {"equal bounds", strings.Replace(validJSON, `"min":200`, `"min":500`, 1), true},
		{"empty", "", false}, {"malformed", "{", false}, {"trailing", validJSON + "{}", false}, {"negative", strings.Replace(validJSON, `"min":200`, `"min":-1`, 1), false}, {"reversed", strings.Replace(validJSON, `"min":200`, `"min":600`, 1), false},
		{"missing bound", strings.Replace(validJSON, `"min":200,`, "", 1), false}, {"null bound", strings.Replace(validJSON, `"min":200`, `"min":null`, 1), false}, {"missing nutrient", strings.Replace(validJSON, `"proteinGrams":null,`, "", 1), false},
		{"bad confidence", strings.Replace(validJSON, `"medium"`, `"certain"`, 1), false}, {"unknown property", strings.Replace(validJSON, `"status":`, `"extra":1,"status":`, 1), false},
		{"missing disclaimer", strings.Replace(validJSON, `,"disclaimer":"Educational estimate."`, "", 1), false}, {"missing assumption", strings.Replace(validJSON, `"One bowl"`, `""`, 1), false}, {"null ingredients", strings.Replace(validJSON, `["rice"]`, `null`, 1), false},
		{"no uncertainty", strings.Replace(validJSON, `["Oils and portion sizes are uncertain."]`, `[]`, 1), false}, {"unclear with advice", strings.Replace(unclearJSON, `"preparationIdea":[]`, `"preparationIdea":["Cook it"]`, 1), false},
		{"too much text", strings.Replace(validJSON, `Likely rice`, strings.Repeat("x", 1001), 1), false}, {"too many steps", strings.Replace(validJSON, `["Cook rice with vegetables."]`, `["a","b","c","d","e","f"]`, 1), false}, {"oversized", strings.Repeat("x", MaxResponseBytes+1), false},
	} {
		t.Run(tc.name, func(t *testing.T) {
			result, err := Parse([]byte(tc.body))
			if (err == nil) != tc.valid {
				t.Fatalf("unexpected result %v", err)
			}
			if err == nil && result.Disclaimer != Disclaimer {
				t.Fatal("untrusted disclaimer")
			}
		})
	}
}

func TestFormattingWrappers(t *testing.T) {
	for _, value := range []string{validJSON, " \n" + validJSON + "\n ", "\xef\xbb\xbf" + validJSON, "```json\n" + validJSON + "\n```", "```\r\n" + validJSON + "\r\n```"} {
		result, err := Parse([]byte(value))
		if err != nil || result.Status != "analyzed" {
			t.Fatalf("valid formatting wrapper rejected: %v", err)
		}
	}
	for _, value := range []string{"Here is the result:\n" + validJSON, "```json\n" + validJSON + "\n```\nmore text", "```json\n" + validJSON, "```json\n" + validJSON + "\n```\n```json\n" + validJSON + "\n```", "```json\n" + strings.Replace(validJSON, `"min":200`, `"min":900`, 1) + "\n```"} {
		if _, err := Parse([]byte(value)); err == nil {
			t.Fatal("unsafe/malformed result accepted")
		}
	}
}
func TestSafeValidationReasons(t *testing.T) {
	for _, tc := range []struct{ body, reason, field string }{
		{"{private-model-content", "invalid_json", ""},
		{strings.Replace(validJSON, `"dishName":"Likely rice",`, "", 1), "missing_field", "dishName"},
		{strings.Replace(validJSON, `"min":200`, `"min":"private-model-content"`, 1), "invalid_type", ""},
		{strings.Replace(validJSON, `"min":200`, `"min":900`, 1), "invalid_range", "nutritionEstimate.caloriesKcal"},
		{strings.Replace(validJSON, `"medium"`, `"private-model-content"`, 1), "invalid_value", "identificationConfidence"},
		{strings.Repeat("x", MaxResponseBytes+1), "output_too_large", ""},
	} {
		_, err := Parse([]byte(tc.body))
		safe, ok := err.(*ValidationError)
		if !ok || safe.Reason != tc.reason || safe.Field != tc.field {
			t.Fatalf("wrong diagnostic: %v", err)
		}
		if strings.Contains(err.Error(), "private-model-content") {
			t.Fatal("model content leaked")
		}
	}
}
