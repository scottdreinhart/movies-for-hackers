#!/usr/bin/env bash
# ------------------------------------------------------------------
# Ensure node_modules has Linux-native binaries.
#
# Checks if node_modules already contains Linux-native platform
# binaries.  If so, skips reinstall (avoids expensive tar copy).
# Otherwise does a clean install on the native ext4 filesystem,
# then tars the result into the NTFS project directory.  This avoids:
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

# Detect if modules are already Linux-native
LINUX_MARKER="$NM/@esbuild/linux-x64"
BIN_DIR="$NM/.bin"

if [ -d "$LINUX_MARKER" ] && [ -d "$BIN_DIR" ]; then
    echo "  [linux] node_modules already has Linux binaries — skipping reinstall"
    exit 0
fi

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
