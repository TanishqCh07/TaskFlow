# -------- BUILD STAGE --------
FROM golang:1.26-alpine AS builder

WORKDIR /app
COPY . .

RUN go mod tidy
RUN go build -o main ./cmd/main.go

# -------- RUN STAGE --------
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]