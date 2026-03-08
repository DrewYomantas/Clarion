#!/usr/bin/env bash
# Render build script — runs from backend/ (Render root directory)
# Builds the React frontend then installs Python deps

set -e

BACKEND_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND_DIR="$BACKEND_DIR/../frontend"

echo "==> Building React frontend..."
cd "$FRONTEND_DIR"
npm install
npm run build
echo "==> React build complete. dist/ contents:"
ls dist/

echo "==> Installing Python dependencies..."
cd "$BACKEND_DIR"
pip install -r requirements.txt

echo "==> Build complete."
