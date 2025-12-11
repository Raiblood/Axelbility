# 🚀 Guía: Usar Axelbility en Tus Proyectos

## Opción 1: Comando Directo (Más Simple) ✅

### Para cualquier proyecto, usa:

```powershell
# Auditar un archivo
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" audit tu-archivo.html

# Auto-corregir
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" fix tu-archivo.html

# Auditar múltiples archivos
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" audit "src/**/*.html"
```

---

## Opción 2: Crear Alias en PowerShell (Recomendado) ⚡

### 1. Crear alias permanente

```powershell
# Abrir tu perfil de PowerShell
notepad $PROFILE

# Si no existe, créalo:
New-Item -Path $PROFILE -Type File -Force
notepad $PROFILE
```

### 2. Agregar al archivo:

```powershell
# Alias para Axelbility
function axel {
    node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" $args
}

# Alias cortos
function axel-audit { axel audit $args }
function axel-fix { axel fix $args }
```

### 3. Recargar perfil:

```powershell
. $PROFILE
```

### 4. Usar en cualquier proyecto:

```powershell
cd tu-proyecto
axel audit index.html
axel fix index.html
```

---

## Opción 3: Integrar en package.json del Proyecto 📦

En tu proyecto, agrega en `package.json`:

```json
{
  "scripts": {
    "a11y:audit": "node \"C:/Users/r.ramos.arias/OneDrive - Accenture/Desktop/axelbility/bin/cli.js\" audit",
    "a11y:fix": "node \"C:/Users/r.ramos.arias/OneDrive - Accenture/Desktop/axelbility/bin/cli.js\" fix",
    "a11y:check": "node \"C:/Users/r.ramos.arias/OneDrive - Accenture/Desktop/axelbility/bin/cli.js\" audit src/**/*.html"
  }
}
```

Luego:

```bash
npm run a11y:audit -- index.html
npm run a11y:fix -- index.html
npm run a11y:check
```

---

## Opción 4: VS Code Extension (Mejor Experiencia) 🎨

### Para probar la extensión en tu proyecto:

```powershell
# 1. Abrir la extensión
cd "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\vscode-extension"
code .

# 2. Presionar F5
# Se abre ventana de desarrollo

# 3. En esa ventana, abrir TU proyecto
File > Open Folder > [tu-proyecto]

# 4. Abrir cualquier HTML
# ¡Los problemas aparecen automáticamente!
```

---

## Ejemplo Práctico: Auditando Tu Proyecto 🎯

### Opción Rápida (Copy-Paste):

```powershell
# 1. Ve a tu proyecto
cd C:\ruta\a\tu-proyecto

# 2. Audita
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" audit index.html

# 3. Corrige
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" fix index.html
```

---

## Pre-commit Hook (Avanzado) 🔒

Para validar automáticamente antes de commits:

```bash
# En tu proyecto, crear .git/hooks/pre-commit
#!/bin/sh
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" audit $(git diff --cached --name-only --diff-filter=ACM | grep '.html$')
```

---

## ¿Cuál Método Prefieres?

1. **Comando directo** - Rápido, sin configuración
2. **Alias PowerShell** - Más cómodo, tipo `axel audit`
3. **npm scripts** - Estándar de Node.js
4. **VS Code Extension** - Mejor experiencia visual

**¿Cuál quieres que configure para ti?** 🚀
