# Script de atajos para Axelbility
# Guardar como: axel-shortcuts.ps1

# Función: Auditar
function Audit-Axel {
    param(
        [string]$Path = "."
    )
    
    $axelPath = "C:\Users\r.ramos.arias\AppData\Roaming\npm\node_modules\axelbility\bin\cli.js"
    
    if ($Path -eq ".") {
        $Path = Get-Location
    }
    
    node $axelPath audit $Path
}

# Función: Corregir
function Fix-Axel {
    param(
        [string]$Path = "."
    )
    
    $axelPath = "C:\Users\r.ramos.arias\AppData\Roaming\npm\node_modules\axelbility\bin\cli.js"
    
    if ($Path -eq ".") {
        $Path = Get-Location
    }
    
    node $axelPath fix $Path
}

# Crear alias cortos
Set-Alias -Name aa -Value Audit-Axel
Set-Alias -Name af -Value Fix-Axel

Write-Host ""
Write-Host "Atajos de Axelbility cargados!" -ForegroundColor Green
Write-Host ""
Write-Host "Comandos disponibles:" -ForegroundColor Cyan
Write-Host "   aa [archivo]     - Auditar archivo o carpeta" -ForegroundColor White
Write-Host "   af [archivo]     - Corregir archivo o carpeta" -ForegroundColor White
Write-Host ""
Write-Host "Ejemplos:" -ForegroundColor Yellow
Write-Host "   aa index.html    - Audita un archivo" -ForegroundColor Gray
Write-Host "   aa .             - Audita carpeta actual" -ForegroundColor Gray
Write-Host "   af productos.html - Corrige un archivo" -ForegroundColor Gray
Write-Host ""
