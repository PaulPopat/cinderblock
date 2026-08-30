import { ExpressionReference, Project, TypeReference } from "@cinderblock/compiler";
import * as vscode from "vscode";

export class DefinitionProvider implements vscode.DefinitionProvider, vscode.HoverProvider, vscode.Disposable {
  readonly #workspacePath: vscode.WorkspaceFolder;
  readonly #cleanup: Array<vscode.Disposable>;

  constructor(workspacePath: vscode.WorkspaceFolder) {
    this.#workspacePath = workspacePath;
    this.#cleanup = [];
    this.#cleanup.push(vscode.languages.registerDefinitionProvider({ language: "cinderblock", scheme: "file" }, this));
    this.#cleanup.push(vscode.languages.registerHoverProvider({ language: "cinderblock", scheme: "file" }, this));
  }

  dispose() {
    for (const cleanup of this.#cleanup) {
      cleanup.dispose();
    }
  }

  #resolve(document: vscode.TextDocument, position: vscode.Position) {
    // This should definitely improve
    if (!document.uri.fsPath.startsWith(this.#workspacePath.uri.fsPath + "/")) return;
    const relativePath = document.uri.fsPath.replace(this.#workspacePath.uri.fsPath + "/", "");

    const project = new Project(this.#workspacePath.uri.fsPath);
    return project.types.find((t) => t.entry && t.range.within(relativePath, position.line + 1, position.character + 1))?.entry;
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
    const found = this.#resolve(document, position);
    if (!found) return;

    if (found instanceof ExpressionReference) {
      const definition = found.subject;
      const range = definition.range;
      return {
        uri: vscode.Uri.joinPath(this.#workspacePath.uri, definition.location.file),
        range: new vscode.Range(
          new vscode.Position(range.from.line - 1, range.from.character - 1),
          new vscode.Position(range.from.line - 1, range.to.character - 1),
        ),
      };
    }

    // Not sure why the compiler is doing this.
    if (found instanceof TypeReference) {
      const definition = found.struct;
      const range = definition.range;
      return {
        uri: vscode.Uri.joinPath(this.#workspacePath.uri, definition.location.file),
        range: new vscode.Range(
          new vscode.Position(range.from.line - 1, range.from.character - 1),
          new vscode.Position(range.from.line - 1, range.to.character - 1),
        ),
      };
    }
  }

  provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.Hover> {
    const found = this.#resolve(document, position);
    if (!found) return;

    if (found instanceof ExpressionReference) {
      const definition = found.subject;
      const range = found.range;
      const type = definition.type;
      const contents = new vscode.MarkdownString(undefined, true);
      contents.appendCodeblock(type.representation(), "cinderblock");
      return new vscode.Hover(
        contents,
        new vscode.Range(
          new vscode.Position(range.from.line - 1, range.from.character - 1),
          new vscode.Position(range.from.line - 1, range.to.character - 1),
        ),
      );
    }

    // Not sure why the compiler is doing this.
    if (found instanceof TypeReference) {
      const range = found.range;
      const contents = new vscode.MarkdownString(undefined, true);
      contents.appendCodeblock(found.representation(), "cinderblock");
      return new vscode.Hover(
        contents,
        new vscode.Range(
          new vscode.Position(range.from.line - 1, range.from.character - 1),
          new vscode.Position(range.from.line - 1, range.to.character - 1),
        ),
      );
    }
  }
}
