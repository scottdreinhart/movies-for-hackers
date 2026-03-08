#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Ensure node_modules has Windows-native binaries.

.DESCRIPTION
    Always does a clean pnpm install for the current (Windows) platform.
    This avoids stale cached modules and cross-platform binary mismatches.
    Install takes ~5-8s because pnpm reuses its global content store.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot
$nm   = Join-Path $root 'node_modules'

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
