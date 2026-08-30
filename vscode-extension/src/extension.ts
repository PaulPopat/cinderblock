import * as vscode from "vscode";
import { SemanticHighlighter } from "./syntax-highlighting/index.ts";
import { ErrorReporter } from "./error-reporting/index.ts";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(SemanticHighlighter.register());

  for (const workspace of vscode.workspace.workspaceFolders ?? []) {
    context.subscriptions.push(new ErrorReporter(workspace.uri.fsPath));
  }
}

export function deactivate() {}
