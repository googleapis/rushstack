// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import {
  FileSystem,
  ITerminal,
  Terminal,
  ConsoleTerminalProvider,
  Path,
  NewlineKind,
  LegacyAdapters,
  Async
} from '@rushstack/node-core-library';
import glob from 'glob';
import * as path from 'path';
import { EOL } from 'os';
import * as chokidar from 'chokidar';

/**
 * @public
 */
export interface ITypingsGeneratorOptions<TTypingsResult = string | undefined> {
  srcFolder: string;
  generatedTsFolder: string;
  fileExtensions: string[];
  parseAndGenerateTypings: (
    fileContents: string,
    filePath: string
  ) => TTypingsResult | Promise<TTypingsResult>;
  terminal?: ITerminal;
  globsToIgnore?: string[];
  /**
   * @deprecated
   *
   * TODO: Remove when version 1.0.0 is released.
   */
  filesToIgnore?: string[];
}

/**
 * This is a simple tool that generates .d.ts files for non-TS files.
 *
 * @public
 */
export class TypingsGenerator {
  // Map of target file path -> Set<dependency file path>
  private _targetMap: Map<string, Set<string>>;

  // Map of dependency file path -> Set<target file path>
  private _dependencyMap: Map<string, Set<string>>;

  protected _options: ITypingsGeneratorOptions;

  public constructor(options: ITypingsGeneratorOptions) {
    this._options = {
      ...options
    };

    if (options.filesToIgnore) {
      throw new Error('The filesToIgnore option is no longer supported. Please use globsToIgnore instead.');
    }

    if (!this._options.generatedTsFolder) {
      throw new Error('generatedTsFolder must be provided');
    }

    if (!this._options.srcFolder) {
      throw new Error('srcFolder must be provided');
    }

    if (Path.isUnder(this._options.srcFolder, this._options.generatedTsFolder)) {
      throw new Error('srcFolder must not be under generatedTsFolder');
    }

    if (Path.isUnder(this._options.generatedTsFolder, this._options.srcFolder)) {
      throw new Error('generatedTsFolder must not be under srcFolder');
    }

    if (!this._options.fileExtensions || this._options.fileExtensions.length === 0) {
      throw new Error('At least one file extension must be provided.');
    }

    if (!this._options.globsToIgnore) {
      this._options.globsToIgnore = [];
    }

    if (!this._options.terminal) {
      this._options.terminal = new Terminal(new ConsoleTerminalProvider({ verboseEnabled: true }));
    }

    this._options.fileExtensions = this._normalizeFileExtensions(this._options.fileExtensions);

    this._targetMap = new Map();

    this._dependencyMap = new Map();
  }

  public async generateTypingsAsync(): Promise<void> {
    await FileSystem.ensureEmptyFolderAsync(this._options.generatedTsFolder);

    const filePaths: string[] = await LegacyAdapters.convertCallbackToPromise(
      glob,
      `**/*+(${this._options.fileExtensions.join('|')})`,
      {
        cwd: this._options.srcFolder,
        absolute: true,
        nosort: true,
        nodir: true,
        ignore: this._options.globsToIgnore
      }
    );

    await Async.forEachAsync(
      filePaths,
      async (filePath: string) => {
        filePath = `${this._options.srcFolder}/${filePath}`;
        await this._parseFileAndGenerateTypingsAsync(filePath);
      },
      { concurrency: 50 }
    );
  }

  public async runWatcherAsync(): Promise<void> {
    await FileSystem.ensureFolderAsync(this._options.generatedTsFolder);

    const globBase: string = `${this._options.srcFolder}/**`;

    await new Promise((resolve, reject): void => {
      const watcher: chokidar.FSWatcher = chokidar.watch(
        this._options.fileExtensions.map((fileExtension) => `${globBase}/*${fileExtension}`),
        {
          ignored: this._options.globsToIgnore
        }
      );
      const boundGenerateTypingsFunction: (filePath: string) => Promise<void> =
        this._parseFileAndGenerateTypingsAsync.bind(this);
      watcher.on('add', boundGenerateTypingsFunction);
      watcher.on('change', boundGenerateTypingsFunction);
      watcher.on('unlink', async (filePath) => {
        const generatedTsFilePath: string = this._getTypingsFilePath(filePath);
        await FileSystem.deleteFileAsync(generatedTsFilePath);
      });
      watcher.on('error', reject);
    });
  }

  /**
   * Register file dependencies that may effect the typings of a target file.
   * Note: This feature is only useful in watch mode.
   * The registerDependency method must be called in the body of parseAndGenerateTypings every
   * time because the registry for a file is cleared at the beginning of processing.
   */
  public registerDependency(target: string, dependency: string): void {
    let targetDependencySet: Set<string> | undefined = this._targetMap.get(target);
    if (!targetDependencySet) {
      targetDependencySet = new Set();
      this._targetMap.set(target, targetDependencySet);
    }
    targetDependencySet.add(dependency);

    let dependencyTargetSet: Set<string> | undefined = this._dependencyMap.get(dependency);
    if (!dependencyTargetSet) {
      dependencyTargetSet = new Set();
      this._dependencyMap.set(dependency, dependencyTargetSet);
    }
    dependencyTargetSet.add(target);
  }

  private async _parseFileAndGenerateTypingsAsync(filePath: string): Promise<void> {
    // Clear registered dependencies prior to reprocessing.
    this._clearDependencies(filePath);

    // Check for targets that register this file as a dependency, and reprocess them too.
    for (const target of this._getDependencyTargets(filePath)) {
      await this._parseFileAndGenerateTypingsAsync(target);
    }

    try {
      const fileContents: string = await FileSystem.readFileAsync(filePath);
      const typingsData: string | undefined = await this._options.parseAndGenerateTypings(
        fileContents,
        filePath
      );
      const generatedTsFilePath: string = this._getTypingsFilePath(filePath);

      // Typings data will be undefined when no types should be generated for the parsed file.
      if (typingsData === undefined) {
        return;
      }

      const prefixedTypingsData: string = [
        '// This file was generated by a tool. Modifying it will produce unexpected behavior',
        '',
        typingsData
      ].join(EOL);

      await FileSystem.writeFileAsync(generatedTsFilePath, prefixedTypingsData, {
        ensureFolderExists: true,
        convertLineEndings: NewlineKind.OsDefault
      });
    } catch (e) {
      this._options.terminal!.writeError(
        `Error occurred parsing and generating typings for file "${filePath}": ${e}`
      );
    }
  }

  private _clearDependencies(target: string): void {
    const targetDependencySet: Set<string> | undefined = this._targetMap.get(target);
    if (targetDependencySet) {
      for (const dependency of targetDependencySet) {
        this._dependencyMap.get(dependency)!.delete(target);
      }
      targetDependencySet.clear();
    }
  }

  private _getDependencyTargets(dependency: string): string[] {
    return [...(this._dependencyMap.get(dependency)?.keys() || [])];
  }

  private _getTypingsFilePath(filePath: string): string {
    const relativeSourceFilePath: string = path.relative(this._options.srcFolder, `${filePath}.d.ts`);
    return `${this._options.generatedTsFolder}/${relativeSourceFilePath}`;
  }

  private _normalizeFileExtensions(fileExtensions: string[]): string[] {
    const result: string[] = [];
    for (const fileExtension of fileExtensions) {
      if (!fileExtension.startsWith('.')) {
        result.push(`.${fileExtension}`);
      } else {
        result.push(fileExtension);
      }
    }

    return result;
  }
}
