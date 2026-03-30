# Makefile for Beyond Earth Docker deployment
.PHONY: help build up down logs restart seed clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

build: ## Build Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## View logs from all services
	docker-compose logs -f

logs-backend: ## View backend logs
	docker-compose logs -f backend

logs-frontend: ## View frontend logs
	docker-compose logs -f frontend

restart: ## Restart all services
	docker-compose restart

restart-backend: ## Restart backend service
	docker-compose restart backend

restart-frontend: ## Restart frontend service
	docker-compose restart frontend

seed: ## Seed the database with initial data
	docker-compose run --rm backend node seed.js

clean: ## Stop services and remove containers, networks, and volumes
	docker-compose down -v

clean-all: clean ## Clean everything including images
	docker-compose down --rmi all -v

ps: ## Show running containers
	docker-compose ps

rebuild: ## Rebuild and restart all services (production)
	docker-compose up --build -d

dev: ## Start development mode with hot-reload
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-build: ## Build development images
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

dev-down: ## Stop development mode
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

shell-backend: ## Open shell in backend container
	docker-compose exec backend sh

shell-frontend: ## Open shell in frontend container
	docker-compose exec frontend sh

