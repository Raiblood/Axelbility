# Documentación de Axelbility

## Índice

1. [Introducción](#introducción)
2. [Instalación](#instalación)
3. [Uso Básico](#uso-básico)
4. [API](#api)
5. [Reglas de Auditoría](#reglas-de-auditoría)
6. [Contribuir](#contribuir)

## Introducción

Axelbility es una herramienta de auditoría de accesibilidad web que ayuda a detectar y corregir problemas de accesibilidad en sitios web según las pautas WCAG 2.1.

### Características

- 🔍 **Auditoría completa**: Detecta problemas de accesibilidad en HTML
- 🔧 **Auto-corrección**: Corrige automáticamente problemas comunes
- 📊 **Reportes**: Genera reportes en HTML, JSON y Markdown
- ⚡ **CLI**: Interfaz de línea de comandos fácil de usar
- 🧪 **Extensible**: Sistema de reglas modular

## Instalación

```bash
npm install axelbility
```

O globalmente para usar la CLI:

```bash
npm install -g axelbility
```

## Uso Básico

### Como módulo de Node.js

```javascript
const Axelbility = require('axelbility');

const axelbility = new Axelbility();

// Auditar HTML
const results = await axelbility.audit(html);
console.log(results);

// Corregir problemas
const fixed = await axelbility.fix(html);
console.log(fixed.html);

// Generar reporte
const report = await axelbility.report(results, 'html');
```

### Desde la línea de comandos

```bash
# Auditar un archivo
axelbility audit index.html

# Corregir problemas
axelbility fix index.html --output index.fixed.html

# Generar reporte
axelbility report index.html --format html --output reporte.html
```

## API

### `Axelbility`

Clase principal de la herramienta.

#### Constructor

```javascript
new Axelbility(options)
```

**Parámetros:**
- `options` (Object): Opciones de configuración

#### Métodos

##### `audit(html)`

Audita un documento HTML.

**Parámetros:**
- `html` (String): Contenido HTML a auditar

**Retorna:** Promise<Object> - Resultados de la auditoría

##### `fix(html)`

Corrige automáticamente problemas de accesibilidad.

**Parámetros:**
- `html` (String): Contenido HTML a corregir

**Retorna:** Promise<Object> - HTML corregido y lista de correcciones

##### `report(results, format)`

Genera un reporte de auditoría.

**Parámetros:**
- `results` (Object): Resultados de auditoría
- `format` (String): Formato del reporte ('html', 'json', 'markdown')

**Retorna:** Promise<String> - Reporte generado

## Reglas de Auditoría

### Reglas ARIA

- **aria-required-attr**: Verifica atributos ARIA requeridos
- **aria-valid-attr**: Valida valores de atributos ARIA
- **aria-hidden-focus**: Detecta elementos enfocables dentro de aria-hidden

### Reglas de Imágenes

- **img-alt**: Verifica presencia de atributo alt en imágenes
- **img-alt-decorative**: Valida imágenes decorativas
- **img-alt-meaningful**: Verifica que el texto alt sea descriptivo

### Reglas de Color

- **color-contrast**: Verifica contraste de color según WCAG AA
- **color-alone**: Valida que no se use solo color para transmitir información
- **link-contrast**: Verifica contraste de enlaces

## Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## Licencia

MIT
