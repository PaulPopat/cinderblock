import * as vscode from "vscode";
import { SemanticHighlighter } from "./syntax-highlighting/index.ts";
import { AppExtension } from "./app-extension/index.ts";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(new SemanticHighlighter());

  for (const workspace of vscode.workspace.workspaceFolders ?? []) {
    context.subscriptions.push(new AppExtension(workspace.uri));
  }
}

export function deactivate() {}
