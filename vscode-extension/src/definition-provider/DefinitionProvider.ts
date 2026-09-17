import {
  EntityLet,
  EntityStruct,
  ExpressionAccess,
  ExpressionReference,
  ExpressionTuplePart,
  loadConfig,
  Project,
  Range,
  Type,
  TypeReference,
  TypeTuple,
} from "@cinderblock-lang/legacy-compiler";
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

  async #resolve(document: vscode.TextDocument, position: vscode.Position) {
    // This should definitely improve
    if (!document.uri.fsPath.startsWith(this.#workspacePath.uri.fsPath + "/")) return;
    const relativePath = document.uri.fsPath.replace(this.#workspacePath.uri.fsPath + "/", "");

    const config = await loadConfig(this.#workspacePath.uri.fsPath);
    const project = new Project(this.#workspacePath.uri.fsPath, ...(config.lib_dirs ?? []));
    return project.types.find((t) => t.entry && t.range.within(relativePath, position.line + 1, position.character + 1))?.entry;
  }

  async provideDefinition(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): Promise<vscode.Definition | vscode.DefinitionLink[] | null | undefined> {
    const found = await this.#resolve(document, position);
    if (!found) return;

    const goTo = (range: Range) => ({
      uri: vscode.Uri.joinPath(this.#workspacePath.uri, range.from.file),
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
