import { CommandExecutor } from './command-executor';
import FileGatherer from './file-gatherer';

export class FolderCommands {
  fileGatherer = new FileGatherer();
  commandExecutor = new CommandExecutor();
  
  async runCommands(filePath: string) {
    // const files = filePath.findFiles('**/*.ts', '**/node_modules/**');

    /*files.then((uris: vscode.Uri[]) => {
      uris.forEach(uri => {
        vscode.workspace.openTextDocument(uri).then(doc => {});
      });
    });*/

    
    const files = await this.fileGatherer.gather(filePath);

    files.forEach(file => )
  }
}
