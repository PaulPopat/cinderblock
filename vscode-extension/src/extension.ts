import * as vscode from "vscode";
import { SemanticHighlighter } from "./syntax-highlighting/index.ts";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(SemanticHighlighter.register());
}

export function deactivate() {}
