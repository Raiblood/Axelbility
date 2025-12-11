#!/bin/bash
# Script de instalación global de Axelbility para Linux/Mac
# Ejecutar: chmod +x install-global.sh && ./install-global.sh

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   AXELBILITY - Instalación Global       ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Verificar Node.js
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js encontrado: $NODE_VERSION"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Instalando dependencias..."
    npm install
fi

# Crear link global
echo ""
echo "🔗 Creando comandos globales..."
npm link

echo ""
echo "✅ ¡Instalación completada!"
echo ""
echo "📚 Comandos disponibles:"
echo "   axel audit <archivo.html>      - Auditar un archivo"
echo "   axel audit <carpeta>            - Auditar todos los HTML de una carpeta"
echo "   axel fix <archivo.html>         - Corregir automáticamente"
echo "   axel fix <carpeta>              - Corregir todos los HTML de una carpeta"
echo "   axel init                       - Crear configuración"
echo ""
echo "💡 Ejemplo de uso:"
echo "   axel audit mi-pagina.html"
echo "   axel fix src/pages"
echo ""
