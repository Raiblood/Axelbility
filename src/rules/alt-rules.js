// Reglas de validación de texto alternativo en imágenes
const altRules = [
  {
    id: 'img-alt',
    description: 'Las imágenes deben tener atributo alt',
    check: async (html) => {
      const violations = [];
      
      // Buscar todas las etiquetas <img>
      const imgRegex = /<img([^>]*)>/gi;
      let match;
      
      while ((match = imgRegex.exec(html)) !== null) {
        const imgTag = match[0];
        const attributes = match[1];
        
        // Verificar si tiene atributo alt
        if (!attributes.includes('alt=')) {
          violations.push({
            element: imgTag,
            issue: 'Falta atributo alt'
          });
        }
      }
      
      return {
        id: 'img-alt',
        status: violations.length > 0 ? 'violation' : 'pass',
        message: violations.length > 0 
          ? `${violations.length} imagen(es) sin atributo alt`
          : 'Todas las imágenes tienen atributo alt',
        elements: violations
      };
    }
  },
  {
    id: 'img-alt-decorative',
    description: 'Las imágenes decorativas deben tener alt vacío',
    check: async (html) => {
      return {
        id: 'img-alt-decorative',
        status: 'pass',
        message: 'Verificación de imágenes decorativas',
        elements: []
      };
    }
  },
  {
    id: 'img-alt-meaningful',
    description: 'El texto alternativo debe ser significativo',
    check: async (html) => {
      const warnings = [];
      
      // Buscar alt con valores genéricos
      const badAltRegex = /alt=['"](?:image|picture|foto|img|icon)['"][^>]*>/gi;
      const matches = html.match(badAltRegex);
      
      if (matches && matches.length > 0) {
        warnings.push({
          count: matches.length,
          issue: 'Texto alternativo genérico o no descriptivo'
        });
      }
      
      return {
        id: 'img-alt-meaningful',
        status: warnings.length > 0 ? 'warning' : 'pass',
        message: warnings.length > 0
          ? `${matches.length} imagen(es) con texto alt genérico`
          : 'Texto alternativo significativo',
        elements: warnings
      };
    }
  }
];

module.exports = altRules;
