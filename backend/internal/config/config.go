package config

import (
	"errors"
	"os"
	"strings"
	"time"
)

const (
	DefaultAddress   = "127.0.0.1:8080"
	CloudBaseURL     = "https://ollama.com/api"
	DefaultModel     = "gemma4:31b"
	InferenceTimeout = 120 * time.Second
)

type Config struct {
	Address, BaseURL, APIKey, Model string
	AITimeout                       time.Duration
	AllowedModels                   []string
}

// Load reads only the credential. Runtime settings are fixed application defaults.
func Load() (Config, error) {
	key := strings.TrimSpace(os.Getenv("OLLAMA_API_KEY"))
	if key == "" || strings.HasPrefix(key, "replace_") || strings.ContainsAny(key, "\r\n\t ") {
		return Config{}, errors.New("set OLLAMA_API_KEY in backend/.env or the backend environment")
	}
	return Config{Address: DefaultAddress, BaseURL: CloudBaseURL, APIKey: key, Model: DefaultModel, AITimeout: InferenceTimeout, AllowedModels: []string{DefaultModel}}, nil
}
