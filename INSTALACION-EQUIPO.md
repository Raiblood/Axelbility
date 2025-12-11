# 📦 AXELBILITY - Instalación para tu Equipo

## 🚀 Instalación Rápida (Windows)

### Paso 1: Copiar la carpeta
Copia toda la carpeta `axelbility` a tu computadora, por ejemplo:
```
C:\herramientas\axelbility\
```

### Paso 2: Instalar dependencias
Abre PowerShell en la carpeta de axelbility y ejecuta:
```powershell
npm install
```

### Paso 3: ¡Listo para usar!

---

## 📖 Cómo usar Axelbility

### Desde tu proyecto:

**Windows (PowerShell o CMD):**
```cmd
# Ir a tu proyecto
cd C:\mi-proyecto\pages

# Auditar todos los HTML
C:\herramientas\axelbility\axel-audit.bat .

# Corregir automáticamente
C:\herramientas\axelbility\axel-fix.bat .
```

---

## 💡 Atajos Opcionales (para no escribir la ruta completa)

### Opción A: Agregar a PATH de Windows

1. Copia la ruta: `C:\herramientas\axelbility`
2. Busca "Variables de entorno" en Windows
3. Edita la variable PATH
4. Agrega la ruta de axelbility
5. Reinicia PowerShell

Después de esto:
```cmd
cd tu-proyecto
axel-audit .
axel-fix .
```

### Opción B: Crear alias en PowerShell

Agrega esto a tu perfil de PowerShell:
```powershell
notepad $PROFILE
```

Pega esto:
```powershell
function aa { C:\herramientas\axelbility\axel-audit.bat $args }
function af { C:\herramientas\axelbility\axel-fix.bat $args }
```

Después:
```powershell
cd tu-proyecto
aa .    # Auditar
af .    # Corregir
```

---

## 🎯 Ejemplos de Uso

### Auditar un archivo:
```cmd
axel-audit.bat index.html
```

### Auditar carpeta completa:
```cmd
axel-audit.bat .
```

### Auditar carpeta específica:
```cmd
axel-audit.bat src/pages
```

### Corregir problemas automáticamente:
```cmd
axel-fix.bat .
```

---

## 📊 Qué detecta:

✅ Imágenes sin texto alternativo (`alt`)  
✅ Íconos sin `aria-hidden`  
✅ Acordeones Bootstrap sin ARIA  
✅ Saltos en jerarquía de encabezados  
✅ Botones sin atributo `type`  
✅ Inputs sin etiquetas `<label>`  
✅ Páginas sin `<title>`  
✅ Documento sin atributo `lang`  
✅ Falta de landmarks (`<main>`, `<nav>`)  
✅ Links vacíos o con texto genérico  

---

## ❓ Problemas Comunes

### "node no se reconoce como comando"
**Solución:** Instala Node.js desde https://nodejs.org (versión 18 o superior)

### "Cannot find module"
**Solución:** Ejecuta `npm install` dentro de la carpeta axelbility

### "No se encontraron archivos HTML"
**Solución:** Asegúrate de estar en la carpeta correcta con archivos .html

---

## 📞 Soporte

Si tienes dudas, contacta al administrador del proyecto.

---

**Versión:** 0.1.0  
**Fecha:** Diciembre 2025
