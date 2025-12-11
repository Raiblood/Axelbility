@echo off
REM Script para corregir archivos HTML con Axelbility
REM Uso: axel-fix.bat [archivo o carpeta]
REM Ejemplo: axel-fix.bat .
REM Ejemplo: axel-fix.bat index.html

setlocal
set SCRIPT_DIR=%~dp0
node "%SCRIPT_DIR%bin\cli.js" fix %*
