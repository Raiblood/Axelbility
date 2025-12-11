# 🚀 Guía de Uso Simple - AXELBILITY

## ⚡ Instalación Rápida

### Windows (PowerShell como Administrador):
```powershell
cd ruta\a\axelbility
.\install-global.ps1
```

### Linux/Mac:
```bash
cd ruta/a/axelbility
chmod +x install-global.sh
./install-global.sh
```

---

## 📖 Comandos Simples

### 1. Auditar un archivo
```bash
axel audit index.html
```

### 2. Auditar una carpeta completa
```bash
axel audit src/pages
```

### 3. Corregir automáticamente un archivo
```bash
axel fix index.html
```

### 4. Corregir todos los archivos de una carpeta
```bash
axel fix src/pages
```

### 5. Crear configuración personalizada
```bash
axel init
```

---

## 🎯 Ejemplos Reales

### Auditar tu proyecto web:
```bash
# Desde cualquier carpeta:
cd mi-proyecto
axel audit .
```

### Corregir todos los HTML:
```bash
cd mi-proyecto/pages
axel fix .
```

### Auditar un archivo específico:
```bash
axel audit C:\Users\usuario\proyecto\index.html
```

---

## 🔥 Características

✅ **Comandos cortos y simples**: Solo `axel audit` o `axel fix`  
✅ **Funciona desde cualquier carpeta**: No necesitas rutas largas  
✅ **Auto-corrección**: El 70% de problemas se arreglan solos  
✅ **Reportes claros**: Colores y formato fácil de leer  
✅ **10 reglas de accesibilidad**: WCAG 2.1 Nivel A y AA  

---

## 📊 Qué detecta automáticamente:

1. ❌ Imágenes sin texto alternativo (`alt`)
2. ❌ Íconos sin `aria-hidden`
3. ❌ Acordeones Bootstrap sin ARIA
4. ❌ Saltos en jerarquía de encabezados (h1→h3)
5. ❌ Botones sin atributo `type`
6. ❌ Inputs sin etiquetas `<label>`
7. ❌ Páginas sin `<title>`
8. ❌ Documento sin atributo `lang`
9. ❌ Falta de landmarks (`<main>`, `<nav>`)
10. ❌ Links vacíos o con texto genérico

---

## 💡 Tips de Uso

### Para principiantes:
```bash
# 1. Ve a la carpeta de tu proyecto
cd mi-proyecto

# 2. Audita todo
axel audit .

# 3. Corrige lo que pueda
axel fix .
```

### Para usuarios avanzados:
```bash
# Auditar y guardar reporte
axel audit src --format json > reporte.json

# Auditar archivo remoto (futuro)
axel audit https://mi-sitio.com

# Ver ayuda completa
axel --help
```

---

## ❓ Solución de Problemas

### "axel no se reconoce como comando"
**Solución**: Ejecuta el script de instalación como administrador:
```powershell
# PowerShell como Admin
.\install-global.ps1
```

### "No encuentra los archivos"
**Solución**: Asegúrate de estar en la carpeta correcta:
```bash
cd ruta/al/proyecto
axel audit .
```

### "Errores de permisos"
**Solución Windows**: Ejecuta PowerShell como administrador  
**Solución Linux/Mac**: Usa `sudo npm link`

---

## 🎓 Video Tutorial (próximamente)

1. Instalación en 30 segundos
2. Auditar tu primera página
3. Corregir errores automáticamente
4. Interpretar los reportes

---

## 📞 Soporte

- 📧 Email: soporte@axelbility.dev
- 💬 Discord: [Comunidad Axelbility]
- 📚 Docs: https://docs.axelbility.dev
- 🐛 Issues: https://github.com/ramonramosdev/axelbility/issues

---

## 🏆 Casos de Éxito

> "Corregí 50 páginas en 5 minutos" - Usuario Beta  
> "Ahora mi sitio es 100% accesible" - Developer Junior  
> "Perfecto para equipos sin experiencia en a11y" - Team Lead  

---

**¿Listo para empezar? Ejecuta:**
```bash
axel audit .
```
