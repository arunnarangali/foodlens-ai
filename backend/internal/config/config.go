package config

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"
)

const (
	DefaultAddress   = "127.0.0.1:8080"
	CloudBaseURL     = "https://ollama.com/api"
	DefaultModel     = "gemma4:31b"
	InferenceTimeout = 120 * time.Second
	StaticDirectory  = "../frontend/dist"
)

type Config struct {
	Address, BaseURL, APIKey, Model string
	AITimeout                       time.Duration
	AllowedModels                   []string
}

// Load reads the credential and the hosting platform PORT. Other settings are fixed.
func Load() (Config, error) {
	key := strings.TrimSpace(os.Getenv("OLLAMA_API_KEY"))
	if key == "" || strings.HasPrefix(key, "replace_") || strings.ContainsAny(key, "\r\n\t ") {
		return Config{}, errors.New("set OLLAMA_API_KEY in backend/.env or the backend environment")
	}
	address := DefaultAddress
	if raw := os.Getenv("PORT"); raw != "" {
		port, err := strconv.Atoi(raw)
		if err != nil || port < 1 || port > 65535 {
			return Config{}, errors.New("platform PORT must be a number from 1 to 65535")
		}
		address = "0.0.0.0:" + strconv.Itoa(port)
	}
	return Config{Address: address, BaseURL: CloudBaseURL, APIKey: key, Model: DefaultModel, AITimeout: InferenceTimeout, AllowedModels: []string{DefaultModel}}, nil
}
