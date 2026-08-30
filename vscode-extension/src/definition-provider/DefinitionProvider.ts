import { ExpressionReference, Project, TypeReference } from "@cinderblock/compiler";
import * as vscode from "vscode";

export class DefinitionProvider implements vscode.DefinitionProvider, vscode.Disposable {
  readonly #workspacePath: vscode.WorkspaceFolder;
  readonly #clenaup: vscode.Disposable;

  constructor(workspacePath: vscode.WorkspaceFolder) {
    this.#workspacePath = workspacePath;
    this.#clenaup = vscode.languages.registerDefinitionProvider({ language: "cinderblock", scheme: "file" }, this);
  }

  dispose() {
    this.#clenaup.dispose();
  }

  provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
    // This should definitely improve
    if (!document.uri.fsPath.startsWith(this.#workspacePath.uri.fsPath + "/")) return;
    const relativePath = document.uri.fsPath.replace(this.#workspacePath.uri.fsPath + "/", "");

    const project = new Project(this.#workspacePath.uri.fsPath);
    const found = project.types.find((t) => t.entry && t.range.within(relativePath, position.line + 1, position.character + 1))?.entry;
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
}
