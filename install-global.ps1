# Script de instalación global de Axelbility
# Ejecutar como administrador: .\install-global.ps1

Write-Host "`n╔══════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   AXELBILITY - Instalación Global       ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green

# Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "`n📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Crear link global
Write-Host "`n🔗 Creando comandos globales..." -ForegroundColor Yellow
npm link

Write-Host "`n✅ ¡Instalación completada!" -ForegroundColor Green
Write-Host "`n📚 Comandos disponibles:" -ForegroundColor Cyan
Write-Host "   axel audit <archivo.html>      - Auditar un archivo" -ForegroundColor White
Write-Host "   axel audit <carpeta>            - Auditar todos los HTML de una carpeta" -ForegroundColor White
Write-Host "   axel fix <archivo.html>         - Corregir automáticamente" -ForegroundColor White
Write-Host "   axel fix <carpeta>              - Corregir todos los HTML de una carpeta" -ForegroundColor White
Write-Host "   axel init                       - Crear configuración" -ForegroundColor White
Write-Host "`n💡 Ejemplo de uso:" -ForegroundColor Cyan
Write-Host "   axel audit mi-pagina.html" -ForegroundColor Yellow
Write-Host "   axel fix src/pages" -ForegroundColor Yellow
Write-Host ""
