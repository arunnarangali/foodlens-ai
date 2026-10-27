package config

import (
	"fmt"
	"net"
	"net/url"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Address, BaseURL, APIKey, Model string
	AITimeout                       time.Duration
}

func Load() (Config, error) {
	address := os.Getenv("SERVER_ADDR")
	if address == "" {
		address = "127.0.0.1:8080"
	}
	_, port, err := net.SplitHostPort(address)
	if err != nil {
		return Config{}, fmt.Errorf("SERVER_ADDR must be a host:port address")
	}
	number, err := strconv.Atoi(port)
	if err != nil || number < 1 || number > 65535 {
		return Config{}, fmt.Errorf("SERVER_ADDR must contain a port from 1 to 65535")
	}
	base := os.Getenv("OLLAMA_BASE_URL")
	if base == "" {
		base = "https://ollama.com/api"
	}
	base = strings.TrimSuffix(base, "/")
	parsed, err := url.Parse(base)
	if err != nil || parsed.Scheme != "https" || parsed.Host != "ollama.com" || parsed.Path != "/api" || parsed.RawQuery != "" || parsed.Fragment != "" || parsed.User != nil || parsed.RawPath != "" {
		return Config{}, fmt.Errorf("OLLAMA_BASE_URL must be https://ollama.com/api")
	}
	key := strings.TrimSpace(os.Getenv("OLLAMA_API_KEY"))
	if key == "" || strings.HasPrefix(key, "replace_") || strings.ContainsAny(key, "\r\n\t ") {
		return Config{}, fmt.Errorf("OLLAMA_API_KEY must be set securely in the backend environment")
	}
	model := strings.TrimSpace(os.Getenv("OLLAMA_MODEL"))
	if len(model) > 128 || !regexp.MustCompile(`^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$`).MatchString(model) || strings.HasPrefix(model, "replace_") {
		return Config{}, fmt.Errorf("OLLAMA_MODEL must be a hosted model identifier from the model listing")
	}
	seconds := 120
	if raw := os.Getenv("OLLAMA_TIMEOUT_SECONDS"); raw != "" {
		seconds, err = strconv.Atoi(raw)
		if err != nil || seconds < 1 || seconds > 180 {
			return Config{}, fmt.Errorf("OLLAMA_TIMEOUT_SECONDS must be from 1 to 180")
		}
	}
	return Config{Address: address, BaseURL: base, APIKey: key, Model: model, AITimeout: time.Duration(seconds) * time.Second}, nil
}
