import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('folderCommands.runCommands', () => {});

  context.subscriptions.push(disposable);
}

export function deactivate() {}
