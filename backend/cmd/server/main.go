package main

import (
	"foodlens/backend/internal/ai"
	"foodlens/backend/internal/api"
	"foodlens/backend/internal/config"
	"log"
	"net/http"
	"time"
)

func main() {
	if err := config.LoadEnvFile(".env"); err != nil {
		log.Fatal(err)
	}
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	analyzer := ai.NewWithDiscovery(cfg.BaseURL, cfg.APIKey, cfg.Model, cfg.AllowedModels, cfg.AITimeout, nil)
	server := &http.Server{Addr: cfg.Address, Handler: api.NewHandler(analyzer, cfg.AITimeout), ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 15 * time.Second, WriteTimeout: 200 * time.Second, IdleTimeout: 60 * time.Second, MaxHeaderBytes: 16 * 1024}
	log.Printf("FoodLens API listening on %s", cfg.Address)
	log.Fatal(server.ListenAndServe())
}
