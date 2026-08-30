import * as vscode from "vscode";
import { SemanticHighlighter } from "./syntax-highlighting/index.ts";
import { ErrorReporter } from "./error-reporting/index.ts";
import { DefinitionProvider } from "./definition-provider/DefinitionProvider.ts";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(new SemanticHighlighter());

  for (const workspace of vscode.workspace.workspaceFolders ?? []) {
    context.subscriptions.push(new ErrorReporter(workspace.uri.fsPath));
    context.subscriptions.push(new DefinitionProvider(workspace));
  }
}

export function deactivate() {}
