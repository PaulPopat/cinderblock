import * as vscode from "vscode";
import { Inline } from "@cinderblock/compiler";

export class SemanticHighlighter implements vscode.DocumentSemanticTokensProvider, vscode.Disposable {
  readonly #clenaup: vscode.Disposable;

  constructor() {
    this.#clenaup = vscode.languages.registerDocumentSemanticTokensProvider({ language: "cinderblock", scheme: "file" }, this, this.legend);
  }

  dispose() {
    this.#clenaup.dispose();
  }

  readonly legend = new vscode.SemanticTokensLegend(
    [
      "namespace",
      "function",
      "type",
      "struct",
      "class",
      "interface",
      "enum",
      "method",
      "macro",
      "parameter",
      "property",
      "keyword",
      "string",
      "number",
      "operator",
      "comment",
    ],
    ["declaration", "defaultLibrary"],
  );

  provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
    try {
      const builder = new vscode.SemanticTokensBuilder(this.legend);
      const app = new Inline(document.getText());
      for (const type of app.types) {
        const [area, ...modifiers] = type.typeName.split(".");
        if (type.range.from.line === -1) {
          continue;
        }

        builder.push(
          new vscode.Range(
            new vscode.Position(type.range.from.line - 1, type.range.from.character - 1),
            new vscode.Position(type.range.from.line - 1, type.range.from.line === type.range.to.line ? type.range.to.character - 1 : 999),
          ),
          area,
          modifiers,
        );
      }

      return builder.build();
    } catch (err) {
      return undefined;
    }
  }
}
