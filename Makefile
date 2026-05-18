# ============================================================
#  3D Printing Website — Makefile
# ============================================================
.PHONY: install dev build start clean help

CLIENT_DIR := client
SERVER_DIR := server

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies (client + server)
	cd $(CLIENT_DIR) && npm install
	cd $(SERVER_DIR) && npm install

dev: ## Start dev servers (client + server)
	@echo "Starting server in background ..."
	@cd $(SERVER_DIR) && node index.js &
	@sleep 1
	@echo "Starting Vite dev server ..."
	cd $(CLIENT_DIR) && npm run dev

build: ## Build frontend for production
	cd $(CLIENT_DIR) && npm run build

start: ## Start production server
	cd $(SERVER_DIR) && node index.js

clean: ## Remove node_modules and dist folders
	rm -rf $(CLIENT_DIR)/node_modules $(CLIENT_DIR)/dist
	rm -rf $(SERVER_DIR)/node_modules
	@echo "Cleaned."
