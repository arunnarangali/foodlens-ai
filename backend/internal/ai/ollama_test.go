package ai

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"foodlens/backend/internal/food"
	"io"
	"net/http"
	"strings"
	"testing"
	"time"
)

type transportFunc func(*http.Request) (*http.Response, error)

func (f transportFunc) RoundTrip(r *http.Request) (*http.Response, error) { return f(r) }

const analysisJSON = `{"status":"analyzed","dishName":"Likely vegetable rice","identificationConfidence":"medium","visibleIngredients":["rice","peas"],"nutritionEstimate":{"servingAssumption":"One bowl","confidence":"low","caloriesKcal":{"min":200,"max":500},"proteinGrams":null,"carbohydrateGrams":{"min":40,"max":80},"fatGrams":null},"preparationIdea":["Cook rice with vegetables."],"uncertainties":["Oils, hidden ingredients and portion size are uncertain."],"disclaimer":"Educational estimate, not medical advice."}`
const unclearJSON = `{"status":"notFoodOrUnclear","dishName":"No clear food visible","identificationConfidence":"low","visibleIngredients":[],"nutritionEstimate":null,"preparationIdea":[],"uncertainties":["Choose a clearer food photo."],"disclaimer":"Educational estimate."}`

func response(status int, body string) *http.Response {
	return &http.Response{StatusCode: status, Header: http.Header{"Content-Type": []string{"application/json"}}, Body: io.NopCloser(strings.NewReader(body))}
}
func envelope(content string) string {
	body, _ := json.Marshal(map[string]any{"done": true, "done_reason": "stop", "message": map[string]string{"role": "assistant", "content": content}})
	return string(body)
}
func TestCloudRequest(t *testing.T) {
	calls := 0
	image := []byte("synthetic food image")
	client := New("https://ollama.com/api", "unit-test-secret", "gemma4:31b", time.Second, transportFunc(func(r *http.Request) (*http.Response, error) {
		calls++
		if r.URL.String() != "https://ollama.com/api/chat" || r.Method != "POST" {
			t.Error("wrong hosted endpoint")
		}
		if r.Header.Get("Authorization") != "Bearer unit-test-secret" || r.Header.Get("Content-Type") != "application/json" {
			t.Error("missing auth or content type")
		}
		if _, ok := r.Context().Deadline(); !ok {
			t.Error("missing context deadline")
		}
		var body map[string]any
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Fatal(err)
		}
		if body["model"] != "gemma4:31b" || body["stream"] != false || body["format"] != nil {
			t.Error("wrong model, streaming or unsupported format")
		}
		messages := body["messages"].([]any)
		system := messages[0].(map[string]any)
		user := messages[1].(map[string]any)
		if system["content"] != Prompt || user["images"].([]any)[0] != base64.StdEncoding.EncodeToString(image) {
			t.Error("incorrect prompt/image")
		}
		if body["options"].(map[string]any)["num_predict"] != float64(4096) {
			t.Error("missing generation limit")
		}
		return response(200, envelope(analysisJSON)), nil
	}))
	result, err := client.Analyze(context.Background(), image, "image/png")
	if err != nil || calls != 1 || result.Status != "analyzed" || result.Disclaimer != food.Disclaimer {
		t.Fatalf("unexpected result: %v", err)
	}
}
func TestCloudFailures(t *testing.T) {
	for _, tc := range []struct {
		name       string
		status     int
		body, code string
	}{
		{"auth", 401, `{"error":"unit-test-secret"}`, "AI_UNAVAILABLE"}, {"forbidden", 403, `{"error":"unit-test-secret"}`, "AI_UNAVAILABLE"}, {"payment", 402, `{"error":"unit-test-secret"}`, "RATE_LIMITED"}, {"quota", 429, `{"error":"unit-test-secret"}`, "RATE_LIMITED"},
		{"model missing", 404, `{"error":"model not found"}`, "AI_UNAVAILABLE"}, {"bad model", 400, `{"error":"invalid model"}`, "AI_UNAVAILABLE"}, {"service", 500, `{"error":"unit-test-secret"}`, "AI_UNAVAILABLE"}, {"timeout", 504, `{}`, "AI_TIMEOUT"},
		{"redirect", 302, ``, "AI_UNAVAILABLE"}, {"malformed envelope", 200, `{`, "AI_INVALID_RESPONSE"}, {"empty", 200, `{}`, "AI_INVALID_RESPONSE"}, {"error envelope", 200, `{"error":"unit-test-secret"}`, "AI_INVALID_RESPONSE"},
		{"truncated", 200, strings.Replace(envelope(analysisJSON), `"done":true`, `"done":false`, 1), "AI_INVALID_RESPONSE"}, {"token limit", 200, strings.Replace(envelope(analysisJSON), `"stop"`, `"length"`, 1), "AI_INVALID_RESPONSE"},
		{"malformed content", 200, envelope(`{`), "AI_INVALID_RESPONSE"}, {"missing fields", 200, envelope(`{"status":"analyzed"}`), "AI_INVALID_RESPONSE"},
		{"invalid range", 200, envelope(strings.Replace(analysisJSON, `"min":200`, `"min":900`, 1)), "AI_INVALID_RESPONSE"},
		{"trailing JSON", 200, envelope(analysisJSON + `{}`), "AI_INVALID_RESPONSE"}, {"model limit", 200, envelope(strings.Repeat("x", food.MaxResponseBytes+1)), "AI_INVALID_RESPONSE"}, {"envelope limit", 200, strings.Repeat("x", MaxEnvelopeBytes+1), "AI_INVALID_RESPONSE"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			calls := 0
			client := New("https://ollama.com/api", "unit-test-secret", "gemma4:31b", time.Second, transportFunc(func(*http.Request) (*http.Response, error) { calls++; return response(tc.status, tc.body), nil }))
			_, err := client.Analyze(context.Background(), []byte("image"), "image/jpeg")
			var provider *food.ProviderError
			if !errors.As(err, &provider) || provider.Code != tc.code || calls != 1 {
				t.Fatalf("unexpected error %v (calls %d)", err, calls)
			}
			if strings.Contains(err.Error(), "unit-test-secret") {
				t.Fatal("secret leaked")
			}
		})
	}
}
func TestNonFood(t *testing.T) {
	client := New("https://ollama.com/api", "unit-test-secret", "gemma4:31b", time.Second, transportFunc(func(*http.Request) (*http.Response, error) { return response(200, envelope(unclearJSON)), nil }))
	result, err := client.Analyze(context.Background(), []byte("image"), "image/webp")
	if err != nil || result.Status != "notFoodOrUnclear" || result.NutritionEstimate != nil || len(result.PreparationIdea) != 0 {
		t.Fatalf("invalid unclear result: %v", err)
	}
}
func TestCancellationAndDeadline(t *testing.T) {
	for _, cancelled := range []bool{false, true} {
		t.Run(map[bool]string{false: "timeout", true: "cancel"}[cancelled], func(t *testing.T) {
			client := New("https://ollama.com/api", "unit-test-secret", "gemma4:31b", 5*time.Millisecond, transportFunc(func(r *http.Request) (*http.Response, error) { <-r.Context().Done(); return nil, r.Context().Err() }))
			ctx, cancel := context.WithCancel(context.Background())
			defer cancel()
			if cancelled {
				cancel()
			}
			_, err := client.Analyze(ctx, []byte("image"), "image/png")
			if cancelled {
				if !errors.Is(err, context.Canceled) {
					t.Fatal("cancellation lost")
				}
			} else {
				var provider *food.ProviderError
				if !errors.As(err, &provider) || provider.Code != "AI_TIMEOUT" {
					t.Fatalf("incorrect timeout: %v", err)
				}
			}
		})
	}
}
func TestNetworkFailure(t *testing.T) {
	client := New("https://ollama.com/api", "unit-test-secret", "gemma4:31b", time.Second, transportFunc(func(*http.Request) (*http.Response, error) { return nil, errors.New("private network detail") }))
	_, err := client.Analyze(context.Background(), []byte("image"), "image/png")
	if err == nil || err.Error() != "AI_UNAVAILABLE" {
		t.Fatalf("unsafe network error: %v", err)
	}
}
func TestNoRedirects(t *testing.T) {
	calls := 0
	client := New("https://ollama.com/api", "unit-test-secret", "gemma4:31b", time.Second, transportFunc(func(r *http.Request) (*http.Response, error) {
		calls++
		res := response(302, "")
		res.Header.Set("Location", "https://evil.example/steal")
		return res, nil
	}))
	_, err := client.Analyze(context.Background(), []byte("image"), "image/png")
	if calls != 1 || err == nil || err.Error() != "AI_UNAVAILABLE" {
		t.Fatal("redirect followed")
	}
}
