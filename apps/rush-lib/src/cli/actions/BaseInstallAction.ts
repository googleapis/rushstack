// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import colors from 'colors/safe';
import * as os from 'os';

import { Import } from '@rushstack/node-core-library';
import {
  CommandLineFlagParameter,
  CommandLineIntegerParameter,
  CommandLineStringParameter
} from '@rushstack/ts-command-line';

import { BaseRushAction } from './BaseRushAction';
import { Event } from '../../api/EventHooks';
import { BaseInstallManager, IInstallManagerOptions } from '../../logic/base/BaseInstallManager';
import { PurgeManager } from '../../logic/PurgeManager';
import { SetupChecks } from '../../logic/SetupChecks';
import { StandardScriptUpdater } from '../../logic/StandardScriptUpdater';
import { Stopwatch } from '../../utilities/Stopwatch';
import { VersionMismatchFinder } from '../../logic/versionMismatch/VersionMismatchFinder';
import { Variants } from '../../api/Variants';
import { RushConstants } from '../../logic/RushConstants';
import { SelectionParameterSet } from '../SelectionParameterSet';

const installManagerFactoryModule: typeof import('../../logic/InstallManagerFactory') = Import.lazy(
  '../../logic/InstallManagerFactory',
  require
);

/**
 * This is the common base class for InstallAction and UpdateAction.
 */
export abstract class BaseInstallAction extends BaseRushAction {
  protected _variant!: CommandLineStringParameter;
  protected _purgeParameter!: CommandLineFlagParameter;
  protected _bypassPolicyParameter!: CommandLineFlagParameter;
  protected _noLinkParameter!: CommandLineFlagParameter;
  protected _networkConcurrencyParameter!: CommandLineIntegerParameter;
  protected _debugPackageManagerParameter!: CommandLineFlagParameter;
  protected _maxInstallAttempts!: CommandLineIntegerParameter;
  protected _ignoreHooksParameter!: CommandLineFlagParameter;
  /*
   * Subclasses can initialize the _selectionParameters property in order for
   * the parameters to be written to the telemetry file
   */
  protected _selectionParameters?: SelectionParameterSet;

  protected onDefineParameters(): void {
    this._purgeParameter = this.defineFlagParameter({
      parameterLongName: '--purge',
      parameterShortName: '-p',
      description: 'Perform "rush purge" before starting the installation'
    });
    this._bypassPolicyParameter = this.defineFlagParameter({
      parameterLongName: '--bypass-policy',
      description: 'Overrides enforcement of the "gitPolicy" rules from rush.json (use honorably!)'
    });
    this._noLinkParameter = this.defineFlagParameter({
      parameterLongName: '--no-link',
      description:
        'If "--no-link" is specified, then project symlinks will NOT be created' +
        ' after the installation completes.  You will need to run "rush link" manually.' +
        ' This flag is useful for automated builds that want to report stages individually' +
        ' or perform extra operations in between the two stages. This flag is not supported' +
        ' when using workspaces.'
    });
    this._networkConcurrencyParameter = this.defineIntegerParameter({
      parameterLongName: '--network-concurrency',
      argumentName: 'COUNT',
      description:
        'If specified, limits the maximum number of concurrent network requests.' +
        '  This is useful when troubleshooting network failures.'
    });
    this._debugPackageManagerParameter = this.defineFlagParameter({
      parameterLongName: '--debug-package-manager',
      description:
        'Activates verbose logging for the package manager. You will probably want to pipe' +
        ' the output of Rush to a file when using this command.'
    });
    this._maxInstallAttempts = this.defineIntegerParameter({
      parameterLongName: '--max-install-attempts',
      argumentName: 'NUMBER',
      description: `Overrides the default maximum number of install attempts.`,
      defaultValue: RushConstants.defaultMaxInstallAttempts
    });
    this._ignoreHooksParameter = this.defineFlagParameter({
      parameterLongName: '--ignore-hooks',
      description: `Skips execution of the "eventHooks" scripts defined in rush.json. Make sure you know what you are skipping.`
    });
    this._variant = this.defineStringParameter(Variants.VARIANT_PARAMETER);
  }

  protected abstract buildInstallOptionsAsync(): Promise<IInstallManagerOptions>;

  protected async runAsync(): Promise<void> {
    VersionMismatchFinder.ensureConsistentVersions(this.rushConfiguration, {
      variant: this._variant.value
    });

    const stopwatch: Stopwatch = Stopwatch.start();

    SetupChecks.validate(this.rushConfiguration);
    let warnAboutScriptUpdate: boolean = false;
    if (this.actionName === 'update') {
      warnAboutScriptUpdate = StandardScriptUpdater.update(this.rushConfiguration);
    } else {
      StandardScriptUpdater.validate(this.rushConfiguration);
    }

    this.eventHooksManager.handle(
      Event.preRushInstall,
      this.parser.isDebug,
      this._ignoreHooksParameter.value
    );

    const purgeManager: PurgeManager = new PurgeManager(this.rushConfiguration, this.rushGlobalFolder);

    if (this._purgeParameter.value!) {
      console.log('The --purge flag was specified, so performing "rush purge"');
      purgeManager.purgeNormal();
      console.log('');
    }

    if (this._networkConcurrencyParameter.value) {
      if (this.rushConfiguration.packageManager !== 'pnpm') {
        throw new Error(
          `The "${this._networkConcurrencyParameter.longName}" parameter is` +
            ` only supported when using the PNPM package manager.`
        );
      }
    }

    // Because the 'defaultValue' option on the _maxInstallAttempts parameter is set,
    // it is safe to assume that the value is not null
    if (this._maxInstallAttempts.value! < 1) {
      throw new Error(`The value of "${this._maxInstallAttempts.longName}" must be positive and nonzero.`);
    }

    const installManagerOptions: IInstallManagerOptions = await this.buildInstallOptionsAsync();

    const installManager: BaseInstallManager =
      installManagerFactoryModule.InstallManagerFactory.getInstallManager(
        this.rushConfiguration,
        this.rushGlobalFolder,
        purgeManager,
        installManagerOptions
      );

    let installSuccessful: boolean = true;
    try {
      await installManager.doInstallAsync();

      this.eventHooksManager.handle(
        Event.postRushInstall,
        this.parser.isDebug,
        this._ignoreHooksParameter.value
      );

      if (warnAboutScriptUpdate) {
        console.log(
          os.EOL +
            colors.yellow(
              'Rush refreshed some files in the "common/scripts" folder.' +
                '  Please commit this change to Git.'
            )
        );
      }

      console.log(
        os.EOL + colors.green(`Rush ${this.actionName} finished successfully. (${stopwatch.toString()})`)
      );
    } catch (error) {
      installSuccessful = false;
      throw error;
    } finally {
      purgeManager.deleteAll();
      stopwatch.stop();

      this._collectTelemetry(stopwatch, installManagerOptions, installSuccessful);
    }
  }

  private _collectTelemetry(
    stopwatch: Stopwatch,
    installManagerOptions: IInstallManagerOptions,
    success: boolean
  ): void {
    if (this.parser.telemetry) {
      const extraData: Record<string, string> = {
        mode: this.actionName,
        clean: (!!this._purgeParameter.value).toString(),
        debug: installManagerOptions.debug.toString(),
        full: installManagerOptions.fullUpgrade.toString(),
        ...this.getParameterStringMap(),
        ...this._selectionParameters?.getTelemetry()
      };
      this.parser.telemetry.log({
        name: 'install',
        duration: stopwatch.duration,
        result: success ? 'Succeeded' : 'Failed',
        extraData
      });
    }
  }
}
