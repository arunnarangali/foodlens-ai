package ai

import (
	"context"
	"encoding/json"
	"errors"
	"foodlens/backend/internal/food"
	"net/http"
	"strings"
	"testing"
	"time"
)

const visionListing = `{"models":[{"name":"text-only","capabilities":["completion"]},{"name":"gemma4:31b","capabilities":["vision","completion"]}]}`

func TestDiscoveryChoosesOnlyApprovedVisionModel(t *testing.T) {
	calls := []string{}
	client := NewWithDiscovery("https://ollama.com/api", "unit-test-key", "auto", []string{"text-only", "gemma4:31b"}, time.Second, transportFunc(func(r *http.Request) (*http.Response, error) {
		calls = append(calls, r.Method+" "+r.URL.Path)
		if r.Header.Get("Authorization") != "Bearer unit-test-key" {
			t.Error("missing private credential")
		}
		if r.Method == "GET" {
			return response(200, visionListing), nil
		}
		var body chatRequest
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			t.Fatal(err)
		}
		if body.Model != "gemma4:31b" {
			t.Error("wrong selected model")
		}
		return response(200, envelope(analysisJSON)), nil
	}))
	result, err := client.Analyze(context.Background(), []byte("image"), "image/png")
	if err != nil || result.Status != "analyzed" || strings.Join(calls, ",") != "GET /api/tags,POST /api/chat" {
		t.Fatalf("unexpected discovery flow: %v", err)
	}
}
func TestDiscoveryFailsClosed(t *testing.T) {
	for _, tc := range []struct {
		name, preferred string
		allowed         []string
		status          int
		body, code      string
	}{
		{"no approval", "auto", nil, 200, visionListing, "AI_MODEL_UNAVAILABLE"},
		{"default unavailable", "auto", []string{"gemma4:31b"}, 200, `{"models":[{"name":"expensive-vision","capabilities":["vision","completion"]}]}`, "AI_MODEL_UNAVAILABLE"},
		{"no vision", "auto", []string{"gemma4:31b"}, 200, `{"models":[{"name":"gemma4:31b","capabilities":["completion"]}]}`, "AI_MODEL_UNAVAILABLE"},
		{"unknown capabilities", "auto", []string{"gemma4:31b"}, 200, `{"models":[{"name":"gemma4:31b"}]}`, "AI_MODEL_UNAVAILABLE"},
		{"explicit unapproved", "other", []string{"gemma4:31b"}, 200, visionListing, "AI_MODEL_UNAVAILABLE"},
		{"auth", "auto", []string{"gemma4:31b"}, 401, `{"error":"private-provider-detail"}`, "AI_UNAVAILABLE"},
		{"quota", "auto", []string{"gemma4:31b"}, 429, `{}`, "RATE_LIMITED"},
		{"deadline", "auto", []string{"gemma4:31b"}, 504, `{}`, "AI_TIMEOUT"},
		{"invalid listing", "auto", []string{"gemma4:31b"}, 200, `{`, "AI_MODEL_UNAVAILABLE"},
		{"large listing", "auto", []string{"gemma4:31b"}, 200, strings.Repeat("x", MaxEnvelopeBytes+1), "AI_MODEL_UNAVAILABLE"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			client := NewWithDiscovery("https://ollama.com/api", "unit-test-key", tc.preferred, tc.allowed, time.Second, transportFunc(func(r *http.Request) (*http.Response, error) {
				if r.Method != "GET" {
					t.Fatal("inference attempted without approved listing")
				}
				return response(tc.status, tc.body), nil
			}))
			_, err := client.Analyze(context.Background(), []byte("image"), "image/png")
			var provider *food.ProviderError
			if !errors.As(err, &provider) || provider.Code != tc.code {
				t.Fatalf("unexpected error %v", err)
			}
		})
	}
}
func TestDiscoveryDoesNotRetryAnotherModelAfterQuotaError(t *testing.T) {
	calls := 0
	client := NewWithDiscovery("https://ollama.com/api", "unit-test-key", "auto", []string{"gemma4:31b", "other"}, time.Second, transportFunc(func(r *http.Request) (*http.Response, error) {
		calls++
		if r.Method == "GET" {
			return response(200, visionListing), nil
		}
		return response(429, `{}`), nil
	}))
	_, err := client.Analyze(context.Background(), []byte("image"), "image/png")
	if err == nil || err.Error() != "RATE_LIMITED" || calls != 2 {
		t.Fatal("unexpected fallback or missing rate error")
	}
}
func TestDiscoveryCancellation(t *testing.T) {
	client := NewWithDiscovery("https://ollama.com/api", "unit-test-key", "auto", []string{"gemma4:31b"}, time.Second, transportFunc(func(r *http.Request) (*http.Response, error) { <-r.Context().Done(); return nil, r.Context().Err() }))
	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	_, err := client.Analyze(ctx, []byte("image"), "image/png")
	if !errors.Is(err, context.Canceled) {
		t.Fatal("discovery cancellation lost")
	}
}
