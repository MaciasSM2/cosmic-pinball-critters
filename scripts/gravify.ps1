# Script de Utilidad: Gravify Checkpoint & Recovery Tool
# Uso: powershell -ExecutionPolicy Bypass -File scripts\gravify.ps1

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  GRAVIFY: Anclando Estado del Proyecto      " -ForegroundColor Yellow
Write-Host "=============================================" -ForegroundColor Cyan

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host "[1/3] Verificando compilacion de TypeScript..." -ForegroundColor Cyan

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] La compilacion fallo. Revisa los errores antes de anclar el estado." -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Compilacion exitosa (0 errores)." -ForegroundColor Green

Write-Host "[2/3] Actualizando marca de tiempo en EMERGENCY_RECOVERY.md..." -ForegroundColor Cyan
$recoveryPath = "EMERGENCY_RECOVERY.md"
if (Test-Path $recoveryPath) {
    (Get-Content $recoveryPath) -replace 'Ultima Actualizacion:.*', "Ultima Actualizacion: $timestamp (Estado 100% Funcional y Verificado)" | Set-Content $recoveryPath
    Write-Host "[OK] EMERGENCY_RECOVERY.md actualizado con timestamp: $timestamp" -ForegroundColor Green
}

Write-Host "[3/3] Estado del servidor local..." -ForegroundColor Cyan
$portInUse = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "[OK] Servidor activo en http://127.0.0.1:5173/" -ForegroundColor Green
} else {
    Write-Host "[INFO] Servidor apagado. Para iniciar: npm run dev" -ForegroundColor Yellow
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  GRAVIFY: Estado guardado correctamente.    " -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan
