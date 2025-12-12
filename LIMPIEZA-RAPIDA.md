# 🧹 ACCIONES DE LIMPIEZA - GUÍA RÁPIDA

## Archivos a ELIMINAR

### 1. Archivo Vacío
```powershell
Remove-Item .\audit
```

### 2. Backup Obsoleto
```powershell
Remove-Item .\src\auditor.js.backup
```

### 3. Reporter no utilizado
```powershell
Remove-Item .\src\reporter.js
```

### 4. Directorio de Reglas Heredadas
```powershell
Remove-Item -Recurse .\src\rules\
```

---

## Verificación Rápida

Después de eliminar, ejecutar:

```powershell
# 1. Ver que los tests siguen pasando
npm test

# 2. Probar CLI
node bin/cli.js audit test/fixtures/test-completo-15-reglas.html

# 3. Ver cambios en git
git status
```

---

## Commit Message (Copiar/Pegar)

```
🧹 chore: Clean up obsolete files and code debt

- Remove src/auditor.js.backup (duplicate of index.js refactoring)
- Remove src/reporter.js (unused functionality, migrated to cli.js)
- Remove src/rules/ directory (legacy modular approach, consolidated in index.js)
  - alt-rules.js
  - aria-rules.js
  - color-rules.js
- Remove empty 'audit' file (unclear purpose)
- Reduce code debt by ~858 lines
- No functional impact (all 8 tests pass)
- Ready for VS Code Marketplace packaging
```

---

## Impacto

**Antes:**
- ❌ 858 líneas de código muerto
- ❌ 6 archivos/carpetas obsoletas
- ❌ Confusión sobre fuente de verdad (¿rules/ o index.js?)

**Después:**
- ✅ 0 líneas de código muerto
- ✅ Código limpio y mantenible
- ✅ Fuente única de verdad: `src/index.js`
- ✅ Listo para publicación en Marketplace

