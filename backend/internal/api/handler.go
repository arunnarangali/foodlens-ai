package api

import (
	"context"
	"encoding/json"
	"errors"
	"foodlens/backend/internal/food"
	"foodlens/backend/internal/validation"
	"net/http"
	"time"
)

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
func fail(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]any{"error": map[string]string{"code": code, "message": message}})
}

type Analyzer interface {
	Analyze(context.Context, []byte, string) (food.Result, error)
}

func NewHandler(analyzer Analyzer, providerTimeout time.Duration) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.Header().Set("Allow", "GET")
			fail(w, 405, "METHOD_NOT_ALLOWED", "Use GET.")
			return
		}
		writeJSON(w, 200, map[string]string{"status": "ok"})
	})
	mux.HandleFunc("/api/analyze", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", "POST")
			fail(w, 405, "METHOD_NOT_ALLOWED", "Use POST.")
			return
		}
		data, uploadErr := validation.Read(w, r)
		if uploadErr != nil {
			fail(w, uploadErr.Status, uploadErr.Code, uploadErr.Message)
			return
		}
		result, err := analyzer.Analyze(r.Context(), data, http.DetectContentType(data))
		if err != nil {
			if errors.Is(err, context.Canceled) {
				return
			}
			code := "AI_UNAVAILABLE"
			status := 503
			message := "Analysis is unavailable. Please try again later."
			var provider *food.ProviderError
			if errors.As(err, &provider) {
				code = provider.Code
			}
			if errors.Is(err, context.DeadlineExceeded) {
				code = "AI_TIMEOUT"
			}
			switch code {
			case "AI_TIMEOUT":
				status = 504
				message = "Analysis timed out. Please try again."
			case "RATE_LIMITED":
				status = 429
				message = "Analysis usage is currently limited. Please try again later."
			case "AI_INVALID_RESPONSE":
				status = 502
				message = "The analysis could not be read safely. Please try again."
			default:
				code = "AI_UNAVAILABLE"
			}
			fail(w, status, code, message)
			return
		}
		if err := result.Validate(); err != nil {
			fail(w, 502, "AI_INVALID_RESPONSE", "The analysis could not be read safely. Please try again.")
			return
		}
		result.Disclaimer = food.Disclaimer
		writeJSON(w, 200, result)
	})
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) { fail(w, 404, "NOT_FOUND", "Endpoint not found.") })
	timed := http.TimeoutHandler(mux, providerTimeout+15*time.Second, `{"error":{"code":"REQUEST_TIMEOUT","message":"Request timed out."}}`)
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		timed.ServeHTTP(jsonWriter{w}, r)
	})
}

// TimeoutHandler defaults to HTML headers; this API always returns JSON.
type jsonWriter struct{ http.ResponseWriter }

func (w jsonWriter) WriteHeader(status int) {
	w.Header().Set("Content-Type", "application/json")
	w.ResponseWriter.WriteHeader(status)
}
