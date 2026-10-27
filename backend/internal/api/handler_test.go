package api

import (
	"bytes"
	"context"
	"encoding/json"
	"foodlens/backend/internal/food"
	"foodlens/backend/internal/validation"
	"image"
	"image/jpeg"
	"image/png"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

func TestHealth(t *testing.T) {
	w := httptest.NewRecorder()
	NewHandler(fakeAnalyzer{}, 120*time.Second).ServeHTTP(w, httptest.NewRequest("GET", "/api/health", nil))
	if w.Code != 200 || w.Body.String() != "{\"status\":\"ok\"}\n" || w.Header().Get("Content-Type") != "application/json" {
		t.Fatalf("unexpected response: %d %s", w.Code, w.Body.String())
	}
}
func TestUploads(t *testing.T) {
	var pngImage, jpegImage bytes.Buffer
	_ = png.Encode(&pngImage, image.NewRGBA(image.Rect(0, 0, 2, 2)))
	_ = jpeg.Encode(&jpegImage, image.NewRGBA(image.Rect(0, 0, 2, 2)), nil)
	// Minimal WebP RIFF header for the content-sniffing boundary (not a decoder test).
	webp := []byte("RIFF\x10\x00\x00\x00WEBPVP8 \x00\x00\x00\x00")
	cases := []struct {
		name      string
		data      []byte
		field     string
		duplicate bool
		status    int
		code      string
	}{
		{"png", pngImage.Bytes(), "image", false, 200, ""},
		{"jpeg", jpegImage.Bytes(), "image", false, 200, ""},
		{"webp signature", webp, "image", false, 200, ""},
		{"missing", nil, "", false, 400, "INVALID_IMAGE"},
		{"empty", nil, "image", false, 400, "INVALID_IMAGE"},
		{"spoofed extension", []byte("not an image"), "image", false, 415, "UNSUPPORTED_MEDIA_TYPE"},
		{"oversize", bytes.Repeat([]byte("x"), validation.MaxImageBytes+1), "image", false, 413, "IMAGE_TOO_LARGE"},
		{"exact limit", append(pngImage.Bytes(), make([]byte, validation.MaxImageBytes-pngImage.Len())...), "image", false, 200, ""},
		{"wrong field", pngImage.Bytes(), "photo", false, 400, "INVALID_IMAGE"},
		{"duplicate", pngImage.Bytes(), "image", true, 400, "INVALID_IMAGE"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			var body bytes.Buffer
			writer := multipart.NewWriter(&body)
			if tc.field != "" {
				part, _ := writer.CreateFormFile(tc.field, "photo.png")
				_, _ = part.Write(tc.data)
			}
			if tc.duplicate {
				part, _ := writer.CreateFormFile("image", "another.png")
				_, _ = part.Write(tc.data)
			}
			_ = writer.Close()
			r := httptest.NewRequest("POST", "/api/analyze", &body)
			r.Header.Set("Content-Type", writer.FormDataContentType())
			w := httptest.NewRecorder()
			NewHandler(fakeAnalyzer{}, 120*time.Second).ServeHTTP(w, r)
			if w.Code != tc.status {
				t.Fatalf("got %d: %s", w.Code, w.Body.String())
			}
			var got struct {
				Status string `json:"status"`
				Error  struct {
					Code string `json:"code"`
				} `json:"error"`
			}
			if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
				t.Fatal(err)
			}
			if tc.status == 200 && got.Status != "notFoodOrUnclear" {
				t.Fatal("success must return analyzer result")
			}
			if tc.code != "" && got.Error.Code != tc.code {
				t.Fatalf("wrong error code: %s", got.Error.Code)
			}
		})
	}
}
func TestProtocolErrors(t *testing.T) {
	for _, tc := range []struct {
		method, path, contentType, body string
		status                          int
	}{
		{"POST", "/api/health", "", "", 405}, {"GET", "/api/analyze", "", "", 405},
		{"GET", "/missing", "", "", 404}, {"POST", "/api/analyze", "application/json", "{}", 400},
		{"POST", "/api/analyze", "multipart/form-data; boundary=broken", "broken", 400},
		{"POST", "/api/analyze", "multipart/form-data", "", 400},
	} {
		t.Run(tc.method+tc.path+tc.contentType, func(t *testing.T) {
			r := httptest.NewRequest(tc.method, tc.path, bytes.NewBufferString(tc.body))
			r.Header.Set("Content-Type", tc.contentType)
			w := httptest.NewRecorder()
			NewHandler(fakeAnalyzer{}, 120*time.Second).ServeHTTP(w, r)
			if w.Code != tc.status {
				t.Fatalf("got %d, want %d", w.Code, tc.status)
			}
			if !json.Valid(w.Body.Bytes()) {
				t.Fatal("error must be JSON")
			}
		})
	}
}

type fakeAnalyzer struct {
	run func(context.Context, []byte, string) (food.Result, error)
}

func (f fakeAnalyzer) Analyze(ctx context.Context, data []byte, mime string) (food.Result, error) {
	if f.run != nil {
		return f.run(ctx, data, mime)
	}
	return food.Result{Status: "notFoodOrUnclear", DishName: "No clear food visible", IdentificationConfidence: "low", VisibleIngredients: []string{}, PreparationIdea: []string{}, Uncertainties: []string{"Please select a clearer food photo."}, Disclaimer: food.Disclaimer}, nil
}

func uploadRequest(t *testing.T) *http.Request {
	t.Helper()
	var photo, body bytes.Buffer
	_ = png.Encode(&photo, image.NewRGBA(image.Rect(0, 0, 1, 1)))
	writer := multipart.NewWriter(&body)
	part, _ := writer.CreateFormFile("image", "food.png")
	_, _ = part.Write(photo.Bytes())
	_ = writer.Close()
	r := httptest.NewRequest("POST", "/api/analyze", &body)
	r.Header.Set("Content-Type", writer.FormDataContentType())
	return r
}

func TestProviderErrors(t *testing.T) {
	for _, tc := range []struct {
		code   string
		status int
	}{{"RATE_LIMITED", 429}, {"AI_UNAVAILABLE", 503}, {"AI_MODEL_UNAVAILABLE", 503}, {"AI_TIMEOUT", 504}, {"AI_INVALID_RESPONSE", 502}, {"private-key", 503}} {
		t.Run(tc.code, func(t *testing.T) {
			called := false
			handler := NewHandler(fakeAnalyzer{run: func(ctx context.Context, data []byte, mime string) (food.Result, error) {
				called = true
				if mime != "image/png" || len(data) == 0 {
					t.Error("invalid provider input")
				}
				if _, ok := ctx.Deadline(); !ok {
					t.Error("missing deadline")
				}
				return food.Result{}, &food.ProviderError{Code: tc.code}
			}}, time.Second)
			w := httptest.NewRecorder()
			handler.ServeHTTP(w, uploadRequest(t))
			if !called || w.Code != tc.status || strings.Contains(w.Body.String(), "private-key") {
				t.Fatalf("unsafe response %d %s", w.Code, w.Body.String())
			}
		})
	}
}

func TestInvalidUploadNeverCallsProvider(t *testing.T) {
	handler := NewHandler(fakeAnalyzer{run: func(context.Context, []byte, string) (food.Result, error) {
		t.Fatal("provider called")
		return food.Result{}, nil
	}}, time.Second)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, httptest.NewRequest("POST", "/api/analyze", strings.NewReader("bad")))
	if w.Code != 400 {
		t.Fatal(w.Code)
	}
}

func TestAnalyzedAndInvalidProviderResult(t *testing.T) {
	for _, invalid := range []bool{false, true} {
		t.Run(map[bool]string{false: "valid", true: "invalid"}[invalid], func(t *testing.T) {
			result := food.Result{Status: "analyzed", DishName: "Likely rice", IdentificationConfidence: "low", VisibleIngredients: []string{"rice"}, NutritionEstimate: &food.Nutrition{ServingAssumption: "One bowl", Confidence: "low", CaloriesKcal: &food.Range{Min: 200, Max: 500}}, PreparationIdea: []string{"Cook rice."}, Uncertainties: []string{"Oil and portion size are uncertain."}, Disclaimer: "Provider disclaimer"}
			if invalid {
				result.NutritionEstimate.CaloriesKcal.Min = 900
			}
			handler := NewHandler(fakeAnalyzer{run: func(context.Context, []byte, string) (food.Result, error) { return result, nil }}, time.Second)
			w := httptest.NewRecorder()
			handler.ServeHTTP(w, uploadRequest(t))
			if invalid {
				if w.Code != 502 {
					t.Fatal(w.Code)
				}
				return
			}
			var got food.Result
			if err := json.Unmarshal(w.Body.Bytes(), &got); err != nil {
				t.Fatal(err)
			}
			if w.Code != 200 || got.Disclaimer != food.Disclaimer || got.NutritionEstimate.ProteinGrams != nil {
				t.Fatalf("unexpected response %s", w.Body.String())
			}
		})
	}
}

func TestOverallTimeout(t *testing.T) {
	done := make(chan struct{})
	handler := NewHandler(fakeAnalyzer{run: func(ctx context.Context, _ []byte, _ string) (food.Result, error) {
		defer close(done)
		<-ctx.Done()
		return food.Result{}, ctx.Err()
	}}, -15*time.Second+10*time.Millisecond)
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, uploadRequest(t))
	if w.Code != 503 || w.Header().Get("Content-Type") != "application/json" || !strings.Contains(w.Body.String(), "REQUEST_TIMEOUT") {
		t.Fatalf("unexpected timeout %d %s", w.Code, w.Body.String())
	}
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("cancellation not propagated")
	}
}
