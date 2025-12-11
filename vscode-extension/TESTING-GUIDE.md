# Guía Rápida - Probar Extensión VS Code

## 🚀 Pasos para Probar

### 1. Abrir la extensión en VS Code
```bash
cd "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\vscode-extension"
code .
```

### 2. Iniciar modo desarrollo
- Presiona **F5** en VS Code
- Se abrirá una nueva ventana "[Extension Development Host]"

### 3. Probar la extensión
En la nueva ventana:
- Abre tu proyecto de prueba: `C:\...\Desktop\proyecto-prueba`
- Abre `index.html`
- **¡Verás los problemas aparecer automáticamente!**

### 4. Comandos disponibles
- **Ctrl+Shift+P** > "Axelbility: Audit Current File"
- **Ctrl+Alt+A** (atajo rápido)
- **Ctrl+Shift+P** > "Axelbility: Auto-fix Issues"

## 🎯 Qué Esperar Ver

### Panel de Problemas (Problems)
```
❌ missing-alt: Image missing alt attribute: producto1.jpg
⚠️ generic-link-text: Link has generic text: "read more"
```

### Al Auto-fix
- Los iconos sin `aria-hidden` se corregirán
- Los botones sin `type` se arreglarán
- Los acordeones tendrán ARIA correcto

## ⚡ Demo Rápida (Sin VS Code)

Si prefieres ver la funcionalidad primero:

```bash
# Crear archivo HTML de prueba
cd "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\proyecto-prueba"

# Auditar
node "C:\Users\r.ramos.arias\OneDrive - Accenture\Desktop\axelbility\bin\cli.js" audit index.html
```

## 🐛 Troubleshooting

Si hay errores:
1. Verifica que estés en la carpeta `vscode-extension`
2. Asegúrate de tener `node_modules` instalado
3. Cierra y vuelve a abrir VS Code

---

**¿Listo para probarlo?** 🎉
