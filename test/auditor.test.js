// Tests para el motor de auditoría
const Axelbility = require('../src/index');
const fs = require('fs').promises;
const path = require('path');

describe('Axelbility Auditor', () => {
  let auditor;
  const fixturesPath = path.join(__dirname, 'fixtures');

  beforeEach(() => {
    auditor = new Axelbility();
  });

  // ========== TESTS ORIGINALES ==========

  test('should detect missing alt text', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-alt.html');
    const results = await auditor.auditFile(htmlPath);

    const altViolations = results.violations.filter(v => v.type === 'missing-alt');
    expect(altViolations.length).toBeGreaterThan(0);
  });

  test('should pass clean HTML', async () => {
    const htmlPath = path.join(fixturesPath, 'clean.html');
    const results = await auditor.auditFile(htmlPath);

    expect(results.passed).toBe(true);
    expect(results.violations.length).toBe(0);
  });

  // ========== NUEVOS TESTS (AÑADIR ESTAS LÍNEAS) ==========

  test('should detect missing aria-hidden on icons', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-aria.html');
    const results = await auditor.auditFile(htmlPath);

    const ariaViolations = results.violations.filter(v => v.type === 'icon-missing-aria-hidden');
    expect(ariaViolations.length).toBeGreaterThan(0);
    expect(ariaViolations.length).toBe(5); // Hay 5 iconos en missing-aria.html
  });

  test('should detect missing button types', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-aria.html');
    const results = await auditor.auditFile(htmlPath);

    const buttonViolations = results.violations.filter(v => v.type === 'button-missing-type');
    expect(buttonViolations.length).toBeGreaterThan(0);
    expect(buttonViolations.length).toBe(6); // 3 botones normales + 3 acordeones
  });

  test('should detect accordion missing aria-expanded', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-aria.html');
    const results = await auditor.auditFile(htmlPath);

    const accordionViolations = results.violations.filter(v => v.type === 'accordion-missing-aria-expanded');
    expect(accordionViolations.length).toBeGreaterThan(0);
    expect(accordionViolations.length).toBe(3); // 3 acordeones sin aria-expanded
  });

  test('should detect accordion missing aria-controls', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-aria.html');
    const results = await auditor.auditFile(htmlPath);

    const accordionViolations = results.violations.filter(v => v.type === 'accordion-missing-aria-controls');
    expect(accordionViolations.length).toBeGreaterThan(0);
    expect(accordionViolations.length).toBe(3); // 3 acordeones sin aria-controls
  });

  test('should mark violations as auto-fixable', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-aria.html');
    const results = await auditor.auditFile(htmlPath);

    const autoFixableCount = results.violations.filter(v => v.autoFixable).length;
    expect(autoFixableCount).toBeGreaterThan(0);
    // Todos los problemas de ARIA son auto-fixables
    expect(autoFixableCount).toBe(results.violations.length);
  });

  test('should detect multiple violation types in one file', async () => {
    const htmlPath = path.join(fixturesPath, 'missing-aria.html');
    const results = await auditor.auditFile(htmlPath);

    // Debería encontrar al menos 3 tipos diferentes de violaciones
    const violationTypes = [...new Set(results.violations.map(v => v.type))];
    expect(violationTypes.length).toBeGreaterThanOrEqual(3);

    // Verificar que contiene los tipos esperados
    expect(violationTypes).toContain('icon-missing-aria-hidden');
    expect(violationTypes).toContain('button-missing-type');
    expect(violationTypes).toContain('accordion-missing-aria-expanded');
    expect(violationTypes).toContain('accordion-missing-aria-controls');
  });

  // ========== FIN NUEVOS TESTS ==========

});