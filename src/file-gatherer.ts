import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export default class FileGatherer {
  config = vscode.workspace.getConfiguration('folderCommands');

  async gather(directory: string): Promise<Array<string>> {
    const files: Array<string> = [];
    await fs.readdir(directory, (err, files) => {
      if (err) {
        return done(err);
      }
      var pending = list.length;
      if (!pending) return done(null, results);
      list.forEach(function(file) {
        file = path.resolve(dir, file);
        fs.stat(file, function(err, stat) {
          if (stat && stat.isDirectory()) {
            walk(file, function(err, res) {
              results = results.concat(res);
              if (!--pending) done(null, results);
            });
          } else {
            results.push(file);
            if (!--pending) done(null, results);
          }
        });
      });
    });
    return files;
  }

  produceBarreledNames(files: string[], directory: string): Array<string> {
    const directories: string[] = [];
    const outputFiles: string[] = [];

    // Make this async
    files
      .filter(file => fs.statSync(`${directory}/${file}`).isDirectory())
      .forEach(directory => {
        directories.push(this.produceBarellableName(directory, true));
      });

    // Make this async
    files
      .filter(
        file =>
          fs.statSync(`${directory}/${file}`).isFile() &&
          file !== 'index.ts' &&
          path.extname(file).match(new RegExp(`${this.getExtensionsRegEx()}`)) &&
          !file.match(this.getExcludeRegEx())
      )
      .forEach(file => {
        outputFiles.push(this.produceBarellableName(file, false));
      });

    return directories.concat(outputFiles);
  }

  produceBarellableName(name: string, directory: boolean): string {
    if (directory) {
      return `./${path.basename(name)}`;
    } else {
      const regEx = new RegExp(`${this.getExtensionsRegEx()}`);
      return `./${path.basename(name.replace(regEx, ''))}`;
    }
  }
  /**
   * Recursively walk a directory asynchronously and obtain all file names (with full path).
   *
   * @param dir Folder name you want to recursively process
   * @param done Callback function, returns all files with full path.
   * @param filter Optional filter to specify which files to include,
   *   e.g. for json files: (f: string) => /.json$/.test(f)
   * @see https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search/50345475#50345475
   */
  walk = (dir: string, done: (err: Error | null, results?: string[]) => void, filter?: (f: string) => boolean) => {
    let results: string[] = [];
    fs.readdir(dir, (err: Error, list: string[]) => {
      if (err) {
        return done(err);
      }
      let pending = list.length;
      if (!pending) {
        return done(null, results);
      }
      list.forEach((file: string) => {
        file = path.resolve(dir, file);
        fs.stat(file, (err2, stat) => {
          if (stat && stat.isDirectory()) {
            walk(
              file,
              (err3, res) => {
                if (res) {
                  results = results.concat(res);
                }
                if (!--pending) {
                  done(null, results);
                }
              },
              filter
            );
          } else {
            if (typeof filter === 'undefined' || (filter && filter(file))) {
              results.push(file);
            }
            if (!--pending) {
              done(null, results);
            }
          }
        });
      });
    });
  };

  private getExcludeRegEx(): string {
    return this.config['excludeFileRegex'];
  }

  private getExtensionsRegEx(): string {
    return this.config['fileExtensionRegex'];
  }
}
