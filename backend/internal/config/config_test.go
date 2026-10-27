package config

import "testing"

func TestLoad(t *testing.T) {
	t.Setenv("OLLAMA_API_KEY", "unit-test-key")
	t.Setenv("OLLAMA_MODEL", "gemma4:31b")
	t.Setenv("OLLAMA_BASE_URL", "")
	t.Setenv("OLLAMA_TIMEOUT_SECONDS", "")
	for _, tc := range []struct {
		address string
		valid   bool
	}{{"", true}, {"127.0.0.1:8080", true}, {":8080", true}, {"replace_with_local_host_and_port", false}, {"localhost:no", false}, {"localhost:0", false}, {"localhost:65536", false}} {
		t.Run(tc.address, func(t *testing.T) {
			t.Setenv("SERVER_ADDR", tc.address)
			cfg, err := Load()
			if (err == nil) != tc.valid {
				t.Fatalf("unexpected config error: %v", err)
			}
			if tc.address == "" && cfg.Address != "127.0.0.1:8080" {
				t.Fatal("wrong default")
			}
		})
	}
}

func TestCloudConfig(t *testing.T) {
	t.Setenv("SERVER_ADDR", "")
	t.Setenv("OLLAMA_API_KEY", "unit-test-key")
	t.Setenv("OLLAMA_MODEL", "gemma4:31b")
	t.Setenv("OLLAMA_BASE_URL", "")
	t.Setenv("OLLAMA_TIMEOUT_SECONDS", "")
	cfg, err := Load()
	if err != nil || cfg.BaseURL != "https://ollama.com/api" || cfg.AITimeout.Seconds() != 120 {
		t.Fatalf("bad defaults: %v", err)
	}
	for _, tc := range []struct{ key, value string }{{"OLLAMA_API_KEY", ""}, {"OLLAMA_API_KEY", "replace_me"}, {"OLLAMA_API_KEY", "secret\nheader"}, {"OLLAMA_MODEL", ""}, {"OLLAMA_MODEL", "replace_me"}, {"OLLAMA_MODEL", "invalid model"}, {"OLLAMA_BASE_URL", "/"}, {"OLLAMA_BASE_URL", "http://localhost:11434"}, {"OLLAMA_BASE_URL", "https://evil.example/api"}, {"OLLAMA_BASE_URL", "https://ollama.com/api?secret=x"}, {"OLLAMA_BASE_URL", "https://user:pass@ollama.com/api"}, {"OLLAMA_TIMEOUT_SECONDS", "0"}, {"OLLAMA_TIMEOUT_SECONDS", "181"}, {"OLLAMA_TIMEOUT_SECONDS", "bad"}} {
		t.Run(tc.key+tc.value, func(t *testing.T) {
			t.Setenv(tc.key, tc.value)
			if _, err := Load(); err == nil {
				t.Fatal("expected invalid config")
			}
		})
	}
	t.Setenv("OLLAMA_BASE_URL", "https://ollama.com/api/")
	t.Setenv("OLLAMA_TIMEOUT_SECONDS", "180")
	if _, err := Load(); err != nil {
		t.Fatal(err)
	}
}
