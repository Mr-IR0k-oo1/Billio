.PHONY: help build test dev clean build-backend build-frontend up down logs

# Default target
help:
	@echo "Available commands:"
	@echo "  make build         - Build both frontend and backend"
	@echo "  make test          - Run tests for frontend and backend"
	@echo "  make dev           - Start all services in development mode"
	@echo "  make up            - Start all services with Docker Compose"
	@echo "  make down          - Stop all services with Docker Compose"
	@echo "  make logs          - Tail logs from all services"
	@echo "  make clean         - Clean build artifacts"

# Build all
build: build-frontend build-backend

build-frontend:
	npm install
	npm run build

build-backend:
	cd backend && cargo build --release

# Testing
test: test-frontend test-backend

test-frontend:
	npm test

test-backend:
	cd backend && cargo test

# Local Development
dev:
	docker compose up -d postgres
	@echo "Starting backend and frontend..."
	# Note: In a real system you'd use a tool like 'overmind' or 'foreman'
	# for now we'll just suggest docker compose for the full stack
	docker compose up

# Docker Helpers
up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f

# Cleaning
clean:
	rm -rf dist
	rm -rf target
	cd backend && cargo clean
	rm -rf node_modules
