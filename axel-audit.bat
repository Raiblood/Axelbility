@echo off
REM Script para auditar archivos HTML con Axelbility
REM Uso: axel-audit.bat [archivo o carpeta]
REM Ejemplo: axel-audit.bat .
REM Ejemplo: axel-audit.bat index.html

setlocal
set SCRIPT_DIR=%~dp0
node "%SCRIPT_DIR%bin\cli.js" audit %*
