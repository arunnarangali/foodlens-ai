package web

import (
	"context"
	"encoding/json"
	"foodlens/backend/internal/api"
	"foodlens/backend/internal/food"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"testing/fstest"
	"time"
)

type noInference struct{}

func (noInference) Analyze(context.Context, []byte, string) (food.Result, error) {
	panic("static/health tests must never call inference")
}
func TestStaticAndAPIRouting(t *testing.T) {
	assets := fstest.MapFS{
		"index.html":     {Data: []byte(`<!doctype html><html><script src="/assets/app.js"></script></html>`)},
		"assets/app.js":  {Data: []byte(`console.log("FoodLens")`)},
		".env":           {Data: []byte("private-file-must-never-be-served")},
		"assets/.hidden": {Data: []byte("private-file-must-never-be-served")},
	}
	handler := NewHandler(api.NewHandler(noInference{}, time.Second), assets)
	for _, tc := range []struct {
		method, path string
		status       int
		contains     string
	}{
		{"GET", "/", 200, "<!doctype html>"}, {"GET", "/assets/app.js", 200, "FoodLens"},
		{"HEAD", "/", 200, ""}, {"GET", "/assets/missing.js", 404, ""}, {"GET", "/assets", 404, ""},
		{"GET", "/.env", 404, ""}, {"GET", "/assets/.hidden", 404, ""}, {"GET", "/../backend/.env", 404, ""},
		{"GET", "/%2e%2e/backend/.env", 404, ""}, {"GET", "/backend/main.go", 404, ""},
		{"GET", "/api/health", 200, `"status":"ok"`}, {"GET", "/api/missing", 404, `"code":"NOT_FOUND"`},
		{"GET", "/api", 404, `"code":"NOT_FOUND"`}, {"GET", "/api/analyze", 405, `"code":"METHOD_NOT_ALLOWED"`},
		{"POST", "/api/analyze", 400, `"code":"BAD_REQUEST"`}, {"POST", "/", 405, ""},
	} {
		t.Run(tc.method+tc.path, func(t *testing.T) {
			w := httptest.NewRecorder()
			handler.ServeHTTP(w, httptest.NewRequest(tc.method, tc.path, nil))
			if w.Code != tc.status || !strings.Contains(w.Body.String(), tc.contains) {
				t.Fatalf("unexpected response %d %s", w.Code, w.Body.String())
			}
			if strings.Contains(w.Body.String(), "private-file-must-never-be-served") {
				t.Fatal("private file leaked")
			}
			if strings.HasPrefix(tc.path, "/api") {
				if !json.Valid(w.Body.Bytes()) || w.Header().Get("Content-Type") != "application/json" {
					t.Fatal("API request reached static handler")
				}
			}
			if tc.method == "HEAD" && w.Body.Len() != 0 {
				t.Fatal("HEAD sent body")
			}
		})
	}
}
func TestMissingFrontendBuild(t *testing.T) {
	handler := NewHandler(http.NotFoundHandler(), fstest.MapFS{})
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, httptest.NewRequest("GET", "/", nil))
	if w.Code != 404 {
		t.Fatal("missing build must not expose another directory")
	}
}
func TestAssetContentType(t *testing.T) {
	handler := NewHandler(http.NotFoundHandler(), fstest.MapFS{"assets/app.js": {Data: []byte("console.log(1)")}})
	w := httptest.NewRecorder()
	handler.ServeHTTP(w, httptest.NewRequest("GET", "/assets/app.js", nil))
	if w.Code != 200 || !strings.Contains(w.Header().Get("Content-Type"), "javascript") || w.Header().Get("X-Content-Type-Options") != "nosniff" {
		t.Fatal("missing safe asset headers")
	}
}
