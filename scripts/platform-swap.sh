#!/usr/bin/env bash
# ------------------------------------------------------------------
# Ensure node_modules has Linux-native binaries.
#
# Always does a clean install on the native ext4 filesystem, then
# tars the result into the NTFS project directory.  This avoids:
#   - pnpm EACCES rename failures on NTFS from WSL
#   - stale cached .bin stubs with broken require() paths
#
# Install takes ~5-8s because pnpm reuses its global content store.
# ------------------------------------------------------------------
set -euo pipefail

# Load nvm so the right Node is on PATH
# shellcheck disable=SC1091
source ~/.nvm/nvm.sh 2>/dev/null || true

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NM="$ROOT/node_modules"

echo "  [linux] Cleaning node_modules..."
rm -rf "$NM" 2>/dev/null || true

echo "  [linux] Installing on ext4 (pnpm install)..."
TMPDIR=$(mktemp -d)
cp "$ROOT/package.json" "$ROOT/pnpm-lock.yaml" "$TMPDIR/"
cp "$ROOT/.npmrc" "$TMPDIR/" 2>/dev/null || true
cd "$TMPDIR"
pnpm install

echo "  [linux] Copying modules to project (tar)..."
tar cf - node_modules | (cd "$ROOT" && tar xf -)
rm -rf "$TMPDIR"

echo "  [linux] Ready"
