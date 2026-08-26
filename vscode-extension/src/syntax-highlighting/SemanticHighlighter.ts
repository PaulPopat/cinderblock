import * as vscode from "vscode";

export class SemanticHighlighter implements vscode.DocumentSemanticTokensProvider {
  static register() {
    const instance = new SemanticHighlighter();

    const selector = { language: "cinderblock", scheme: "file" };
    return vscode.languages.registerDocumentSemanticTokensProvider(selector, instance, instance.legend);
  }

  readonly legend = new vscode.SemanticTokensLegend(["class", "interface", "enum", "function", "variable"], ["declaration", "documentation"]);

  provideDocumentSemanticTokens(document: vscode.TextDocument): vscode.ProviderResult<vscode.SemanticTokens> {
    const tokensBuilder = new vscode.SemanticTokensBuilder(this.legend);

    tokensBuilder.push(new vscode.Range(new vscode.Position(1, 1), new vscode.Position(1, 5)), "class", ["declaration"]);
    return tokensBuilder.build();
  }
}
