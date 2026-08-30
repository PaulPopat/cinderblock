import * as vscode from "vscode";
import { Project, CompilerError } from "@cinderblock/compiler";
import path from "node:path";

export class ErrorReporter implements vscode.Disposable {
  readonly #diagnostics: vscode.DiagnosticCollection;
  readonly #workspacePath: string;
  readonly #watcher: vscode.FileSystemWatcher;

  constructor(workspacePath: string) {
    this.#workspacePath = workspacePath;
    this.#diagnostics = vscode.languages.createDiagnosticCollection("cinderblock");

    let timeout: NodeJS.Timeout | number | undefined = undefined;
    this.#watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(this.#workspacePath), "**/*.cb"));
    const checker = () => {
      if (timeout) clearTimeout(timeout);
      setTimeout(() => this.check(), 100);
    };

    this.#watcher.onDidChange(checker);
    this.#watcher.onDidCreate(checker);
    this.#watcher.onDidDelete(checker);
  }

  dispose() {
    this.#diagnostics.dispose();
    this.#watcher.dispose();
  }

  check() {
    this.#diagnostics.clear();

    try {
      const project = new Project(this.#workspacePath);
      project.binaryData;
    } catch (err) {
      if (!(err instanceof CompilerError)) return;

      this.#diagnostics.set(vscode.Uri.file(path.resolve(this.#workspacePath, err.range.from.file)), [
        {
          range: new vscode.Range(
            new vscode.Position(err.range.from.line - 1, err.range.from.character - 1),
            new vscode.Position(err.range.to.line - 1, err.range.to.character - 1),
          ),
          message: err.compilerMessage,
          severity: vscode.DiagnosticSeverity.Error,
        },
      ]);
    }
  }
}
