GO ?= go

.DEFAULT_GOAL := help
.PHONY: help run build test vet fmt check clean

help:
	@printf '%s\n' \
	  'make run    Start the API (loads backend .env)' \
	  'make build  Build ./server' \
	  'make test   Run all Go tests' \
	  'make vet    Run Go static checks' \
	  'make fmt    Format Go sources' \
	  'make check  Run tests and static checks' \
	  'make clean  Remove ./server'

run:
	$(GO) run ./cmd/server

build:
	$(GO) build -o server ./cmd/server

test:
	$(GO) test ./...

vet:
	$(GO) vet ./...

fmt:
	$(GO) fmt ./...

check: test vet

clean:
	rm -f server
