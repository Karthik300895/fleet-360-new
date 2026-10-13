#!/usr/bin/env bash
# Run on Ubuntu server (PuTTY) from repo root: bash scripts/server-update.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "==> Discard generated manifest so git pull can run"
git checkout -- public/acl-markdown-files.json 2>/dev/null || true

echo "==> Pull latest main"
git pull origin main

echo "==> Build"
npm run build

echo "==> PM2"
if ! command -v pm2 >/dev/null 2>&1; then
  echo "pm2 not installed. Start manually: npm run start:local"
  exit 1
fi

if [[ ! -f ecosystem.config.cjs ]]; then
  echo "ERROR: ecosystem.config.cjs missing after pull — push it from your dev machine first."
  exit 1
fi

pm2 startOrReload ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs
pm2 save

echo "==> Health check"
curl -sf "http://127.0.0.1:3000/api/health" && echo ""
