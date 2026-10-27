package config

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func unset(t *testing.T, key string) {
	t.Helper()
	t.Setenv(key, "")
	if err := os.Unsetenv(key); err != nil {
		t.Fatal(err)
	}
}
func envFile(t *testing.T, content string) string {
	t.Helper()
	path := filepath.Join(t.TempDir(), ".env")
	if err := os.WriteFile(path, []byte(content), 0600); err != nil {
		t.Fatal(err)
	}
	return path
}
func TestEnvFileLoadsPrivateKeyWithDefaults(t *testing.T) {
	t.Setenv("PORT", "")
	unset(t, "OLLAMA_API_KEY")
	if err := LoadEnvFile(envFile(t, "# private test fixture\nOLLAMA_API_KEY=unit-test-key\n")); err != nil {
		t.Fatal(err)
	}
	cfg, err := Load()
	if err != nil || cfg.Model != DefaultModel || len(cfg.AllowedModels) != 1 || cfg.AllowedModels[0] != "gemma4:31b" {
		t.Fatalf("invalid key-only configuration: %v", err)
	}
}
func TestExportedVariablesWin(t *testing.T) {
	t.Setenv("OLLAMA_API_KEY", "exported-test-key")
	if err := LoadEnvFile(envFile(t, "OLLAMA_API_KEY=file-test-key\n")); err != nil {
		t.Fatal(err)
	}
	if os.Getenv("OLLAMA_API_KEY") != "exported-test-key" {
		t.Fatal("exported value overwritten")
	}
}
func TestEnvFileQuotesAndLiteralValues(t *testing.T) {
	for _, line := range []string{"export OLLAMA_API_KEY='literal$(command)'\r\n", "OLLAMA_API_KEY=\"literal$(command)\"\n"} {
		unset(t, "OLLAMA_API_KEY")
		if err := LoadEnvFile(envFile(t, line)); err != nil {
			t.Fatal(err)
		}
		if os.Getenv("OLLAMA_API_KEY") != "literal$(command)" {
			t.Fatal("incorrect literal parse")
		}
	}
}
func TestOtherFileSettingsRejected(t *testing.T) {
	for _, key := range []string{"SERVER_ADDR", "OLLAMA_BASE_URL", "OLLAMA_MODEL", "OLLAMA_ALLOWED_MODELS", "OLLAMA_TIMEOUT_SECONDS"} {
		t.Run(key, func(t *testing.T) {
			unset(t, "OLLAMA_API_KEY")
			if err := LoadEnvFile(envFile(t, "OLLAMA_API_KEY=unit-test-key\n"+key+"=obsolete\n")); err == nil {
				t.Fatal("unsupported setting accepted")
			}
			if _, ok := os.LookupEnv("OLLAMA_API_KEY"); ok {
				t.Fatal("invalid file partially applied")
			}
		})
	}
}
func TestEnvFileFailuresAreAtomicAndRedacted(t *testing.T) {
	for _, content := range []string{
		"OLLAMA_API_KEY=private-test-value\nbad-line", "OLLAMA_API_KEY='private-test-value", "UNKNOWN_SETTING=private-test-value", "OLLAMA_API_KEY=a\nOLLAMA_API_KEY=private-test-value", strings.Repeat("x", 64*1024+1),
	} {
		t.Run("invalid file", func(t *testing.T) {
			unset(t, "OLLAMA_API_KEY")
			err := LoadEnvFile(envFile(t, content))
			if err == nil || strings.Contains(err.Error(), "private-test-value") {
				t.Fatal("missing or unsafe parse error")
			}
			if _, exists := os.LookupEnv("OLLAMA_API_KEY"); exists {
				t.Fatal("partially loaded invalid file")
			}
		})
	}
}
func TestMissingEnvFile(t *testing.T) {
	if err := LoadEnvFile(filepath.Join(t.TempDir(), "missing")); err != nil {
		t.Fatal(err)
	}
}
