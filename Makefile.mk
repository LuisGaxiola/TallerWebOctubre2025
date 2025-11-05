.PHONY: help up down restart logs clean seed migrate

help: ## Muestra este mensaje de ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

up: ## Inicia todos los servicios
	docker-compose up -d

down: ## Detiene todos los servicios
	docker-compose down

restart: ## Reinicia todos los servicios
	docker-compose restart

logs: ## Muestra los logs de todos los servicios
	docker-compose logs -f

logs-backend: ## Muestra los logs del backend
	docker-compose logs -f backend

logs-frontend: ## Muestra los logs del frontend
	docker-compose logs -f frontend

build: ## Construye las imágenes Docker
	docker-compose build

clean: ## Limpia contenedores, volúmenes e imágenes
	docker-compose down -v --rmi all

migrate: ## Ejecuta las migraciones de la base de datos
	docker-compose exec backend npm run db:generate
	docker-compose exec backend npm run db:push

seed: ## Ejecuta el seed de la base de datos
	docker-compose exec backend npm run db:seed

shell-backend: ## Abre una shell en el contenedor backend
	docker-compose exec backend sh

shell-frontend: ## Abre una shell en el contenedor frontend
	docker-compose exec frontend sh

psql: ## Conecta a PostgreSQL
	docker-compose exec postgres psql -U postgres -d social_network

redis-cli: ## Conecta a Redis CLI
	docker-compose exec redis redis-cli

install: ## Instala dependencias en backend y frontend
	cd backend && npm install
	cd frontend && npm install

dev-backend: ## Ejecuta el backend en modo desarrollo (local)
	cd backend && npm run dev

dev-frontend: ## Ejecuta el frontend en modo desarrollo (local)
	cd frontend && npm run dev