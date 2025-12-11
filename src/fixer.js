// Auto-corrección de problemas de accesibilidad


/* # Este archivo contiene:
# - class AxelbilityFixer
# - fixFile()
# - fixIconAriaHidden()
# - fixAccordionAriaExpanded()
# - fixAccordionAriaControls()
# - fixButtonType() */

const fs = require('fs').promises;
const cheerio = require('cheerio');
const chalk = require('chalk');

class AxelbilityFixer {
  constructor() {
    this.fixes = [];
  }

  /**
   * Aplicar correcciones a un archivo
   * @param {string} filePath - Ruta al archivo
   * @param {Array} violations - Violaciones detectadas
   * @returns {Promise<Object>} - Resultado de correcciones
   */
  async fixFile(filePath, violations) {
    try {
      const html = await fs.readFile(filePath, 'utf-8');
      const $ = cheerio.load(html, { decodeEntities: false });

      // Filtrar solo violaciones auto-corregibles
      const fixableViolations = violations.filter(v => v.autoFixable);

      console.log(chalk.blue(`\n🔧 Aplicando ${fixableViolations.length} correcciones...\n`));

      // Aplicar cada corrección
      for (const violation of fixableViolations) {
        switch (violation.type) {
          case 'icon-missing-aria-hidden':
            this.fixIconAriaHidden($, violation);
            break;
          case 'accordion-missing-aria-expanded':
            this.fixAccordionAriaExpanded($, violation);
            break;
          case 'accordion-missing-aria-controls':
            this.fixAccordionAriaControls($, violation);
            break;
          case 'button-missing-type':
            this.fixButtonType($);
            break;
          case 'positive-tabindex':
            this.fixPositiveTabindex($, violation);
            break;
          case 'decorative-image-no-role':
            this.fixDecorativeImage($, violation);
            break;
          case 'table-th-no-scope':
            this.fixTableScope($);
            break;
          case 'redundant-role':
            this.fixRedundantRole($, violation);
            break;
          case 'missing-document-lang':
            this.fixDocumentLang($);
            break;
        }
      }

      // Guardar archivo modificado
      const fixedHtml = $.html();
      await fs.writeFile(filePath, fixedHtml, 'utf-8');

      return {
        success: true,
        fixesApplied: this.fixes.length,
        fixes: this.fixes
      };

    } catch (error) {
      throw new Error(`Error fixing ${filePath}: ${error.message}`);
    }
  }

  /**
   * Fix: Agregar aria-hidden a iconos
   */
  fixIconAriaHidden($, violation) {
    const iconSelectors = 'i.icon, i.fas, i.far, i.fab, i[class*="fa-"]';

    $(iconSelectors).each((i, elem) => {
      const $icon = $(elem);
      if (!$icon.attr('aria-hidden')) {
        $icon.attr('aria-hidden', 'true');
        this.fixes.push({
          type: violation.type,
          element: $icon.attr('class'),
          fix: 'Added aria-hidden="true"'
        });
        console.log(chalk.green(`  ✓ Fixed icon: ${$icon.attr('class')}`));
      }
    });
  }

  /**
   * Fix: Agregar aria-expanded a acordeones
   */
  fixAccordionAriaExpanded($, violation) {
    $('button[data-bs-toggle="collapse"]').each((i, elem) => {
      const $button = $(elem);
      if (!$button.attr('aria-expanded')) {
        $button.attr('aria-expanded', 'false');
        this.fixes.push({
          type: violation.type,
          target: $button.attr('data-bs-target'),
          fix: 'Added aria-expanded="false"'
        });
        console.log(chalk.green(`  ✓ Fixed accordion: ${$button.attr('data-bs-target')}`));
      }
    });
  }

  /**
   * Fix: Agregar aria-controls a acordeones
   */
  fixAccordionAriaControls($, violation) {
    $('button[data-bs-toggle="collapse"]').each((i, elem) => {
      const $button = $(elem);
      const target = $button.attr('data-bs-target');

      if (!$button.attr('aria-controls') && target) {
        const controlsId = target.replace('#', '');
        $button.attr('aria-controls', controlsId);
        this.fixes.push({
          type: violation.type,
          target: target,
          fix: `Added aria-controls="${controlsId}"`
        });
        console.log(chalk.green(`  ✓ Fixed accordion controls: ${target}`));
      }
    });
  }

  /**
   * Fix: Agregar type a botones
   */
  fixButtonType($) {
    $('button').each((i, elem) => {
      const $button = $(elem);
      if (!$button.attr('type')) {
        // Por defecto asignar "button"
        $button.attr('type', 'button');
        this.fixes.push({
          type: 'button-missing-type',
          fix: 'Added type="button"'
        });
        console.log(chalk.green(`  ✓ Fixed button type`));
      }
    });
  }

  /**
   * Fix: Eliminar tabindex positivos (cambiar a 0 o -1)
   */
  fixPositiveTabindex($, violation) {
    $('[tabindex]').each((i, elem) => {
      const $elem = $(elem);
      const tabindex = parseInt($elem.attr('tabindex'));
      
      if (tabindex > 0) {
        $elem.attr('tabindex', '0');
        this.fixes.push({
          type: 'positive-tabindex',
          fix: `Changed tabindex from ${tabindex} to 0`
        });
        console.log(chalk.green(`  ✓ Fixed tabindex: ${tabindex} → 0`));
      }
    });
  }

  /**
   * Fix: Agregar role="presentation" a imágenes decorativas
   */
  fixDecorativeImage($, violation) {
    $('img[alt=""]').each((i, elem) => {
      const $img = $(elem);
      const role = $img.attr('role');
      
      if (!role || (role !== 'presentation' && role !== 'none')) {
        $img.attr('role', 'presentation');
        this.fixes.push({
          type: 'decorative-image-no-role',
          fix: 'Added role="presentation"'
        });
        console.log(chalk.green(`  ✓ Fixed decorative image role`));
      }
    });
  }

  /**
   * Fix: Agregar scope a elementos th en tablas
   */
  fixTableScope($) {
    $('table th').each((i, elem) => {
      const $th = $(elem);
      
      if (!$th.attr('scope')) {
        // Detectar si es th de fila o columna
        const $parent = $th.parent();
        const isFirstRow = $parent.parent().children().first().is($parent);
        
        if (isFirstRow) {
          $th.attr('scope', 'col');
        } else {
          $th.attr('scope', 'row');
        }
        
        this.fixes.push({
          type: 'table-th-no-scope',
          fix: `Added scope="${$th.attr('scope')}"`
        });
        console.log(chalk.green(`  ✓ Fixed table header scope`));
      }
    });
  }

  /**
   * Fix: Eliminar roles redundantes
   */
  fixRedundantRole($, violation) {
    const redundantMappings = {
      'button': 'button',
      'link': 'a',
      'navigation': 'nav',
      'main': 'main',
      'banner': 'header',
      'contentinfo': 'footer'
    };
    
    Object.keys(redundantMappings).forEach(role => {
      const tag = redundantMappings[role];
      $(`${tag}[role="${role}"]`).each((i, elem) => {
        $(elem).removeAttr('role');
        this.fixes.push({
          type: 'redundant-role',
          element: tag,
          fix: `Removed redundant role="${role}"`
        });
        console.log(chalk.green(`  ✓ Removed redundant role from <${tag}>`));
      });
    });
  }

  /**
   * Fix: Agregar atributo lang al documento
   */
  fixDocumentLang($) {
    const $html = $('html');
    if (!$html.attr('lang')) {
      $html.attr('lang', 'es');
      this.fixes.push({
        type: 'missing-document-lang',
        fix: 'Added lang="es"'
      });
      console.log(chalk.green(`  ✓ Added document lang`));
    }
  }
}

module.exports = AxelbilityFixer;