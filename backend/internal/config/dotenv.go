package config

import (
	"bufio"
	"bytes"
	"errors"
	"fmt"
	"io"
	"os"
	"strings"
)

// LoadEnvFile loads a private backend configuration file. Exported variables win.
// Values are literal: no command execution, interpolation or shell expansion.
// Nothing is applied if a line is malformed. Error messages contain no values.
func LoadEnvFile(path string) error {
	file, err := os.Open(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return errors.New("could not read backend environment file")
	}
	defer file.Close()
	data, err := io.ReadAll(io.LimitReader(file, 64*1024+1))
	if err != nil || len(data) > 64*1024 {
		return errors.New("backend environment file is unreadable or too large")
	}
	allowed := map[string]bool{"OLLAMA_API_KEY": true}
	values := map[string]string{}
	scanner := bufio.NewScanner(bytes.NewReader(data))
	lineNumber := 0
	for scanner.Scan() {
		lineNumber++
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		line = strings.TrimPrefix(line, "export ")
		key, value, found := strings.Cut(line, "=")
		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		invalid := func() error { return fmt.Errorf("invalid backend environment file at line %d", lineNumber) }
		if !found || !allowed[key] {
			return invalid()
		}
		if _, exists := values[key]; exists {
			return invalid()
		}
		if len(value) > 0 && (value[0] == '\'' || value[0] == '"') {
			if len(value) < 2 || value[len(value)-1] != value[0] {
				return invalid()
			}
			value = value[1 : len(value)-1]
		} else if index := strings.Index(value, " #"); index >= 0 {
			value = strings.TrimSpace(value[:index])
		}
		if strings.ContainsAny(value, "\x00\r\n") {
			return invalid()
		}
		values[key] = value
	}
	if scanner.Err() != nil {
		return errors.New("could not parse backend environment file")
	}
	for key, value := range values {
		if _, exists := os.LookupEnv(key); !exists {
			if err := os.Setenv(key, value); err != nil {
				return errors.New("could not load backend configuration")
			}
		}
	}
	return nil
}
