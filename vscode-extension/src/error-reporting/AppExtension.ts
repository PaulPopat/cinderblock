import * as vscode from "vscode";
import {
  Project,
  CompilerError,
  EntityLet,
  EntityStruct,
  ExpressionAccess,
  ExpressionReference,
  ExpressionTuplePart,
  Range,
  Type,
  TypeReference,
  TypeTuple,
} from "@cinderblock-lang/legacy-compiler";
import path from "node:path";

export class AppExtension implements vscode.DefinitionProvider, vscode.HoverProvider, vscode.Disposable {
  #project: Project | undefined = undefined;
  readonly #cleanup: Array<vscode.Disposable> = [];
  readonly #diagnostics: vscode.DiagnosticCollection;
  readonly #workspacePath: vscode.Uri;
  readonly #watcher: vscode.FileSystemWatcher;

  constructor(workspacePath: vscode.Uri) {
    this.#workspacePath = workspacePath;
    this.#cleanup.push(vscode.languages.registerDefinitionProvider({ language: "cinderblock", scheme: "file" }, this));
    this.#cleanup.push(vscode.languages.registerHoverProvider({ language: "cinderblock", scheme: "file" }, this));
    this.#diagnostics = vscode.languages.createDiagnosticCollection("cinderblock");
    this.#cleanup.push(this.#diagnostics);

    let timeout: NodeJS.Timeout | number | undefined = undefined;
    this.#watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(vscode.Uri.file(this.#workspacePath.fsPath), "**/*.cb"));
    this.#cleanup.push(this.#watcher);

    const checker = () => {
      if (timeout) clearTimeout(timeout);
      setTimeout(() => this.check(), 10_000);
    };

    this.#watcher.onDidChange(checker);
    this.#watcher.onDidCreate(checker);
    this.#watcher.onDidDelete(checker);
    this.check();
  }

  #tryCreateProject() {
    try {
      return new Project(this.#workspacePath.fsPath);
    } catch {
      return undefined;
    }
  }

  dispose() {
    for (const cleanup of this.#cleanup) {
      cleanup.dispose();
    }
  }

  check() {
    this.#diagnostics.clear();

    try {
      this.#project = this.#tryCreateProject();
      this.#project?.binaryData;
    } catch (err) {
      if (!(err instanceof CompilerError)) return;

      this.#diagnostics.set(vscode.Uri.file(path.resolve(this.#workspacePath.fsPath, err.range.from.file)), [
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

  async #resolve(document: vscode.TextDocument, position: vscode.Position) {
    // This should definitely improve
    if (!document.uri.fsPath.startsWith(this.#workspacePath.fsPath + "/")) return;
    const relativePath = document.uri.fsPath.replace(this.#workspacePath.fsPath + "/", "");

    return this.#project?.types.find((t) => t.entry && t.range.within(relativePath, position.line + 1, position.character + 1))?.entry;
  }

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): Promise<vscode.Definition | vscode.DefinitionLink[] | null | undefined> {
    const found = await this.#resolve(document, position);
    if (!found) return;

    const goTo = (range: Range) => ({
      uri: vscode.Uri.joinPath(this.#workspacePath, range.from.file),
      range: new vscode.Range(
        new vscode.Position(range.from.line - 1, range.from.character - 1),
        new vscode.Position(range.from.line - 1, range.to.character - 1),
      ),
    });

    if (found instanceof ExpressionReference) return goTo(found.subject.range);
    if (found instanceof TypeReference) {
      const range = found.subject?.range;
      if (range) return goTo(range);
    }
  }

  async provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.Hover | undefined> {
    const found = await this.#resolve(document, position);
    if (!found) return;

    const display = (type: Type, range: Range) => {
      const contents = new vscode.MarkdownString(undefined, true);
      contents.appendCodeblock(type.representation(0), "cinderblock");
      return new vscode.Hover(
        contents,
        new vscode.Range(
          new vscode.Position(range.from.line - 1, range.from.character - 1),
          new vscode.Position(range.from.line - 1, range.to.character - 1),
        ),
      );
    };

    if (found instanceof ExpressionReference) return display(found.subject.type, found.range);
    if (found instanceof TypeReference) return display(found, found.range);
    if (found instanceof EntityLet) return display(found.type, found.range);
    if (found instanceof EntityStruct) return display(new TypeTuple(found.location, found.done, () => found, found.args), found.range);
    if (found instanceof ExpressionTuplePart) return display(found.value.resolution, found.range);
    if (found instanceof ExpressionAccess) return display(found.resolution, found.range);
  }
}
