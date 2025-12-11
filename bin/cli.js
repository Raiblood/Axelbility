

// Interfaz de línea de comandos para Axelbility//
/* #!/usr/bin / env node */
// filepath: bin/cli.js

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const Axelbility = require('../src/index');
const AxelbilityFixer = require('../src/fixer');
const AxelbilityReporter = require('../src/reporter');

// Helper: Resolver rutas y encontrar archivos HTML
function resolveHtmlFiles(inputPath) {
  const normalizedPath = path.resolve(inputPath);
  
  // Si es un archivo específico
  if (fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isFile()) {
    return [normalizedPath];
  }
  
  // Si es una carpeta, buscar todos los HTML
  if (fs.existsSync(normalizedPath) && fs.statSync(normalizedPath).isDirectory()) {
    const pattern = path.join(normalizedPath, '**', '*.html').replace(/\\/g, '/');
    const files = glob.sync(pattern, { 
      ignore: '**/node_modules/**',
      nodir: true,
      absolute: true
    });
    return files;
  }
  
  // Si es un patrón glob
  const pattern = normalizedPath.replace(/\\/g, '/');
  return glob.sync(pattern, { 
    ignore: '**/node_modules/**',
    nodir: true,
    absolute: true
  });
}

const program = new Command();

console.log(chalk.bold.blue(`
 █████╗ ██╗  ██╗███████╗██╗     ██████╗ ██╗██╗     ██╗████████╗██╗   ██╗
██╔══██╗╚██╗██╔╝██╔════╝██║     ██╔══██╗██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
███████║ ╚███╔╝ █████╗  ██║     ██████╔╝██║██║     ██║   ██║    ╚████╔╝ 
██╔══██║ ██╔██╗ ██╔══╝  ██║     ██╔══██╗██║██║     ██║   ██║     ╚██╔╝  
██║  ██║██╔╝ ██╗███████╗███████╗██████╔╝██║███████╗██║   ██║      ██║   
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝ ╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝   
`));
console.log(chalk.gray('         Accessibility validation, automated.\n'));

program
  .name('axelbility')
  .description('AI-powered accessibility automation agent')
  .version('0.1.0');

program
  .command('audit <path>')
  .description('Audit HTML file(s) or folder for accessibility issues')
  .option('-s, --strict', 'Strict mode (fail on warnings)')
  .option('-r, --report <format>', 'Generate report (html|json)', 'console')
  .action(async (inputPath, options) => {
    const spinner = ora('🔍 Buscando archivos HTML...').start();

    try {
      const files = resolveHtmlFiles(inputPath);

      if (files.length === 0) {
        spinner.fail(chalk.red('❌ No se encontraron archivos HTML'));
        console.log(chalk.yellow('\n💡 Tip: Asegúrate de estar en la carpeta correcta o proporciona una ruta válida\n'));
        process.exit(1);
      }

      spinner.succeed(chalk.green(`✅ ${files.length} archivo(s) encontrado(s)`));
      console.log('');

      const auditor = new Axelbility({ strict: options.strict });
      let totalViolations = 0;
      let totalWarnings = 0;
      let filesWithIssues = 0;

      for (const file of files) {
        const results = await auditor.auditFile(file);
        totalViolations += results.violations.length;
        totalWarnings += results.warnings.length;
        
        if (results.violations.length > 0 || results.warnings.length > 0) {
          filesWithIssues++;
        }

        if (options.report === 'html') {
          await AxelbilityReporter.generateHtmlReport(results);
        } else if (options.report === 'json') {
          await AxelbilityReporter.generateJsonReport(results);
        } else {
          AxelbilityReporter.printConsoleReport(results);
        }
      }

      // Resumen final
      console.log(chalk.bold.cyan('\n═══════════════════════════════════════════'));
      console.log(chalk.bold.cyan('           RESUMEN DE AUDITORÍA'));
      console.log(chalk.bold.cyan('═══════════════════════════════════════════\n'));
      console.log(chalk.white(`📁 Archivos analizados: ${files.length}`));
      console.log(chalk.white(`📄 Archivos con problemas: ${filesWithIssues}`));
      console.log(chalk.red(`❌ Violaciones totales: ${totalViolations}`));
      console.log(chalk.yellow(`⚠️  Advertencias totales: ${totalWarnings}`));
      console.log('');

      if (totalViolations === 0 && totalWarnings === 0) {
        console.log(chalk.green.bold('✨ ¡Excelente! Todos los archivos pasaron la auditoría.\n'));
        process.exit(0);
      } else if (totalViolations === 0) {
        console.log(chalk.yellow.bold('⚠️  Solo advertencias encontradas. No hay violaciones críticas.\n'));
        process.exit(0);
      } else {
        console.log(chalk.red.bold(`💡 Usa ${chalk.cyan('axel fix')} para corregir automáticamente los problemas.\n`));
        process.exit(1);
      }

    } catch (error) {
      spinner.fail(chalk.red('Auditoría fallida'));
      console.error(chalk.red(`\nError: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command('fix <path>')
  .description('Auto-fix accessibility issues in file(s) or folder')
  .action(async (inputPath) => {
    const spinner = ora('🔍 Buscando archivos HTML...').start();

    try {
      const files = resolveHtmlFiles(inputPath);

      if (files.length === 0) {
        spinner.fail(chalk.red('❌ No se encontraron archivos HTML'));
        console.log(chalk.yellow('\n💡 Tip: Asegúrate de estar en la carpeta correcta o proporciona una ruta válida\n'));
        process.exit(1);
      }

      spinner.succeed(chalk.green(`✅ ${files.length} archivo(s) encontrado(s)`));
      console.log('');

      let totalFixed = 0;
      let filesFixed = 0;

      for (const file of files) {
        const fileSpinner = ora(`🔧 Reparando ${path.basename(file)}...`).start();

        const auditor = new Axelbility();
        const results = await auditor.auditFile(file);

        const fixer = new AxelbilityFixer();
        const fixResults = await fixer.fixFile(file, results.violations);

        if (fixResults.fixesApplied > 0) {
          fileSpinner.succeed(chalk.green(`✅ ${fixResults.fixesApplied} problema(s) corregido(s) en ${path.basename(file)}`));
          totalFixed += fixResults.fixesApplied;
          filesFixed++;
        } else {
          fileSpinner.info(chalk.gray(`ℹ️  No hay problemas auto-reparables en ${path.basename(file)}`));
        }
      }

      // Resumen final
      console.log(chalk.bold.cyan('\n═══════════════════════════════════════════'));
      console.log(chalk.bold.cyan('        RESUMEN DE CORRECCIONES'));
      console.log(chalk.bold.cyan('═══════════════════════════════════════════\n'));
      console.log(chalk.white(`📁 Archivos procesados: ${files.length}`));
      console.log(chalk.white(`📝 Archivos modificados: ${filesFixed}`));
      console.log(chalk.green(`✅ Total de correcciones: ${totalFixed}`));
      console.log('');

      if (totalFixed > 0) {
        console.log(chalk.green.bold(`🎉 ¡Listo! ${totalFixed} problema(s) corregido(s) automáticamente.`));
        console.log(chalk.cyan(`\n💡 Ejecuta ${chalk.bold('axel audit')} para verificar los cambios.\n`));
      } else {
        console.log(chalk.yellow.bold('⚠️  No se encontraron problemas auto-reparables.'));
        console.log(chalk.gray('   Algunos problemas requieren corrección manual.\n'));
      }

      process.exit(0);

    } catch (error) {
      spinner.fail(chalk.red('Reparación fallida'));
      console.error(chalk.red(`\nError: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize Axelbility configuration')
  .action(() => {
    console.log(chalk.blue('\n🚀 Initializing Axelbility...\n'));

    const config = {
      rules: [
        'missing-alt',
        'icon-missing-aria-hidden',
        'accordion-missing-aria',
        'heading-order',
        'button-missing-type'
      ],
      exclude: [
        'node_modules/**',
        'dist/**'
      ],
      strict: false,
      autoFix: true
    };

    require('fs').writeFileSync(
      '.axelbility.json',
      JSON.stringify(config, null, 2),
      'utf-8'
    );

    console.log(chalk.green('\n✅ Configuration created!\n'));
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}