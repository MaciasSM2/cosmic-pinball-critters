# Script de Utilidad: Caveman Fast Diagnostic Tool
# Uso: powershell -ExecutionPolicy Bypass -File scripts\caveman.ps1

Write-Host "--- CAVEMAN STATUS ---" -ForegroundColor Yellow
$gitDiff = git status --short
if ($gitDiff) {
    Write-Host "Modificados:" -ForegroundColor Cyan
    Write-Host $gitDiff
} else {
    Write-Host "Git: Limpio (Sin cambios pendientes)." -ForegroundColor Green
}

$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "Vite: OK (5173)" -ForegroundColor Green
} else {
    Write-Host "Vite: APAGADO" -ForegroundColor Red
}
Write-Host "----------------------" -ForegroundColor Yellow
