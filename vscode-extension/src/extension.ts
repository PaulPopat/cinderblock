import * as vscode from "vscode";
import { SemanticHighlighter } from "./syntax-highlighting";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(SemanticHighlighter.register());
}

export function deactivate() {}
