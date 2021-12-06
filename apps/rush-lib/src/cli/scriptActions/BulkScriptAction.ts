// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import * as os from 'os';
import colors from 'colors/safe';

import { AlreadyReportedError, Terminal } from '@rushstack/node-core-library';
import { CommandLineFlagParameter, CommandLineStringParameter } from '@rushstack/ts-command-line';

import { Event } from '../../index';
import { SetupChecks } from '../../logic/SetupChecks';
import { ITaskSelectorOptions, TaskSelector } from '../../logic/TaskSelector';
import { Stopwatch, StopwatchState } from '../../utilities/Stopwatch';
import { BaseScriptAction, IBaseScriptActionOptions } from './BaseScriptAction';
import { ITaskRunnerOptions, TaskRunner } from '../../logic/taskRunner/TaskRunner';
import { Utilities } from '../../utilities/Utilities';
import { RushConstants } from '../../logic/RushConstants';
import { EnvironmentVariableNames } from '../../api/EnvironmentConfiguration';
import { LastLinkFlag, LastLinkFlagFactory } from '../../api/LastLinkFlag';
import { RushConfigurationProject } from '../../api/RushConfigurationProject';
import { BuildCacheConfiguration } from '../../api/BuildCacheConfiguration';
import { Selection } from '../../logic/Selection';
import { SelectionParameterSet } from '../SelectionParameterSet';
import { CommandLineConfiguration } from '../../api/CommandLineConfiguration';

/**
 * Constructor parameters for BulkScriptAction.
 */
export interface IBulkScriptActionOptions extends IBaseScriptActionOptions {
  enableParallelism: boolean;
  ignoreMissingScript: boolean;
  ignoreDependencyOrder: boolean;
  incremental: boolean;
  allowWarningsInSuccessfulBuild: boolean;
  watchForChanges: boolean;
  disableBuildCache: boolean;

  /**
   * Optional command to run. Otherwise, use the `actionName` as the command to run.
   */
  commandToRun?: string;
}

interface IExecuteInternalOptions {
  taskSelectorOptions: ITaskSelectorOptions;
  taskRunnerOptions: ITaskRunnerOptions;
  stopwatch: Stopwatch;
  ignoreHooks?: boolean;
  terminal: Terminal;
}

/**
 * This class implements bulk commands which are run individually for each project in the repo,
 * possibly in parallel.  The action executes a script found in the project's package.json file.
 *
 * @remarks
 * Bulk commands can be defined via common/config/command-line.json.  Rush's predefined "build"
 * and "rebuild" commands are also modeled as bulk commands, because they essentially just
 * execute scripts from package.json in the same as any custom command.
 */
export class BulkScriptAction extends BaseScriptAction {
  private readonly _enableParallelism: boolean;
  private readonly _ignoreMissingScript: boolean;
  private readonly _isIncrementalBuildAllowed: boolean;
  private readonly _commandToRun: string;
  private readonly _watchForChanges: boolean;
  private readonly _disableBuildCache: boolean;
  private readonly _repoCommandLineConfiguration: CommandLineConfiguration | undefined;
  private readonly _ignoreDependencyOrder: boolean;
  private readonly _allowWarningsInSuccessfulBuild: boolean;

  private _changedProjectsOnly!: CommandLineFlagParameter;
  private _selectionParameters!: SelectionParameterSet;
  private _verboseParameter!: CommandLineFlagParameter;
  private _parallelismParameter: CommandLineStringParameter | undefined;
  private _ignoreHooksParameter!: CommandLineFlagParameter;

  public constructor(options: IBulkScriptActionOptions) {
    super(options);
    this._enableParallelism = options.enableParallelism;
    this._ignoreMissingScript = options.ignoreMissingScript;
    this._isIncrementalBuildAllowed = options.incremental;
    this._commandToRun = options.commandToRun || options.actionName;
    this._ignoreDependencyOrder = options.ignoreDependencyOrder;
    this._allowWarningsInSuccessfulBuild = options.allowWarningsInSuccessfulBuild;
    this._watchForChanges = options.watchForChanges;
    this._disableBuildCache = options.disableBuildCache;
    this._repoCommandLineConfiguration = options.commandLineConfiguration;
  }

  public async runAsync(): Promise<void> {
    // TODO: Replace with last-install.flag when "rush link" and "rush unlink" are deprecated
    const lastLinkFlag: LastLinkFlag = LastLinkFlagFactory.getCommonTempFlag(this.rushConfiguration);
    if (!lastLinkFlag.isValid()) {
      const useWorkspaces: boolean =
        this.rushConfiguration.pnpmOptions && this.rushConfiguration.pnpmOptions.useWorkspaces;
      if (useWorkspaces) {
        throw new Error(`Link flag invalid.${os.EOL}Did you run "rush install" or "rush update"?`);
      } else {
        throw new Error(`Link flag invalid.${os.EOL}Did you run "rush link"?`);
      }
    }

    this._doBeforeTask();

    const stopwatch: Stopwatch = Stopwatch.start();

    const isQuietMode: boolean = !this._verboseParameter.value;
    const isDebugMode: boolean = !!this.parser.isDebug;

    // if this is parallelizable, then use the value from the flag (undefined or a number),
    // if parallelism is not enabled, then restrict to 1 core
    const parallelism: string | undefined = this._enableParallelism ? this._parallelismParameter!.value : '1';

    // Collect all custom parameter values
    const customParameterValues: string[] = [];
    for (const customParameter of this.customParameters) {
      customParameter.appendToArgList(customParameterValues);
    }

    const changedProjectsOnly: boolean = this._isIncrementalBuildAllowed && this._changedProjectsOnly.value;

    const terminal: Terminal = new Terminal(this.rushSession.terminalProvider);
    let buildCacheConfiguration: BuildCacheConfiguration | undefined;
    if (!this._disableBuildCache && ['build', 'rebuild'].includes(this.actionName)) {
      buildCacheConfiguration = await BuildCacheConfiguration.tryLoadAsync(
        terminal,
        this.rushConfiguration,
        this.rushSession
      );
    }

    const selection: Set<RushConfigurationProject> = await this._selectionParameters.getSelectedProjectsAsync(
      terminal,
      true
    );

    if (!selection.size) {
      terminal.writeLine(colors.yellow(`The command line selection parameters did not match any projects.`));
      return;
    }

    const taskSelectorOptions: ITaskSelectorOptions = {
      rushConfiguration: this.rushConfiguration,
      buildCacheConfiguration,
      selection,
      commandName: this.actionName,
      commandToRun: this._commandToRun,
      customParameterValues,
      isQuietMode: isQuietMode,
      isDebugMode: isDebugMode,
      isIncrementalBuildAllowed: this._isIncrementalBuildAllowed,
      ignoreMissingScript: this._ignoreMissingScript,
      ignoreDependencyOrder: this._ignoreDependencyOrder,
      allowWarningsInSuccessfulBuild: this._allowWarningsInSuccessfulBuild,
      packageDepsFilename: Utilities.getPackageDepsFilenameForCommand(this._commandToRun)
    };

    const taskRunnerOptions: ITaskRunnerOptions = {
      quietMode: isQuietMode,
      debugMode: this.parser.isDebug,
      parallelism: parallelism,
      changedProjectsOnly: changedProjectsOnly,
      allowWarningsInSuccessfulBuild: this._allowWarningsInSuccessfulBuild,
      repoCommandLineConfiguration: this._repoCommandLineConfiguration
    };

    const executeOptions: IExecuteInternalOptions = {
      taskSelectorOptions,
      taskRunnerOptions,
      stopwatch,
      terminal
    };

    if (this._watchForChanges) {
      await this._runWatch(executeOptions);
    } else {
      await this._runOnce(executeOptions);
    }
  }

  /**
   * Runs the command in watch mode. Fundamentally is a simple loop:
   * 1) Wait for a change to one or more projects in the selection (skipped initially)
   * 2) Invoke the command on the changed projects, and, if applicable, impacted projects
   *    Uses the same algorithm as --impacted-by
   * 3) Goto (1)
   */
  private async _runWatch(options: IExecuteInternalOptions): Promise<void> {
    const {
      taskSelectorOptions: { selection: projectsToWatch },
      stopwatch,
      terminal
    } = options;

    // Use async import so that we don't pay the cost for sync builds
    const { ProjectWatcher } = await import('../../logic/ProjectWatcher');

    const projectWatcher: typeof ProjectWatcher.prototype = new ProjectWatcher({
      debounceMilliseconds: 1000,
      rushConfiguration: this.rushConfiguration,
      projectsToWatch,
      terminal
    });

    const onWatchingFiles = (): void => {
      // Report so that the developer can always see that it is in watch mode as the latest console line.
      terminal.writeLine(
        `Watching for changes to ${projectsToWatch.size} ${
          projectsToWatch.size === 1 ? 'project' : 'projects'
        }. Press Ctrl+C to exit.`
      );
    };

    // Loop until Ctrl+C
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // On the initial invocation, this promise will return immediately with the full set of projects
      const { changedProjects, state } = await projectWatcher.waitForChange(onWatchingFiles);

      let selection: ReadonlySet<RushConfigurationProject> = changedProjects;

      if (stopwatch.state === StopwatchState.Stopped) {
        // Clear and reset the stopwatch so that we only report time from a single execution at a time
        stopwatch.reset();
        stopwatch.start();
      }

      terminal.writeLine(`Detected changes in ${selection.size} project${selection.size === 1 ? '' : 's'}:`);
      const names: string[] = [...selection].map((x) => x.packageName).sort();
      for (const name of names) {
        terminal.writeLine(`    ${colors.cyan(name)}`);
      }

      // If the command ignores dependency order, that means that only the changed projects should be affected
      // That said, running watch for commands that ignore dependency order may have unexpected results
      if (!this._ignoreDependencyOrder) {
        selection = Selection.intersection(Selection.expandAllConsumers(selection), projectsToWatch);
      }

      const executeOptions: IExecuteInternalOptions = {
        taskSelectorOptions: {
          ...options.taskSelectorOptions,
          // Revise down the set of projects to execute the command on
          selection,
          // Pass the ProjectChangeAnalyzer from the state differ to save a bit of overhead
          projectChangeAnalyzer: state
        },
        taskRunnerOptions: options.taskRunnerOptions,
        stopwatch,
        // For now, don't run pre-build or post-build in watch mode
        ignoreHooks: true,
        terminal
      };

      try {
        // Delegate the the underlying command, for only the projects that need reprocessing
        await this._runOnce(executeOptions);
      } catch (err) {
        // In watch mode, we want to rebuild even if the original build failed.
        if (!(err instanceof AlreadyReportedError)) {
          throw err;
        }
      }
    }
  }

  protected onDefineParameters(): void {
    if (this._enableParallelism) {
      this._parallelismParameter = this.defineStringParameter({
        parameterLongName: '--parallelism',
        parameterShortName: '-p',
        argumentName: 'COUNT',
        environmentVariable: EnvironmentVariableNames.RUSH_PARALLELISM,
        description:
          'Specifies the maximum number of concurrent processes to launch during a build.' +
          ' The COUNT should be a positive integer or else the word "max" to specify a count that is equal to' +
          ' the number of CPU cores. If this parameter is omitted, then the default value depends on the' +
          ' operating system and number of CPU cores.'
      });
    }

    this._selectionParameters = new SelectionParameterSet(this.rushConfiguration, this);

    this._verboseParameter = this.defineFlagParameter({
      parameterLongName: '--verbose',
      parameterShortName: '-v',
      description: 'Display the logs during the build, rather than just displaying the build status summary'
    });

    if (this._isIncrementalBuildAllowed) {
      this._changedProjectsOnly = this.defineFlagParameter({
        parameterLongName: '--changed-projects-only',
        parameterShortName: '-c',
        description:
          'Normally the incremental build logic will rebuild changed projects as well as' +
          ' any projects that directly or indirectly depend on a changed project. Specify "--changed-projects-only"' +
          ' to ignore dependent projects, only rebuilding those projects whose files were changed.' +
          ' Note that this parameter is "unsafe"; it is up to the developer to ensure that the ignored projects' +
          ' are okay to ignore.'
      });
    }

    this._ignoreHooksParameter = this.defineFlagParameter({
      parameterLongName: '--ignore-hooks',
      description: `Skips execution of the "eventHooks" scripts defined in rush.json. Make sure you know what you are skipping.`
    });

    this.defineScriptParameters();
  }

  /**
   * Runs a single invocation of the command
   */
  private async _runOnce(options: IExecuteInternalOptions): Promise<void> {
    const taskSelector: TaskSelector = new TaskSelector(options.taskSelectorOptions);

    // Register all tasks with the task collection

    const taskRunner: TaskRunner = new TaskRunner(
      taskSelector.registerTasks().getOrderedTasks(),
      options.taskRunnerOptions
    );

    const { ignoreHooks, stopwatch } = options;

    try {
      await taskRunner.executeAsync();

      stopwatch.stop();
      console.log(colors.green(`rush ${this.actionName} (${stopwatch.toString()})`));

      if (!ignoreHooks) {
        this._doAfterTask(stopwatch, true);
      }
    } catch (error) {
      stopwatch.stop();

      if (error instanceof AlreadyReportedError) {
        console.log(`rush ${this.actionName} (${stopwatch.toString()})`);
      } else {
        if (error && (error as Error).message) {
          if (this.parser.isDebug) {
            console.log('Error: ' + (error as Error).stack);
          } else {
            console.log('Error: ' + (error as Error).message);
          }
        }

        console.log(colors.red(`rush ${this.actionName} - Errors! (${stopwatch.toString()})`));
      }

      if (!ignoreHooks) {
        this._doAfterTask(stopwatch, false);
      }
      throw new AlreadyReportedError();
    }
  }

  private _doBeforeTask(): void {
    if (
      this.actionName !== RushConstants.buildCommandName &&
      this.actionName !== RushConstants.rebuildCommandName
    ) {
      // Only collects information for built-in tasks like build or rebuild.
      return;
    }

    SetupChecks.validate(this.rushConfiguration);

    this.eventHooksManager.handle(Event.preRushBuild, this.parser.isDebug, this._ignoreHooksParameter.value);
  }

  private _doAfterTask(stopwatch: Stopwatch, success: boolean): void {
    if (
      this.actionName !== RushConstants.buildCommandName &&
      this.actionName !== RushConstants.rebuildCommandName
    ) {
      // Only collects information for built-in tasks like build or rebuild.
      return;
    }
    this._collectTelemetry(stopwatch, success);
    this.parser.flushTelemetry();
    this.eventHooksManager.handle(Event.postRushBuild, this.parser.isDebug, this._ignoreHooksParameter.value);
  }

  private _collectTelemetry(stopwatch: Stopwatch, success: boolean): void {
    const extraData: Record<string, string> = {
      ...this._selectionParameters.getTelemetry(),
      ...this.getParameterStringMap()
    };

    if (this.parser.telemetry) {
      this.parser.telemetry.log({
        name: this.actionName,
        duration: stopwatch.duration,
        result: success ? 'Succeeded' : 'Failed',
        extraData
      });
    }
  }
}
