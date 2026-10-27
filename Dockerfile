FROM node:22-alpine AS frontend
WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM golang:1.26-alpine AS backend
WORKDIR /build/backend
COPY backend/ ./
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/server ./cmd/server

FROM alpine:3.23 AS runtime
RUN apk add --no-cache ca-certificates \
    && addgroup -S -g 10001 app \
    && adduser -S -D -H -u 10001 -G app app
WORKDIR /app/backend
COPY --from=backend --chown=app:app /out/server ./server
COPY --from=frontend --chown=app:app /build/frontend/dist /app/frontend/dist
USER app:app
ENV PORT=10000
EXPOSE 10000
ENTRYPOINT ["./server"]
