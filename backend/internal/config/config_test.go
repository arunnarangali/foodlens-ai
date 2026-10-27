package config

import (
	"strings"
	"testing"
)

func TestKeyOnlyConfiguration(t *testing.T) {
	t.Setenv("OLLAMA_API_KEY", "unit-test-key")
	// Old exported settings must not alter the fixed cloud destination or defaults.
	for _, key := range []string{"SERVER_ADDR", "OLLAMA_BASE_URL", "OLLAMA_MODEL", "OLLAMA_ALLOWED_MODELS", "OLLAMA_TIMEOUT_SECONDS"} {
		t.Setenv(key, "obsolete-invalid-value")
	}
	cfg, err := Load()
	if err != nil {
		t.Fatal(err)
	}
	if cfg.APIKey != "unit-test-key" || cfg.Address != "127.0.0.1:8080" || cfg.BaseURL != "https://ollama.com/api" || cfg.Model != "gemma4:31b" || cfg.AITimeout.Seconds() != 120 || len(cfg.AllowedModels) != 1 || cfg.AllowedModels[0] != cfg.Model {
		t.Fatal("key-only defaults did not match")
	}
	// A caller cannot mutate defaults for subsequent requests.
	cfg.AllowedModels[0] = "other"
	fresh, err := Load()
	if err != nil || fresh.AllowedModels[0] != DefaultModel {
		t.Fatal("mutable defaults")
	}
}
func TestInvalidKeysAreRedacted(t *testing.T) {
	for _, value := range []string{"", "replace_with_your_ollama_api_key", "private-test\nheader", "private-test key"} {
		t.Run("invalid key", func(t *testing.T) {
			t.Setenv("OLLAMA_API_KEY", value)
			_, err := Load()
			if err == nil {
				t.Fatal("expected missing/invalid key error")
			}
			if strings.Contains(err.Error(), "private-test") {
				t.Fatal("key leaked")
			}
		})
	}
}
