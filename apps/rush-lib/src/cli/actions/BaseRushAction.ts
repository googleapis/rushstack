// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import colors from 'colors/safe';
import * as os from 'os';
import * as path from 'path';

import { CommandLineAction, ICommandLineActionOptions } from '@rushstack/ts-command-line';
import { LockFile } from '@rushstack/node-core-library';

import { RushConfiguration } from '../../api/RushConfiguration';
import { EventHooksManager } from '../../logic/EventHooksManager';
import { RushCommandLineParser } from './../RushCommandLineParser';
import { Utilities } from '../../utilities/Utilities';
import { RushGlobalFolder } from '../../api/RushGlobalFolder';
import { RushSession } from '../../pluginFramework/RushSession';

export interface IBaseRushActionOptions extends ICommandLineActionOptions {
  /**
   * By default, Rush operations acquire a lock file which prevents multiple commands from executing simultaneously
   * in the same repo folder.  (For example, it would be a mistake to run "rush install" and "rush build" at the
   * same time.)  If your command makes sense to run concurrently with other operations,
   * set safeForSimultaneousRushProcesses=true to disable this protection.  In particular, this is needed for
   * custom scripts that invoke other Rush commands.
   */
  safeForSimultaneousRushProcesses?: boolean;

  /**
   * The rush parser.
   */
  parser: RushCommandLineParser;
}

/**
 * The base class for a few specialized Rush command-line actions that
 * can be used without a rush.json configuration.
 */
export abstract class BaseConfiglessRushAction extends CommandLineAction {
  private _parser: RushCommandLineParser;
  private _safeForSimultaneousRushProcesses: boolean;

  protected get rushConfiguration(): RushConfiguration | undefined {
    return this._parser.rushConfiguration;
  }

  protected get rushSession(): RushSession {
    return this._parser.rushSession;
  }

  protected get rushGlobalFolder(): RushGlobalFolder {
    return this._parser.rushGlobalFolder;
  }

  protected get parser(): RushCommandLineParser {
    return this._parser;
  }

  public constructor(options: IBaseRushActionOptions) {
    super(options);

    this._parser = options.parser;
    this._safeForSimultaneousRushProcesses = !!options.safeForSimultaneousRushProcesses;
  }

  protected onExecute(): Promise<void> {
    this._ensureEnvironment();

    if (this.rushConfiguration) {
      if (!this._safeForSimultaneousRushProcesses) {
        if (!LockFile.tryAcquire(this.rushConfiguration.commonTempFolder, 'rush')) {
          console.log(colors.red(`Another Rush command is already running in this repository.`));
          process.exit(1);
        }
      }
    }

    if (!Utilities.shouldRestrictConsoleOutput()) {
      console.log(`Starting "rush ${this.actionName}"${os.EOL}`);
    }
    return this.runAsync();
  }

  /**
   * All Rush actions need to implement this method. This method runs after
   * environment has been set up by the base class.
   */
  protected abstract runAsync(): Promise<void>;

  private _ensureEnvironment(): void {
    if (this.rushConfiguration) {
      // eslint-disable-next-line dot-notation
      let environmentPath: string | undefined = process.env['PATH'];
      environmentPath =
        path.join(this.rushConfiguration.commonTempFolder, 'node_modules', '.bin') +
        path.delimiter +
        environmentPath;
      // eslint-disable-next-line dot-notation
      process.env['PATH'] = environmentPath;
    }
  }
}

/**
 * The base class that most Rush command-line actions should extend.
 */
export abstract class BaseRushAction extends BaseConfiglessRushAction {
  private _eventHooksManager: EventHooksManager | undefined;

  protected get eventHooksManager(): EventHooksManager {
    if (!this._eventHooksManager) {
      this._eventHooksManager = new EventHooksManager(this.rushConfiguration);
    }

    return this._eventHooksManager;
  }

  protected get rushConfiguration(): RushConfiguration {
    return super.rushConfiguration!;
  }

  protected async onExecute(): Promise<void> {
    if (!this.rushConfiguration) {
      throw Utilities.getRushConfigNotFoundError();
    }

    this._throwPluginErrorIfNeed();

    await this.parser.pluginManager.tryInitializeAssociatedCommandPluginsAsync(this.actionName);

    this._throwPluginErrorIfNeed();

    await this.rushSession.hooks.initialize.promise();

    return super.onExecute();
  }

  /**
   * If an error is encountered while trying to load plugins, it is saved in the `PluginManager.error`
   * property, so we can defer throwing it until when `_throwPluginErrorIfNeed()` is called.
   */
  private _throwPluginErrorIfNeed(): void {
    // If the plugin configuration is broken, these three commands are used to fix the problem:
    //
    //   "rush update"
    //   "rush init-autoinstaller"
    //   "rush update-autoinstaller"
    //
    // Thus we do not report plugin errors when invoking these commands.
    if (!['update', 'init-autoinstaller', 'update-autoinstaller'].includes(this.actionName)) {
      const pluginError: Error | undefined = this.parser.pluginManager.error;
      if (pluginError) {
        throw pluginError;
      }
    }
  }
}
