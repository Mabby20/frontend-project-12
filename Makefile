install:
	npm ci

start-frontend:
	make start -C frontend

start-build:
	make build -C frontend

start-backend:
	npx start-server

frontend-lint:
	make lint -C frontend

start:
	make start-backend & make start-frontend

build:
	make start-backend & make start-build
