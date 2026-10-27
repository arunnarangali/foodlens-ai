package ai

import (
	"context"
	"encoding/json"
	"foodlens/backend/internal/food"
	"io"
	"net/http"
	"strings"
	"time"
)

// NewWithDiscovery selects only explicitly allowed hosted vision models.
// A listing proves capabilities, not free usage, account entitlement or pricing.
func NewWithDiscovery(base, key, model string, allowed []string, timeout time.Duration, transport http.RoundTripper) *Ollama {
	client := New(base, key, model, timeout, transport)
	client.discovery = true
	client.allowedModels = append([]string(nil), allowed...)
	return client
}
func (o *Ollama) selectModel(ctx context.Context) (string, error) {
	unavailable := &food.ProviderError{Code: "AI_MODEL_UNAVAILABLE"}
	if len(o.allowedModels) == 0 {
		return "", unavailable
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimSuffix(o.endpoint, "/chat")+"/tags", nil)
	if err != nil {
		return "", unavailable
	}
	request.Header.Set("Authorization", "Bearer "+o.key)
	request.Header.Set("Accept", "application/json")
	response, err := o.client.Do(request)
	if err != nil {
		_, safe := transportFailure(ctx, err)
		return "", safe
	}
	defer response.Body.Close()
	switch response.StatusCode {
	case 402, 429:
		return "", &food.ProviderError{Code: "RATE_LIMITED"}
	case 408, 504:
		return "", &food.ProviderError{Code: "AI_TIMEOUT"}
	case 200:
	default:
		return "", &food.ProviderError{Code: "AI_UNAVAILABLE"}
	}
	data, err := io.ReadAll(io.LimitReader(response.Body, MaxEnvelopeBytes+1))
	if err != nil {
		_, safe := transportFailure(ctx, err)
		return "", safe
	}
	if len(data) > MaxEnvelopeBytes {
		return "", unavailable
	}
	var listing struct {
		Models []struct {
			Name         string   `json:"name"`
			Capabilities []string `json:"capabilities"`
		} `json:"models"`
	}
	if json.Unmarshal(data, &listing) != nil {
		return "", unavailable
	}
	available := map[string]bool{}
	for _, model := range listing.Models {
		vision, completion := false, false
		for _, capability := range model.Capabilities {
			if capability == "vision" {
				vision = true
			}
			if capability == "completion" {
				completion = true
			}
		}
		if vision && completion {
			available[model.Name] = true
		}
	}
	for _, model := range o.allowedModels {
		if (o.model == "auto" || o.model == model) && available[model] {
			return model, nil
		}
	}
	return "", unavailable
}
