import * as path from 'path';
import * as vscode from 'vscode';
import { FolderCommands } from './folder-commands';

export function activate(context: vscode.ExtensionContext) {
  const folderCommands = new FolderCommands();

  const command = vscode.commands.registerCommand('extension.folderCommands', folder => {
    const filePath =
      folder && folder.fsPath
        ? folder.fsPath
        : vscode && vscode.window && vscode.window.activeTextEditor
        ? path.dirname(vscode.window.activeTextEditor.document.fileName)
        : '';

    folderCommands.runCommands(filePath).catch((err: string) => {
      vscode.window.showErrorMessage(err);
    });
  });

  context.subscriptions.push(command);
}

export function deactivate() {}
