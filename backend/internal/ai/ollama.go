package ai

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"errors"
	"foodlens/backend/internal/food"
	"io"
	"log"
	"net"
	"net/http"
	"strings"
	"time"
)

const MaxEnvelopeBytes = 256 * 1024

type Ollama struct {
	client               *http.Client
	endpoint, key, model string
	timeout              time.Duration
	discovery            bool
	allowedModels        []string
}

// New creates the hosted client. Configuration validation is owned by config.Load.
// A custom transport lets tests exercise the real HTTP adapter without sockets or credits.
func New(base, key, model string, timeout time.Duration, transport http.RoundTripper) *Ollama {
	if transport == nil {
		transport = &http.Transport{Proxy: http.ProxyFromEnvironment, DialContext: (&net.Dialer{Timeout: 10 * time.Second, KeepAlive: 30 * time.Second}).DialContext, TLSHandshakeTimeout: 10 * time.Second, ResponseHeaderTimeout: timeout, IdleConnTimeout: 60 * time.Second, MaxIdleConns: 10}
	}
	return &Ollama{client: &http.Client{Transport: transport, Timeout: timeout, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }}, endpoint: base + "/chat", key: key, model: model, timeout: timeout}
}

type chatMessage struct {
	Role    string   `json:"role"`
	Content string   `json:"content"`
	Images  []string `json:"images,omitempty"`
}
type chatRequest struct {
	Model    string        `json:"model"`
	Messages []chatMessage `json:"messages"`
	Stream   bool          `json:"stream"`
	Options  struct {
		NumPredict int `json:"num_predict"`
	} `json:"options"`
}

func failure(code string) (food.Result, error) {
	return food.Result{}, &food.ProviderError{Code: code}
}

func (o *Ollama) Analyze(ctx context.Context, image []byte, _ string) (food.Result, error) {
	ctx, cancel := context.WithTimeout(ctx, o.timeout)

	defer cancel()
	model := o.model
	if o.discovery {
		var err error
		model, err = o.selectModel(ctx)
		if err != nil {
			return food.Result{}, err
		}
	}
	payload := chatRequest{Model: model, Messages: []chatMessage{{Role: "system", Content: Prompt}, {Role: "user", Content: "Analyze this food photo. Return only the required JSON object.", Images: []string{base64.StdEncoding.EncodeToString(image)}}}, Stream: false}
	payload.Options.NumPredict = 4096
	body, err := json.Marshal(payload)
	if err != nil {
		return failure("AI_UNAVAILABLE")
	}
	request, err := http.NewRequestWithContext(ctx, http.MethodPost, o.endpoint, bytes.NewReader(body))
	if err != nil {
		return failure("AI_UNAVAILABLE")
	}
	request.Header.Set("Authorization", "Bearer "+o.key)
	request.Header.Set("Content-Type", "application/json")
	request.Header.Set("Accept", "application/json")
	response, err := o.client.Do(request)
	if err != nil {
		return transportFailure(ctx, err)
	}
	defer response.Body.Close()
	switch {
	case response.StatusCode == 402 || response.StatusCode == 429:
		return failure("RATE_LIMITED")
	case response.StatusCode == 408 || response.StatusCode == 504:
		return failure("AI_TIMEOUT")
	case response.StatusCode != http.StatusOK:
		return failure("AI_UNAVAILABLE")
	}
	data, err := io.ReadAll(io.LimitReader(response.Body, MaxEnvelopeBytes+1))
	if err != nil {
		return transportFailure(ctx, err)
	}
	if len(data) > MaxEnvelopeBytes {
		return o.invalidResponse(model, "output_too_large", "", len(data))
	}
	var envelope struct {
		Message    *chatMessage `json:"message"`
		Done       bool         `json:"done"`
		DoneReason string       `json:"done_reason"`
		Error      string       `json:"error"`
	}
	if err := json.Unmarshal(data, &envelope); err != nil {
		return o.invalidResponse(model, "invalid_envelope", "", len(data))
	}
	if envelope.Error != "" {
		return o.invalidResponse(model, "invalid_envelope", "", len(data))
	}
	if envelope.DoneReason == "length" {
		return o.invalidResponse(model, "output_truncated", "", len(data))
	}
	if !envelope.Done {
		return o.invalidResponse(model, "incomplete_response", "", len(data))
	}
	if envelope.DoneReason != "stop" || envelope.Message == nil || envelope.Message.Role != "assistant" {
		return o.invalidResponse(model, "invalid_envelope", "", len(data))
	}
	if strings.TrimSpace(envelope.Message.Content) == "" {
		return o.invalidResponse(model, "empty_content", "", len(data))
	}
	result, err := food.Parse([]byte(envelope.Message.Content))
	if err != nil {
		var validation *food.ValidationError
		if errors.As(err, &validation) {
			return o.invalidResponse(model, validation.Reason, validation.Field, len(data))
		}
		return o.invalidResponse(model, "invalid_json", "", len(data))
	}
	return result, nil
}

func transportFailure(ctx context.Context, err error) (food.Result, error) {
	if errors.Is(ctx.Err(), context.Canceled) {
		return food.Result{}, context.Canceled
	}
	var netError net.Error
	if errors.Is(ctx.Err(), context.DeadlineExceeded) || errors.Is(err, context.DeadlineExceeded) || (errors.As(err, &netError) && netError.Timeout()) {
		return failure("AI_TIMEOUT")
	}
	return failure("AI_UNAVAILABLE")
}

func (o *Ollama) invalidResponse(model, reason, field string, size int) (food.Result, error) {
	// Never include raw decoder errors, provider messages, image bytes or credentials.
	log.Printf("foodlens_ai_response_rejected model=%q reason=%q field=%q response_bytes=%d", model, reason, field, size)
	return failure("AI_INVALID_RESPONSE")
}
