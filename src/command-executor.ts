import * as vscode from 'vscode';

export class CommandExecutor {
  private _command = '';

  private _args: object | null = null;

  public command(command: string): CommandExecutor {
    this._command = command;
    return this;
  }

  public args(args: object | null): CommandExecutor {
    this._args = args;
    return this;
  }

  public execute(): Thenable<unknown> | null {
    if (this._command && this._args) {
      return vscode.commands.executeCommand(this._command, this._args);
    }
    if (this._command) {
      return vscode.commands.executeCommand(this._command);
    }
    return null;
  }
}
