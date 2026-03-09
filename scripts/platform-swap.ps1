#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Ensure node_modules has Windows-native binaries.

.DESCRIPTION
    Checks if node_modules already contains Windows-native platform binaries.
    If so, skips reinstall (avoids file-lock conflicts when called from pnpm).
    If modules are missing or from another platform, does a clean pnpm install.
    Install takes ~5-8s because pnpm reuses its global content store.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot
$nm   = Join-Path $root 'node_modules'

# Detect if modules are already Windows-native by checking platform-specific dirs
$winMarker = Join-Path $nm '@esbuild\win32-x64'
$binDir    = Join-Path $nm '.bin'

if ((Test-Path $winMarker) -and (Test-Path $binDir)) {
    Write-Host '  [windows] node_modules already has Windows binaries — skipping reinstall' -ForegroundColor Green
    exit 0
}

Write-Host '  [windows] Cleaning node_modules...' -ForegroundColor Cyan
if (Test-Path $nm) {
    # robocopy /MOVE to a temp dir handles long paths that Remove-Item chokes on
    $tmp = Join-Path $env:TEMP "nm_cleanup_$(Get-Random)"
    robocopy $nm $tmp /MOVE /E /NFL /NDL /NJH /NJS /NC /NS /NP | Out-Null
    Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host '  [windows] Installing (pnpm install)...' -ForegroundColor Cyan
Push-Location $root
pnpm install
Pop-Location

Write-Host '  [windows] Ready' -ForegroundColor Green
