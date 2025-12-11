// Generación de reportes de auditoría
const chalk = require('chalk');
const fs = require('fs').promises;

class AxelbilityReporter {

  /**
   * Generar reporte en consola
   */
  static printConsoleReport(results) {
    console.log('\n' + chalk.bold.blue('═══════════════════════════════════════════'));
    console.log(chalk.bold.blue('          AXELBILITY AUDIT REPORT          '));
    console.log(chalk.bold.blue('═══════════════════════════════════════════') + '\n');

    console.log(chalk.cyan(`📄 File: ${results.file}`));
    console.log(chalk.cyan(`✓ Passed: ${results.passed ? chalk.green('YES') : chalk.red('NO')}`));
    console.log('');

    // Violations
    if (results.violations.length > 0) {
      console.log(chalk.red.bold(`\n❌ ${results.violations.length} VIOLATIONS FOUND:\n`));

      results.violations.forEach((v, i) => {
        const severityColor = v.severity === 'critical' ? 'red' : 'yellow';
        console.log(chalk[severityColor](`  ${i + 1}. [${v.severity.toUpperCase()}] ${v.type}`));
        console.log(chalk.gray(`     ${v.message}`));
        console.log(chalk.gray(`     WCAG: ${v.wcag}`));
        if (v.autoFixable) {
          console.log(chalk.green(`     ✓ Auto-fixable`));
        }
        console.log('');
      });
    } else {
      console.log(chalk.green.bold('\n✅ NO VIOLATIONS FOUND!\n'));
    }

    // Warnings
    if (results.warnings.length > 0) {
      console.log(chalk.yellow.bold(`\n⚠️  ${results.warnings.length} WARNINGS:\n`));

      results.warnings.forEach((w, i) => {
        console.log(chalk.yellow(`  ${i + 1}. ${w.type}`));
        console.log(chalk.gray(`     ${w.message}`));
        console.log('');
      });
    }

    // Summary
    console.log(chalk.blue('═══════════════════════════════════════════\n'));
    console.log(chalk.bold('SUMMARY:'));
    console.log(`  Total violations: ${chalk.red(results.violations.length)}`);
    console.log(`  Auto-fixable: ${chalk.green(results.violations.filter(v => v.autoFixable).length)}`);
    console.log(`  Warnings: ${chalk.yellow(results.warnings.length)}`);
    console.log(chalk.blue('\n═══════════════════════════════════════════\n'));
  }

  /**
   * Generar reporte HTML
   */
  static async generateHtmlReport(results, outputPath = './axelbility-report.html') {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Axelbility Report</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 { font-size: 2.5em; margin-bottom: 10px; }
        .header p { font-size: 1.2em; opacity: 0.9; }
        .content { padding: 40px; }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .summary-card {
            background: #f7fafc;
            border-left: 4px solid;
            padding: 20px;
            border-radius: 5px;
        }
        .summary-card.passed { border-color: #00CC66; }
        .summary-card.failed { border-color: #FF3366; }
        .summary-card h3 { font-size: 2em; margin-bottom: 5px; }
        .summary-card p { color: #666; }
        .violation {
            background: #fff5f5;
            border-left: 4px solid #FF3366;
            padding: 20px;
            margin-bottom: 15px;
            border-radius: 5px;
        }
        .violation.moderate { 
            background: #fffaf0; 
            border-color: #FFA500; 
        }
        .violation h3 { color: #FF3366; margin-bottom: 10px; }
        .violation.moderate h3 { color: #FFA500; }
        .violation p { color: #666; margin: 5px 0; }
        .badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 0.8em;
            font-weight: bold;
            margin-top: 10px;
        }
        .badge.auto-fix { background: #00CC66; color: white; }
        .badge.manual { background: #666; color: white; }
        .no-issues {
            text-align: center;
            padding: 60px 20px;
            color: #00CC66;
            font-size: 1.5em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚡ AXELBILITY</h1>
            <p>Accessibility Audit Report</p>
        </div>
        
        <div class="content">
            <div class="summary">
                <div class="summary-card ${results.passed ? 'passed' : 'failed'}">
                    <h3>${results.passed ? '✅' : '❌'}</h3>
                    <p>Status: ${results.passed ? 'PASSED' : 'FAILED'}</p>
                </div>
                <div class="summary-card">
                    <h3>${results.violations.length}</h3>
                    <p>Violations Found</p>
                </div>
                <div class="summary-card">
                    <h3>${results.violations.filter(v => v.autoFixable).length}</h3>
                    <p>Auto-fixable</p>
                </div>
                <div class="summary-card">
                    <h3>${results.warnings.length}</h3>
                    <p>Warnings</p>
                </div>
            </div>

            <h2 style="margin-bottom: 20px; color: #667eea;">📄 File: ${results.file}</h2>

            ${results.violations.length > 0 ? `
                <h2 style="margin: 30px 0 20px; color: #FF3366;">❌ Violations</h2>
                ${results.violations.map(v => `
                    <div class="violation ${v.severity}">
                        <h3>[${v.severity.toUpperCase()}] ${v.type}</h3>
                        <p><strong>Message:</strong> ${v.message}</p>
                        <p><strong>Element:</strong> &lt;${v.element}&gt;</p>
                        <p><strong>WCAG:</strong> ${v.wcag}</p>
                        <span class="badge ${v.autoFixable ? 'auto-fix' : 'manual'}">
                            ${v.autoFixable ? '✓ Auto-fixable' : 'Manual review required'}
                        </span>
                    </div>
                `).join('')}
            ` : `
                <div class="no-issues">
                    <div style="font-size: 3em; margin-bottom: 20px;">🎉</div>
                    <div>No accessibility violations found!</div>
                    <div style="font-size: 0.8em; color: #666; margin-top: 10px;">
                        Your code meets WCAG 2.1 AA standards
                    </div>
                </div>
            `}

            ${results.warnings.length > 0 ? `
                <h2 style="margin: 30px 0 20px; color: #FFA500;">⚠️ Warnings</h2>
                ${results.warnings.map(w => `
                    <div class="violation moderate">
                        <h3>${w.type}</h3>
                        <p>${w.message}</p>
                        <p><strong>WCAG:</strong> ${w.wcag}</p>
                    </div>
                `).join('')}
            ` : ''}
        </div>
    </div>
</body>
</html>
        `;

    await fs.writeFile(outputPath, html, 'utf-8');
    console.log(chalk.green(`\n✅ HTML report generated: ${outputPath}\n`));
  }

  /**
   * Generar reporte JSON
   */
  static async generateJsonReport(results, outputPath = './axelbility-report.json') {
    const json = JSON.stringify(results, null, 2);
    await fs.writeFile(outputPath, json, 'utf-8');
    console.log(chalk.green(`\n✅ JSON report generated: ${outputPath}\n`));
  }
}

module.exports = AxelbilityReporter;