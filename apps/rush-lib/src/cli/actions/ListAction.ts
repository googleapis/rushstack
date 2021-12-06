// Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
// See LICENSE in the project root for license information.

import { ConsoleTerminalProvider, Import, Sort, Terminal } from '@rushstack/node-core-library';
import { CommandLineFlagParameter } from '@rushstack/ts-command-line';

import { BaseRushAction } from './BaseRushAction';
import { RushCommandLineParser } from '../RushCommandLineParser';
import { RushConfigurationProject } from '../../api/RushConfigurationProject';
import { VersionPolicyDefinitionName } from '../../api/VersionPolicy';
import { SelectionParameterSet } from '../SelectionParameterSet';

const cliTable: typeof import('cli-table') = Import.lazy('cli-table', require);

/**
 * Shape of "rush list --json" output.
 *
 * It contains parts (with different names) coming from
 * {@link ../../api/RushConfigurationProject#IRushConfigurationProjectJson | IRushConfigurationProjectJson}.
 */
export interface IJsonEntry {
  name: string;
  version: string;
  /**
   * @see {@link ../../api/RushConfigurationProject#IRushConfigurationProjectJson.publishFolder | IRushConfigurationProjectJson.publishFolder}
   */
  path: string;
  fullPath: string;
  /**
   * @see {@link ../../api/RushConfigurationProject#IRushConfigurationProjectJson.versionPolicyName | IRushConfigurationProjectJson.versionPolicyName}
   */
  versionPolicyName?: string;
  /**
   * @see {@link ../../api/VersionPolicy#VersionPolicyDefinitionName | VersionPolicyDefinitionName}
   */
  versionPolicy?: string;
  /**
   * @see {@link ../../api/RushConfigurationProject#IRushConfigurationProjectJson.shouldPublish | IRushConfigurationProjectJson.shouldPublish}
   */
  shouldPublish?: boolean;
  /**
   * @see {@link ../../api/RushConfigurationProject#IRushConfigurationProjectJson.reviewCategory | IRushConfigurationProjectJson.reviewCategory}
   */
  reviewCategory?: string;
}

export interface IJsonOutput {
  projects: IJsonEntry[];
}

export class ListAction extends BaseRushAction {
  private _version!: CommandLineFlagParameter;
  private _path!: CommandLineFlagParameter;
  private _fullPath!: CommandLineFlagParameter;
  private _jsonFlag!: CommandLineFlagParameter;
  private _detailedFlag!: CommandLineFlagParameter;
  private _selectionParameters!: SelectionParameterSet;

  public constructor(parser: RushCommandLineParser) {
    super({
      actionName: 'list',
      summary: 'List package information for all projects in the repo',
      documentation:
        'List package names, and optionally version (--version) and ' +
        'path (--path) or full path (--full-path), for projects in the ' +
        'current rush config.',
      parser
    });
  }

  protected onDefineParameters(): void {
    this._version = this.defineFlagParameter({
      parameterLongName: '--version',
      parameterShortName: '-v',
      description:
        'If this flag is specified, the project version will be ' +
        'displayed in a column along with the package name.'
    });

    this._path = this.defineFlagParameter({
      parameterLongName: '--path',
      parameterShortName: '-p',
      description:
        'If this flag is specified, the project path will be ' +
        'displayed in a column along with the package name.'
    });

    this._fullPath = this.defineFlagParameter({
      parameterLongName: '--full-path',
      description:
        'If this flag is specified, the project full path will ' +
        'be displayed in a column along with the package name.'
    });

    this._detailedFlag = this.defineFlagParameter({
      parameterLongName: '--detailed',
      description:
        'For the non --json view, if this flag is specified, ' +
        'include path (-p), version (-v) columns along with ' +
        'the project’s applicable: versionPolicy, versionPolicyName, ' +
        'shouldPublish, and reviewPolicy fields.'
    });

    this._jsonFlag = this.defineFlagParameter({
      parameterLongName: '--json',
      description: 'If this flag is specified, output will be in JSON format.'
    });

    this._selectionParameters = new SelectionParameterSet(this.rushConfiguration, this);
  }

  protected async runAsync(): Promise<void> {
    const terminal: Terminal = new Terminal(new ConsoleTerminalProvider());
    const selection: Set<RushConfigurationProject> = await this._selectionParameters.getSelectedProjectsAsync(
      terminal,
      false
    );
    Sort.sortSetBy(selection, (x: RushConfigurationProject) => x.packageName);
    if (this._jsonFlag.value && this._detailedFlag.value) {
      throw new Error(`The parameters "--json" and "--detailed" cannot be used together.`);
    }
    if (this._jsonFlag.value) {
      this._printJson(selection);
    } else if (this._version.value || this._path.value || this._fullPath.value || this._detailedFlag.value) {
      this._printListTable(selection);
    } else {
      this._printList(selection);
    }
  }

  private _printJson(selection: Set<RushConfigurationProject>): void {
    const projects: IJsonEntry[] = Array.from(selection, (config: RushConfigurationProject): IJsonEntry => {
      let reviewCategory: undefined | string;
      let shouldPublish: undefined | boolean;
      let versionPolicy: undefined | string;
      let versionPolicyName: undefined | string;
      if (config.versionPolicy !== undefined) {
        const definitionName: string = VersionPolicyDefinitionName[config.versionPolicy.definitionName];
        versionPolicy = `${definitionName}`;
        versionPolicyName = config.versionPolicy.policyName;
      } else {
        shouldPublish = config.shouldPublish;
      }
      if (config.reviewCategory) {
        reviewCategory = config.reviewCategory;
      }
      return {
        name: config.packageName,
        version: config.packageJson.version,
        path: config.projectRelativeFolder,
        fullPath: config.projectFolder,
        versionPolicy,
        versionPolicyName,
        shouldPublish,
        reviewCategory
      };
    });

    const output: IJsonOutput = {
      projects
    };
    console.log(JSON.stringify(output, undefined, 2));
  }

  private _printList(selection: Set<RushConfigurationProject>): void {
    for (const project of selection) {
      console.log(project.packageName);
    }
  }

  private _printListTable(selection: Set<RushConfigurationProject>): void {
    const tableHeader: string[] = ['Project'];
    if (this._version.value || this._detailedFlag.value) {
      tableHeader.push('Version');
    }
    if (this._path.value || this._detailedFlag.value) {
      tableHeader.push('Path');
    }
    if (this._fullPath.value) {
      tableHeader.push('Full Path');
    }
    if (this._detailedFlag.value) {
      tableHeader.push('Version policy');
      tableHeader.push('Version policy name');
      tableHeader.push('Should publish');
      tableHeader.push('Review category');
    }

    // eslint-disable-next-line @typescript-eslint/typedef
    const table = new cliTable({
      head: tableHeader
    });

    for (const project of selection) {
      const packageRow: string[] = [project.packageName];
      if (this._version.value || this._detailedFlag.value) {
        packageRow.push(project.packageJson.version);
      }
      if (this._path.value || this._detailedFlag.value) {
        packageRow.push(project.projectRelativeFolder);
      }
      if (this._fullPath.value) {
        packageRow.push(project.projectFolder);
      }
      if (this._detailedFlag.value) {
        // When we HAVE a version policy
        let versionPolicyDefinitionName: string = '';
        let versionPolicyName: string = '';
        // When we DO NOT have version policy, fallback to shouldPublish boolean
        let shouldPublish: string = '';
        let reviewCategory: string = '';
        if (project.versionPolicy !== undefined) {
          const definitionName: string = VersionPolicyDefinitionName[project.versionPolicy.definitionName];
          versionPolicyDefinitionName = definitionName;
          versionPolicyName = project.versionPolicy.policyName;
        } else {
          shouldPublish = `${String(project.shouldPublish)}`;
        }
        if (project.reviewCategory) {
          reviewCategory = project.reviewCategory;
        }
        packageRow.push(versionPolicyDefinitionName);
        packageRow.push(versionPolicyName);
        packageRow.push(shouldPublish);
        packageRow.push(reviewCategory);
      }
      table.push(packageRow);
    }
    console.log(table.toString());
  }
}
