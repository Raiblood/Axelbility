const vscode = require('vscode');
const path = require('path');
const Axelbility = require('../src/index');

let diagnosticCollection;

/**
 * Activar la extensión
 */
function activate(context) {
  console.log('🚀 Axelbility extension is now active!');

  // Crear colección de diagnósticos
  diagnosticCollection = vscode.languages.createDiagnosticCollection('axelbility');
  context.subscriptions.push(diagnosticCollection);

  // Comando: Auditar archivo actual
  let auditCommand = vscode.commands.registerCommand('axelbility.auditFile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    await auditDocument(editor.document);
  });

  // Comando: Auto-fix
  let fixCommand = vscode.commands.registerCommand('axelbility.fixFile', async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'html') {
      vscode.window.showWarningMessage('This command only works with HTML files');
      return;
    }

    await fixDocument(editor);
  });

  // Comando: Auditar workspace
  let auditWorkspaceCommand = vscode.commands.registerCommand('axelbility.auditWorkspace', async () => {
    await auditWorkspace();
  });

  // Auto-check al guardar
  let onSaveDisposable = vscode.workspace.onDidSaveTextDocument(document => {
    if (document.languageId === 'html') {
      auditDocument(document);
    }
  });

  // Auto-check mientras se escribe (debounced)
  let onChangeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
    const config = vscode.workspace.getConfiguration('axelbility');
    if (config.get('enableAutoCheck') && event.document.languageId === 'html') {
      debounceAudit(event.document);
    }
  });

  // Auto-check al abrir archivo
  let onOpenDisposable = vscode.workspace.onDidOpenTextDocument(document => {
    if (document.languageId === 'html') {
      auditDocument(document);
    }
  });

  context.subscriptions.push(
    auditCommand,
    fixCommand,
    auditWorkspaceCommand,
    onSaveDisposable,
    onChangeDisposable,
    onOpenDisposable
  );

  // Auditar archivo actual al activar
  if (vscode.window.activeTextEditor?.document.languageId === 'html') {
    auditDocument(vscode.window.activeTextEditor.document);
  }
}

/**
 * Auditar un documento
 */
async function auditDocument(document) {
  try {
    const text = document.getText();
    
    // Guardar temporalmente para auditar
    const tempPath = path.join(require('os').tmpdir(), 'axelbility-temp.html');
    const fs = require('fs').promises;
    await fs.writeFile(tempPath, text);

    const auditor = new Axelbility();
    const results = await auditor.auditFile(tempPath);

    // Limpiar archivo temporal
    await fs.unlink(tempPath).catch(() => {});

    // Convertir resultados a diagnósticos de VS Code
    const diagnostics = convertToDiagnostics(document, results);
    diagnosticCollection.set(document.uri, diagnostics);

    // Mostrar resumen
    const violationCount = results.violations.length;
    const warningCount = results.warnings.length;
    
    if (violationCount === 0 && warningCount === 0) {
      vscode.window.showInformationMessage('✅ No accessibility issues found!');
    } else {
      vscode.window.showWarningMessage(
        `⚠️ Found ${violationCount} violation(s) and ${warningCount} warning(s)`
      );
    }

  } catch (error) {
    vscode.window.showErrorMessage(`Axelbility error: ${error.message}`);
  }
}

/**
 * Convertir resultados a diagnósticos de VS Code
 */
function convertToDiagnostics(document, results) {
  const diagnostics = [];
  const config = vscode.workspace.getConfiguration('axelbility');
  const showWarnings = config.get('showWarnings');

  // Procesar violaciones
  for (const violation of results.violations) {
    const diagnostic = new vscode.Diagnostic(
      new vscode.Range(0, 0, 0, 0), // Por ahora línea 0, mejorar después
      violation.message,
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.code = violation.type;
    diagnostic.source = 'Axelbility';
    diagnostics.push(diagnostic);
  }

  // Procesar advertencias
  if (showWarnings) {
    for (const warning of results.warnings) {
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(0, 0, 0, 0),
        warning.message,
        vscode.DiagnosticSeverity.Warning
      );
      diagnostic.code = warning.type;
      diagnostic.source = 'Axelbility';
      diagnostics.push(diagnostic);
    }
  }

  return diagnostics;
}

/**
 * Aplicar correcciones automáticas
 */
async function fixDocument(editor) {
  const document = editor.document;
  
  try {
    const text = document.getText();
    const tempPath = path.join(require('os').tmpdir(), 'axelbility-fix.html');
    const fs = require('fs').promises;
    
    await fs.writeFile(tempPath, text);

    // Ejecutar fixer
    const AxelbilityFixer = require('../src/fixer');
    const auditor = new Axelbility();
    const results = await auditor.auditFile(tempPath);
    
    const fixer = new AxelbilityFixer();
    const fixed = await fixer.fixFile(tempPath, results.violations);

    // Leer archivo corregido
    const fixedContent = await fs.readFile(tempPath, 'utf-8');
    
    // Reemplazar contenido
    const edit = new vscode.WorkspaceEdit();
    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );
    edit.replace(document.uri, fullRange, fixedContent);
    await vscode.workspace.applyEdit(edit);

    // Limpiar
    await fs.unlink(tempPath).catch(() => {});

    vscode.window.showInformationMessage(
      `✅ Fixed ${fixed.fixes.length} issue(s) automatically`
    );

    // Re-auditar
    await auditDocument(document);

  } catch (error) {
    vscode.window.showErrorMessage(`Fix error: ${error.message}`);
  }
}

/**
 * Auditar todo el workspace
 */
async function auditWorkspace() {
  const files = await vscode.workspace.findFiles('**/*.html', '**/node_modules/**');
  
  if (files.length === 0) {
    vscode.window.showInformationMessage('No HTML files found in workspace');
    return;
  }

  vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: 'Auditing workspace...',
    cancellable: false
  }, async (progress) => {
    let totalViolations = 0;
    let totalWarnings = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      progress.report({ 
        message: `Checking ${path.basename(file.fsPath)} (${i + 1}/${files.length})`,
        increment: (100 / files.length)
      });

      const document = await vscode.workspace.openTextDocument(file);
      await auditDocument(document);

      const diagnostics = diagnosticCollection.get(file);
      if (diagnostics) {
        totalViolations += diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
        totalWarnings += diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Warning).length;
      }
    }

    vscode.window.showInformationMessage(
      `Workspace audit complete: ${totalViolations} violations, ${totalWarnings} warnings across ${files.length} files`
    );
  });
}

// Debounce para auto-check
let debounceTimer;
function debounceAudit(document) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    auditDocument(document);
  }, 1000);
}

/**
 * Desactivar la extensión
 */
function deactivate() {
  if (diagnosticCollection) {
    diagnosticCollection.dispose();
  }
}

module.exports = {
  activate,
  deactivate
};
