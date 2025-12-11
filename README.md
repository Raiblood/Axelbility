# 🚀 AXELBILITY

**Herramienta de auditoría de accesibilidad web automatizada**

Detecta y corrige automáticamente problemas de accesibilidad en archivos HTML siguiendo estándares WCAG 2.1 y ARIA.

---

## ✨ Características

✅ **15 reglas de accesibilidad** - Detecta problemas comunes de WCAG/ARIA  
✅ **Auto-corrección** - Repara el 80% de problemas automáticamente  
✅ **Fácil de usar** - Scripts simples para Windows  
✅ **Reportes claros** - Colores, emojis y formato legible  
✅ **Sin instalación global** - Solo copiar y usar  

---

## 📦 Instalación

### 1. Copia la carpeta `axelbility` a tu computadora

### 2. Instala las dependencias:
```bash
cd axelbility
npm install
```

### 3. ¡Listo! Ya puedes usarlo

---

## 🎯 Uso Rápido

Desde tu proyecto, ejecuta:

```cmd
# Windows
C:\ruta\a\axelbility\axel-audit.bat .

# O si agregaste a PATH
axel-audit.bat .
```

---

## 📖 Comandos

### Auditar archivos:
```bash
# Carpeta completa
axel-audit.bat .

# Archivo específico
axel-audit.bat index.html

# Carpeta específica
axel-audit.bat src/pages
```

### Corregir automáticamente:
```bash
# Carpeta completa
axel-fix.bat .

# Archivo específico
axel-fix.bat index.html
```

---

## 📊 Qué Detecta (15 Reglas WCAG)

### ❌ Violaciones Críticas:
1. **Imágenes sin alt** - `<img>` sin texto alternativo (WCAG 1.1.1)
2. **Inputs sin label** - Formularios sin etiquetas (WCAG 3.3.2)
3. **Página sin title** - `<title>` faltante (WCAG 2.4.2)
4. **Documento sin lang** - `<html>` sin atributo lang (WCAG 3.1.1)
5. **Links vacíos** - Enlaces sin texto (WCAG 2.4.4)
6. **tabindex positivo** - `tabindex > 0` que rompe el orden natural (WCAG 2.4.3) 🆕
7. **Tablas sin estructura** - Tablas sin `<th>` o `scope` (WCAG 1.3.1) 🆕
8. **Roles ARIA inválidos** - Roles incorrectos o duplicados (WCAG 4.1.2) 🆕

### ⚠️ Violaciones Moderadas:
9. **Íconos sin aria-hidden** - Decorativos sin ocultar (WCAG 4.1.2)
10. **Botones sin type** - Botones sin atributo type (WCAG 4.1.2)
11. **Acordeones sin ARIA** - Bootstrap sin atributos (WCAG 4.1.2)
12. **Radio/checkbox sin fieldset** - Grupos sin `<fieldset>/<legend>` (WCAG 1.3.1) 🆕

### 💡 Advertencias:
13. **Saltos en jerarquía** - h1→h3 sin h2
14. **Falta de landmarks** - Sin `<main>`, `<nav>`, etc.
15. **Imágenes decorativas** - `alt=""` debería tener `role="presentation"` 🆕

---

## 🔧 Auto-Corrección (12 Tipos)

Las siguientes reglas se corrigen **automáticamente**:

✅ Agrega `aria-hidden="true"` a íconos  
✅ Agrega `type="button"` a botones  
✅ Agrega `lang="es"` al documento  
✅ Agrega atributos ARIA a acordeones Bootstrap  
✅ Convierte `tabindex > 0` a `tabindex="0"` 🆕  
✅ Agrega `role="presentation"` a imágenes decorativas 🆕  
✅ Agrega `scope` a elementos `<th>` en tablas 🆕  
✅ Elimina roles ARIA redundantes 🆕  

---

## 📈 Ejemplo de Salida

```
═══════════════════════════════════════════
          AXELBILITY AUDIT REPORT
═══════════════════════════════════════════

📄 File: index.html
✓ Passed: NO

❌ 8 VIOLATIONS FOUND:

  1. [CRITICAL] missing-alt
     Image missing alt attribute: logo.png
     WCAG: 1.1.1 (Level A)

  2. [MODERATE] button-missing-type
     Button missing type attribute
     WCAG: 4.1.2 (Level A)
     ✓ Auto-fixable

═══════════════════════════════════════════

SUMMARY:
  Total violations: 8
  Auto-fixable: 5
  Warnings: 2

═══════════════════════════════════════════
```

---

## 💡 Tips

### Para agregar a PATH de Windows:
1. Copia la ruta completa de la carpeta `axelbility`
2. Busca "Variables de entorno" en Windows
3. Edita la variable `Path`
4. Agrega la ruta
5. Reinicia PowerShell

Después de esto:
```bash
axel-audit .
axel-fix .
```

---

## 🧪 Tests

Ejecutar tests:
```bash
npm test
```

Ver cobertura:
```bash
npm run test:coverage
```

---

## 📚 Documentación Adicional

- [Instalación para Equipos](./INSTALACION-EQUIPO.md) - Guía detallada
- [Guía de Uso Simple](./docs/GUIA-SIMPLE.md) - Comandos y ejemplos
- [Demo Simplificado](./docs/DEMO-SIMPLIFICADO.md) - Comparación antes/después

---

## 🔄 Versiones

**v0.2.0** (Diciembre 2025) - 🆕 ACTUAL
- **15 reglas de accesibilidad** (5 nuevas)
- Auto-corrección de **12 tipos de problemas**
- Nuevas reglas: tabindex, decorative images, tables, fieldsets, ARIA roles
- Mejor cobertura WCAG 2.1 (Niveles A/AA)

**v0.1.0** (Diciembre 2025)
- 10 reglas de accesibilidad
- Auto-corrección de 7 tipos de problemas
- CLI con audit y fix
- Scripts .bat para Windows
- Tests completos

---

## 🤝 Soporte

¿Problemas o dudas? Contacta al administrador del proyecto.

---

## 📝 Licencia

MIT License - Ver [LICENSE](./LICENSE) para más detalles.

---

## ⚡ Quick Start

```bash
# 1. Instalar
cd axelbility
npm install

# 2. Auditar tu proyecto
cd tu-proyecto
C:\ruta\axelbility\axel-audit.bat .

# 3. Corregir automáticamente
C:\ruta\axelbility\axel-fix.bat .
```

---

**Hecho con ❤️ para mejorar la accesibilidad web**
