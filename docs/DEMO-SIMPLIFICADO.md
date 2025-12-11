# 🎯 DEMO: Comandos Simplificados

## ✅ AHORA (Comandos Simples)

### 1. Auditar un archivo:
```bash
axel audit index.html
```

### 2. Auditar carpeta completa:
```bash
cd mi-proyecto
axel audit src/pages
```

### 3. Auditar desde cualquier lugar:
```bash
axel audit C:\proyecto\pages
```

### 4. Corregir automáticamente:
```bash
axel fix src/pages
```

### 5. Auditar carpeta actual:
```bash
cd pages
axel audit .
```

---

## ❌ ANTES (Comando Complicado)

```bash
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" audit "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\proyecto_final_clean\music_store_node\src\pages\index.html"
```

---

## 🚀 Mejoras Implementadas

### 1. **Instalación Global**
- ✅ Script `install-global.ps1` para Windows
- ✅ Script `install-global.sh` para Linux/Mac
- ✅ Comando global `axel` disponible desde cualquier carpeta

### 2. **Resolución Inteligente de Rutas**
- ✅ Acepta archivos individuales: `axel audit index.html`
- ✅ Acepta carpetas: `axel audit src/pages`
- ✅ Acepta rutas relativas: `axel audit .`
- ✅ Acepta rutas absolutas: `axel audit C:\proyecto\pages`
- ✅ Ignora automáticamente `node_modules`

### 3. **Interfaz Más Amigable**
- ✅ Mensajes en español
- ✅ Emojis para mejor visualización
- ✅ Resumen completo al final
- ✅ Tips útiles cuando hay errores
- ✅ Progreso claro con spinners

### 4. **Reportes Mejorados**
- ✅ Resumen final con estadísticas
- ✅ Contador de archivos procesados
- ✅ Total de violaciones y advertencias
- ✅ Sugerencias de siguiente paso

---

## 📦 Instalación Para Usuarios Finales

### Paso 1: Descargar
```bash
git clone https://github.com/ramonramosdev/axelbility.git
cd axelbility
```

### Paso 2: Instalar (Windows)
```powershell
# Abrir PowerShell como Administrador
.\install-global.ps1
```

### Paso 3: Usar
```bash
cd tu-proyecto
axel audit .
```

---

## 🎓 Para Usuarios Sin Conocimientos Técnicos

### Guía Visual Paso a Paso:

1. **Abrir PowerShell como Administrador**
   - Buscar "PowerShell" en Windows
   - Click derecho → "Ejecutar como administrador"

2. **Ir a la carpeta de axelbility**
   ```powershell
   cd Descargas\axelbility
   ```

3. **Ejecutar instalador**
   ```powershell
   .\install-global.ps1
   ```

4. **Cerrar y abrir nueva PowerShell normal**

5. **Ir a tu proyecto**
   ```powershell
   cd Documentos\mi-sitio-web
   ```

6. **Auditar**
   ```powershell
   axel audit .
   ```

7. **Corregir automáticamente**
   ```powershell
   axel fix .
   ```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Proyecto de Clase
```bash
cd C:\Users\alumno\Documentos\proyecto-web
axel audit .
axel fix .
```

### Ejemplo 2: Freelancer
```bash
cd cliente-123/sitio
axel audit src
axel fix src
```

### Ejemplo 3: Empresa
```bash
cd C:\Proyectos\ecommerce
axel audit frontend/pages
axel fix frontend/pages
```

---

## 🔥 Comparación

| Antes | Ahora |
|-------|-------|
| Ruta completa de 150+ caracteres | 2 palabras: `axel audit` |
| Solo un archivo a la vez | Carpetas completas |
| Mensajes técnicos en inglés | Mensajes claros en español |
| Sin resumen | Resumen completo con stats |
| Difícil de usar | Tan fácil como `npm install` |

---

## ✅ Checklist de Usabilidad

- [x] Comandos cortos y memorables
- [x] Funciona desde cualquier carpeta
- [x] Instalación automática
- [x] Mensajes de error claros
- [x] Tips y sugerencias útiles
- [x] Resumen de resultados
- [x] Progreso visual (spinners)
- [x] Soporte para carpetas
- [x] Ignora node_modules
- [x] Documentación simple

---

**🎉 Resultado: De 150 caracteres a 2 palabras**

```bash
# Antes
node "C:\Users\...\Desktop\axelbility\bin\cli.js" audit "C:\Users\...\proyecto\pages\index.html"

# Ahora
axel audit .
```
