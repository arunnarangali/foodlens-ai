package config

import (
	"strings"
	"testing"
)

func TestKeyOnlyConfiguration(t *testing.T) {
	t.Setenv("OLLAMA_API_KEY", "unit-test-key")
	t.Setenv("PORT", "")
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

func TestPlatformPort(t *testing.T) {
	t.Setenv("OLLAMA_API_KEY", "unit-test-key")
	for _, tc := range []struct {
		value, address string
		valid          bool
	}{
		{"", "127.0.0.1:8080", true}, {"10000", "0.0.0.0:10000", true}, {"8080", "0.0.0.0:8080", true},
		{"0", "", false}, {"-1", "", false}, {"65536", "", false}, {"secret-invalid-port", "", false}, {" 8080", "", false},
	} {
		t.Run(tc.value, func(t *testing.T) {
			t.Setenv("PORT", tc.value)
			cfg, err := Load()
			if (err == nil) != tc.valid {
				t.Fatalf("unexpected port error: %v", err)
			}
			if err == nil && cfg.Address != tc.address {
				t.Fatal("incorrect bind address")
			}
			if err != nil && strings.Contains(err.Error(), "secret-invalid-port") {
				t.Fatal("raw invalid port logged")
			}
		})
	}
}
