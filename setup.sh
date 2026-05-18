#!/usr/bin/env bash
# ============================================================
#  3D Printing Website — Setup & Dev Script
# ============================================================
set -euo pipefail

# --------------- colors ---------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# --------------- helpers ---------------
info()    { printf "${BLUE}[INFO]${NC}  %s\n" "$*"; }
success() { printf "${GREEN}[OK]${NC}    %s\n" "$*"; }
warn()    { printf "${YELLOW}[WARN]${NC}  %s\n" "$*"; }
error()   { printf "${RED}[ERR]${NC}   %s\n" "$*"; exit 1; }

banner() {
  printf "${CYAN}${BOLD}"
  cat <<'EOF'
  ╔══════════════════════════════════════════════════╗
  ║       🖨️  3D Printing Website — Setup           ║
  ║          Underwater AI Printing                  ║
  ╚══════════════════════════════════════════════════╝
EOF
  printf "${NC}\n"
}

# --------------- checks ---------------
check_node() {
  info "Checking Node.js >= 18 ..."
  if ! command -v node >/dev/null 2>&1; then
    error "Node.js is not installed. Install v18+ from https://nodejs.org"
  fi
  NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VER" -lt 18 ]; then
    error "Node.js $NODE_VER found but >= 18 required."
  fi
  success "Node.js $(node -v) detected"
}

check_mongo() {
  info "Checking MongoDB ..."
  if command -v mongosh >/dev/null 2>&1; then
    if mongosh --eval "db.version()" --quiet >/dev/null 2>&1; then
      success "MongoDB (mongosh) is available"
      return 0
    fi
  fi
  if command -v mongod >/dev/null 2>&1; then
    success "MongoDB (mongod) is available"
    return 0
  fi
  warn "MongoDB not found or not running."
  printf "${YELLOW}  The server needs MongoDB to function fully.${NC}\n"
  printf "  Continue without DB check? [y/N] "
  read -r answer
  case "$answer" in
    [yY]*) warn "Continuing without MongoDB — server may fail to connect." ;;
    *)     error "Aborting. Install MongoDB or use MongoDB Atlas." ;;
  esac
}

install_client() {
  info "Installing client dependencies ..."
  (cd client && npm install --no-fund --no-audit) || error "Client npm install failed"
  success "Client dependencies installed"
}

install_server() {
  info "Installing server dependencies ..."
  (cd server && npm install --no-fund --no-audit) || error "Server npm install failed"
  success "Server dependencies installed"
}

copy_env() {
  if [ ! -f server/.env ]; then
    if [ -f .env.example ]; then
      cp .env.example server/.env
      success "Copied .env.example → server/.env  (edit with your credentials)"
    else
      warn ".env.example not found — create server/.env manually"
    fi
  else
    info "server/.env already exists — skipping"
  fi
}

# --------------- modes ---------------
mode_frontend() {
  banner
  check_node
  install_client
  echo ""
  info "Starting Vite dev server ..."
  printf "${GREEN}${BOLD}"
  printf "  ➜  Local:   http://localhost:5173\n"
  printf "${NC}"
  (cd client && npm run dev)
}

mode_full() {
  banner
  check_node
  check_mongo
  install_client
  install_server
  copy_env
  echo ""
  info "Starting servers ..."
  printf "${GREEN}${BOLD}"
  printf "  ➜  Client:  http://localhost:5173\n"
  printf "  ➜  Server:  http://localhost:5000\n"
  printf "${NC}\n"

  # Start server in background
  (cd server && node index.js) &
  SERVER_PID=$!
  trap "kill $SERVER_PID 2>/dev/null" EXIT INT TERM

  sleep 1
  # Start client in foreground
  (cd client && npm run dev)
}

mode_build() {
  banner
  check_node
  install_client
  install_server
  echo ""
  info "Building frontend for production ..."
  (cd client && npm run build) || error "Build failed"
  success "Build complete → client/dist/"
  echo ""
  printf "${BOLD}Next steps:${NC}\n"
  printf "  1. Copy ${CYAN}client/dist/${NC} to your web server (or use nginx)\n"
  printf "  2. Start the API:  ${CYAN}cd server && node index.js${NC}\n"
  printf "  3. Or use Docker:  ${CYAN}docker compose up --build${NC}\n"
}

usage() {
  banner
  printf "${BOLD}Usage:${NC}\n"
  printf "  ./setup.sh [mode]\n\n"
  printf "${BOLD}Modes:${NC}\n"
  printf "  ${CYAN}frontend${NC}  (default) Install client deps & start Vite dev server\n"
  printf "  ${CYAN}full${NC}     Full stack — MongoDB check, install all, start both\n"
  printf "  ${CYAN}all${NC}      Alias for full\n"
  printf "  ${CYAN}build${NC}    Install all deps & build frontend for production\n"
  printf "  ${CYAN}help${NC}     Show this message\n"
}

# --------------- main ---------------
MODE="${1:-frontend}"

case "$MODE" in
  frontend)  mode_frontend ;;
  full|all)  mode_full ;;
  build)     mode_build ;;
  help|-h|--help) usage ;;
  *)         error "Unknown mode '$MODE'. Run ./setup.sh help" ;;
esac
