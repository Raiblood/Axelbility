// Punto de entrada principal de Axelbility
const fs = require('fs').promises;
const cheerio = require('cheerio');
const axe = require('axe-core');

class Axelbility {
  constructor(options = {}) {
    this.options = {
      strict: options.strict || false,
      autoFix: options.autoFix || false,
      rules: options.rules || this.getDefaultRules()
    };
    this.results = {
      violations: [],
      fixes: [],
      warnings: []
    };
  }

  /**
   * Auditar un archivo HTML
   * @param {string} filePath - Ruta al archivo HTML
   * @returns {Promise<Object>} - Resultados de auditoría
   */
  async auditFile(filePath) {
    try {
      // Leer archivo
      const html = await fs.readFile(filePath, 'utf-8');

      // Parsear HTML
      const $ = cheerio.load(html);

      // Ejecutar reglas
      await this.checkMissingAltText($);
      await this.checkAriaHidden($);
      await this.checkAccordionAria($);
      await this.checkHeadingOrder($);
      await this.checkButtonTypes($);
      await this.checkFormLabels($);
      await this.checkPageTitle($);
      await this.checkDocumentLang($);
      await this.checkLandmarks($);
      await this.checkLinkText($);
      await this.checkTabIndex($);
      await this.checkDecorativeImages($);
      await this.checkTableStructure($);
      await this.checkFormFieldsets($);
      await this.checkAriaRoles($);

      return {
        file: filePath,
        passed: this.results.violations.length === 0,
        violations: this.results.violations,
        fixes: this.results.fixes,
        warnings: this.results.warnings
      };

    } catch (error) {
      throw new Error(`Error auditing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Regla: Verificar imágenes sin alt text
   */
  async checkMissingAltText($) {
    $('img').each((i, elem) => {
      const $img = $(elem);
      const src = $img.attr('src') || 'unknown';

      if (!$img.attr('alt') && $img.attr('alt') !== '') {
        this.results.violations.push({
          type: 'missing-alt',
          severity: 'critical',
          element: 'img',
          src: src,
          message: `Image missing alt attribute: ${src}`,
          wcag: '1.1.1 (Level A)',
          line: this.getLineNumber($, elem)
        });
      }
    });
  }

  /**
   * Regla: Verificar iconos sin aria-hidden
   */
  async checkAriaHidden($) {
    const iconSelectors = 'i.icon, i.fas, i.far, i.fab, i[class*="fa-"]';

    $(iconSelectors).each((i, elem) => {
      const $icon = $(elem);

      if (!$icon.attr('aria-hidden')) {
        const className = $icon.attr('class') || 'unknown';

        this.results.violations.push({
          type: 'icon-missing-aria-hidden',
          severity: 'moderate',
          element: 'i',
          class: className,
          message: `Decorative icon missing aria-hidden="true": ${className}`,
          wcag: '4.1.2 (Level A)',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Regla: Verificar acordeones sin ARIA
   */
  async checkAccordionAria($) {
    $('button[data-bs-toggle="collapse"]').each((i, elem) => {
      const $button = $(elem);
      const target = $button.attr('data-bs-target');

      if (!$button.attr('aria-expanded')) {
        this.results.violations.push({
          type: 'accordion-missing-aria-expanded',
          severity: 'critical',
          element: 'button',
          target: target,
          message: `Accordion button missing aria-expanded: ${target}`,
          wcag: '4.1.2 (Level A)',
          autoFixable: true
        });
      }

      if (!$button.attr('aria-controls')) {
        this.results.violations.push({
          type: 'accordion-missing-aria-controls',
          severity: 'critical',
          element: 'button',
          target: target,
          message: `Accordion button missing aria-controls: ${target}`,
          wcag: '4.1.2 (Level A)',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Regla: Verificar orden de headings
   */
  async checkHeadingOrder($) {
    const headings = $('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;

    headings.each((i, elem) => {
      const currentLevel = parseInt(elem.tagName.replace('h', ''));

      if (currentLevel - lastLevel > 1) {
        this.results.warnings.push({
          type: 'heading-order-skip',
          severity: 'moderate',
          element: elem.tagName,
          message: `Heading skips level: ${elem.tagName} after h${lastLevel}`,
          wcag: '2.4.6 (Level AA)',
          autoFixable: false
        });
      }

      lastLevel = currentLevel;
    });
  }

  /**
   * Regla: Verificar botones sin type
   */
  async checkButtonTypes($) {
    $('button').each((i, elem) => {
      const $button = $(elem);

      if (!$button.attr('type')) {
        this.results.violations.push({
          type: 'button-missing-type',
          severity: 'moderate',
          element: 'button',
          message: 'Button missing type attribute (should be "button", "submit", or "reset")',
          wcag: '4.1.2 (Level A)',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Regla: Verificar inputs sin labels
   */
  async checkFormLabels($) {
    $('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"], textarea, select').each((i, elem) => {
      const $input = $(elem);
      const id = $input.attr('id');
      const name = $input.attr('name') || 'unknown';
      const type = $input.attr('type') || elem.tagName.toLowerCase();

      // Verificar si tiene label asociado
      const hasLabel = id && $(`label[for="${id}"]`).length > 0;
      const hasAriaLabel = $input.attr('aria-label') || $input.attr('aria-labelledby');
      const hasTitle = $input.attr('title');

      if (!hasLabel && !hasAriaLabel && !hasTitle) {
        this.results.violations.push({
          type: 'form-input-no-label',
          severity: 'critical',
          element: elem.tagName.toLowerCase(),
          name: name,
          message: `Form ${type} missing accessible label: ${name}`,
          wcag: '3.3.2 (Level A)',
          autoFixable: false
        });
      }
    });
  }

  /**
   * Regla: Verificar título de página
   */
  async checkPageTitle($) {
    const title = $('title').text().trim();

    if (!title || title.length === 0) {
      this.results.violations.push({
        type: 'missing-page-title',
        severity: 'critical',
        element: 'title',
        message: 'Page is missing a <title> element',
        wcag: '2.4.2 (Level A)',
        autoFixable: false
      });
    } else if (title.length < 3) {
      this.results.warnings.push({
        type: 'page-title-too-short',
        severity: 'moderate',
        element: 'title',
        message: `Page title is too short: "${title}"`,
        wcag: '2.4.2 (Level A)',
        autoFixable: false
      });
    }
  }

  /**
   * Regla: Verificar idioma del documento
   */
  async checkDocumentLang($) {
    const htmlLang = $('html').attr('lang');

    if (!htmlLang || htmlLang.trim().length === 0) {
      this.results.violations.push({
        type: 'missing-document-lang',
        severity: 'critical',
        element: 'html',
        message: 'Document is missing lang attribute on <html> element',
        wcag: '3.1.1 (Level A)',
        autoFixable: true
      });
    }
  }

  /**
   * Regla: Verificar landmarks ARIA
   */
  async checkLandmarks($) {
    const hasMain = $('main, [role="main"]').length > 0;
    const hasNav = $('nav, [role="navigation"]').length > 0;
    const hasHeader = $('header, [role="banner"]').length > 0;

    if (!hasMain) {
      this.results.warnings.push({
        type: 'missing-main-landmark',
        severity: 'moderate',
        element: 'main',
        message: 'Page should have a <main> landmark or role="main"',
        wcag: '2.4.1 (Level A)',
        autoFixable: false
      });
    }

    // Verificar múltiples main
    const mainCount = $('main, [role="main"]').length;
    if (mainCount > 1) {
      this.results.violations.push({
        type: 'multiple-main-landmarks',
        severity: 'moderate',
        element: 'main',
        message: `Page has ${mainCount} main landmarks, should have only one`,
        wcag: '2.4.1 (Level A)',
        autoFixable: false
      });
    }
  }

  /**
   * Regla: Verificar texto de enlaces
   */
  async checkLinkText($) {
    $('a').each((i, elem) => {
      const $link = $(elem);
      const text = $link.text().trim();
      const ariaLabel = $link.attr('aria-label');
      const title = $link.attr('title');
      const href = $link.attr('href');

      // Verificar enlaces vacíos
      if (!text && !ariaLabel && !title) {
        this.results.violations.push({
          type: 'empty-link-text',
          severity: 'critical',
          element: 'a',
          href: href || 'unknown',
          message: `Link has no accessible text: ${href}`,
          wcag: '2.4.4 (Level A)',
          autoFixable: false
        });
      }

      // Advertir sobre texto genérico
      const genericTexts = ['click here', 'read more', 'more', 'link', 'click', 'here', 'haga clic aquí', 'más'];
      if (text && genericTexts.includes(text.toLowerCase())) {
        this.results.warnings.push({
          type: 'generic-link-text',
          severity: 'moderate',
          element: 'a',
          text: text,
          message: `Link has generic text: "${text}" - consider more descriptive text`,
          wcag: '2.4.4 (Level A)',
          autoFixable: false
        });
      }
    });
  }

  /**
   * Regla 11: Verificar tabindex problemáticos
   * tabindex > 0 causa problemas de navegación por teclado
   */
  async checkTabIndex($) {
    $('[tabindex]').each((i, elem) => {
      const tabindex = parseInt($(elem).attr('tabindex'));
      
      if (tabindex > 0) {
        this.results.violations.push({
          type: 'positive-tabindex',
          severity: 'critical',
          element: elem.tagName,
          message: `Element has positive tabindex="${tabindex}" which disrupts natural tab order`,
          wcag: '2.4.3 (Level A)',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Regla 12: Verificar imágenes decorativas
   * Imágenes sin alt deben tener role="presentation" o alt=""
   */
  async checkDecorativeImages($) {
    $('img').each((i, elem) => {
      const $img = $(elem);
      const alt = $img.attr('alt');
      const role = $img.attr('role');
      const src = $img.attr('src') || 'unknown';
      
      // Si no tiene alt pero tampoco role="presentation", es un problema
      if (alt === undefined && role !== 'presentation' && role !== 'none') {
        // Ya lo detecta checkMissingAltText, pero agregamos contexto
        return;
      }
      
      // Si tiene alt vacío pero no tiene role="presentation"
      if (alt === '' && role !== 'presentation' && role !== 'none') {
        this.results.warnings.push({
          type: 'decorative-image-no-role',
          severity: 'minor',
          element: 'img',
          src: src,
          message: 'Image with empty alt should have role="presentation" for better semantics',
          wcag: '1.1.1 (Level A)',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Regla 13: Verificar estructura de tablas
   * Tablas de datos deben tener th, scope y caption
   */
  async checkTableStructure($) {
    $('table').each((i, elem) => {
      const $table = $(elem);
      const hasCaption = $table.find('caption').length > 0;
      const hasTh = $table.find('th').length > 0;
      const thWithScope = $table.find('th[scope]').length;
      const totalTh = $table.find('th').length;
      
      // Tabla sin caption
      if (!hasCaption) {
        this.results.warnings.push({
          type: 'table-missing-caption',
          severity: 'moderate',
          element: 'table',
          message: 'Table missing <caption> element for accessibility',
          wcag: '1.3.1 (Level A)',
          autoFixable: false
        });
      }
      
      // Tabla sin th (probablemente es tabla de datos)
      if (!hasTh && $table.find('tr').length > 1) {
        this.results.violations.push({
          type: 'table-missing-headers',
          severity: 'critical',
          element: 'table',
          message: 'Data table missing <th> header cells',
          wcag: '1.3.1 (Level A)',
          autoFixable: false
        });
      }
      
      // th sin scope
      if (hasTh && thWithScope < totalTh) {
        this.results.warnings.push({
          type: 'table-th-no-scope',
          severity: 'moderate',
          element: 'th',
          message: `${totalTh - thWithScope} <th> elements missing scope attribute`,
          wcag: '1.3.1 (Level A)',
          autoFixable: true
        });
      }
    });
  }

  /**
   * Regla 14: Verificar fieldsets en formularios
   * Grupos de inputs relacionados deben usar fieldset/legend
   */
  async checkFormFieldsets($) {
    $('form').each((i, elem) => {
      const $form = $(elem);
      const radioGroups = {};
      const checkboxGroups = {};
      
      // Buscar grupos de radio buttons
      $form.find('input[type="radio"]').each((j, input) => {
        const name = $(input).attr('name');
        if (name) {
          radioGroups[name] = (radioGroups[name] || 0) + 1;
        }
      });
      
      // Buscar grupos de checkboxes
      $form.find('input[type="checkbox"]').each((j, input) => {
        const name = $(input).attr('name');
        if (name) {
          checkboxGroups[name] = (checkboxGroups[name] || 0) + 1;
        }
      });
      
      // Verificar si grupos tienen fieldset
      Object.keys(radioGroups).forEach(name => {
        if (radioGroups[name] > 1) {
          const $radios = $form.find(`input[type="radio"][name="${name}"]`);
          const hasFieldset = $radios.closest('fieldset').length > 0;
          
          if (!hasFieldset) {
            this.results.violations.push({
              type: 'radio-group-no-fieldset',
              severity: 'moderate',
              element: 'input[type="radio"]',
              group: name,
              message: `Radio button group "${name}" should be wrapped in <fieldset> with <legend>`,
              wcag: '1.3.1 (Level A)',
              autoFixable: false
            });
          }
        }
      });
      
      Object.keys(checkboxGroups).forEach(name => {
        if (checkboxGroups[name] > 2) {
          const $checkboxes = $form.find(`input[type="checkbox"][name="${name}"]`);
          const hasFieldset = $checkboxes.closest('fieldset').length > 0;
          
          if (!hasFieldset) {
            this.results.warnings.push({
              type: 'checkbox-group-no-fieldset',
              severity: 'minor',
              element: 'input[type="checkbox"]',
              group: name,
              message: `Checkbox group "${name}" should consider using <fieldset> with <legend>`,
              wcag: '1.3.1 (Level A)',
              autoFixable: false
            });
          }
        }
      });
    });
  }

  /**
   * Regla 15: Verificar roles ARIA duplicados o incorrectos
   */
  async checkAriaRoles($) {
    const validRoles = [
      'alert', 'alertdialog', 'application', 'article', 'banner', 'button', 
      'checkbox', 'complementary', 'contentinfo', 'dialog', 'directory', 
      'document', 'form', 'grid', 'gridcell', 'group', 'heading', 'img', 
      'link', 'list', 'listbox', 'listitem', 'log', 'main', 'marquee', 
      'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox', 
      'menuitemradio', 'navigation', 'note', 'option', 'presentation', 
      'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup', 
      'rowheader', 'scrollbar', 'search', 'separator', 'slider', 'spinbutton', 
      'status', 'tab', 'tablist', 'tabpanel', 'textbox', 'timer', 'toolbar', 
      'tooltip', 'tree', 'treegrid', 'treeitem', 'none'
    ];
    
    // Verificar roles inválidos
    $('[role]').each((i, elem) => {
      const role = $(elem).attr('role');
      if (!validRoles.includes(role)) {
        this.results.violations.push({
          type: 'invalid-aria-role',
          severity: 'critical',
          element: elem.tagName,
          role: role,
          message: `Invalid ARIA role="${role}"`,
          wcag: '4.1.2 (Level A)',
          autoFixable: false
        });
      }
    });
    
    // Verificar roles duplicados que deberían ser únicos
    const uniqueRoles = ['main', 'banner', 'contentinfo'];
    uniqueRoles.forEach(role => {
      const elements = $(`[role="${role}"]`);
      if (elements.length > 1) {
        this.results.violations.push({
          type: 'duplicate-landmark-role',
          severity: 'critical',
          element: `[role="${role}"]`,
          count: elements.length,
          message: `Multiple elements with role="${role}" found (${elements.length}). Should be unique per page.`,
          wcag: '4.1.2 (Level A)',
          autoFixable: false
        });
      }
    });
    
    // Verificar conflictos role vs elemento nativo
    const conflicts = {
      'button': ['button'],
      'link': ['a'],
      'navigation': ['nav'],
      'main': ['main'],
      'banner': ['header'],
      'contentinfo': ['footer']
    };
    
    Object.keys(conflicts).forEach(role => {
      conflicts[role].forEach(tag => {
        $(`${tag}[role="${role}"]`).each((i, elem) => {
          this.results.warnings.push({
            type: 'redundant-role',
            severity: 'minor',
            element: tag,
            role: role,
            message: `Redundant role="${role}" on <${tag}> element (native semantics already provide this)`,
            wcag: '4.1.2 (Level A)',
            autoFixable: true
          });
        });
      });
    });
  }

  /**
   * Obtener número de línea aproximado (simplificado)
   */
  getLineNumber($, elem) {
    // Implementación básica - en producción usar parser más sofisticado
    return 'N/A';
  }

  /**
   * Reglas por defecto
   */
  getDefaultRules() {
    return [
      'missing-alt',
      'icon-missing-aria-hidden',
      'accordion-missing-aria',
      'heading-order',
      'button-missing-type',
      'form-input-no-label',
      'missing-page-title',
      'missing-document-lang',
      'missing-main-landmark',
      'empty-link-text',
      'positive-tabindex',
      'decorative-image-no-role',
      'table-structure',
      'form-fieldsets',
      'aria-roles'
    ];
  }
}

module.exports = Axelbility;